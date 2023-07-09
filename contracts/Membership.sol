// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Membership {
    struct Member {
        string username;
    }

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
        require(bytes(members[msg.sender].username).length == 0, "Already a member.");
        require(bytes(_username).length > 0, "Username is required.");
        require(!isUsernameTaken(_username), "Username already exists");

        Member storage newMember = members[msg.sender];
        newMember.username = _username;
        usernames[_username] = true;

        emit MemberRegistered(msg.sender); // Emit event after successful registration
    }

    // Function to unregister a member
    function unregisterMember() external {
        require(bytes(members[msg.sender].username).length > 0, "Not a member.");
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
        require(bytes(members[_address].username).length > 0, "Not a member.");
        return members[_address].username;
    }
}
