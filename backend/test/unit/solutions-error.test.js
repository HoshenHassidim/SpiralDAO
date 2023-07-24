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
        await problemsContract.connect(user1).raiseProblem("Problem1");
        await problemsContract.connect(user2).rateProblem(1, 10);
        await problemsContract.connect(user3).rateProblem(1, 10);
    });


    // Test cases for Solutions.sol

    it("proposeSolution should revert when problem does not exist", async function () {
        await expect(
            solutionsContract.connect(user1).proposeSolution(2, "Solution1")
        ).to.be.revertedWith("problemDoesNotExist");
    });

    it("proposeSolution should revert when no name is provided", async function () {
        await expect(
            solutionsContract.connect(user1).proposeSolution(1, "")
        ).to.be.revertedWith("nameCannotBeEmpty");
    });

    it("cancelSolution should revert when solution does not exist", async function () {
        await expect(
            solutionsContract.connect(user1).cancelSolution(1)
        ).to.be.revertedWith("solutionDoesNotExist");
    });

    it("cancelSolution should revert when not the owner of the solution", async function () {



        await solutionsContract.connect(user1).proposeSolution(1, "Solution1");


        await expect(
            solutionsContract.connect(user2).cancelSolution(1)
        ).to.be.revertedWith("onlySolutionCreatorCanPerform");
    });
    //Unit Tests 
    it("Should delete solution name after cancelling solution", async function () {


        await solutionsContract.connect(user2).proposeSolution(1, "S1");
        await solutionsContract.connect(user2).cancelSolution(1);
        const nameTaken = await solutionsContract.isSolutionNameTaken("S1");
        expect(nameTaken).to.equal(false);
    })
    it("Should delete solution name after changing solution", async function () {


        await solutionsContract.connect(user2).proposeSolution(1, "S1");
        await solutionsContract.connect(user2).changeSolutionName(1, "S2");
        const nameTaken = await solutionsContract.isSolutionNameTaken("S1");
        expect(nameTaken).to.equal(false);
    })
    it('reverts for invalid solution ID', async () => {
        await solutionsContract.connect(user1).proposeSolution(1, "S1");
        await expect(
            solutionsContract.connect(user1).cancelSolution(0)
        ).to.be.revertedWith('invalidID');
    });

    // Test solution already rated error  
    it('reverts if solution already rated', async () => {
        await solutionsContract.connect(user1).proposeSolution(1, 'Sol 1');

        await solutionsContract.connect(user2).rateSolution(1, 8);

        await expect(
            solutionsContract.connect(user1).cancelSolution(1)
        ).to.be.revertedWith('solutionAlreadyRated');
    });

    // Test solution not open for rating error
    it('reverts if solution not open for rating', async () => {
        await solutionsContract.connect(user1).proposeSolution(1, 'Sol 2');

        await solutionsContract.connect(user1).cancelSolution(1);

        await expect(
            solutionsContract.connect(user2).rateSolution(1, 10)
        ).to.be.revertedWith('solutonClosedForRating');
    });

    // Test creator rating own solution error
    it('reverts if creator rates own solution', async () => {
        await solutionsContract.connect(user1).proposeSolution(1, 'Sol 3');

        await expect(
            solutionsContract.connect(user1).rateSolution(1, 10)
        ).to.be.revertedWith('creatorCannotRateOwnProblem');
    });

    // Test invalid rating error
    it('reverts for invalid rating', async () => {
        await solutionsContract.connect(user1).proposeSolution(1, 'Sol 4');

        await expect(
            solutionsContract.connect(user2).rateSolution(1, 0)
        ).to.be.revertedWith('ratingOutOfRange');

        await expect(
            solutionsContract.connect(user2).rateSolution(1, 11)
        ).to.be.revertedWith('ratingOutOfRange');
    });



});
