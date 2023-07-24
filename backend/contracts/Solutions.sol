// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Import external contracts
import "./Membership.sol";
import "./Problems.sol";

// Main contract for handling solutions
contract Solutions {
    // Struct for defining a solution
    struct Solution {
        uint256 solutionId; // Unique identifier for the solution
        uint256 problemId; // The problem this solution addresses
        address creator; // The creator of the solution
        string name; // The name of the solution
        uint256 ratingSum; // Sum of ratings the solution has received
        uint256 numberOfRaters; // Number of people who rated the solution
        bool isOpenForRating; // Whether the solution is open for rating
        mapping(address => uint) oldRating; // Mapping to check if a member has already rated
    }

    // Membership contract reference
    Membership private membershipContract;
    // Problems contract reference
    Problems private problemsContract;

    // Counter to maintain solution ids
    uint256 private solutionCounter;

    // Mapping from solutionId to Solution struct
    mapping(uint256 => Solution) private solutions;
    // Mapping to keep track of existing solution names
    mapping(string => bool) private solutionNames;
    // Mapping to keep track of solutions for a specific problem
    mapping(uint256 => uint256[]) private problemToSolutions;

    // A dynamic list of all solution ids
    uint256[] private allSolutions;

    // Constants for the rating system
    uint256 constant MAX_RATING = 10; // Maximum possible rating
    uint256 constant MIN_RATING_COUNT = 2; // Minimum count of ratings required
    uint256 constant MIN_RATING_AVERAGE = 7; // Minimum average rating required
    uint256 constant MIN_TOTAL_RATE_COUNT = 3; // Minimum number ratings required

    uint256 constant SOLUTION_ID_INDEX = 2; // Index where the solution id is held
    uint256 constant RATING_NUMBER_INDEX = 1; // Index where the number of raters is held
    uint256 constant TOTAL_RATING_INDEX = 0; // Index where the total rating is held

    error onlySolutionCreatorCanPerform();
    error invalidID();
    error nameCannotBeEmpty();
    error nameAlreadyExists();
    error problemDoesNotMeetCriteria();
    error solutonClosedForRating();
    error solutionAlreadyRated();
    error IDOutofRange();
    error creatorCannotRateOwnProblem();
    error ratingOutOfRange();
    error solutionDoesNotExist();
    error problemDoesNotExist();
    // Events to log actions happening in the contract
    event SolutionProposed(uint256 solutionId, uint256 problemId, address creator, string name);
    event SolutionCancelled(uint256 solutionId);
    event SolutionRated(uint256 solutionId, address rater, uint256 rating);
    event SolutionNameChanged(uint256 solutionId, string newName);

    // Modifier to restrict actions to solution creators
    modifier onlyCreator(uint256 _solutionId) {
        if (msg.sender != solutions[_solutionId].creator) revert onlySolutionCreatorCanPerform();
        _;
    }

    // Constructor for initial setup
    constructor(Membership _membershipContract, Problems _problemsContract) {
        membershipContract = _membershipContract;
        problemsContract = _problemsContract;
    }

    // Function to propose a solution
    function proposeSolution(uint256 _problemId, string memory _name) external {
        if (bytes(_name).length <= 0) revert nameCannotBeEmpty();
        if (_problemId == 0) revert invalidID();
        if (!problemsContract.doesProblemExist(_problemId)) revert problemDoesNotExist();

        if (solutionNames[_name]) revert nameAlreadyExists();
        if (!problemsContract.meetsRatingCriteria(_problemId)) revert problemDoesNotMeetCriteria();

        // Increment solution counter and create a new solution
        solutionCounter++;

        Solution storage newSolution = solutions[solutionCounter];
        newSolution.solutionId = solutionCounter;
        newSolution.problemId = _problemId;
        newSolution.creator = msg.sender;
        newSolution.name = _name;
        newSolution.isOpenForRating = true;

        // Register new solution name and map problem to the solution
        solutionNames[_name] = true;
        problemToSolutions[_problemId].push(solutionCounter);

        // Emit the event
        emit SolutionProposed(solutionCounter, _problemId, msg.sender, _name);
    }

    // Function to cancel a solution
    function cancelSolution(uint256 _solutionId) external {
        if (_solutionId == 0) revert invalidID();

        if (bytes(solutions[_solutionId].name).length <= 0 || solutionCounter < _solutionId)
            revert solutionDoesNotExist();
        if (msg.sender != solutions[_solutionId].creator) revert onlySolutionCreatorCanPerform();

        Solution storage solution = solutions[_solutionId];

        if (!solution.isOpenForRating) revert solutonClosedForRating();
        if (solution.numberOfRaters != 0) revert solutionAlreadyRated();

        // Mark the solution as closed for rating
        solution.isOpenForRating = false;

        delete solutionNames[solutions[_solutionId].name];

        // Emit the event
        emit SolutionCancelled(_solutionId);
    }

    // Function to change the name of a solution
    function changeSolutionName(
        uint256 _solutionId,
        string memory _newName
    ) external onlyCreator(_solutionId) {
        if (solutionCounter < _solutionId) revert solutionDoesNotExist();
        if (bytes(_newName).length <= 0) revert nameCannotBeEmpty();
        if (solutionNames[_newName]) revert nameAlreadyExists();

        Solution storage solution = solutions[_solutionId];

        // Update the solution name
        delete solutionNames[solution.name];
        solution.name = _newName;
        solutionNames[_newName] = true;

        // Emit the event
        emit SolutionNameChanged(_solutionId, _newName);
    }

    // Function to rate a solution
    function rateSolution(uint256 _solutionId, uint256 _rating) external {
        if (solutionCounter < _solutionId) revert solutionDoesNotExist();
        if (solutions[_solutionId].creator == msg.sender) revert creatorCannotRateOwnProblem();
        if (_rating < 1 || _rating > MAX_RATING) revert ratingOutOfRange();
        if (!solutions[_solutionId].isOpenForRating) revert solutonClosedForRating();

        if (solutions[_solutionId].oldRating[msg.sender] > 0) {
            solutions[_solutionId].ratingSum -= solutions[_solutionId].oldRating[msg.sender];
        } else {
            solutions[_solutionId].numberOfRaters++;
        }
        solutions[_solutionId].oldRating[msg.sender] = _rating;
        solutions[_solutionId].ratingSum += _rating;

        // if (solutions[_solutionId].numberOfRaters > 1){
        //     allRatings[solutions[_solutionId].indexOfArray] = [solutions[_solutionId].ratingSum, solutions[_solutionId].numberOfRaters, solutions[_solutionId].solutionId];

        // }
        // else {
        // allRatings.push([solutions[_solutionId].ratingSum, solutions[_solutionId].numberOfRaters, solutions[_solutionId].solutionId]);
        // solutions[_solutionId].indexOfArray = allRatings.length - 1;
        // }
        if (solutions[_solutionId].numberOfRaters > 1) {
            allSolutions.push(_solutionId);
        }
        // Emit the event
        emit SolutionRated(_solutionId, msg.sender, _rating);
    }

    // Function to check if a solution can become a project
    function canBecomeProject(uint256 _solutionId) external view returns (bool) {
        Solution storage solution = solutions[_solutionId];

        uint256 avgRating = solution.ratingSum / solution.numberOfRaters;

        // if (avgRating > highestRating) {
        //     highestRating = avgRating;
        // }
        // Check if the solution meets the rating requirements
        if (
            solution.numberOfRaters < MIN_RATING_COUNT ||
            avgRating < MIN_RATING_AVERAGE ||
            _solutionId != findSolutionWithHighestRating()
        ) {
            return false;
        }

        // Calculate the total ratings for the problem the solution addresses
        uint256 totalRatingsForProblem = 0;
        uint256[] storage solutionIds = problemToSolutions[solution.problemId];

        for (uint256 i = 0; i < solutionIds.length; i++) {
            totalRatingsForProblem += solutions[solutionIds[i]].numberOfRaters;
        }

        // Check if the total ratings meet the requirements
        return totalRatingsForProblem >= MIN_TOTAL_RATE_COUNT;
    }

    // Function to find the highest rated solution
    function findSolutionWithHighestRating() private view returns (uint256) {
        uint256 highestRating = 0;
        uint256 highestRatingSolutionId;

        // Iterate over the keys in the mapping
        for (uint256 i = 0; i < allSolutions.length; i++) {
            uint256 solutionId = allSolutions[i];
            Solution storage solution = solutions[solutionId];
            // Calculate the rating for the current solution
            uint256 rating = solution.ratingSum / solution.numberOfRaters;

            // Update highestRating and highestRatingSolutionId if the current rating is higher
            if (rating > highestRating) {
                highestRating = rating;
                highestRatingSolutionId = solutionId;
            }
        }

        return highestRatingSolutionId;
    }

    // Function to view the details of a solution
    function viewSolutionDetails(
        uint256 _solutionId
    ) external view returns (uint256, uint256, address, string memory, uint256, uint256, bool) {
        if (_solutionId <= 0 || _solutionId > solutionCounter) revert IDOutofRange();

        Solution storage solution = solutions[_solutionId];

        // Return all the solution details
        return (
            solution.solutionId,
            solution.problemId,
            solution.creator,
            solution.name,
            solution.ratingSum,
            solution.numberOfRaters,
            solution.isOpenForRating
        );
    }

    // View functions to get private state variables
    function getSolutionCounter() external view returns (uint) {
        return solutionCounter;
    }

    function isSolutionNameTaken(string memory _name) external view returns (bool) {
        return solutionNames[_name];
    }

    // Function to get the creators of a solution and its corresponding problem
    function getCreators(
        uint256 _solutionId
    ) external view returns (address solutionCreator, address problemCreator) {
        if (_solutionId <= 0 || _solutionId > solutionCounter) revert IDOutofRange();

        Solution storage solution = solutions[_solutionId];
        solutionCreator = solution.creator;

        problemCreator = problemsContract.getProblemCreator(solution.problemId);
    }
}
