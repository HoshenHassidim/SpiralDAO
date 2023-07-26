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
        mapping(address => uint256) oldRating; // Mapping to check if a member has already rated
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
//Custom Errors
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
        if (msg.sender != solutions[_solutionId].creator) revert onlySolutionCreatorCanPerform(); //If the person calling the function is not the oslution creator of the solution entered, an error will occur 
        _;
    }

    // Constructor for initial setup
    constructor(Membership _membershipContract, Problems _problemsContract) {
        //variables initialized to the values of the contracts entered into the constructor function
        membershipContract = _membershipContract; 
        problemsContract = _problemsContract;
    }

    // Function to propose a solution
    function proposeSolution(uint256 _problemId, string memory _name) external {
        if (bytes(_name).length <= 0) revert nameCannotBeEmpty(); //If the number of characters inside the name entered into the function 
        if (_problemId == 0) revert invalidID(); // If the problem id is 0 then an error will occur 
        if (!problemsContract.doesProblemExist(_problemId)) revert problemDoesNotExist(); //If the problem entered does not exist, an error will occur

        if (solutionNames[_name]) revert nameAlreadyExists(); //if the solution name already exists in the solutionNames mapping, an error will occur
        if (!problemsContract.meetsRatingCriteria(_problemId)) revert problemDoesNotMeetCriteria(); //If the problem entered doesn't meet the rting criteria, an error will occur

        // Increment solution counter and create a new solution
        solutionCounter++; 

        Solution storage newSolution = solutions[solutionCounter]; //New solution created in solutions mapping and saved in a variable
        //Properties of new solution are now set here
        newSolution.solutionId = solutionCounter;
        newSolution.problemId = _problemId;
        newSolution.creator = msg.sender;
        newSolution.name = _name;
        newSolution.isOpenForRating = true;

        // Register new solution name and map problem to the solution
        solutionNames[_name] = true;
        problemToSolutions[_problemId].push(solutionCounter); //Add a new solution to the problemsToSolutions mapping. This will cause the mapping with the id of the problem to have one more solution added for that id

        // Emit the event
        emit SolutionProposed(solutionCounter, _problemId, msg.sender, _name); //Event emitted
    }

    // Function to cancel a solution
    function cancelSolution(uint256 _solutionId) external {
        if (_solutionId == 0) revert invalidID(); //If solution ID is zero then an error will occur

        if (bytes(solutions[_solutionId].name).length <= 0 || solutionCounter < _solutionId)
            revert solutionDoesNotExist(); //If the solution id doesnt exist (either below 1 or above the solution counter) than an error will occur 
        if (msg.sender != solutions[_solutionId].creator) revert onlySolutionCreatorCanPerform(); //If the person calling the function is not the solution creator of the solution entered, then an error will occur 

        Solution storage solution = solutions[_solutionId]; //solution entered is now saved into a variable

        if (!solution.isOpenForRating) revert solutonClosedForRating(); //If the solution is not open for rating, an error will occur
        if (solution.numberOfRaters != 0) revert solutionAlreadyRated(); //If the number of raters is not zero, meaning it has been rated before, an error will occur

        // Mark the solution as closed for rating
        solution.isOpenForRating = false;

        delete solutionNames[solutions[_solutionId].name]; //delete the solution name from the solution names mapping, now that it has been cancelled
        //ETHAN SUGGESTION - MAYBE DELETE THE SOLUTION FROM SOLUTIONS MAPPING AS WELL. TALK TO CHOSHEN
        // Emit the event
        emit SolutionCancelled(_solutionId);
    }

    // Function to change the name of a solution
    function changeSolutionName(
        uint256 _solutionId,
        string memory _newName
    ) external onlyCreator(_solutionId) {
        if (solutionCounter < _solutionId) revert solutionDoesNotExist(); //If the solution id is greater than the solution counter, then an error will occur
        if (bytes(_newName).length <= 0) revert nameCannotBeEmpty(); //If the number of characters in the name ented is zero, an error will occur
        if (solutionNames[_newName]) revert nameAlreadyExists(); //if the name entered already exists inside the solutionName mapping, an error will occur

        Solution storage solution = solutions[_solutionId]; //solution entered is now saved into a variable

        // Update the solution name
        delete solutionNames[solution.name]; //delete the old solution name from the solutionNames mapping
        solution.name = _newName; //property for the name of the solution is now set to the new name
        solutionNames[_newName] = true; //property for the solutionNames for that name now set to true

        // Emit the event
        emit SolutionNameChanged(_solutionId, _newName);
    }

    // Function to rate a solution
    function rateSolution(uint256 _solutionId, uint256 _rating) external {
        if (solutionCounter < _solutionId) revert solutionDoesNotExist(); //If the solution id is greater than the solution couter, then an error will occur 
        if (solutions[_solutionId].creator == msg.sender) revert creatorCannotRateOwnProblem(); //If the person calling the function is the solution creator, an error wll occur 
        if (_rating < 1 || _rating > MAX_RATING) revert ratingOutOfRange(); //If the rating is below one or above ten, an error will occur 
        if (!solutions[_solutionId].isOpenForRating) revert solutonClosedForRating(); // If the solution is not open for rating, an error will occur 

        if (solutions[_solutionId].oldRating[msg.sender] > 0) { //If the person calling the function has rated before (meaning their previous rating is above 0)...
            solutions[_solutionId].ratingSum -= solutions[_solutionId].oldRating[msg.sender]; //Subtract the user's old rating from the rating sum for the solution
        } else { //If the person has not rated before...
            solutions[_solutionId].numberOfRaters++; //Increment the rater count by 1
        }
        solutions[_solutionId].oldRating[msg.sender] = _rating; //Current rating now becoemes the old rating
        solutions[_solutionId].ratingSum += _rating; //Add the rating to the total sum of the ratings

        // if (solutions[_solutionId].numberOfRaters > 1){
        //     allRatings[solutions[_solutionId].indexOfArray] = [solutions[_solutionId].ratingSum, solutions[_solutionId].numberOfRaters, solutions[_solutionId].solutionId];

        // }
        // else {
        // allRatings.push([solutions[_solutionId].ratingSum, solutions[_solutionId].numberOfRaters, solutions[_solutionId].solutionId]);
        // solutions[_solutionId].indexOfArray = allRatings.length - 1;
        // }
        if (solutions[_solutionId].numberOfRaters > 1) { 
            allSolutions.push(_solutionId); //Add the current solution id to the allSolutions mapping
        }
        // Emit the event
        emit SolutionRated(_solutionId, msg.sender, _rating);
    }

    // Function to check if a solution can become a project
    function canBecomeProject(uint256 _solutionId) external returns (bool) {
        Solution storage solution = solutions[_solutionId]; //solution entered now stored into a variable
        uint256 avgRating = solution.ratingSum / solution.numberOfRaters; //calculate average

        // Check if the solution meets the rating requirements
        if (
            solution.numberOfRaters < MIN_RATING_COUNT ||
            avgRating < MIN_RATING_AVERAGE ||
            _solutionId != findSolutionWithHighestRating() //if solution id is not the id that had the highest rating from raters
        ) {
            return false;
        }

        // Calculate the total ratings for the problem the solution addresses
        uint256 totalRatingsForProblem = 0;
        uint256[] storage solutionIds = problemToSolutions[solution.problemId]; //Solution ids for problem entered now stored into variable

        for (uint256 i = 0; i < solutionIds.length; i++) {
            totalRatingsForProblem += solutions[solutionIds[i]].numberOfRaters; //Add the raters for each solution to the problem to a variable 
        }

        // Check if the total ratings meet the requirements
        if (totalRatingsForProblem < MIN_TOTAL_RATE_COUNT) { //If the total raters for the problem is less than the minimum...
            return false;
        }

        // Close the rating for all solutions associated with the same problem
        for (uint256 i = 0; i < solutionIds.length; i++) {
            solutions[solutionIds[i]].isOpenForRating = false; // Changed: Close the rating for all other solutions
        }

        return true;
    }

    function canBecomeProjectView(uint256 _solutionId) external view returns (bool) {
        Solution storage solution = solutions[_solutionId]; //solution entered now saved into a variable
        uint256 avgRating = solution.ratingSum / solution.numberOfRaters; //calculate average

        // Check if the solution meets the rating requirements
        if (
            solution.numberOfRaters < MIN_RATING_COUNT ||
            avgRating < MIN_RATING_AVERAGE ||
            _solutionId != findSolutionWithHighestRating() //if solution id is not the id that had the highest rating from raters
        ) {
            return false;
        }

        // Calculate the total ratings for the problem the solution addresses
        uint256 totalRatingsForProblem = 0;
        uint256[] storage solutionIds = problemToSolutions[solution.problemId];//Solution ids for problem entered now stored into variable

        for (uint256 i = 0; i < solutionIds.length; i++) {
            totalRatingsForProblem += solutions[solutionIds[i]].numberOfRaters; //Add the raters for each solution to the problem to a variable 
        
        }

        // Check if the total ratings meet the requirements
        return totalRatingsForProblem >= MIN_TOTAL_RATE_COUNT; //Returns a bool - if the total ratings for the problem is less than the minimum, it will return false. Otherwise, true
    }

    // Function to find the highest rated solution
    function findSolutionWithHighestRating() private view returns (uint256) {
        uint256 highestRating = 0;
        uint256 highestRatingSolutionId;

        // Iterate over the keys in the mapping
        for (uint256 i = 0; i < allSolutions.length; i++) {
            uint256 solutionId = allSolutions[i]; //solution id of current iteration saved to variable
            Solution storage solution = solutions[solutionId]; //solution of current iteration saved to variable
            // Calculate the rating for the current solution
            uint256 rating = solution.ratingSum / solution.numberOfRaters; //Average calculator

            // Update highestRating and highestRatingSolutionId if the current rating is higher
            if (rating > highestRating) {
                highestRating = rating; //If the highest rating is greater than the previous highest rating, then that value will become the highest rating
                highestRatingSolutionId = solutionId; //Also, the solution id will become the solution id with the highest rating
            }
        }

        return highestRatingSolutionId;
    }

    // Function to view the details of a solution
    function viewSolutionDetails(
        uint256 _solutionId
    ) external view returns (uint256, uint256, address, string memory, uint256, uint256, bool) {
        if (_solutionId <= 0 || _solutionId > solutionCounter) revert IDOutofRange(); //If the id is out of range (less than zero or greater than the solution counter) then an error will occur

        Solution storage solution = solutions[_solutionId]; //solution entered now stored into a variable

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
    function getSolutionCounter() external view returns (uint256) {
        return solutionCounter;
    }

    function isSolutionNameTaken(string memory _name) external view returns (bool) {
        return solutionNames[_name]; //Returns bool, if the solution name is taken, it will return true. Otherwise, false
    }

    // Function to get the creators of a solution and its corresponding problem
    function getCreators(
        uint256 _solutionId
    ) external view returns (address problemCreator, address solutionCreator) {
        if (_solutionId <= 0 || _solutionId > solutionCounter) revert IDOutofRange(); //If the id is out of range (less than zero or greater than the solution counter) then an error will occur

        Solution storage solution = solutions[_solutionId]; //Solution entered now stored into a variable
        solutionCreator = solution.creator; //solution creator for solution  that was entered is now saved into a variable (and are returned)

        problemCreator = problemsContract.getProblemCreator(solution.problemId); //Problem creattor for solution that was entered is now saved into a variable (and are returned)
    }
}
