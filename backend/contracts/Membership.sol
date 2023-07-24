// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Membership {
    struct rating {
        uint256 taskId;
        address raterId;
        uint256 rating;
    }
    struct Member {
        bool isMember;
        string username;
        uint256 tasksAssigned;
        rating[] ratings;
        uint256 numOfTasks;
        uint256 tasksAvg;
        uint256 projectsManaged;
        uint256 problemsAccepted;
        uint256 solutionsAccepted;
    }

    // Custom Errors
    error AlreadyMember();
    error UsernameRequired();
    error UsernameAlreadyExists();
    error mustBeMember();

    // Mapping of address to Member - made private
    mapping(address => Member) private members;

    // Mapping of usernames to boolean - made private
    mapping(string => bool) private usernames;

    // Declare an event for member registration
    event MemberRegistered(address indexed memberAddress, string username);
    event MemberRegisteredWithoutName(address indexed memberAddress);

    // Declare an event for member unregistration
    event MemberUnregistered(address indexed memberAddress);

    // Function to register a new member
    function registerMember(string memory _username) external {
        if (bytes(members[msg.sender].username).length > 0) revert AlreadyMember();
        if (bytes(_username).length == 0) revert UsernameRequired();
        if (isUsernameTaken(_username)) revert UsernameAlreadyExists();

        Member storage newMember = members[msg.sender];
        newMember.isMember = true;
        newMember.username = _username;
        usernames[_username] = true;

        newMember.tasksAssigned = 0;
        newMember.tasksAvg = 0;
        //newMember.taskAvgs = new avg[](0);
        newMember.projectsManaged = 0;
        newMember.problemsAccepted = 0;
        newMember.solutionsAccepted = 0;
        emit MemberRegistered(msg.sender, _username); // Emit event after successful registration
    }

    function registerMemberWithoutName(address _address) private {
        Member storage newMember = members[_address];
        // newMember.username = _username;
        newMember.isMember = true;

        newMember.tasksAssigned = 0;
        newMember.tasksAvg = 0;
        //newMember.taskAvgs = new avg[](0);
        newMember.projectsManaged = 0;
        newMember.problemsAccepted = 0;
        newMember.solutionsAccepted = 0;
        emit MemberRegisteredWithoutName(msg.sender); // Emit event after successful registration
    }

    // Function to unregister a member
    function unregisterMember() external {
        if (!members[msg.sender].isMember) revert mustBeMember();

        delete usernames[members[msg.sender].username];
        delete members[msg.sender];

        emit MemberUnregistered(msg.sender); // Emit event after successful unregistration
    }

    // Function to check if an address is a registered member
    function isRegisteredMember(address _address) external view returns (bool) {
        return members[_address].isMember;
    }

    // View function to access usernames mapping
    function isUsernameTaken(string memory _username) public view returns (bool) {
        return usernames[_username];
    }

    // View function to access members mapping
    function viewMemberDetails(
        address _address
    ) external view returns (string memory, uint256, uint256, uint256, uint256, uint256) {
        if (!members[_address].isMember) revert mustBeMember();
        return (
            members[_address].username, //0
            members[_address].tasksAssigned, //1
            members[_address].tasksAvg, //2
            //does not return taskAvgs
            members[_address].projectsManaged, //3
            members[_address].problemsAccepted, //4
            members[_address].solutionsAccepted /*, //5
            calculateRating(_address)*/
        );
    }

    //when task is assigned to member, will add it to this array to keep track of all tasks worked on
    function assignTaskToMember(address _address) external {
        if (!members[_address].isMember) {
            registerMemberWithoutName(_address);
        }
        members[_address].tasksAssigned++;
    }

    // Function to add the average rating for a task and update the overall tasksAvg
    function addTaskAvg(
        address _address,
        address _rater,
        uint256 _rating,
        uint256 _taskId
    ) external {
        if (!members[_address].isMember) revert mustBeMember();
        bool checker = true;
        uint256 numberOfTasks = 0;
        for (uint i = 0; i < members[_address].ratings.length; i++) {
            if (
                (_taskId == members[_address].ratings[i].taskId) &&
                (_rater == members[_address].ratings[i].raterId)
            ) {
                checker = false;
                members[_address].ratings[i].rating = _rating;
            }
            if (members[_address].ratings[i].taskId > numberOfTasks)
                numberOfTasks = members[_address].ratings[i].taskId;
        }
        if (checker) {
            rating memory newRating = rating(_taskId, _rater, _rating);
            members[_address].ratings.push(newRating);
        }
        uint256 ratingsSum = 0;
        for (uint i = 0; i < members[_address].ratings.length; i++) {
            ratingsSum += members[_address].ratings[i].rating;
        }
        members[_address].tasksAvg = ratingsSum / members[_address].ratings.length;
    }

    function proposedSolutionAccepted(address _address) external {
        if (!members[_address].isMember) {
            registerMemberWithoutName(_address);
        }
        members[_address].solutionsAccepted++;
    }

    function proposedProblemAccepted(address _address) external {
        if (!members[_address].isMember) {
            registerMemberWithoutName(_address);
        }
        members[_address].problemsAccepted++;
    }

    function managedProject(address _address) external {
        if (!members[_address].isMember) {
            registerMemberWithoutName(_address);
        }
        members[_address].projectsManaged++;
    }
}
