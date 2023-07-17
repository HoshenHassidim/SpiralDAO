// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// The contract name is Tokens, which extends from ERC20 standard
contract Tokens is ERC20 {
    // Variable that stores the administrator address for this contract
    address public admin;

    //Custom Errors
    error mustBeAdmin();

    // The constructor takes three parameters: token name, token symbol, and admin address.
    // It uses the ERC20 constructor to set the name and symbol, and stores the admin address.
    // If no admin address is provided, it defaults to the deployer of the contract.
    constructor(string memory name, string memory symbol, address _admin) ERC20(name, symbol) {
        if (_admin == address(0)) {
            admin = msg.sender;
        } else {
            admin = _admin;
        }
    }

    // Only admin can call the mint function
    modifier onlyAdmin() {
        if (msg.sender != admin) revert mustBeAdmin();
        _;
    }

    // Mint function to create new tokens, which can only be called by the admin.
    // This takes in an account to mint tokens for, and the amount of tokens to mint.
    function mint(address account, uint256 amount) external onlyAdmin {
        _mint(account, amount);
    }
}
