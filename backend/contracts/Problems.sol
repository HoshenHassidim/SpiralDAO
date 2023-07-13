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
        uint256 id;
        address creator;
        string name;
        uint256 ratingSum;
        uint256 ratingCount;
        bool openForRating;
        mapping(address => uint256) oldRating;
    }
    //Errors 
    error onlyRegisteredMember();
    error nameRequired();
    error nameExists();
    error invalidProblemID();
    error onlyCreatorCanCancel();
    error problemAlreadyRated();
    error problemClosedForRating();
    error ratingOutOfRange();
    error problemProposerCannotRate();
    error userNameAlreadyExists();
    error onlyCreatorCanChangeProblemName();
    error cannotChangeNameAfterProblemHasBeenRated();

    // This is a counter for the problems raised, serving as the unique identifier for each problem
   uint256 private problemCounter;

   uint256 MAX_RATING = 10;
   uint256 MIN_RATING_COUNT = 2;
   uint256 MIN_RATING_AVERAGE = 7;

    // This mapping links each problem id to a Problem struct
    mapping(uint256 => Problem) private problems;

    // This mapping helps prevent duplicate problem names
    mapping(string => bool) private problemNames;

    // These events are emitted when a new problem is raised, a problem is cancelled, or a problem is rated
    event NewProblem(uint256 id, address creator, string name);
    event ProblemCancelled(uint256 id);
    event ProblemRated(uint256 id, address rater, uint256 rating);
    event ProblemChanged(uint256 id, string name);

    // This modifier ensures that only registered members can raise, cancel or rate a problem
    modifier onlyMember() {
        if(!membershipContract.isRegisteredMember(msg.sender)) {
            revert onlyRegisteredMember();
        }
        _;
    }

    // This function allows a member to raise a problem
    function raiseProblem(string calldata _name) external onlyMember {
        if (bytes(_name).length == 0) revert nameRequired();
        if(problemNames[_name]) revert nameExists();
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
    function cancelProblem(uint256 _problemId) external onlyMember {
        if(_problemId <= 0 || _problemId > problemCounter) revert invalidProblemID();
        Problem storage problem = problems[_problemId];
        if(problem.creator != msg.sender) revert onlyCreatorCanCancel();
        if(problem.ratingCount != 0) revert problemAlreadyRated();
        if(!problem.openForRating) revert problemClosedForRating();

        problem.openForRating = false;
        // The problem is now closed for rating
        emit ProblemCancelled(_problemId);
    }

    // This function allows a member to rate a problem
    function rateProblem(uint256 _problemId, uint256 _rating) external onlyMember {
        if(_rating < 1 || _rating > MAX_RATING) revert ratingOutOfRange();//note check to see if the console prints the value itself. the user will not know the value of MAX_RATING (To solve use string concatination)

        Problem storage problem = problems[_problemId];

        if(problem.creator == msg.sender) revert problemProposerCannotRate();
        if(!problem.openForRating) revert problemClosedForRating();
        if(problem.oldRating[msg.sender] > 0) {
           problem.ratingSum -= problem.oldRating[msg.sender];
        } else {
           problem.ratingCount++;
        }
        problem.oldRating[msg.sender] = _rating;
        problem.ratingSum += _rating;

        emit ProblemRated(_problemId, msg.sender, _rating);
    }

    // This function checks if a problem meets certain rating criteria
    function meetsRatingCriteria(uint256 _problemId) external view returns (bool) {
        if(_problemId <= 0 || _problemId > problemCounter) revert invalidProblemID();
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
    function changeProblemName(uint256 _problemId, string calldata _newName) external onlyMember {
     
        if(_problemId <= 0 || _problemId > problemCounter) revert invalidProblemID();
        if (bytes(_newName).length == 0) revert nameRequired();
        if(problemNames[_newName]) revert userNameAlreadyExists();

        Problem storage problem = problems[_problemId];

        if(msg.sender != problem.creator) revert onlyCreatorCanChangeProblemName();
        if(problem.ratingCount != 0) revert cannotChangeNameAfterProblemHasBeenRated();

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
        uint256 _problemId
    ) external view returns (uint256, address, string memory, uint256, uint256, bool) {
        if(_problemId <= 0 || _problemId > problemCounter) revert invalidProblemID();
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
    function getProblemCounter() external view returns (uint256) {
        return problemCounter;
    }

    function isProblemNameTaken(string memory _name) external view returns (bool) {
        return problemNames[_name];
    }
}
