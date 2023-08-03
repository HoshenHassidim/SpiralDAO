const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("MemberBackground", function () {
    let Membership, membership, deployer, addr1
    let deployerAddress, addr1Address

    // before(async function () {
    //     deployerAddress = await deployer.getAddress()
    //     addr1Address = await addr1.getAddress()
    // })

    // beforeEach(async function () {
    //     membership = await Membership.deploy()
    //     await membership.deployed()
    // })

    describe("viewMemberDetails", function () {
        let problems,
            solutions,
            membership,
            tokenManagement,
            projects,
            tasks,
            authorizationManagement
        let accounts, projectManagerAccount, projectId, offerId, removalOfferId

        before(async function () {
            const AuthorizationManagement = await ethers.getContractFactory(
                "AuthorizationManagement"
            )
            const TokenManagement = await ethers.getContractFactory("TokenManagement")
            const Membership = await ethers.getContractFactory("Membership")
            const Problems = await ethers.getContractFactory("Problems")
            const Solutions = await ethers.getContractFactory("Solutions")
            const Projects = await ethers.getContractFactory("Projects")
            const Tasks = await ethers.getContractFactory("Tasks")

            authorizationManagement = await AuthorizationManagement.deploy()
            await authorizationManagement.deployed()

            tokenManagement = await TokenManagement.deploy(authorizationManagement.address)
            await tokenManagement.deployed()

            membership = await Membership.deploy(authorizationManagement.address)
            await membership.deployed()

            problems = await Problems.deploy(membership.address, authorizationManagement.address)
            await problems.deployed()

            solutions = await Solutions.deploy(
                membership.address,
                problems.address,
                authorizationManagement.address
            )
            await solutions.deployed()

            projects = await Projects.deploy(
                membership.address,
                authorizationManagement.address,
                solutions.address,
                tokenManagement.address
            )
            await projects.deployed()

            tasks = await Tasks.deploy(
                membership.address,
                projects.address,
                tokenManagement.address,
                authorizationManagement.address
            )
            await tasks.deployed()

            accounts = await ethers.getSigners()

            await authorizationManagement
                .connect(accounts[0])
                .authorizeContract(tokenManagement.address)
            await authorizationManagement.connect(accounts[0]).authorizeContract(problems.address)
            await authorizationManagement.connect(accounts[0]).authorizeContract(solutions.address)
            await authorizationManagement.connect(accounts[0]).authorizeContract(projects.address)
            await authorizationManagement.connect(accounts[0]).authorizeContract(tasks.address)

            for (let i = 0; i < 8; i++) {
                const name = String(i)
                await membership.connect(accounts[i]).registerMember(name)
            } //creates 7 members (1-7)

            await problems.connect(accounts[0]).raiseProblem("Problem 1") //person 0 raises problem
            const problemId = await problems.getProblemCounter()
            for (let i = 1; i < 4; i++) {
                await problems.connect(accounts[i]).rateProblem(problemId, 9)
            } //people 1,2,3 rate problem as 9
            await problems.connect(accounts[0]).raiseProblem("Problem 2") //person 0 raises another problem
            const problemId2 = await problems.getProblemCounter()
            for (let i = 1; i < 4; i++) {
                await problems.connect(accounts[i]).rateProblem(problemId2, 9)
            } //people 1,2,3 rate problem as 9

            // await tokenManagement.connect(accounts[0]).authorizeContract(projects.address) //authorizes contract
            projectManagerAccount = accounts[2] //person 2 will become proj manager

            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 1") //person 1 raises solution
            const solutionId = await solutions.getSolutionCounter()
            for (let i = 2; i < 6; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, 5)
            } //people 2,3,4,5 rate solution as 5
            expect((await solutions.viewSolutionDetails(solutionId))[6]).to.be.true

            await expect(
                projects.connect(projectManagerAccount).proposeManagementOffer(solutionId)
            ).to.be.revertedWith("solutionDoesNotMeetCriteria")
            expect((await solutions.viewSolutionDetails(solutionId))[6]).to.be.true

            for (let i = 2; i < 6; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, 9)
            } //people 2,3,4,5 rate solution as 9

            await solutions.connect(accounts[7]).proposeSolution(problemId, "Solution 2") //person 7 raises solution
            const solutionId2 = await solutions.getSolutionCounter()
            for (let i = 2; i < 6; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId2, 9)
            } //people 2,3,4,5 rate solution as 9

            await solutions.connect(accounts[7]).proposeSolution(problemId2, "Solution A") //person 7 raises solution
            const solutionId3 = await solutions.getSolutionCounter()
            for (let i = 2; i < 6; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId3, 9)
            } //people 2,3,4,5 rate solution as 9

            expect((await solutions.viewSolutionDetails(solutionId))[6]).to.be.true
            expect((await solutions.viewSolutionDetails(solutionId2))[6]).to.be.true
            expect((await solutions.viewSolutionDetails(solutionId3))[6]).to.be.true

            await projects.connect(projectManagerAccount).proposeManagementOffer(solutionId) //person 3 offers to be manager for project 1 and creates project

            expect((await solutions.viewSolutionDetails(solutionId))[6]).to.be.false
            expect((await solutions.viewSolutionDetails(solutionId2))[6]).to.be.false
            expect((await solutions.viewSolutionDetails(solutionId3))[6]).to.be.true

            const offerId = await projects.getManagementOfferCounter() //create offer Id
            for (let i = 3; i < 7; i++) {
                await projects.connect(accounts[i]).ratelManagementOffer(offerId, 9)
            } //people 3,4,5,6 rate offer as 9
            projectId = solutionId //assigns projectId
            projects.assignProjectManager(projectId) //assigns project manager

            performerAccount = accounts[3]
            await tasks.connect(projectManagerAccount).addTask(1, "Task 1", 1000)
            taskId = await tasks.getTotalTasks()
            await tasks.connect(performerAccount).proposeTaskOffer(taskId)
            for (let i = 0; i < 3; i++) {
                await tasks.connect(accounts[i]).rateTaskOffer(taskId, 9)
            }
            await tasks.connect(accounts[4]).rateTaskOffer(taskId, 9)
            await tasks.assignTask(taskId)
            await tasks.connect(performerAccount).completeTask(taskId)
            for (let i = 0; i < 3; i++) {
                await tasks.connect(accounts[i]).rateCompletedTask(taskId, i + 6) //6,7,8
            }
            await tasks.connect(accounts[3]).verifyTask(taskId)
        })

        it("Should track member details correctly", async function () {
            let user0Details = await membership.viewMemberDetails(await accounts[0].getAddress())
            expect(user0Details[0]).to.equal("0") //username
            expect(user0Details[1]).to.equal(0) //tasksAssigned
            expect(user0Details[2]).to.equal(0) //tasksAvg
            expect(user0Details[3]).to.equal(0) //projectsManaged
            expect(user0Details[4]).to.equal(1) //problemsAccepted
            expect(user0Details[5]).to.equal(0) //solutionsAccepted

            let user1Details = await membership.viewMemberDetails(await accounts[1].getAddress())
            expect(user1Details[0]).to.equal("1") //username
            expect(user1Details[1]).to.equal(0) //tasksAssigned
            expect(user1Details[2]).to.equal(0) //tasksAvg
            expect(user1Details[3]).to.equal(0) //projectsManaged
            expect(user1Details[4]).to.equal(0) //problemsAccepted
            expect(user1Details[5]).to.equal(1) //solutionsAccepted

            let user2Details = await membership.viewMemberDetails(await accounts[2].getAddress())
            expect(user2Details[0]).to.equal("2") //username
            expect(user2Details[1]).to.equal(0) //tasksAssigned
            expect(user2Details[2]).to.equal(0) //tasksAvg
            expect(user2Details[3]).to.equal(1) //projectsManaged
            expect(user2Details[4]).to.equal(0) //problemsAccepted
            expect(user2Details[5]).to.equal(0) //solutionsAccepted

            let user3Details = await membership.viewMemberDetails(await accounts[3].getAddress())
            expect(user3Details[0]).to.equal("3") //username
            expect(user3Details[1]).to.equal(1) //tasksAssigned //one task assigned
            expect(user3Details[2]).to.equal(7) //tasksAvg //average of all ratings: 6+7+8 / 3 = 7
            expect(user3Details[3]).to.equal(0) //projectsManaged
            expect(user3Details[4]).to.equal(0) //problemsAccepted
            expect(user3Details[5]).to.equal(0) //solutionsAccepted

            await tasks.connect(projectManagerAccount).addTask(1, "Task 2", 1000)
            taskId = await tasks.getTotalTasks()
            await tasks.connect(performerAccount).proposeTaskOffer(taskId)
            for (let i = 0; i < 3; i++) {
                await tasks.connect(accounts[i]).rateTaskOffer(taskId, 9)
            }
            await tasks.connect(accounts[4]).rateTaskOffer(taskId, 9)
            await tasks.assignTask(taskId)
            await tasks.connect(performerAccount).completeTask(taskId)
            for (let i = 0; i < 3; i++) {
                await tasks.connect(accounts[i]).rateCompletedTask(taskId, i + 1) //1,2,3
            }
            await tasks.connect(accounts[4]).rateCompletedTask(taskId, 8)
            await tasks.connect(accounts[3]).verifyTask(taskId)

            let newUser3Details = await membership.viewMemberDetails(await accounts[3].getAddress())
            expect(newUser3Details[0]).to.equal("3") //username
            expect(newUser3Details[1]).to.equal(2) //tasksAssigned //two tasks assigned
            expect(newUser3Details[2]).to.equal(5) //tasksAvg //average of all ratings: ((6+7+8)/3 + (1+2+3+8)/4 )/2 = 5.25 ≈ 5
            expect(newUser3Details[3]).to.equal(0) //projectsManaged
            expect(newUser3Details[4]).to.equal(0) //problemsAccepted
            expect(newUser3Details[5]).to.equal(0) //solutionsAccepted
        })
    })
})
