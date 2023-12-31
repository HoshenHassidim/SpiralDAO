const { ethers } = require("hardhat")
const { expect } = require("chai")

describe("TokenManagement", function () {
    let admin, authorized, notAuthorized, problemCreator, solutionCreator, executor, manager
    let tokenManagement, authorizationManagement, tokens

    beforeEach(async function () {
        // Get the Signers
        ;[admin, authorized, notAuthorized, problemCreator, solutionCreator, executor, manager] =
            await ethers.getSigners()

        // Deploy the Tokens contract
        const Tokens = await ethers.getContractFactory("Tokens")
        tokens = await Tokens.deploy("SPIRALDAOTOKEN", "SDT", admin.address)
        await tokens.deployed()

        // Deploy the AuthorizationManagement contract
        const AuthorizationManagement = await ethers.getContractFactory("AuthorizationManagement")
        authorizationManagement = await AuthorizationManagement.deploy()
        await authorizationManagement.deployed()

        // Deploy the TokenManagement contract
        const TokenManagement = await ethers.getContractFactory("TokenManagement")
        tokenManagement = await TokenManagement.deploy(authorizationManagement.address)
        await tokenManagement.deployed()

        // Authorize one account
        await authorizationManagement.authorizeContract(authorized.address)
    })

    it("should create new project tokens correctly", async function () {
        await expect(
            tokenManagement
                .connect(notAuthorized)
                .newProjectToken(
                    1,
                    "Test Token",
                    "TST",
                    problemCreator.address,
                    solutionCreator.address
                )
        ).to.be.revertedWith("mustBeAuthorised")

        await tokenManagement
            .connect(authorized)
            .newProjectToken(
                1,
                "Test Token",
                "TST",
                problemCreator.address,
                solutionCreator.address
            )

        expect(await tokenManagement.getProjectToken(1)).to.not.equal(
            "0x0000000000000000000000000000000000000000"
        )
    })

    it("should complete a task and mint tokens correctly", async function () {
        // Creating a new project token for test
        await tokenManagement
            .connect(authorized)
            .newProjectToken(
                1,
                "Test Token",
                "TST",
                problemCreator.address,
                solutionCreator.address
            )

        await expect(
            tokenManagement
                .connect(notAuthorized)
                .completeTask(executor.address, manager.address, 1000, 1)
        ).to.be.revertedWith("mustBeAuthorised")

        await tokenManagement
            .connect(authorized)
            .completeTask(executor.address, manager.address, 1000, 1)

        // Check the balance of executor and manager
        expect(await tokenManagement.viewBalance(executor.address, 1)).to.equal(1000)
        expect(await tokenManagement.viewBalance(manager.address, 1)).to.be.above(0)
    })

    // New tests for error cases
    it("should not create project token with zero address", async function () {
        await expect(
            tokenManagement
                .connect(authorized)
                .newProjectToken(
                    1,
                    "Test Token",
                    "TST",
                    "0x0000000000000000000000000000000000000000",
                    solutionCreator.address
                )
        ).to.be.revertedWith("addressesCannotBeZero")
    })

    it("should not create project token with project id 0", async function () {
        await expect(
            tokenManagement
                .connect(authorized)
                .newProjectToken(
                    0,
                    "Test Token",
                    "TST",
                    problemCreator.address,
                    solutionCreator.address
                )
        ).to.be.revertedWith("projectIDMustBeGreaterThanZero")
    })

    it("should not complete task with zero task value", async function () {
        await expect(
            tokenManagement
                .connect(authorized)
                .completeTask(executor.address, manager.address, 0, 1)
        ).to.be.revertedWith("taskValueMustBeGreaterThanZero")
    })

    it("should not view balance for zero address", async function () {
        await expect(
            tokenManagement.viewBalance("0x0000000000000000000000000000000000000000", 1)
        ).to.be.revertedWith("addressCannotBeZero")
    })
})
