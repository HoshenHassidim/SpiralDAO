const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Tokens", function () {
    let tokensContract;
    let admin;
    let user1;
    const initialSupply = ethers.utils.parseEther("1000");
    const mintAmount = ethers.utils.parseEther("500");

    beforeEach(async function () {
        // Deploy the Tokens contract
        const Tokens = await ethers.getContractFactory("Tokens");
        [admin, user1] = await ethers.getSigners();
        tokensContract = await Tokens.deploy("Test Token", "TST", admin.address);

        // Mint initial supply of tokens
        await tokensContract.mint(admin.address, initialSupply);
    });

    it("should set the correct admin address", async function () {
        expect(await tokensContract.admin()).to.equal(admin.address);
    });

    it("should mint new tokens when called by admin", async function () {
        await tokensContract.connect(admin).mint(user1.address, mintAmount);
        expect(await tokensContract.balanceOf(user1.address)).to.equal(mintAmount);
    });

    it("should revert minting when called by non-admin", async function () {
        await expect(tokensContract.connect(user1).mint(user1.address, mintAmount)).to.be.revertedWith(
            "mustBeAdmin"
        );
    });
});
