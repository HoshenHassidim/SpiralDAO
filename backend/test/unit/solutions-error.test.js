const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Solutions", function () {
    let membershipContract;
    let problemsContract;
    let solutionsContract;
    let owner;
    let user1;
    let user2;
    let user3;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        const Membership = await ethers.getContractFactory("Membership");
        const Problems = await ethers.getContractFactory("Problems");
        const Solutions = await ethers.getContractFactory("Solutions");

        [owner, user1, user2, user3] = await ethers.getSigners();

        // Deploying Membership contract
        membershipContract = await Membership.deploy();
        await membershipContract.deployed();

        // Deploying Problems contract, passing the Membership contract address in constructor
        problemsContract = await Problems.deploy(membershipContract.address);
        await problemsContract.deployed();

        // Deploying Solutions contract, passing the Problems contract address in constructor
        solutionsContract = await Solutions.deploy(membershipContract.address, problemsContract.address);
        await solutionsContract.deployed();
    });

    // Test cases for Membership.sol
    it("registerMember should revert when already a member", async function () {
        await membershipContract.connect(user1).registerMember("Alice");
        await expect(
            membershipContract.connect(user1).registerMember("Alice")
        ).to.be.revertedWith("AlreadyMember");
    });

    it("registerMember should revert when username is not provided", async function () {
        await expect(
            membershipContract.connect(user1).registerMember("")
        ).to.be.revertedWith("UsernameRequired");
    });

    it("registerMember should revert when username already exists", async function () {
        await membershipContract.connect(user1).registerMember("Alice");
        await expect(
            membershipContract.connect(user2).registerMember("Alice")
        ).to.be.revertedWith("UsernameAlreadyExists");
    });

    it("unregisterMember should revert when not a member", async function () {
        await expect(
            membershipContract.connect(user1).unregisterMember()
        ).to.be.revertedWith("NotMember");
    });

    it("getMember should revert when not a member", async function () {
        await expect(
            membershipContract.getMember(user1.address)
        ).to.be.revertedWith("NotMember");
    });

    // Test cases for Problems.sol
    it("raiseProblem should revert when not a member", async function () {
        await expect(
            problemsContract.connect(user1).raiseProblem("Problem1")
        ).to.be.revertedWith("mustBeMember");
    });

    it("raiseProblem should revert when no name is provided", async function () {
        await membershipContract.connect(user1).registerMember("Alice");
        await expect(
            problemsContract.connect(user1).raiseProblem("")
        ).to.be.revertedWith("nameRequired");
    });

    it("cancelProblem should revert when problem does not exist", async function () {
        await membershipContract.connect(user1).registerMember("Alice");
        await expect(
            problemsContract.connect(user1).cancelProblem(1)
        ).to.be.revertedWith("problemDoesNotExist");
    });

    it("cancelProblem should revert when not the owner of the problem", async function () {
        await membershipContract.connect(user1).registerMember("Alice");
        await membershipContract.connect(user2).registerMember('Tom');
        await problemsContract.connect(user1).raiseProblem("Problem1");
        await expect(
            problemsContract.connect(user2).cancelProblem(1)
        ).to.be.revertedWith("onlyCreatorCanCancel");
    });

    // Test cases for Solutions.sol
    it("proposeSolution should revert when not a member", async function () {
        await expect(
            solutionsContract.connect(user1).proposeSolution(1, "Solution1")
        ).to.be.revertedWith("mustBeMember");
    });

    it("proposeSolution should revert when problem does not exist", async function () {
        await membershipContract.connect(user1).registerMember("Alice");
        await expect(
            solutionsContract.connect(user1).proposeSolution(1, "Solution1")
        ).to.be.revertedWith("problemDoesNotExist");
    });

    it("proposeSolution should revert when no name is provided", async function () {
        await membershipContract.connect(user1).registerMember("Alice");
        await problemsContract.connect(user1).raiseProblem("Problem1");
        await expect(
            solutionsContract.connect(user1).proposeSolution(1, "")
        ).to.be.revertedWith("nameCannotBeEmpty");
    });

    it("cancelSolution should revert when solution does not exist", async function () {
        await membershipContract.connect(user1).registerMember("Alice");
        await problemsContract.connect(user1).raiseProblem("Problem1");
        await expect(
            solutionsContract.connect(user1).cancelSolution(1)
        ).to.be.revertedWith("solutionDoesNotExist");
    });

    it("cancelSolution should revert when not the owner of the solution", async function () {
        await membershipContract.connect(user1).registerMember("Alice");
        await membershipContract.connect(user2).registerMember("Emily");
        await membershipContract.connect(user3).registerMember("Tom");


        await problemsContract.connect(user1).raiseProblem("Problem1");
        await problemsContract.connect(user2).rateProblem(1, 10);
        await problemsContract.connect(user3).rateProblem(1, 10);
        await solutionsContract.connect(user1).proposeSolution(1, "Solution1");


        await expect(
            solutionsContract.connect(user2).cancelSolution(1)
        ).to.be.revertedWith("onlySolutionCreatorCanPerform");
    });
});