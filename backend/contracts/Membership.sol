// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Membership {
    struct avg {
        uint256 taskId;
        uint256 taskAverage;
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

        newMember.tasksAssigned = 0;
        newMember.tasksAvg = 0;
        //newMember.taskAvgs = new avg[](0);
        newMember.projectsManaged = 0;
        newMember.problemsAccepted = 0;
        newMember.solutionsAccepted = 0;

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
    ) external view returns (string memory, uint256, uint256, uint256, uint256, uint256) {
        if (bytes(members[_address].username).length == 0) revert NotMember();
        return (
            members[_address].username, //0
            members[_address].tasksAssigned, //1
            members[_address].tasksAvg, //2
            //does not return taskAvgs
            members[_address].projectsManaged, //3
            members[_address].problemsAccepted, //4
            members[_address].solutionsAccepted //5
        );
    }

    //when task is assigned to member, will add it to this array to keep track of all tasks worked on
    function assignTaskToMember(address _address) external {
        if (bytes(members[_address].username).length == 0) revert NotMember();
        members[_address].tasksAssigned++;
    }

    // Function to add the average rating for a task and update the overall tasksAvg
    function addTaskAvg(address _address, uint256 _taskAvg, uint256 _taskId) external {
        if (bytes(members[_address].username).length == 0) revert NotMember();
        bool check = true;
        for (uint i = 0; i < members[_address].taskAvgs.length; i++) {
            if ((((members[_address]).taskAvgs[i]).taskId) == (_taskId)) {
                members[_address].taskAvgs[i].taskAverage = _taskAvg;
                check = false;
            }
        }
        if (check) {
            avg memory newAvg = avg(_taskAvg, _taskId);
            members[_address].taskAvgs.push(newAvg);
        }
        uint256 totalAvg = 0;
        for (uint i = 0; i < members[_address].taskAvgs.length; i++) {
            totalAvg += members[_address].taskAvgs[i].taskAverage;
        }
        members[_address].tasksAvg = totalAvg;
    }

    function proposedSolutionAccepted(address _address) external {
        if (bytes(members[_address].username).length == 0) revert NotMember();
        members[_address].solutionsAccepted++;
    }

    function proposedProblemAccepted(address _address) external {
        if (bytes(members[_address].username).length == 0) revert NotMember();
        members[_address].problemsAccepted++;
    }

    function managedProject(address _address) external {
        if (bytes(members[_address].username).length == 0) revert NotMember();
        members[_address].projectsManaged++;
    }

    // Function to calculate the rating of a member on a scale of 1 to 10
    function calculateRating(address _address) external view returns (uint256) {
        //THIS DOES NOT RLY WORK YET
        if (bytes(members[_address].username).length == 0) revert NotMember();
        Member memory member = members[_address];

        // Calculate a weighted average based on different factors
        // You can modify these weights based on your specific criteria and requirements
        uint256 tasksWeight = 3;
        uint256 projectsWeight = 3;
        uint256 problemsWeight = 1;
        uint256 solutionsWeight = 2;

        uint256 totalWeight = tasksWeight + projectsWeight + problemsWeight + solutionsWeight;

        uint256 tasksAvgScore = (member.tasksAvg * tasksWeight) / totalWeight;
        uint256 projectsScore = (member.projectsManaged * projectsWeight) / totalWeight;
        uint256 problemsScore = (member.problemsAccepted * problemsWeight) / totalWeight;
        uint256 solutionsScore = (member.solutionsAccepted * solutionsWeight) / totalWeight;

        uint256 totalScore = tasksAvgScore + projectsScore + problemsScore + solutionsScore;

        // Normalize the score to a scale of 1 to 10
        uint256 normalizedScore = (totalScore * 10) / totalWeight;

        // Ensure the rating is within the range of 1 to 10
        if (normalizedScore > 10) {
            return 10;
        } else if (normalizedScore < 1) {
            return 1;
        } else {
            return normalizedScore;
        }
    }
}
