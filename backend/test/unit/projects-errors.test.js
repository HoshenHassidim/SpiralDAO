const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Projects Errors", function () {
    let problems, solutions, membership, tokenManagement, projects, tasks
    let accounts, projectManagerAccount, projectId

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
    })
    // afterEach(async function () {
    //     if (membership.connect(accounts[0]).isRegisteredMember(accounts[0].address)) await membership.connect(accounts[0]).unregisterMember();
    //     if (membership.connect(accounts[1]).isRegisteredMember(accounts[1].address)) await membership.connect(accounts[1]).unregisterMember();
    //     if (membership.connect(accounts[2]).isRegisteredMember(accounts[1].address)) await membership.connect(accounts[2]).unregisterMember();

    // })

    it("Should revert for invalid solution ID", async function () {
        await expect(projects.connect(accounts[0]).proposeOffer(0)).to.be.revertedWith("invalidID")
    })

    it("Should revert if project not open for proposals", async function () {
        await projects.connect(accounts[0]).proposeOffer(1)
        await projects.connect(accounts[2]).rateOffer(1, 10)
        await projects.connect(accounts[3]).rateOffer(1, 10)
        await projects.connect(accounts[4]).rateOffer(1, 10)
        await projects.connect(accounts[5]).rateOffer(1, 10)

        await projects.assignProjectManager(1)
        await projects.connect()
        await expect(projects.connect(accounts[1]).proposeOffer(1)).to.be.revertedWith(
            "projectNotOpenForProposals"
        )
    })

    it("Should revert if user already proposed", async function () {
        await projects.connect(accounts[0]).proposeOffer(1)
        await expect(projects.connect(accounts[0]).proposeOffer(1)).to.be.revertedWith(
            "userAlreadyProposed"
        )
    })

    it("Should revert if not offer creator", async function () {
        await projects.connect(accounts[0]).proposeOffer(1)
        const offerId = await projects.getOfferCounter()
        await expect(projects.connect(accounts[1]).cancelOffer(offerId)).to.be.revertedWith(
            "onlyManager"
        )
    })
    // ...Rest of contract setup

    it("Should revert if rating is out of range", async function () {
        await projects.connect(accounts[0]).proposeOffer(1)
        const offerId = await projects.getOfferCounter()

        await expect(projects.connect(accounts[1]).rateOffer(offerId, 0)).to.be.revertedWith(
            "ratingOutOfRange"
        )

        await expect(projects.connect(accounts[1]).rateOffer(offerId, 11)).to.be.revertedWith(
            "ratingOutOfRange"
        )
    })

    it("Should revert if manager rates own offer", async function () {
        await projects.connect(accounts[0]).proposeOffer(1)
        const offerId = await projects.getOfferCounter()

        await expect(projects.connect(accounts[0]).rateOffer(offerId, 10)).to.be.revertedWith(
            "managerCannotRateOwnOffer"
        )
    })

    it("Should revert if offer not open for rating", async function () {
        await projects.connect(accounts[0]).proposeOffer(1)
        const offerId = await projects.getOfferCounter()

        await projects.connect(accounts[0]).cancelOffer(offerId)

        await expect(projects.connect(accounts[1]).rateOffer(offerId, 10)).to.be.revertedWith(
            "offerNotActive"
        )
    })

    it("Should revert if insufficient total raters", async function () {
        await projects.connect(accounts[0]).proposeOffer(1)
        await projects.connect(accounts[1]).proposeOffer(1)

        const offerId1 = await projects.getOfferCounter()
        const offerId2 = offerId1 - 1

        await projects.connect(accounts[2]).rateOffer(offerId1, 10)
        await projects.connect(accounts[2]).rateOffer(offerId2, 8)

        await expect(projects.connect(accounts[1]).assignProjectManager(1)).to.be.revertedWith(
            "insufficientTotalRatersForAllOffers"
        )
    })

    it("Should revert for non-existent project", async function () {
        await expect(projects.connect(accounts[0]).viewProjectDetails(1)).to.be.revertedWith(
            "projectDoesNotExist"
        )
    })

    // ...
    // Test cases for other errors

    // after(async function () {
    //     await membership.unregisterMember({ from: accounts[0] });
    //     await membership.unregisterMember({ from: accounts[1] });
    //     await membership.unregisterMember({ from: accounts[2] });
    // })
})