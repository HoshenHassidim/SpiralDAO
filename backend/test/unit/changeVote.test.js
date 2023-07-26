const { expect } = require("chai")

describe("changeVote", function () {
    let problems, solutions, membership, tokenManagement, projects, tasks
    let accounts, projectManagerAccount, offerId, projectId

    before(async function () {
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

        for (let i = 0; i < 8; i++) {
            const name = String(i)
            await membership.connect(accounts[i]).registerMember(name)
        }

        await problems.connect(accounts[0]).raiseProblem("Problem 1")
    })

    it("Should allow members to change their vote for problem", async function () {
        const problemId = await problems.getProblemCounter()
        for (let i = 1; i < 4; i++) {
            await problems.connect(accounts[i]).rateProblem(problemId, 6)
        }
        expect(await problems.meetsRatingCriteria(problemId)).to.be.false

        for (let i = 1; i < 4; i++) {
            await problems.connect(accounts[i]).rateProblem(problemId, 9)
        }
        expect(await problems.meetsRatingCriteria(problemId)).to.be.true
    })

    it("Should allow members to change their vote for solution", async function () {
        const problemId = await problems.getProblemCounter()
        await solutions.connect(accounts[0]).proposeSolution(problemId, "Solution 1")
        const solutionId = await solutions.getSolutionCounter()
        expect((await solutions.viewSolutionDetails(solutionId))[3]).to.equal("Solution 1")

        for (let i = 1; i < 6; i++) {
            await solutions.connect(accounts[i]).rateSolution(solutionId, 6)
        }
        expect(await solutions.canBecomeProjectView(solutionId)).to.be.false

        for (let i = 1; i < 6; i++) {
            await solutions.connect(accounts[i]).rateSolution(solutionId, 9)
        }
        expect(await solutions.canBecomeProjectView(solutionId)).to.be.true

        projectId = solutionId
    })

    it("Should allow members to change their rating for the management offer", async function () {
        permission_b = await tokenManagement.isAuthorized(projects.address)
        await tokenManagement.connect(accounts[0]).authorizeContract(projects.address)
        permission_a = await tokenManagement.isAuthorized(projects.address)

        projectManagerAccount = accounts[2]
        await projects.connect(projectManagerAccount).proposeOffer(projectId)

        offerId = await projects.getOfferCounter()

        // Members rating the offer
        for (let i = 3; i < 7; i++) {
            await projects.connect(accounts[i]).rateOffer(offerId, 6)
        }
        const offerDetails = await projects.viewOfferDetails(offerId)
        expect(offerDetails[3]).to.equal(24) // Total rating
        expect(offerDetails[4]).to.equal(4) // Total number of raters

        for (let i = 3; i < 7; i++) {
            await projects.connect(accounts[i]).rateOffer(offerId, 9)
        }
        const offerDetails1 = await projects.viewOfferDetails(offerId)

        expect(offerDetails1[3]).to.equal(36) // Total rating
        expect(offerDetails1[4]).to.equal(4) // Total number of raters
    })

    let performerAccount, taskId

    it("Should allow members to change their rate for the task offer", async function () {
        await projects.assignProjectManager(projectId)

        permission_b = await tokenManagement.isAuthorized(tasks.address)
        await tokenManagement.connect(accounts[0]).authorizeContract(tasks.address)
        permission_a = await tokenManagement.isAuthorized(tasks.address)

        performerAccount = accounts[3]
        await tasks.connect(projectManagerAccount).addTask(projectId, "Task 1", 1000)

        taskId = await tasks.getTotalTasks()

        await tasks.connect(performerAccount).proposeTaskOffer(taskId)

        offerId = await tasks.getTotalTaskOffers()

        for (let i = 4; i < 7; i++) {
            await tasks.connect(accounts[i]).rateTaskOffer(offerId, 2)
        }
        const offerDetails = await tasks.getTaskOfferDetails(offerId)
        expect(offerDetails[3]).to.equal(6) // Total rating
        expect(offerDetails[4]).to.equal(3) // Total number of raters

        for (let i = 4; i < 7; i++) {
            await tasks.connect(accounts[i]).rateTaskOffer(offerId, 9)
        }
        const offerDetailsNew = await tasks.getTaskOfferDetails(offerId)
        expect(offerDetailsNew[3]).to.equal(27) // Total rating
        expect(offerDetailsNew[4]).to.equal(3) // Total number of raters
    })

    it("Should allow members to change rating for the completed task", async function () {
        await tasks.connect(accounts[2]).rateTaskOffer(offerId, 9)

        await tasks.assignTask(taskId)

        await tasks.connect(performerAccount).completeTask(taskId)

        await tasks.connect(accounts[0]).rateCompletedTask(taskId, 6)
        await tasks.connect(accounts[1]).rateCompletedTask(taskId, 2)

        const taskDetails = await tasks.getTaskDetails(taskId)
        expect(taskDetails[5]).to.equal(8) // Total rating
        expect(taskDetails[6]).to.equal(2) // Total number of raters

        await tasks.connect(accounts[0]).rateCompletedTask(taskId, 8)
        await tasks.connect(accounts[1]).rateCompletedTask(taskId, 9)

        const taskDetails1 = await tasks.getTaskDetails(taskId)
        expect(taskDetails1[5]).to.equal(17) // Total rating
        expect(taskDetails1[6]).to.equal(2) // Total number of raters
    })

    it("Should allow members to change their rating for the management removal offer", async function () {
        removalProposer = accounts[7]
        await projects.connect(removalProposer).proposeRemoveManager(projectId)
        removalOfferId = projects.getRemovalOfferCounter()

        // Members rating the offer
        for (let i = 3; i < 7; i++) {
            await projects.connect(accounts[i]).rateRemovalOffer(removalOfferId, 6)
        }
        const removalOfferDetails = await projects.viewRemovalOfferDetails(removalOfferId)
        expect(removalOfferDetails[3]).to.equal(24) // Total rating
        expect(removalOfferDetails[4]).to.equal(4) // Total number of raters

        for (let i = 3; i < 7; i++) {
            await projects.connect(accounts[i]).rateRemovalOffer(removalOfferId, 9)
        }
        const removalOfferDetails1 = await projects.viewRemovalOfferDetails(removalOfferId)

        expect(removalOfferDetails1[3]).to.equal(36) // Total rating
        expect(removalOfferDetails1[4]).to.equal(4) // Total number of raters
    })
})
