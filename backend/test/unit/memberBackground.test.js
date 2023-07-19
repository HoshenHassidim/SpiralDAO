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
        // it("Should return the details of a member", async function () {
        //     await membership.connect(deployer).registerMember("deployer")
        //     let userDetails = await membership.viewMemberDetails(deployerAddress)
        //     expect(userDetails[0]).to.equal("deployer")
        //     for (let i = 1; i <= 5; i++) expect(userDetails[i]).to.equal(0)
        // })

        // it("Should revert when attempting to get username of non-member", async function () {
        //     await expect(membership.viewMemberDetails(deployerAddress)).to.be.revertedWith(
        //         "NotMember"
        //     )
        // })

        let problems, solutions, membership, tokenManagement, projects, tasks
        let accounts, projectManagerAccount, projectId, removalOfferId

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
            } //creates 8 members (0-7)

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
            await projects.connect(projectManagerAccount).proposeOffer(1) //person 2 offers to be manager for project 1
            const offerId = await projects.getOfferCounter() //create offer Id
            for (let i = 3; i < 7; i++) {
                await projects.connect(accounts[i]).rateOffer(offerId, 9)
            } //people 3,4,5,6 rate offer as 9
            projectId = solutionId //assigns projectId
            projects.assignProjectManager(projectId) //assigns project manager
        })
    })
})
