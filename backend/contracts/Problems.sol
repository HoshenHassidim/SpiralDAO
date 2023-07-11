// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Membership.sol";

contract Problems {
    // This is a reference to the external Membership contract
    Membership private membershipContract;

    // The constructor function is called once when the contract is deployed
    constructor(Membership _membershipContract) {
        membershipContract = _membershipContract;
    }

    // The Problem struct defines the structure for each problem
    // Each problem has an id, creator, name, ratingSum, ratingCount, openForRating status, and a mapping of addresses that have rated it
    struct Problem {
        uint id;
        address creator;
        string name;
        uint ratingSum;
        uint ratingCount;
        bool openForRating;
        mapping(address => bool) hasRated;
    }

    // This is a counter for the problems raised, serving as the unique identifier for each problem
    uint256 private problemCounter;

    uint256 MAX_RATING = 10;
    uint256 MIN_RATING_COUNT = 2;
    uint256 MIN_RATING_AVERAGE = 7;

    // This mapping links each problem id to a Problem struct
    mapping(uint => Problem) private problems;

    // This mapping helps prevent duplicate problem names
    mapping(string => bool) private problemNames;

    // These events are emitted when a new problem is raised, a problem is cancelled, or a problem is rated
    event NewProblem(uint id, address creator, string name);
    event ProblemCancelled(uint id);
    event ProblemRated(uint id, address rater, uint rating);
    event ProblemChanged(uint id, string name);

    // This modifier ensures that only registered members can raise, cancel or rate a problem
    modifier onlyMember() {
        require(
            membershipContract.isRegisteredMember(msg.sender),
            "Only registered members can perform this action"
        );
        _;
    }

    // This function allows a member to raise a problem
    function raiseProblem(string calldata _name) external onlyMember {
        require(bytes(_name).length > 0, "Problem name is required and must not be empty.");
        require(!problemNames[_name], "Problem name already exists, please use a different name.");

        problemCounter++;

        Problem storage newProblem = problems[problemCounter];
        newProblem.id = problemCounter;
        newProblem.creator = msg.sender;
        newProblem.name = _name;
        newProblem.ratingSum = 0;
        newProblem.ratingCount = 0;
        newProblem.openForRating = true;

        problemNames[_name] = true;

        emit NewProblem(problemCounter, msg.sender, _name);
    }

    // This function allows the creator of a problem to cancel it
    function cancelProblem(uint _problemId) external onlyMember {
        require(_problemId > 0 && _problemId <= problemCounter, "Invalid problem ID.");
        Problem storage problem = problems[_problemId];
        require(problem.creator == msg.sender, "Only the creator can cancel the problem.");
        require(problem.ratingCount == 0, "Problem has already been rated");
        require(problem.openForRating, "Problem is already closed for rating.");

        problem.openForRating = false;
        // The problem is now closed for rating
        emit ProblemCancelled(_problemId);
    }

    // This function allows a member to rate a problem
    function rateProblem(uint _problemId, uint _rating) external onlyMember {
        require(_rating >= 1 && _rating <= MAX_RATING, "Rating must be between 1 and MAX_RATING.");//note check to see if the console prints the value itself. the user will not know the value of MAX_RATING (To solve use string concatination)

        Problem storage problem = problems[_problemId];

        require(problem.openForRating, "Problem is closed for rating.");
        require(!problem.hasRated[msg.sender], "You have already rated this problem.");

        problem.ratingSum += _rating;
        problem.ratingCount++;
        problem.hasRated[msg.sender] = true;

        emit ProblemRated(_problemId, msg.sender, _rating);
    }

    // This function checks if a problem meets certain rating criteria
    function meetsRatingCriteria(uint _problemId) external view returns (bool) {
        require(_problemId > 0 && _problemId <= problemCounter, "Invalid problem ID.");
        Problem storage problem = problems[_problemId];

        // The problem must have at least MIN_RATING_COUNT ratings
        if (problem.ratingCount < MIN_RATING_COUNT) {
            return false;
        }

        // The average rating must be at least MIN_RATING_AVERAGE
        if ((problem.ratingSum / problem.ratingCount) < MIN_RATING_AVERAGE) {
            return false;
        }

        return true;
    }

    // Function to change the name of a problem
    function changeProblemName(uint _problemId, string calldata _newName) external onlyMember {
        require(_problemId > 0 && _problemId <= problemCounter, "Invalid problem ID.");
        require(bytes(_newName).length > 0, "New name is required and must not be empty.");
        require(!problemNames[_newName], "New name already exists, please use a different name.");

        Problem storage problem = problems[_problemId];

        require(msg.sender == problem.creator, "Only the creator can change the problem name.");
        require(problem.ratingCount == 0, "Cannot change name after the problem has been rated.");

        // Delete the old name from the problemNames mapping
        problemNames[problem.name] = false;
        // Update the problem's name
        problem.name = _newName;
        // Mark the new name as used in the problemNames mapping
        problemNames[_newName] = true;

        emit ProblemChanged(_problemId, _newName);
    }

    // View function to see details about a problem
    function viewProblemDetails(
        uint _problemId
    ) external view returns (uint, address, string memory, uint, uint, bool) {
        require(_problemId > 0 && _problemId <= problemCounter, "Invalid problem ID.");

        Problem storage problem = problems[_problemId];

        // Returns the problem details: id, creator, name, ratingSum, ratingCount, and openForRating status
        return (
            problem.id,
            problem.creator,
            problem.name,
            problem.ratingSum,
            problem.ratingCount,
            problem.openForRating
        );
    }

    // View functions to get private state variables
    function getProblemCounter() external view returns (uint) {
        return problemCounter;
    }

    function isProblemNameTaken(string memory _name) external view returns (bool) {
        return problemNames[_name];
    }
}
