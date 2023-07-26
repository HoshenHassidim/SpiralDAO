const { expect } = require("chai")
const { ethers } = require("hardhat")
let owner, member1, member2, accounts
describe("Tasks Errors", function () {
    let problems, solutions, membership, tokenManagement, projects, tasks
    let projectManagerAccount, projectId

    beforeEach(async function () {
        const TokenManagement = await ethers.getContractFactory("TokenManagement")
        const Membership = await ethers.getContractFactory("Membership")
        const Problems = await ethers.getContractFactory("Problems")
        const Solutions = await ethers.getContractFactory("Solutions")
        const Projects = await ethers.getContractFactory("Projects")
        const Tasks = await ethers.getContractFactory("Tasks")

        tokenManagement = await TokenManagement.deploy()
        await tokenManagement.deployed()

        membership = await Membership.deploy(tokenManagement.address)
        await membership.deployed()

        problems = await Problems.deploy(membership.address)
        await problems.deployed()

        solutions = await Solutions.deploy(membership.address, problems.address)
        await solutions.deployed()

        projects = await Projects.deploy(
            membership.address,
            solutions.address,
            tokenManagement.address
        )
        await projects.deployed()

        tasks = await Tasks.deploy(membership.address, projects.address, tokenManagement.address)
        await tasks.deployed()

        accounts = await ethers.getSigners()
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
        await projects.connect(accounts[0]).proposeOffer(1)
        await projects.connect(accounts[2]).rateOffer(1, 10)
        await projects.connect(accounts[3]).rateOffer(1, 10)
        await projects.connect(accounts[4]).rateOffer(1, 10)
        await projects.connect(accounts[5]).rateOffer(1, 10)

        await projects.assignProjectManager(1)
        await tokenManagement.connect(accounts[0]).authorizeContract(tasks.address)

        let owner, member1, member2

        owner = accounts[0]
        member1 = accounts[1]
        member2 = accounts[2]
    })

    it("reverts if not project manager", async () => {
        await expect(tasks.connect(accounts[2]).addTask(1, "Task", 101)).to.be.revertedWith(
            "mustBeProjectManager"
        )
    })

    it("reverts for invalid task ID", async () => {
        await expect(tasks.connect(accounts[1]).completeTask(0)).to.be.revertedWith("invalidID")
    })

    it("reverts if name not provided", async () => {
        await expect(tasks.connect(accounts[0]).addTask(1, "", 100)).to.be.revertedWith(
            "nameRequired"
        )
    })

    it("reverts if duplicate name", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 1", 101)

        await expect(tasks.connect(accounts[0]).addTask(1, "Task 1", 101)).to.be.revertedWith(
            "nameAlreadyExists"
        )
    })

    it("reverts if value too low", async () => {
        await expect(tasks.connect(accounts[0]).addTask(1, "Task 2", 50)).to.be.revertedWith(
            "valueTooLow"
        )
    })

    it("reverts if task not open", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 3", 100)

        await tasks.connect(accounts[0]).cancelTask(1)

        await expect(tasks.connect(accounts[0]).cancelTask(1)).to.be.revertedWith(
            "taskNotOpenForCancellation"
        )
    })

    // Tests for all other errors

    // ...Previous tests

    it("reverts if proposals exist", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 4", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)

        await expect(tasks.connect(accounts[0]).cancelTask(1)).to.be.revertedWith("proposalsExist")
    })

    it("reverts if task not open for changes", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 5", 100)

        await tasks.connect(accounts[0]).cancelTask(1)

        await expect(tasks.connect(accounts[0]).changeTask(1, "New Name", 2)).to.be.revertedWith(
            "taskNotOpenForChanges"
        )
    })

    it("reverts if member already proposed", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 6", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)

        await expect(tasks.connect(accounts[1]).proposeTaskOffer(1)).to.be.revertedWith(
            "memberAlreadyProposed"
        )
    })

    /////////////////////////////////////////////////////////////////////////////
    // Friday July 21 - WORK STARTS HERE!
    it("reverts if offer not open", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 7", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)

        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)
        // console.log(offerId);

        await tasks.connect(accounts[1]).cancelTaskOffer(offerId)

        await expect(tasks.connect(accounts[2]).rateTaskOffer(offerId, 8)).to.be.revertedWith(
            "offerNotOpenForRating" && "offerNotActive"
        )
    })

    // Tests for remaining errors

    // ...Previous tests

    it("reverts if non-performer cancels offer", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 8", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)

        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)

        await expect(tasks.connect(accounts[2]).cancelTaskOffer(offerId)).to.be.revertedWith(
            "onlyPerformerCanCancel"
        )
    })

    it("reverts if task not open when rating", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 9", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)

        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)

        await tasks.connect(accounts[1]).cancelTaskOffer(offerId)

        await expect(tasks.connect(accounts[2]).rateTaskOffer(offerId, 10)).to.be.revertedWith(
            "offerNotOpenForRating" && "offerNotActive"
        )
    })

    it("reverts if invalid rating", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 10", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)

        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)

        await expect(tasks.connect(accounts[2]).rateTaskOffer(offerId, 0)).to.be.revertedWith(
            "ratingOutOfRange"
        )

        await expect(tasks.connect(accounts[2]).rateTaskOffer(offerId, 11)).to.be.revertedWith(
            "ratingOutOfRange"
        )
    })

    // Tests for any other additional errors

    // ...Previous tests

    it("reverts if performer rates own offer", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 11", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)

        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)

        await expect(tasks.connect(accounts[1]).rateTaskOffer(offerId, 10)).to.be.revertedWith(
            "performerCannotRateOwnOffer"
        )
    })

    it("reverts if no suitable offer", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 12", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)

        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 5) // Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 5)
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 5)
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 5)

        await expect(tasks.assignTask(1)).to.be.revertedWith("noSuitableOffer")
    })

    it("reverts if non-performer completes task", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 13", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10) // Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10)
        await tasks.assignTask(1)

        await expect(tasks.connect(accounts[2]).completeTask(1)).to.be.revertedWith(
            "onlyAssignedPerformerCanComplete"
        )
    })

    it("reverts if unassigned task completed", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 13", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10) // Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10)
        await expect(tasks.connect(accounts[0]).completeTask(1)).to.be.revertedWith(
            "taskNotAssigned"
        )
    })

    // Tests for any other additional errors

    // ...Previous tests

    it("reverts if wrong task status when completing", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 15", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10) // Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10)

        await tasks.assignTask(1)

        await tasks.connect(accounts[1]).cancelTaskOffer(1)

        await expect(tasks.connect(accounts[1]).completeTask(1)).to.be.revertedWith(
            "userHasNotProposed"
        )
    })

    it("reverts if performer rates own task", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 16", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10) // Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10)

        await tasks.assignTask(1)

        await tasks.connect(accounts[1]).completeTask(1)

        await expect(tasks.connect(accounts[1]).rateCompletedTask(1, 10)).to.be.revertedWith(
            "performerCannotRateOwnTask"
        )
    })

    it("reverts if not in verification stage", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 17", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10) // Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10)

        await tasks.assignTask(1)

        await expect(tasks.verifyTask(1)).to.be.revertedWith("taskNotInVerificationStage")
    })

    it("reverts if not enough ratings", async () => {
        await tasks.addTask(1, "Task 18", 100)

        await tasks.connect(accounts[1]).proposeTaskOffer(1)
        const offerId = await tasks.connect(accounts[1]).getTaskOfferId(1)
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 10) // Low rating
        await tasks.connect(accounts[3]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 10)
        await tasks.connect(accounts[5]).rateTaskOffer(offerId, 10)

        await tasks.assignTask(1)

        await tasks.connect(accounts[1]).completeTask(1)
        await tasks.connect(accounts[2]).rateCompletedTask(1, 10)

        await expect(tasks.verifyTask(1)).to.be.revertedWith("notEnoughRatings")
    })
    //UNIT TESTS
    it("should keep task name after adding task", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 3", 100)

        const taskNameTaken = await tasks.doesTaskNameExist(1, "Task 3")
        expect(taskNameTaken).to.equal(true)
    })
    it("should delete task name after cancelling task", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 3", 100)

        await tasks.connect(accounts[0]).cancelTask(1)

        const taskNameTaken = await tasks.doesTaskNameExist(1, "Task 3")
        expect(taskNameTaken).to.equal(false)
    })
    it("should delete task name after changing task name", async () => {
        await tasks.connect(accounts[0]).addTask(1, "Task 3", 100)

        await tasks.connect(accounts[0]).changeTask(1, "Task 4", 100)

        const taskNameTaken = await tasks.doesTaskNameExist(1, "Task 3")
        expect(taskNameTaken).to.equal(false)
    })

    // Add any other additional test cases

    it("Should have transferred the tokens to the performer & administrator", async function () {

        await tasks.connect(accounts[0]).addTask(0, "Task 1", 100)
        await tasks.connect(accounts[1]).proposeTaskOffer(1)
        await tasks.connect(accounts[2]).rateTaskOffer(1, 10)
        await tasks.connect(accounts[3]).rateTaskOffer(1, 10)
        await tasks.connect(accounts[4]).rateTaskOffer(1, 10)
        await tasks.connect(accounts[5]).rateTaskOffer(1, 10)
        await tasks.assignTask(1);
        await tasks.connect(accounts[1]).completeTask(1);
        await tasks.connect(accounts[2]).rateCompletedTask(1, 10);
        await tasks.connect(accounts[3]).rateCompletedTask(1, 10);
        await tasks.verifyTask(1);
        const taskDetails = await tasks.getTaskDetails(0)
        let performerBalance = await tokenManagement.viewBalance(
            accounts[1].address,
            taskDetails[1]
        )
        let adminBalance = await tokenManagement.viewBalance(
            accounts[0].address,
            taskDetails[1]
        )

        expect(performerBalance).to.equal(110)
        expect(adminBalance).to.equal(20)
    })

});

