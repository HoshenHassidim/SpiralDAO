// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// This is the contract for managing authorizations.
contract AuthorizationManagement {
    // The admin is the account that has all permissions
    address private admin;

    // A mapping of authorized contracts that can perform certain actions
    mapping(address => bool) private authorizedContracts;

    // Custom errors for better error handling
    error mustBeAdmin();
    error mustBeAuthorised();
    error addressCannotBeZero();
    error contractWasNotAuthorised();
    error alreadyAuthorised();

    event AuthorizationGranted(address indexed account);
    event AuthorizationRevoked(address indexed account);
    event AdminChanged(address indexed newAdmin);

    // Constructor sets the admin to the sender and authorizes the sender
    constructor() {
        admin = msg.sender;
        emit AdminChanged(msg.sender);
    }

    // Modifier to allow only the admin to perform certain actions
    modifier onlyAdmin() {
        if (msg.sender != admin) revert mustBeAdmin();
        _;
    }

    // Modifier to allow only authorized contracts to perform certain actions
    modifier onlyAuthorized() {
        if (!authorizedContracts[msg.sender]) revert mustBeAuthorised();
        _;
    }

    // Function to authorize a contract, can only be called by the admin
    function authorizeContract(address contractAddress) external onlyAdmin {
        if (contractAddress == address(0)) revert addressCannotBeZero();
        if (authorizedContracts[contractAddress]) revert alreadyAuthorised();
        authorizedContracts[contractAddress] = true;
        emit AuthorizationGranted(contractAddress);
    }

    // Function to revoke authorization from a contract, can only be called by the admin
    function revokeContractAuthorization(address contractAddress) external onlyAdmin {
        if (!authorizedContracts[contractAddress]) revert contractWasNotAuthorised();
        authorizedContracts[contractAddress] = false;
        emit AuthorizationRevoked(contractAddress);
    }

    // Function to change the admin, can only be called by the current admin
    function changeAdmin(address newAdmin) external onlyAdmin {
        if (newAdmin == address(0)) revert addressCannotBeZero();
        admin = newAdmin;
        emit AdminChanged(newAdmin);
    }

    // Function to check if an address is authorized
    function isAuthorized(address _address) public view returns (bool) {
        if (_address == address(0)) revert addressCannotBeZero();
        return authorizedContracts[_address];
    }

    // Function to get the admin address
    function getAdmin() public view returns (address) {
        return admin;
    }
}
