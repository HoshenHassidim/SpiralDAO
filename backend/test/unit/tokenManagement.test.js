const { ethers } = require("hardhat")
const { expect } = require("chai")

describe("TokenManagement", function () {
    let admin, authorized, notAuthorized, problemCreator, solutionCreator, executor, manager
    let tokenManagement, tokens

    beforeEach(async function () {
        // Get the Signers
        ;[admin, authorized, notAuthorized, problemCreator, solutionCreator, executor, manager] =
            await ethers.getSigners()

        // Deploy the Tokens contract
        const Tokens = await ethers.getContractFactory("Tokens")
        tokens = await Tokens.deploy("Test Token", "TST", admin.address)
        await tokens.deployed()

        // Deploy the TokenManagement contract
        const TokenManagement = await ethers.getContractFactory("TokenManagement")
        tokenManagement = await TokenManagement.deploy()
        await tokenManagement.deployed()

        // Authorize one account
        await tokenManagement.authorizeContract(authorized.address)
    })

    it("should set the correct admin address", async function () {
        expect(await tokenManagement.admin()).to.equal(admin.address)
    })

    it("should authorize a contract correctly", async function () {
        expect(await tokenManagement.isAuthorized(authorized.address)).to.equal(true)
        expect(await tokenManagement.isAuthorized(notAuthorized.address)).to.equal(false)
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
})