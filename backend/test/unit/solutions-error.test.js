const { ethers } = require("hardhat")
const { expect } = require("chai")

describe("Solutions Errors", function () {
    let problems, solutions, membership, authorizationManagement
    let owner
    let user1
    let user2
    let user3

    beforeEach(async function () {
        ;[owner, user1, user2, user3] = await ethers.getSigners()
        accounts = await ethers.getSigners()

        // Get the ContractFactory and Signers here.
        const AuthorizationManagement = await ethers.getContractFactory("AuthorizationManagement")
        const Membership = await ethers.getContractFactory("Membership")
        const Problems = await ethers.getContractFactory("Problems")
        const Solutions = await ethers.getContractFactory("Solutions")

        authorizationManagement = await AuthorizationManagement.deploy()
        await authorizationManagement.deployed()

        membership = await Membership.deploy(authorizationManagement.address)
        await membership.deployed()

        // Deploying Problems contract, passing the Membership contract address in constructor
        problems = await Problems.deploy(membership.address, authorizationManagement.address)
        await problems.deployed()

        // Deploying Solutions contract, passing the Problems contract address in constructor
        solutions = await Solutions.deploy(
            membership.address,
            problems.address,
            authorizationManagement.address
        )
        await authorizationManagement.connect(accounts[0]).authorizeContract(problems.address)
        await authorizationManagement.connect(accounts[0]).authorizeContract(solutions.address)
        await solutions.deployed()
        await problems.connect(user1).raiseProblem("Problem1")
        await problems.connect(user2).rateProblem(1, 10)
        await problems.connect(user3).rateProblem(1, 10)
    })

    // Test cases for Solutions.sol

    it("proposeSolution should revert when problem does not exist", async function () {
        await expect(solutions.connect(user1).proposeSolution(2, "Solution1")).to.be.revertedWith(
            "problemDoesNotExist"
        )
    })

    it("proposeSolution should revert when no name is provided", async function () {
        await expect(solutions.connect(user1).proposeSolution(1, "")).to.be.revertedWith(
            "nameCannotBeEmpty"
        )
    })

    it("cancelSolution should revert when solution does not exist", async function () {
        await expect(solutions.connect(user1).cancelSolution(1)).to.be.revertedWith(
            "solutionDoesNotExist"
        )
    })

    it("cancelSolution should revert when not the owner of the solution", async function () {
        await solutions.connect(user1).proposeSolution(1, "Solution1")

        await expect(solutions.connect(user2).cancelSolution(1)).to.be.revertedWith(
            "onlySolutionCreatorCanPerform"
        )
    })
    //Unit Tests
    it("Should delete solution name after cancelling solution", async function () {
        await solutions.connect(user2).proposeSolution(1, "S1")
        await solutions.connect(user2).cancelSolution(1)
        const nameTaken = await solutions.isSolutionNameTaken("S1")
        expect(nameTaken).to.equal(false)
    })
    it("Should delete solution name after changing solution", async function () {
        await solutions.connect(user2).proposeSolution(1, "S1")
        await solutions.connect(user2).changeSolutionName(1, "S2")
        const nameTaken = await solutions.isSolutionNameTaken("S1")
        expect(nameTaken).to.equal(false)
    })
    it("reverts for invalid solution ID", async () => {
        await solutions.connect(user1).proposeSolution(1, "S1")
        await expect(solutions.connect(user1).cancelSolution(0)).to.be.revertedWith("invalidID")
    })

    // Test solution already rated error
    it("reverts if solution already rated", async () => {
        await solutions.connect(user1).proposeSolution(1, "Sol 1")

        await solutions.connect(user2).rateSolution(1, 8)

        await expect(solutions.connect(user1).cancelSolution(1)).to.be.revertedWith(
            "solutionAlreadyRated"
        )
    })

    // Test solution not open for rating error
    it("reverts if solution not open for rating", async () => {
        await solutions.connect(user1).proposeSolution(1, "Sol 2")

        await solutions.connect(user1).cancelSolution(1)

        await expect(solutions.connect(user2).rateSolution(1, 10)).to.be.revertedWith(
            "solutonClosedForRating"
        )
    })

    // Test creator rating own solution error
    it("reverts if creator rates own solution", async () => {
        await solutions.connect(user1).proposeSolution(1, "Sol 3")

        await expect(solutions.connect(user1).rateSolution(1, 10)).to.be.revertedWith(
            "creatorCannotRateOwnProblem"
        )
    })

    // Test invalid rating error
    it("reverts for invalid rating", async () => {
        await solutions.connect(user1).proposeSolution(1, "Sol 4")

        await expect(solutions.connect(user2).rateSolution(1, 0)).to.be.revertedWith(
            "ratingOutOfRange"
        )

        await expect(solutions.connect(user2).rateSolution(1, 11)).to.be.revertedWith(
            "ratingOutOfRange"
        )
    })
})
