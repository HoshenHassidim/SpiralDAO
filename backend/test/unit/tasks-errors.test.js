const { expect } = require("chai");
const { ethers } = require("hardhat");
let owner, member1, member2, accounts;
describe("Tasks", function () {

    let problems, solutions, membership, tokenManagement, projects, tasks
    let projectManagerAccount, projectId

    beforeEach(async function () {
        const Membership = await ethers.getContractFactory("Membership")
        const Problems = await ethers.getContractFactory("Problems")
        const Solutions = await ethers.getContractFactory("Solutions")
        const TokenManagement = await ethers.getContractFactory("TokenManagement")
        const Projects = await ethers.getContractFactory("Projects")
        const Tasks = await ethers.getContractFactory("Tasks")

        membership = await Membership.deploy()
        await membership.deployed()

        problems = await Problems.deploy(membership.address)
        await problems.deployed()

        solutions = await Solutions.deploy(membership.address, problems.address)
        await solutions.deployed()

        tokenManagement = await TokenManagement.deploy()
        await tokenManagement.deployed()

        projects = await Projects.deploy(
            membership.address,
            solutions.address,
            tokenManagement.address
        )
        await projects.deployed()

        tasks = await Tasks.deploy(membership.address, projects.address, tokenManagement.address)
        await tasks.deployed()

        accounts = await ethers.getSigners()

        for (let i = 0; i < 8; i++) {
            const name = String(i)
            await membership.connect(accounts[i]).registerMember(name)
        }

        await problems.connect(accounts[0]).raiseProblem("Problem 1")
        const problemId = await problems.getProblemCounter()
        for (let i = 1; i < 4; i++) {
            await problems.connect(accounts[i]).rateProblem(problemId, 9)
        }

        await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 1")
        const solutionId = await solutions.getSolutionCounter()
        for (let i = 2; i < 6; i++) {
            await solutions.connect(accounts[i]).rateSolution(solutionId, 9)
        }

        await tokenManagement.connect(accounts[0]).authorizeContract(projects.address)
        await projects.connect(accounts[0]).proposeOffer(1);
        await projects.connect(accounts[2]).rateOffer(1, 10);
        await projects.connect(accounts[3]).rateOffer(1, 10);
        await projects.connect(accounts[4]).rateOffer(1, 10);
        await projects.connect(accounts[5]).rateOffer(1, 10);

        await projects.assignProjectManager(1);
        await tokenManagement.connect(accounts[0]).authorizeContract(tasks.address)



        let owner, member1, member2;

        owner = accounts[0];
        member1 = accounts[1];
        member2 = accounts[2];



    });

    it('reverts if not member', async () => {

        await membership.connect(accounts[0]).unregisterMember();
        await expect(
            tasks.connect(accounts[0]).proposeTaskOffer(1)
        ).to.be.revertedWith("mustBeMember");

    });

    it('reverts if not project manager', async () => {

        await expect(
            tasks.connect(accounts[2]).addTask(1, "Task", 101)
        ).to.be.revertedWith("mustBeProjectManager");

    });

    it('reverts for invalid task ID', async () => {

        await expect(
            tasks.connect(accounts[1]).completeTask(0)
        ).to.be.revertedWith("invalidID");

    });

    it('reverts if name not provided', async () => {

        await expect(
            tasks.connect(accounts[0]).addTask(1, "", 100)
        ).to.be.revertedWith("nameRequired");

    });

    it('reverts if duplicate name', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 1", 101);

        await expect(
            tasks.connect(accounts[0]).addTask(1, "Task 1", 101)
        ).to.be.revertedWith("nameAlreadyExists");

    });

    it('reverts if value too low', async () => {

        await expect(
            tasks.connect(accounts[0]).addTask(1, "Task 2", 50)
        ).to.be.revertedWith("valueTooLow");

    });

    it('reverts if task not open', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 3", 100);

        await tasks.connect(accounts[0]).cancelTask(1);

        await expect(
            tasks.connect(accounts[0]).cancelTask(1)
        ).to.be.revertedWith("taskNotOpenForCancellation");

    });

    // Tests for all other errors

    // ...Previous tests


    it('reverts if proposals exist', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 4", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);

        await expect(
            tasks.connect(accounts[0]).cancelTask(1)
        ).to.be.revertedWith("proposalsExist");

    });

    it('reverts if task not open for changes', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 5", 100);

        await tasks.connect(accounts[0]).cancelTask(1);

        await expect(
            tasks.connect(accounts[0]).changeTask(1, "New Name", 2)
        ).to.be.revertedWith("taskNotOpenForChanges");

    });

    it('reverts if member already proposed', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 6", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);

        await expect(
            tasks.connect(accounts[1]).proposeTaskOffer(1)
        ).to.be.revertedWith("memberAlreadyProposed");

    });

    /////////////////////////////////////////////////////////////////////////////
    // Friday July 21 - WORK STARTS HERE!
    it('reverts if offer not open', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 7", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);

        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);
        console.log(offerId);

        await tasks.connect(accounts[1]).cancelTaskOffer(offerId);

        await expect(
            tasks.connect(accounts[2]).rateTaskOffer(offerId, 8)
        ).to.be.revertedWith("offerNotOpenForRating");

    });

    // Tests for remaining errors

    // ...Previous tests

    it('reverts if non-performer cancels offer', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 8", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);

        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);

        await expect(
            tasks.connect(accounts[2]).cancelTaskOffer(offerId)
        ).to.be.revertedWith("onlyPerformerCanCancel");

    });

    it('reverts if task not open when rating', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 9", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);

        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);

        await tasks.connect(accounts[1]).cancelTaskOffer(offerId);

        await expect(
            tasks.connect(accounts[2]).rateTaskOffer(offerId, 10)
        ).to.be.revertedWith("offerNotOpenForRating");

    });

    it('reverts if invalid rating', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 10", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);

        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);

        await expect(
            tasks.connect(accounts[2]).rateTaskOffer(offerId, 0)
        ).to.be.revertedWith("ratingOutOfRange");

        await expect(
            tasks.connect(accounts[2]).rateTaskOffer(offerId, 11)
        ).to.be.revertedWith("ratingOutOfRange");

    });

    // Tests for any other additional errors

    // ...Previous tests 

    it('reverts if performer rates own offer', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 11", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);

        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);

        await expect(
            tasks.connect(accounts[1]).rateTaskOffer(offerId, 10)
        ).to.be.revertedWith("performerCannotRateOwnOffer");

    });

    it('reverts if no suitable offer', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 12", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);

        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 5);// Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 5);
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 5);
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 5);


        await expect(
            tasks.assignTask(1)
        ).to.be.revertedWith("noSuitableOffer");

    });

    it('reverts if non-performer completes task', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 13", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10);// Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10);
        await tasks.assignTask(1);

        await expect(
            tasks.connect(accounts[2]).completeTask(1)
        ).to.be.revertedWith("onlyAssignedPerformerCanComplete");

    });

    it('reverts if unassigned task completed', async () => {


        await tasks.connect(accounts[0]).addTask(1, "Task 13", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10);// Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10);
        await expect(
            tasks.connect(accounts[0]).completeTask(1)
        ).to.be.revertedWith("taskNotAssigned");

    });

    // Tests for any other additional errors

    // ...Previous tests

    it('reverts if wrong task status when completing', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 15", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10);// Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10);

        await tasks.assignTask(1);

        await tasks.connect(accounts[1]).cancelTaskOffer(1);

        await expect(
            tasks.connect(accounts[1]).completeTask(1)
        ).to.be.revertedWith("userHasNotProposed");

    });

    it('reverts if performer rates own task', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 16", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10);// Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10);

        await tasks.assignTask(1);

        await tasks.connect(accounts[1]).completeTask(1);

        await expect(
            tasks.connect(accounts[1]).rateCompletedTask(1, 10)
        ).to.be.revertedWith("performerCannotRateOwnTask");

    });

    it('reverts if not in verification stage', async () => {

        await tasks.connect(accounts[0]).addTask(1, "Task 17", 100);


        await tasks.connect(accounts[1]).proposeTaskOffer(1);
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10);// Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10);

        await tasks.assignTask(1);

        await expect(
            tasks.verifyTask(1)
        ).to.be.revertedWith("taskNotInVerificationStage");

    });

    it('reverts if not enough ratings', async () => {

        await tasks.addTask(1, "Task 18", 100);

        await tasks.connect(accounts[1]).proposeTaskOffer(1);
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1);
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10);// Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10);
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10);

        await tasks.assignTask(1);

        await tasks.connect(accounts[1]).completeTask(1);
        await tasks.connect(accounts[2]).rateCompletedTask(1, 10);

        await expect(
            tasks.verifyTask(1)
        ).to.be.revertedWith("notEnoughRatings");

    });

    // Add any other additional test cases

});
    // afterEach(async function () {
    //     if (membership.connect(accounts[0]).isRegisteredMember(accounts[0].address)) await membership.connect(accounts[0]).unregisterMember();
    //     if (membership.connect(accounts[1]).isRegisteredMember(accounts[1].address)) await membership.connect(accounts[1]).unregisterMember();
    //     if (membership.connect(accounts[2]).isRegisteredMember(accounts[1].address)) await membership.connect(accounts[2]).unregisterMember();

    // })

    //     it("Should revert for invalid solution ID", async function () {
    //         await expect(
    //             projects.connect(accounts[0]).proposeOffer(0)
    //         ).to.be.revertedWith("invalidID");
    //     });

    //     it("Should revert if not a registered member", async function () {
    //         await membership.connect(accounts[0]).unregisterMember();
    //         await expect(
    //             projects.connect(accounts[0]).proposeOffer(1)
    //         ).to.be.revertedWith("mustBeMember");

    //     });


    //     it("Should revert if project not open for proposals", async function () {
    //         await projects.connect(accounts[0]).proposeOffer(1);
    //         await projects.connect(accounts[2]).rateOffer(1, 10);
    //         await projects.connect(accounts[3]).rateOffer(1, 10);
    //         await projects.connect(accounts[4]).rateOffer(1, 10);
    //         await projects.connect(accounts[5]).rateOffer(1, 10);

    //         await projects.assignProjectManager(1);
    //         await projects.connect()
    //         await expect(
    //             projects.connect(accounts[1]).proposeOffer(1)
    //         ).to.be.revertedWith("projectNotOpenForProposals");
    //     });

    //     it("Should revert if user already proposed", async function () {
    //         await projects.connect(accounts[0]).proposeOffer(1);
    //         await expect(
    //             projects.connect(accounts[0]).proposeOffer(1)
    //         ).to.be.revertedWith("userAlreadyProposed");
    //     });

    //     it("Should revert if not offer creator", async function () {
    //         await projects.connect(accounts[0]).proposeOffer(1);
    //         const offerId = await projects.getOfferCounter();
    //         await expect(
    //             projects.connect(accounts[1]).cancelOffer(offerId)
    //         ).to.be.revertedWith("onlyManager");
    //     });
    //     // ...Rest of contract setup

    //     it("Should revert if rating is out of range", async function () {
    //         await projects.connect(accounts[0]).proposeOffer(1);
    //         const offerId = await projects.getOfferCounter();

    //         await expect(
    //             projects.connect(accounts[1]).rateOffer(offerId, 0)
    //         ).to.be.revertedWith("ratingOutOfRange");

    //         await expect(
    //             projects.connect(accounts[1]).rateOffer(offerId, 11)
    //         ).to.be.revertedWith("ratingOutOfRange");
    //     });

    //     it("Should revert if manager rates own offer", async function () {
    //         await projects.connect(accounts[0]).proposeOffer(1);
    //         const offerId = await projects.getOfferCounter();

    //         await expect(
    //             projects.connect(accounts[0]).rateOffer(offerId, 10)
    //         ).to.be.revertedWith("managerCannotRateOwnOffer");
    //     });

    //     it("Should revert if offer not open for rating", async function () {
    //         await projects.connect(accounts[0]).proposeOffer(1);
    //         const offerId = await projects.getOfferCounter();

    //         await projects.connect(accounts[0]).cancelOffer(offerId);

    //         await expect(
    //             projects.connect(accounts[1]).rateOffer(offerId, 10)
    //         ).to.be.revertedWith("notOpenForRating");
    //     });

    //     it("Should revert if insufficient total raters", async function () {
    //         await projects.connect(accounts[0]).proposeOffer(1);
    //         await projects.connect(accounts[1]).proposeOffer(1);

    //         const offerId1 = await projects.getOfferCounter();
    //         const offerId2 = offerId1 - 1;

    //         await projects.connect(accounts[2]).rateOffer(offerId1, 10);
    //         await projects.connect(accounts[2]).rateOffer(offerId2, 8);

    //         await expect(
    //             projects.connect(accounts[1]).assignProjectManager(1)
    //         ).to.be.revertedWith("insufficientTotalRatersForAllOffers");
    //     });

    //     it("Should revert for non-existent project", async function () {
    //         await expect(
    //             projects.connect(accounts[0]).viewProjectDetails(1)
    //         ).to.be.revertedWith("projectDoesNotExist");
    //     });

    //     // ...
    //     // Test cases for other errors

    //     // after(async function () {
    //     //     await membership.unregisterMember({ from: accounts[0] });
    //     //     await membership.unregisterMember({ from: accounts[1] });
    //     //     await membership.unregisterMember({ from: accounts[2] });
    //     // })
