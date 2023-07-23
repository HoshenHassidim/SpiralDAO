const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Membership", function () {
    let Membership, membership, deployer, addr1
    let deployerAddress, addr1Address

    before(async function () {
        Membership = await ethers.getContractFactory("Membership")
        ;[deployer, addr1] = await ethers.getSigners()

        deployerAddress = await deployer.getAddress()
        addr1Address = await addr1.getAddress()
    })

    beforeEach(async function () {
        membership = await Membership.deploy()
        await membership.deployed()
    })

    describe("viewMemberDetails", function () {
        let problems, solutions, membership, tokenManagement, projects, tasks
        let accounts, projectManagerAccount, projectId, removalOfferId

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

            tasks = await Tasks.deploy(
                membership.address,
                projects.address,
                tokenManagement.address
            )
            await tasks.deployed()

            accounts = await ethers.getSigners()

            for (let i = 0; i < 8; i++) {
                const name = String(i)
                await membership.connect(accounts[i]).registerMember(name)
            } //creates 7 members (1-7)

            await problems.connect(accounts[0]).raiseProblem("Problem 1") //person 0 raises problem
            const problemId = await problems.getProblemCounter()
            for (let i = 1; i < 4; i++) {
                await problems.connect(accounts[i]).rateProblem(problemId, 9)
            } //people 1,2,3 rate problem as 9

            await solutions.connect(accounts[1]).proposeSolution(problemId, "Solution 1") //person 1 raises solution
            const solutionId = await solutions.getSolutionCounter()
            for (let i = 2; i < 6; i++) {
                await solutions.connect(accounts[i]).rateSolution(solutionId, 9)
            } //people 2,3,4,5 rate solution as 9

            await tokenManagement.connect(accounts[0]).authorizeContract(projects.address) //authorizes contract

            projectManagerAccount = accounts[2] //person 2 will become proj manager
            await projects.connect(projectManagerAccount).proposeOffer(1) //person 3 offers to be manager for project 1
            const offerId = await projects.getOfferCounter() //create offer Id
            for (let i = 3; i < 7; i++) {
                await projects.connect(accounts[i]).rateOffer(offerId, 9)
            } //people 3,4,5,6 rate offer as 9
            projectId = solutionId //assigns projectId
            projects.assignProjectManager(projectId) //assigns project manager

            await tasks.connect(projectManagerAccount).addTask(projectId, "1", 100) //creates new task (randomly chose task value 100)
            taskProposer = accounts[3] //person 3 will run task
            taskId = await tasks.getTotalTasks() //i think(?)
            await tasks.connect(taskProposer).proposeTaskOffer(taskId)
            for (let i = 0; i < 7; i += 2) {
                await tasks.connect(accounts[i]).rateTaskOffer(taskId, 9)
            }
            //await tasks.assignTask(taskId)
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
            expect(user3Details[1]).to.equal(0) //tasksAssigned
            expect(user3Details[2]).to.equal(0) //tasksAvg
            expect(user3Details[3]).to.equal(0) //projectsManaged
            expect(user3Details[4]).to.equal(0) //problemsAccepted
            expect(user3Details[5]).to.equal(0) //solutionsAccepted
        })
    })
})
