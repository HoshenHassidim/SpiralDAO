// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Membership {
    struct Member {
        string username;
        uint256[] tasksAssigned;
        mapping(uint256 => uint256) taskAvg;
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
    function getMember(address _address) public view returns (string memory) {
        if (bytes(members[_address].username).length == 0) revert NotMember();

        return members[_address].username;
    }

    //when task is assigned to member, will add it to this array to keep track of all tasks worked on
    function assignTaskToMember(address _address, uint256 _taskId) external {
        members[_address].tasksAssigned.push(_taskId);
    }

    //keep track of the average rating a person got for each task, and the total average of all the tasks
    function addTaskAvg(address _address, uint256 _taskId, uint256 _taskAvg) external {
        members[_address].taskAvg[_taskId] = _taskAvg;
    }
}
