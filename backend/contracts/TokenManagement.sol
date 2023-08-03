// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Tokens.sol";
import "./AuthorizationManagement.sol";

// This is the contract for managing tokens, including creating new tokens for projects and minting tokens.
contract TokenManagement {
    // A mapping of project IDs to their respective token contracts
    mapping(uint256 => Tokens) private projectTokens;

    AuthorizationManagement private authorizationManagementContract;

    // Constants for various token distribution percentages and ratios
    uint256 private INVERSE_PROJECT_MANAGER_SHARE = 10;
    uint256 private INVERSE_DAO_TOKEN_PAY_RATIO = 10;
    uint256 private PROJECT_TOKEN_PROBLEM_CREATOR = 10;
    uint256 private DAO_TOKEN_PROBLEM_CREATOR = 10;
    uint256 private PROJECT_TOKEN_SOLUTION_CREATOR = 10;
    uint256 private DAO_TOKEN_SOLUTION_CREATOR = 10;

    // Custom errors for better error handling
    error mustBeAuthorised();
    error addressCannotBeZero();
    error projectIDMustBeGreaterThanZero();
    error addressesCannotBeZero();
    error taskValueMustBeGreaterThanZero();
    error projectIDCannotBeZero();
    error contractWasNotAuthorised();

    // Events for token creation and token minting events
    event ProjectTokenCreated(
        uint256 indexed projectId,
        address indexed problemCreator,
        address indexed solutionCreator,
        uint256 problemCreatorProjectTokens,
        uint256 problemCreatorDaoTokens,
        uint256 solutionCreatorProjectTokens,
        uint256 solutionCreatorDaoTokens
    );
    event TokensMinted(
        address indexed account,
        uint256 projectId,
        uint256 projectTokens,
        uint256 daoTokens
    );

    // Constructor sets the admin to the sender and authorizes the sender
    constructor(AuthorizationManagement _authorizationManagementContract) {
        authorizationManagementContract = _authorizationManagementContract;

        // Create a new DAO token and assign it to project ID 0
        Tokens newToken = new Tokens("SPIRALDAOTOKEN", "SDT", address(this));
        projectTokens[0] = newToken;
    }

    // Modifier to allow only authorized contracts to perform certain actions
    modifier onlyAuthorized() {
        if (!authorizationManagementContract.isAuthorized(msg.sender)) revert mustBeAuthorised();
        _;
    }

    // Function to create a new token for a project, can only be called by an authorized contract
    function newProjectToken(
        uint256 projectId,
        string memory name,
        string memory symbol,
        address problemCreator,
        address solutionCreator
    ) external onlyAuthorized {
        if (projectId == 0) revert projectIDMustBeGreaterThanZero();
        if (problemCreator == address(0) || solutionCreator == address(0))
            revert addressesCannotBeZero();

        // Create a new token contract for the project with the specified name and symbol
        Tokens newToken = new Tokens(name, symbol, address(this));
        // Assign the newly created token contract to the specified project ID
        projectTokens[projectId] = newToken;

        // Mint project tokens and DAO tokens for problemCreator and solutionCreator
        Tokens projectToken = projectTokens[projectId];
        projectToken.mint(problemCreator, PROJECT_TOKEN_PROBLEM_CREATOR);
        projectToken.mint(solutionCreator, PROJECT_TOKEN_SOLUTION_CREATOR);

        // Mint DAO tokens for problemCreator and solutionCreator from the DAO token contract (project ID 0)
        Tokens daoToken = projectTokens[0];
        daoToken.mint(problemCreator, DAO_TOKEN_PROBLEM_CREATOR);
        daoToken.mint(solutionCreator, DAO_TOKEN_SOLUTION_CREATOR);

        // Emit an event indicating the successful creation of the project tokens
        emit ProjectTokenCreated(
            projectId,
            problemCreator,
            solutionCreator,
            PROJECT_TOKEN_PROBLEM_CREATOR,
            DAO_TOKEN_PROBLEM_CREATOR,
            PROJECT_TOKEN_SOLUTION_CREATOR,
            DAO_TOKEN_SOLUTION_CREATOR
        );
    }

    // Function to complete a task and mint tokens, can only be called by an authorized contract
    function completeTask(
        address executor,
        address manager,
        uint256 taskValue,
        uint256 projectId
    ) external onlyAuthorized {
        if (executor == address(0) || manager == address(0)) revert addressesCannotBeZero();
        if (taskValue <= 0) revert taskValueMustBeGreaterThanZero();

        // Calculate the payments and DAO token amounts for the executor and manager
        uint256 executorPayment = taskValue;
        uint256 managerPayment = (taskValue * INVERSE_PROJECT_MANAGER_SHARE) / 100;
        uint256 executorDaoTokens = (executorPayment * INVERSE_DAO_TOKEN_PAY_RATIO) / 100;
        uint256 managerDaoTokens = (managerPayment * INVERSE_DAO_TOKEN_PAY_RATIO) / 100;

        // Mint project tokens for the executor and manager
        Tokens projectToken = projectTokens[projectId];
        projectToken.mint(executor, executorPayment);
        if (manager != address(0)) {
            projectToken.mint(manager, managerPayment);
        }
        // If the project ID is not 0, mint DAO tokens for the executor and manager from the DAO token contract (project ID 0)
        if (projectId != 0) {
            Tokens daoToken = projectTokens[0];
            daoToken.mint(executor, executorDaoTokens);
            if (manager != address(0)) {
                daoToken.mint(manager, managerDaoTokens);
            }
        }

        // Emit events indicating the successful minting of tokens for the executor and manager
        if (projectId == 0) {
            emit TokensMinted(executor, projectId, executorPayment, 0);
            if (manager != address(0)) {
                emit TokensMinted(manager, projectId, managerPayment, 0);
            }
        } else {
            emit TokensMinted(executor, projectId, executorPayment, executorDaoTokens);
            if (manager != address(0)) {
                emit TokensMinted(manager, projectId, managerPayment, managerDaoTokens);
            }
        }
    }

    // Function to view the balance of an address for a particular project
    function viewBalance(address _address, uint256 _projectId) external view returns (uint256) {
        if (_address == address(0)) revert addressCannotBeZero();
        return projectTokens[_projectId].balanceOf(_address);
    }

    // Function to get the project token for a particular project
    function getProjectToken(uint256 _projectId) external view returns (Tokens) {
        return projectTokens[_projectId];
    }
}
