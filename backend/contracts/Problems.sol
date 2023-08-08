// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Membership.sol";
import "./AuthorizationManagement.sol";

contract Problems {
    // This is a reference to the external Membership contract
    Membership private membershipContract;
    AuthorizationManagement private authorizationManagementContract;

    // The constructor function is called once when the contract is deployed
    constructor(
        Membership _membershipContract,
        AuthorizationManagement _authorizationManagementContract
    ) {
        membershipContract = _membershipContract;
        authorizationManagementContract = _authorizationManagementContract;
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
    //Each Error has custom name that when reverted will show uo as an error message
    error nameRequired();
    error nameExists();
    error invalidProblemID();
    error onlyCreatorCanCancel();
    error problemAlreadyRated();
    error problemClosedForRating();
    error ratingOutOfRange();
    error problemProposerCannotRate();
    error nameAlreadyExists();
    error onlyCreatorCanChangeProblemName();
    error cannotChangeNameAfterProblemHasBeenRated();
    error problemDoesNotExist();
    error mustBeAuthorised();

    // Modifier to allow only authorized contracts to perform certain actions.
    modifier onlyAuthorized() {
        if (!authorizationManagementContract.isAuthorized(msg.sender)) revert mustBeAuthorised();
        _;
    }

    // This is a counter for the problems raised, serving as the unique identifier for each problem
    uint256 private problemCounter;

    //Some constants
    uint256 MAX_RATING = 10;
    uint256 MIN_RATING_COUNT = 2;
    uint256 MIN_RATING_AVERAGE = 7;

    // This mapping links each problem id to a Problem struct
    mapping(uint256 => Problem) private problems;

    // This mapping helps prevent duplicate problem names
    mapping(string => bool) private problemNames;

    // These events are emitted when a new problem is raised, a problem is cancelled, or a problem is rated
    event NewProblem(uint256 problemId, address creator, string name);
    event ProblemCancelled(uint256 problemId);
    event ProblemRated(uint256 problemId, address rater, uint256 rating);
    event ProblemChanged(uint256 problemId, string name);
    event ProblemRatingCriteriaMet(uint256 problemId);

    // This function allows a member to raise a problem
    function raiseProblem(string calldata _name) external {
        if (bytes(_name).length == 0) revert nameRequired(); //If number of characters entered is 0, an error will occur
        if (problemNames[_name]) revert nameExists(); //If the name of the problem is already registered in the problemNames mapping, an error will occur
        problemCounter++; //Add to then number of problems registered

        Problem storage newProblem = problems[problemCounter]; //New problem is created, and registered in the problems mapping
        //Setting the properties of the problem
        newProblem.id = problemCounter;
        newProblem.creator = msg.sender;
        newProblem.name = _name;
        newProblem.ratingSum = 0;
        newProblem.ratingCount = 0;
        newProblem.openForRating = true;

        problemNames[_name] = true; //Register the new problem name inside problemNames and set its value to true

        emit NewProblem(problemCounter, msg.sender, _name); //Event emitted
    }

    // This function allows the creator of a problem to cancel it

    function cancelProblem(uint256 _problemId) external {
        if (bytes(problems[_problemId].name).length <= 0) revert problemDoesNotExist(); //If problem entered doesn't have a name (ie. It doesn't exist) an error will occur
        if (_problemId <= 0 || _problemId > problemCounter) revert invalidProblemID(); //If problem id is less than zero or greater than the number of problems entered, an error will occur

        Problem storage problem = problems[_problemId]; //problem entered is now stored into a new variable
        if (problem.creator != msg.sender) revert onlyCreatorCanCancel(); //If the person calling the function is not the creator of the problem, an error will occur
        if (problem.ratingCount != 0) revert problemAlreadyRated(); //If the rating count for a problem is not zero, meaning people have rated the problem, an error will occur
        if (!problem.openForRating) revert problemClosedForRating(); //if the openForRating property is false, meaning the problem is not open for rating, an error will occur

        problem.openForRating = false; //Since the problem has been cancelled, it can no longer be rated, so this property is set to false
        delete problemNames[problems[_problemId].name]; //current problem now deleted from problems mapping as it has been cancelled
        // The problem is now closed for rating
        emit ProblemCancelled(_problemId); //Event emitted
    }

    // Function to change the name of a problem
    function changeProblemName(uint256 _problemId, string calldata _newName) external {
        if (_problemId <= 0 || _problemId > problemCounter) revert invalidProblemID(); //If the problem id is less than 0 or greater than the problem counter, an error will be emitted
        if (bytes(_newName).length == 0) revert nameRequired(); //If the number of characters entered is 0, an error will be emitted
        if (problemNames[_newName]) revert nameAlreadyExists(); //If the problem name for the problem entered already exists inside the problemNames mapping, an error will occur

        Problem storage problem = problems[_problemId]; //the problem entered is now saved into a variable

        if (msg.sender != problem.creator) revert onlyCreatorCanChangeProblemName(); //If the person calling the function is not the problem creator, an error will occur
        if (problem.ratingCount != 0) revert cannotChangeNameAfterProblemHasBeenRated(); //If there are people who have already rated the problem, an error will occur

        // Delete the old name from the problemNames mapping
        delete problemNames[problem.name]; //delete the old problem name from the problemNames mapping
        // delete problems[_problemId]; //ETHAN SUGGESTION - ADD WHEN CHOSHEN APPROVES
        // Update the problem's name
        problem.name = _newName; //name property changed to new name
        // Mark the new name as used in the problemNames mapping
        problemNames[_newName] = true; //name property set to true inside the problemNames mapping

        emit ProblemChanged(_problemId, _newName); //Event emitted
    }

    // This function allows a member to rate a problem
    function rateProblem(uint256 _problemId, uint256 _rating) external {
        if (_rating < 1 || _rating > MAX_RATING) revert ratingOutOfRange(); //If rating is less than 1 or higher than 10, an error will occur

        Problem storage problem = problems[_problemId]; //current problem saved in variable

        if (problem.creator == msg.sender) revert problemProposerCannotRate(); //If the person calling the function is the problem creator, an error will occur
        if (problem.id <= 0 || _problemId > problemCounter) revert invalidProblemID(); //If id is less than 0 or greater than the problem counter, aan error will occur
        if (!problem.openForRating) revert problemClosedForRating(); //If the openForRating variable is false, an error will occur as the problem is not open for rating

        if (problem.oldRating[msg.sender] > 0) {
            //If the person calling the function has rated the problem before... (ie their past rating is greater than 0)
            problem.ratingSum -= problem.oldRating[msg.sender]; //Subtract the old rating from the total rating sum for the problem
        } else {
            problem.ratingCount++; //If the person has not rated the problem before, add 1 to the total rating count for the problem
        }
        problem.oldRating[msg.sender] = _rating; //New rating registered as the old rating
        problem.ratingSum += _rating; //add the rating entered into the function to the rating sum for the problem

        emit ProblemRated(_problemId, msg.sender, _rating); //Event emitted
    }

    // This function checks if a problem meets certain rating criteria
    function meetsRatingCriteria(uint256 _problemId) external onlyAuthorized returns (bool) {
        if (bytes(problems[_problemId].name).length <= 0) revert problemDoesNotExist(); //If the problem entered doesn't have a name (it doesn't exist) then an error is emitted
        if (_problemId <= 0 || _problemId > problemCounter) revert invalidProblemID(); //If the problem id is less than 0 or greater than the problem counter, an error will be emitted
        Problem storage problem = problems[_problemId]; //problem entered is now saved in a variable
        if (!problem.openForRating) revert problemClosedForRating(); //If the openForRating variable is false, an error will occur as the problem is not open for rating

        // The problem must have at least MIN_RATING_COUNT ratings
        if (problem.ratingCount < MIN_RATING_COUNT) {
            //If the rating count for the problem is less than the minimum rating count any problem to move on...
            return false;
        }

        // The average rating must be at least MIN_RATING_AVERAGE
        if ((problem.ratingSum / problem.ratingCount) < MIN_RATING_AVERAGE) {
            //If the average rating for the problem is less than the minimum rating average for the problem to move on to the next step....
            return false;
        }

        problem.openForRating = false;

        emit ProblemRatingCriteriaMet(_problemId);

        return true;
    }

    // This function checks if a problem meets certain rating criteria
    function viewMeetsRatingCriteria(uint256 _problemId) external view returns (bool) {
        if (bytes(problems[_problemId].name).length <= 0) revert problemDoesNotExist(); //If the problem entered doesn't have a name (it doesn't exist) then an error is emitted
        if (_problemId <= 0 || _problemId > problemCounter) revert invalidProblemID(); //If the problem id is less than 0 or greater than the problem counter, an error will be emitted
        Problem storage problem = problems[_problemId]; //problem entered is now saved in a variable

        // The problem must have at least MIN_RATING_COUNT ratings
        if (problem.ratingCount < MIN_RATING_COUNT) {
            //If the rating count for the problem is less than the minimum rating count any problem to move on...
            return false;
        }

        // The average rating must be at least MIN_RATING_AVERAGE
        if ((problem.ratingSum / problem.ratingCount) < MIN_RATING_AVERAGE) {
            //If the average rating for the problem is less than the minimum rating average for the problem to move on to the next step....
            return false;
        }

        return true;
    }

    // View function to see details about a problem
    function viewProblemDetails(
        uint256 _problemId
    ) external view returns (uint256, address, string memory, uint256, uint256, bool) {
        if (_problemId <= 0 || _problemId > problemCounter) revert invalidProblemID(); //If the problem id is less than 0 or greater than the problem counter, an error will be emitted
        Problem storage problem = problems[_problemId]; //Problem entered is now stored inside a variable

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
        return problemNames[_name]; //If name is registered inside this mapping, it will return true. Otherwise, false
    }

    function getProblemCreator(uint256 _problemId) external view returns (address) {
        if (problems[_problemId].id <= 0) revert invalidProblemID(); //If the problem id is less than 0 or greater than the problem counter, an error will be emitted
        return problems[_problemId].creator;
    }

    function doesProblemExist(uint256 _problemId) external view returns (bool) {
        return bytes(problems[_problemId].name).length > 0; //If the problem id exists inside the problems mapping, and the number of characters in the name is greater than 0, meaning it exists, than the function will return true. Otherwise, false
    }
}
