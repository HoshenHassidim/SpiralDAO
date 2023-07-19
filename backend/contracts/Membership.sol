// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Membership {
    struct avg {
        uint256 average;
        uint256 id;
    }
    struct Member {
        string username;
        uint256 tasksAssigned;
        avg[] taskAvgs;
        uint256 tasksAvg;
        uint256 projectsManaged;
        uint256 problemsAccepted;
        uint256 solutionsAccepted;
    }

    // Custom Errors
    error AlreadyMember();
    error UsernameRequired();
    error UsernameAlreadyExists();
    error NotMember();

    // Mapping of address to Member - made private
    mapping(address => Member) private members;

    // Mapping of usernames to boolean - made private
    mapping(string => bool) private usernames;

    // Declare an event for member registration
    event MemberRegistered(address indexed memberAddress);

    // Declare an event for member unregistration
    event MemberUnregistered(address indexed memberAddress);

    // Function to register a new member
    function registerMember(string memory _username) external {
        if (bytes(members[msg.sender].username).length > 0) revert AlreadyMember();
        if (bytes(_username).length == 0) revert UsernameRequired();
        if (isUsernameTaken(_username)) revert UsernameAlreadyExists();

        Member storage newMember = members[msg.sender];
        newMember.username = _username;
        usernames[_username] = true;

        emit MemberRegistered(msg.sender); // Emit event after successful registration
    }

    // Function to unregister a member
    function unregisterMember() external {
        if (bytes(members[msg.sender].username).length == 0) revert NotMember();

        delete usernames[members[msg.sender].username];
        delete members[msg.sender];

        emit MemberUnregistered(msg.sender); // Emit event after successful unregistration
    }

    // Function to check if an address is a registered member
    function isRegisteredMember(address _address) external view returns (bool) {
        return bytes(members[_address].username).length > 0;
    }

    // View function to access usernames mapping
    function isUsernameTaken(string memory _username) public view returns (bool) {
        return usernames[_username];
    }

    // View function to access members mapping
    function viewMemberDetails(
        address _address
    ) external view returns (string memory, uint256, uint256, uint256, uint256, uint256, uint256) {
        if (bytes(members[_address].username).length == 0) revert NotMember();
        return (
            members[_address].username,
            members[_address].tasksAssigned,
            members[_address].tasksAvg,
            members[_address].tasksAvg,
            members[_address].projectsManaged,
            members[_address].problemsAccepted,
            members[_address].solutionsAccepted
        );
    }

    //when task is assigned to member, will add it to this array to keep track of all tasks worked on
    function assignTaskToMember(address _address) external {
        members[_address].tasksAssigned++;
    }

    // Function to add the average rating for a task and update the overall tasksAvg
    function addTaskAvg(address _address, uint256 _taskAvg, uint256 _taskId) external {
        bool check = true;
        for (uint i = 0; i < members[_address].taskAvgs.length; i++) {
            if ((((members[_address]).taskAvgs[i]).id) == (_taskId)) {
                members[_address].taskAvgs[i].average = _taskAvg;
                check = false;
            }
        }
        if (check) {
            avg memory newAvg = avg(_taskAvg, _taskId);
            members[_address].taskAvgs.push(newAvg);
        }
        uint256 totalAvg = 0;
        for (uint i = 0; i < members[_address].taskAvgs.length; i++) {
            totalAvg += members[_address].taskAvgs[i].average;
        }
        members[_address].tasksAvg = totalAvg;
    }

    function proposedSolutionAccepted(address _address) external {
        members[_address].solutionsAccepted++;
    }

    function proposedProblemAccepted(address _address) external {
        members[_address].problemsAccepted++;
    }

    function managedProject(address _address) external {
        members[_address].projectsManaged++;
    }
}
