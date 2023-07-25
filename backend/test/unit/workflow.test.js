const { expect } = require("chai")

describe("Workflow", function () {
    let problems, solutions, membership, tokenManagement, projects, tasks
    let accounts, projectManagerAccount, offerId

    before(async function () {
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
    })

    it("Should register five members", async function () {
        for (let i = 0; i < 8; i++) {
            const name = String(i)
            await membership.connect(accounts[i]).registerMember(name)
            expect(await membership.isRegisteredMember(accounts[i].address)).to.be.true
        }
    })

    it("Should raise a problem", async function () {
        await problems.connect(accounts[0]).raiseProblem("Problem 1")
        const problemId = await problems.getProblemCounter()
        expect(problemId).to.equal(1)
        expect((await problems.viewProblemDetails(problemId))[2]).to.equal("Problem 1")
    })

    it("Should rate the problem", async function () {
        const problemId = await problems.getProblemCounter()

        for (let i = 1; i < 2; i++) {
            await problems.connect(accounts[i]).rateProblem(problemId, 6)
        }
        expect(await problems.meetsRatingCriteria(problemId)).to.be.false

        for (let i = 3; i < 4; i++) {
            await problems.connect(accounts[i]).rateProblem(problemId, 9)
        }
        expect(await problems.meetsRatingCriteria(problemId)).to.be.true
    })

    it("Should propose a solution", async function () {
        const problemId = await problems.getProblemCounter()
        await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 1")
        const solutionId = await solutions.getSolutionCounter()
        expect((await solutions.viewSolutionDetails(solutionId))[3]).to.equal("Solution 1")
    })

    it("Test getter for problem and solution creators", async function () {
        const Creators = await solutions.getCreators(1)
        expect(Creators[0]).to.equal(accounts[1].address)
        expect(Creators[1]).to.equal(accounts[0].address)
    })

    it("Should rate the solution", async function () {
        const solutionId = await solutions.getSolutionCounter()

        for (let i = 2; i < 3; i++) {
            await solutions.connect(accounts[i]).rateSolution(solutionId, 6)
        }
        expect(await solutions.canBecomeProject(solutionId)).to.be.false

        for (let i = 4; i < 7; i++) {
            await solutions.connect(accounts[i]).rateSolution(solutionId, 9)
        }
        expect(await solutions.canBecomeProject(solutionId)).to.be.true
    })

    it("Token management permission should be allowed for the project contract", async function () {
        permission_b = await tokenManagement.isAuthorized(projects.address)
        await tokenManagement.connect(accounts[0]).authorizeContract(projects.address)
        permission_a = await tokenManagement.isAuthorized(projects.address)
        expect(permission_b).to.equal(false)
        expect(permission_a).to.equal(true)
    })

    it("Should allow a member to propose to be a project manager", async function () {
        // Member proposing to be the manager
        projectManagerAccount = accounts[2]
        await projects.connect(projectManagerAccount).proposeOffer(1)

        offerId = await projects.getOfferCounter()
        offerId2 = await projects.getOfferCounter()

        const offerDetails = await projects.viewOfferDetails(offerId)

        expect(offerDetails[0]).to.equal(offerId)
        expect(offerDetails[1]).to.equal(1)
        expect(offerDetails[2]).to.equal(projectManagerAccount.address)
        expect(offerDetails[5]).to.be.true
    })

    it("Should have transferred the tokens to the creators", async function () {
        const Creators = await solutions.getCreators(1)
        let problemCreatorBalance = await tokenManagement.viewBalance(Creators[1], 1)
        let solutionCreatorBalance = await tokenManagement.viewBalance(Creators[0], 1)

        expect(problemCreatorBalance).to.equal(10)
        expect(solutionCreatorBalance).to.equal(10)
    })

    it("Should allow members to rate the management offer", async function () {
        // Member 1 rating the offer
        await projects.connect(accounts[0]).rateOffer(offerId, 7)
        // Member 2 rating the offer
        await projects.connect(accounts[1]).rateOffer(offerId, 9)
        // Member 3 rating the offer
        await projects.connect(accounts[3]).rateOffer(offerId, 8)

        const offerDetails = await projects.viewOfferDetails(offerId)

        expect(offerDetails[3]).to.equal(24) // Total rating
        expect(offerDetails[4]).to.equal(3) // Total number of raters

        const address0 = "0x0000000000000000000000000000000000000000"
        const projectManager0 = await projects.getProjectManager(1)
        expect(projectManager0).to.equal(address0)
    })

    it("Should assign the project manager if the average rating is above 7", async function () {
        await projects.connect(accounts[4]).rateOffer(offerId2, 8)
        await projects.assignProjectManager(1)

        const projectManager = await projects.getProjectManager(1)
        expect(projectManager).to.equal(projectManagerAccount.address)
    })

    // it("Should assign the project manager if the average rating is above 7", async function () {
    //     await projects.assignProjectManager(1)

    //     const projectManager = await projects.getProjectManager(1)
    //     expect(projectManager).to.equal(projectManagerAccount.address)
    // })

    it("Token management permission should be allowed for the tasks contract", async function () {
        permission_b = await tokenManagement.isAuthorized(tasks.address)
        await tokenManagement.connect(accounts[0]).authorizeContract(tasks.address)
        permission_a = await tokenManagement.isAuthorized(tasks.address)
        expect(permission_b).to.equal(false)
        expect(permission_a).to.equal(true)
    })

    let performerAccount, taskId

    it("Should allow a member to add a task", async function () {
        performerAccount = accounts[3]
        await tasks.connect(projectManagerAccount).addTask(1, "Task 1", 1000)

        taskId = await tasks.getTotalTasks()
        const taskDetails = await tasks.getTaskDetails(taskId)

        expect(taskDetails[0]).to.equal(taskId)
        expect(taskDetails[2]).to.equal("Task 1")
    })

    it("Should allow a member to offer for the task", async function () {
        await tasks.connect(performerAccount).proposeTaskOffer(taskId)

        offerId = await tasks.getTotalTaskOffers()
        const offerDetails = await tasks.getTaskOfferDetails(offerId)

        expect(offerDetails[0]).to.equal(offerId)
        expect(offerDetails[1]).to.equal(taskId)
        expect(offerDetails[2]).to.equal(performerAccount.address)
        expect(offerDetails[5]).to.be.true
    })

    it("Should allow members to rate the task offer", async function () {
        // Member 1 rating the offer
        await tasks.connect(accounts[0]).rateTaskOffer(offerId, 9)
        // Member 2 rating the offer
        await tasks.connect(accounts[1]).rateTaskOffer(offerId, 9)
        // Member 3 rating the offer
        await tasks.connect(accounts[4]).rateTaskOffer(offerId, 9)

        const offerDetails = await tasks.getTaskOfferDetails(offerId)

        expect(offerDetails[3]).to.equal(27) // Total rating
        expect(offerDetails[4]).to.equal(3) // Total number of raters
    })

    it("Should assign the task to the performer if the average rating is above 7", async function () {
        await tasks.connect(accounts[2]).rateTaskOffer(offerId2, 9)

        const performer0 = await tasks.getTaskDetails(taskId)[4]
        const taskDetails0 = await tasks.getTaskDetails(taskId)
        await tasks.assignTask(taskId)
        // const performer = await tasks.getTaskDetails(taskId)[4]
        const taskDetailsAfter = await tasks.getTaskDetails(taskId)
        const performer = taskDetailsAfter[4]
        expect(performer0).to.equal(undefined)
        expect(performer).to.equal(performerAccount.address)
        const taskDetails = await tasks.getTaskDetails(taskId)
        expect(taskDetails0[8]).to.equal(0)
        expect(taskDetails[8]).to.equal(1)
    })

    it("Should mark the task as complete", async function () {
        const taskDetails0 = await tasks.getTaskDetails(taskId)
        await tasks.connect(performerAccount).completeTask(taskId)

        const taskDetails = await tasks.getTaskDetails(taskId)
        expect(taskDetails0[8]).to.equal(1)
        expect(taskDetails[8]).to.equal(2)
    })

    it("Should allow members to rate the completed task", async function () {
        await tasks.connect(accounts[0]).rateCompletedTask(taskId, 8)
        await tasks.connect(accounts[1]).rateCompletedTask(taskId, 9)

        const taskDetails = await tasks.getTaskDetails(taskId)
        expect(taskDetails[5]).to.equal(17) // Total rating
        expect(taskDetails[6]).to.equal(2) // Total number of raters
    })

    it("Should verify the task", async function () {
        const taskDetails0 = await tasks.getTaskDetails(taskId)
        await tasks.connect(accounts[0]).verifyTask(taskId)
        const taskDetails = await tasks.getTaskDetails(taskId)
        expect(taskDetails0[8]).to.equal(2)
        expect(taskDetails[8]).to.equal(3)
    })

    it("Should have transferred the tokens to the performer & administrator", async function () {
        const taskDetails = await tasks.getTaskDetails(taskId)
        let performerBalance = await tokenManagement.viewBalance(
            performerAccount.address,
            taskDetails[1]
        )
        let adminBalance = await tokenManagement.viewBalance(
            projectManagerAccount.address,
            taskDetails[1]
        )

        expect(performerBalance).to.equal(10)
        expect(adminBalance).to.equal(10)
    })
})
