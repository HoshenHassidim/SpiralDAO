// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
        mapping(address => uint) oldRating; // Mapping to keep track of user's old rating
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

    // Constants for the rating system
    uint256 constant MAX_RATING = 10; // Maximum possible rating
    uint256 constant MIN_RATING_COUNT = 2; // Minimum count of ratings required
    uint256 constant MIN_RATING_AVERAGE = 7; // Minimum average rating required
    uint256 constant MIN_TOTAL_RATING = 3;

    // Events to log actions happening in the contract
    event SolutionProposed(uint256 solutionId, uint256 problemId, address creator, string name);
    event SolutionCancelled(uint256 solutionId);
    event SolutionRated(uint256 solutionId, address rater, uint256 rating);
    event SolutionNameChanged(uint256 solutionId, string newName);

    // Modifier to restrict functions to members only
    modifier onlyMember() {
        require(
            membershipContract.isRegisteredMember(msg.sender),
            "Action restricted to registered members"
        );
        _;
    }

    // Modifier to restrict actions to solution creators
    modifier onlyCreator(uint256 _solutionId) {
        require(
            msg.sender == solutions[_solutionId].creator,
            "Only the solution creator can perform this action"
        );
        _;
    }

    // Constructor for initial setup
    constructor(Membership _membershipContract, Problems _problemsContract) {
        membershipContract = _membershipContract;
        problemsContract = _problemsContract;
    }

    // Function to propose a solution
    function proposeSolution(uint256 _problemId, string memory _name) external onlyMember {
        require(problemsContract.getProblemCounter() >= _problemId, "Invalid problem ID");
        require(bytes(_name).length > 0, "Solution name cannot be empty");
        require(!solutionNames[_name], "Solution name already exists");
        require(
            problemsContract.meetsRatingCriteria(_problemId),
            "Problem does not meet the rating criteria"
        );

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
    function cancelSolution(uint256 _solutionId) external onlyCreator(_solutionId) {
        Solution storage solution = solutions[_solutionId];
        require(solutionCounter >= _solutionId, "Invalid solution ID");
        require(solution.isOpenForRating, "The solution is already closed for rating");
        require(solution.numberOfRaters == 0, "Solution has already been rated");

        // Mark the solution as closed for rating
        solution.isOpenForRating = false;

        solutionNames[solutions[_solutionId].name] = false;

        // Emit the event
        emit SolutionCancelled(_solutionId);
    }

    // Function to change the name of a solution
    function changeSolutionName(
        uint256 _solutionId,
        string memory _newName
    ) external onlyCreator(_solutionId) {
        require(solutionCounter >= _solutionId, "Invalid solution ID");
        require(bytes(_newName).length > 0, "New name is required and must not be empty");
        require(!solutionNames[_newName], "New name already exists, please use a different name");

        Solution storage solution = solutions[_solutionId];

        // Update the solution name
        solutionNames[solution.name] = false;
        solution.name = _newName;
        solutionNames[_newName] = true;

        // Emit the event
        emit SolutionNameChanged(_solutionId, _newName);
    }

    // Function to rate a solution
    function rateSolution(uint256 _solutionId, uint256 _rating) external onlyMember {
        require(solutionCounter >= _solutionId, "Invalid solution ID");
        require(_rating >= 1 && _rating <= MAX_RATING, "Rating must be between 1 and MAX_RATING");
        require(solutions[_solutionId].isOpenForRating, "Solution is not open for rating");
        if (solutions[_solutionId].oldRating[msg.sender] > 0) {
           solutions[_solutionId].ratingSum -= solutions[_solutionId].oldRating[msg.sender];
        } else {
           solutions[_solutionId].numberOfRaters++;
        }
        solutions[_solutionId].oldRating[msg.sender] = _rating;

        // Update the solution rating and rater count
        solutions[_solutionId].ratingSum += _rating;

        // Emit the event
        emit SolutionRated(_solutionId, msg.sender, _rating);
    }

    // Function to check if a solution can become a project
    function canBecomeProject(uint256 _solutionId) external view returns (bool) {
        Solution storage solution = solutions[_solutionId];

        // Check if the solution meets the rating requirements
        if (
            solution.numberOfRaters < MIN_RATING_COUNT ||
            (solution.ratingSum / solution.numberOfRaters) < MIN_RATING_AVERAGE
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
        return totalRatingsForProblem >= MIN_TOTAL_RATING;
    }

    // Function to view the details of a solution
    function viewSolutionDetails(
        uint256 _solutionId
    ) external view returns (uint256, uint256, address, string memory, uint256, uint256, bool) {
        require(_solutionId > 0 && _solutionId <= solutionCounter, "Solution ID is out of range");

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
}
