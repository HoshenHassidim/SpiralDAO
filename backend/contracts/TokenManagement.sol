// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Tokens.sol";

// This is the contract for managing tokens, including creating new tokens for projects and minting tokens.
contract TokenManagement {
    // The admin is the account that has all permissions
    address public immutable admin;
    // A mapping of project IDs to their respective token contracts
    mapping(uint256 => Tokens) private projectTokens;
    // A mapping of authorized contracts that can perform certain actions
    mapping(address => bool) private authorizedContracts;
    // A constant value representing the share of the project manager in percent
    uint256 private INVERSE_PROJECT_MANAGER_SHARE = 10;
    // A constant value representing the DAO token payment ratio
    uint256 private INVERSE_DAO_TOKEN_PAY_RATIO = 10;
    // A constant value represeting how much project tokens the problem creator will get
    uint256 private PROJECT_TOKEN_PROBLEM_CREATOR = 10;
    // A constant value represeting how much DAO tokens the problem creator will get
    uint256 private DAO_TOKEN_PROBLEM_CREATOR = 10;
    // A constant value represeting how much project tokens the problem creator will get
    uint256 private PROJECT_TOKEN_SOLUTION_CREATOR = 10;
    // A constant value represeting how much DAO tokens the problem creator will get
    uint256 private DAO_TOKEN_SOLUTION_CREATOR = 10;

    constructor() {
        // The constructor sets the admin to the sender, and authorizes the sender
        admin = msg.sender;
        authorizedContracts[msg.sender] = true;
        // Create a new DAO token and assign it to project ID 0
        Tokens newToken = new Tokens("SPIRALDAOTOKEN", "SDT", address(this));
        projectTokens[0] = newToken;
    }

    // Modifier to allow only the admin to perform certain actions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Modifier to allow only authorized contracts to perform certain actions
    modifier onlyAuthorized() {
        require(
            authorizedContracts[msg.sender],
            "This contract is not authorized to perform this action"
        );
        _;
    }

    // Function to authorize a contract, can only be called by the admin
    function authorizeContract(address contractAddress) external onlyAdmin {
        require(contractAddress != address(0), "Address cannot be zero");
        authorizedContracts[contractAddress] = true;
    }

    // Function to revoke authorization from a contract, can only be called by the admin
    function revokeContractAuthorization(address contractAddress) external onlyAdmin {
        require(contractAddress != address(0), "Address cannot be zero");
        authorizedContracts[contractAddress] = false;
    }

    // Function to create a new token for a project, can only be called by an authorized contract
    function newProjectToken(
        uint256 projectId,
        string memory name,
        string memory symbol,
        address problemCreator,
        address solutionCreator
    ) external onlyAuthorized {
        require(projectId != 0, "Project ID cannot be zero");
        Tokens newToken = new Tokens(name, symbol, address(this));
        projectTokens[projectId] = newToken;
        Tokens projectToken = projectTokens[projectId];
        projectToken.mint(problemCreator, PROJECT_TOKEN_PROBLEM_CREATOR);
        projectToken.mint(solutionCreator, PROJECT_TOKEN_SOLUTION_CREATOR);

        Tokens Token = projectTokens[0];
        Token.mint(problemCreator, DAO_TOKEN_PROBLEM_CREATOR);
        Token.mint(solutionCreator, DAO_TOKEN_SOLUTION_CREATOR);
    }

    // Function to complete a task and mint tokens, can only be called by an authorized contract
    function completeTask(
        address executor,
        address manager,
        uint256 taskValue,
        uint256 projectId
    ) external onlyAuthorized {
        require(executor != address(0) && manager != address(0), "Addresses cannot be zero");
        require(taskValue > 0, "Task value must be greater than zero");
        require(projectId != 0, "Project ID cannot be zero");

        uint256 executorPayment = taskValue;
        uint256 managerPayment = (taskValue * INVERSE_PROJECT_MANAGER_SHARE) / 100;

        Tokens projectToken = projectTokens[projectId];
        projectToken.mint(executor, executorPayment);
        projectToken.mint(manager, managerPayment);

        Tokens Token = projectTokens[0];
        Token.mint(executor, (executorPayment * INVERSE_DAO_TOKEN_PAY_RATIO) / 100);
        Token.mint(manager, (managerPayment * INVERSE_DAO_TOKEN_PAY_RATIO) / 100);
    }

    // Function to view the balance of an address for a particular project
    function viewBalance(address _address, uint256 _projectId) external view returns (uint256) {
        require(_address != address(0), "Address cannot be zero");

        return projectTokens[_projectId].balanceOf(_address);
    }

    // Function to get the project token for a particular project
    function getProjectToken(uint256 _projectId) external view returns (Tokens) {
        return projectTokens[_projectId];
    }

    // Function to check if an address is authorized
    function isAuthorized(address _address) external view returns (bool) {
        require(_address != address(0), "Address cannot be zero");

        return authorizedContracts[_address];
    }
}
