// SPDX-License-Identifier: MIT
// SPDX-License-Identifier identifies the license under which the contract is released.

pragma solidity ^0.8.4;
// Specifies the minimum Solidity version required for the contract.

import "./TokenManagement.sol";

// Importing the TokenManagement contract to access its functionalities.

contract Membership {
    // Struct to store task ratings for a member.
    struct taskRating {
        uint256 taskId;
        uint256 taskAvgRating;
    }

    // Struct to store member details.
    struct Member {
        bool isMember;
        string username;
        uint256 tasksAssigned;
        taskRating[] ratings;
        uint256 numOfTasks;
        uint256 tasksAvg;
        uint256 projectsManaged;
        uint256 problemsAccepted;
        uint256 solutionsAccepted;
    }

    // Custom Errors
    error AlreadyMember(); // Error to be raised when someone tries to register an already registered member.
    error UsernameRequired(); // Error to be raised when a username is not provided during registration.
    error UsernameAlreadyExists(); // Error to be raised when the provided username is already taken.
    error mustBeAuthorised(); // Error to be raised when an unauthorized contract tries to perform specific actions.
    error mustBeMember(); // Error to be raised when a non-member tries to access member-only functions.

    // Mapping of address to Member
    mapping(address => Member) private members;

    // Mapping of usernames to boolean
    mapping(string => bool) private usernames;

    event MemberRegistered(address indexed memberAddress, string username); // Declare an event for member registration.
    event MemberRegisteredWithoutName(address indexed memberAddress); // Declare an event for member registration when a usename was not provided.
    event MemberUnregistered(address indexed memberAddress); // Declare an event for member unregistration.
    event TaskAssignedtoMember(address indexed memberAddress, uint256 taskCount); // Declare an event for when a task is assigned to a specific member.
    event ProblemAndSolutionAccepted(
        address indexed problemCreator,
        uint256 problemAcceptedCount,
        address indexed solutionCreator,
        uint256 solutionAcceptedCount
    ); // Declare an event for when a project was accpeted which marks the creators of the problem and solution linked to that project
    event ProjectManaged(address _member, uint256 ProjectManagedCount); // Declare an event for when a project manager has been assigned as a specific member.

    TokenManagement private tokenManagementContract; // Reference to the TokenManagement contract

    // Constructor to initialize the imported contracts.
    constructor(TokenManagement _tokenManagementContract) {
        tokenManagementContract = _tokenManagementContract;
    }

    // Modifier to allow only authorized contracts to perform certain actions.
    modifier onlyAuthorized() {
        if (!tokenManagementContract.isAuthorized(msg.sender)) revert mustBeAuthorised();
        _;
    }

    // Function to register a new member.
    function registerMember(string memory _username) external {
        // Check if the sender is already a member.
        if (bytes(members[msg.sender].username).length > 0) revert AlreadyMember();
        // Check if a username is provided.
        if (bytes(_username).length == 0) revert UsernameRequired();
        // Check if the username is already taken.
        if (isUsernameTaken(_username)) revert UsernameAlreadyExists();

        // Add the new member to the contract.
        Member storage newMember = members[msg.sender];
        newMember.isMember = true;
        newMember.username = _username;
        usernames[_username] = true;

        // Initialize member's details.
        newMember.tasksAssigned = 0;
        newMember.tasksAvg = 0;
        newMember.projectsManaged = 0;
        newMember.problemsAccepted = 0;
        newMember.solutionsAccepted = 0;

        emit MemberRegistered(msg.sender, _username); // Emit event after successful registration.
    }

    // Function to register a new member without providing a username.
    function registerMemberWithoutName(address _address) private {
        Member storage newMember = members[_address];
        newMember.isMember = true;

        // Initialize member's details.
        newMember.tasksAssigned = 0;
        newMember.tasksAvg = 0;
        newMember.projectsManaged = 0;
        newMember.problemsAccepted = 0;
        newMember.solutionsAccepted = 0;

        emit MemberRegisteredWithoutName(msg.sender); // Emit event after successful registration.
    }

    // Function to unregister a member.
    function unregisterMember() external {
        // Check if the sender is a member.
        if (!members[msg.sender].isMember) revert mustBeMember();

        // Remove the member from the contract.
        delete usernames[members[msg.sender].username];
        delete members[msg.sender];

        emit MemberUnregistered(msg.sender); // Emit event after successful unregistration.
    }

    // View function to check if an address is registered as a member.
    function isRegisteredMember(address _address) external view returns (bool) {
        return members[_address].isMember;
    }

    // View function to check if a username is taken.
    function isUsernameTaken(string memory _username) public view returns (bool) {
        return usernames[_username];
    }

    // View function to access member details.
    function viewMemberDetails(
        address _address
    ) external view returns (string memory, uint256, uint256, uint256, uint256, uint256) {
        // Check if the address belongs to a member.
        if (!members[_address].isMember) revert mustBeMember();
        return (
            members[_address].username,
            members[_address].tasksAssigned,
            members[_address].tasksAvg,
            members[_address].projectsManaged,
            members[_address].problemsAccepted,
            members[_address].solutionsAccepted
        );
    }

    // Function to assign a task to a member.
    function assignTaskToMember(address _address) external {
        // Check if the address belongs to a member, if not, register it as a member without a username.
        if (!members[_address].isMember) {
            registerMemberWithoutName(_address);
        }

        members[_address].tasksAssigned++;
        emit TaskAssignedtoMember(_address, members[_address].tasksAssigned);
    }

    // Function to update the average rating for a task and the overall tasksAvg for a member.
    function updateTasksAvg(address performer, uint256 _taskId, uint256 _taskAvg) external {
        // Check if the address belongs to a member.
        if (!members[performer].isMember) revert mustBeMember();

        bool checker = true;
        // Update the task rating if it already exists in the member's ratings array.
        for (uint i = 0; i < members[performer].ratings.length; i++) {
            if (_taskId == members[performer].ratings[i].taskId) {
                checker = false;
                members[performer].ratings[i].taskAvgRating = _taskAvg;
            }
        }
        // If the task rating doesn't exist, add it to the ratings array.
        if (checker) {
            taskRating memory newRating = taskRating(_taskId, _taskAvg);
            members[performer].ratings.push(newRating);
        }

        // Recalculate the overall tasksAvg based on all task ratings.
        uint256 ratingsSum = 0;
        for (uint i = 0; i < members[performer].ratings.length; i++) {
            ratingsSum += members[performer].ratings[i].taskAvgRating;
        }
        members[performer].tasksAvg = ratingsSum / members[performer].ratings.length;
    }

    // Function to record when a problem and its solution are used for a project's creation.
    function proposedProblemAndSolutionAccepted(
        address _problemCreator,
        address _solutionCreator
    ) external {
        // Check if the problem creator is a member, if not, register them as a member without a username.
        if (!members[_problemCreator].isMember) {
            registerMemberWithoutName(_problemCreator);
        }
        // Check if the solution creator is a member, if not, register them as a member without a username.
        if (!members[_solutionCreator].isMember) {
            registerMemberWithoutName(_solutionCreator);
        }

        members[_problemCreator].problemsAccepted++;
        members[_solutionCreator].solutionsAccepted++;

        emit ProblemAndSolutionAccepted(
            _problemCreator,
            members[_problemCreator].problemsAccepted,
            _solutionCreator,
            members[_solutionCreator].solutionsAccepted
        );
    }

    // Function to record when a project is managed by a member.
    function managedProject(address _address) external {
        // Check if the address belongs to a member, if not, register it as a member without a username.
        if (!members[_address].isMember) {
            registerMemberWithoutName(_address);
        }

        members[_address].projectsManaged++;
        emit ProjectManaged(_address, members[_address].projectsManaged);
    }
}
