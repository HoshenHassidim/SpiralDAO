const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Projects Errors", function () {
    let problems, solutions, membership, tokenManagement, projects, tasks, authorizationManagement
    let accounts, projectManagerAccount, projectId

    beforeEach(async function () {
        const AuthorizationManagement = await ethers.getContractFactory("AuthorizationManagement")
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
    })
    // afterEach(async function () {
    //     if (membership.connect(accounts[0]).isRegisteredMember(accounts[0].address)) await membership.connect(accounts[0]).unregisterMember();
    //     if (membership.connect(accounts[1]).isRegisteredMember(accounts[1].address)) await membership.connect(accounts[1]).unregisterMember();
    //     if (membership.connect(accounts[2]).isRegisteredMember(accounts[1].address)) await membership.connect(accounts[2]).unregisterMember();

    // })
    it("Should have DAO Project upon loading, and manager should be the deployer", async function () {
        const manager = await projects.getProjectManager(0)
        console.log(manager)
        expect(manager).to.equal(accounts[0].address)
    })
    it("should revert when trying to assign project manager to DAO project, when deployer has not been thrown out", async function () {
        await expect(projects.assignProjectManager(0)).to.be.revertedWith("managerHasBeenAssigned")
        // await expect(projects.doesProjectHaveManager(0)).to.be.true;
        const hasManager = await projects.doesProjectHaveManager(0)
        expect(hasManager).to.be.true
    })
    it("should revert when there are insufficient raters to throw a manager of DAO out", async function () {
        await projects.connect(accounts[1]).proposeRemoveManager(0)
        await projects.connect(accounts[2]).rateRemovalOffer(1, 10)
        await projects.connect(accounts[3]).rateRemovalOffer(1, 10)
        await projects.connect(accounts[4]).rateRemovalOffer(1, 10)
        await expect(projects.checkRemovalRatings(1)).to.be.revertedWith(
            "insufficientTotalRatersForAllOffers"
        )
    })
    it("should remove project manager if enough people vote them out of their position", async function () {
        await projects.connect(accounts[1]).proposeRemoveManager(0)
        await projects.connect(accounts[2]).rateRemovalOffer(1, 10)
        await projects.connect(accounts[3]).rateRemovalOffer(1, 10)
        await projects.connect(accounts[4]).rateRemovalOffer(1, 10)
        await projects.connect(accounts[5]).rateRemovalOffer(1, 10)
        await projects.connect(accounts[6]).rateRemovalOffer(1, 10)
        await projects.checkRemovalRatings(1)
        const hasManager = await projects.doesProjectHaveManager(0)
        expect(hasManager).to.be.false
    })
    it("should register memeber as spiral DAO member if enough people vote them in", async function () {
        await projects.connect(accounts[1]).proposeRemoveManager(0)
        await projects.connect(accounts[2]).rateRemovalOffer(1, 10)
        await projects.connect(accounts[3]).rateRemovalOffer(1, 10)
        await projects.connect(accounts[4]).rateRemovalOffer(1, 10)
        await projects.connect(accounts[5]).rateRemovalOffer(1, 10)
        await projects.connect(accounts[6]).rateRemovalOffer(1, 10)
        await projects.checkRemovalRatings(1)
        let hasManager = await projects.doesProjectHaveManager(0)
        expect(hasManager).to.be.false
        await projects.connect(accounts[1]).proposeManagementOffer(0)
        await projects.connect(accounts[2]).rateManagementOffer(1, 10)
        await projects.connect(accounts[3]).rateManagementOffer(1, 10)
        await projects.connect(accounts[4]).rateManagementOffer(1, 10)
        await projects.connect(accounts[5]).rateManagementOffer(1, 10)
        await projects.assignProjectManager(0)
        hasManager = await projects.doesProjectHaveManager(0)
        expect(hasManager).to.be.true
    })
    it("Should revert for invalid solution ID", async function () {
        await expect(projects.connect(accounts[0]).proposeManagementOffer(2)).to.be.revertedWith(
            "invalidID"
        )
    })

    it("Should revert if project not open for proposals", async function () {
        await projects.connect(accounts[0]).proposeManagementOffer(1)
        await projects.connect(accounts[2]).rateManagementOffer(1, 10)
        await projects.connect(accounts[3]).rateManagementOffer(1, 10)
        await projects.connect(accounts[4]).rateManagementOffer(1, 10)
        await projects.connect(accounts[5]).rateManagementOffer(1, 10)

        await projects.assignProjectManager(1)
        await projects.connect()
        await expect(projects.connect(accounts[1]).proposeManagementOffer(1)).to.be.revertedWith(
            "projectNotOpenForProposals"
        )
    })

    it("Should revert if user already proposed", async function () {
        await projects.connect(accounts[0]).proposeManagementOffer(1)
        await expect(projects.connect(accounts[0]).proposeManagementOffer(1)).to.be.revertedWith(
            "userAlreadyProposed"
        )
    })

    it("Should revert if not offer creator", async function () {
        await projects.connect(accounts[0]).proposeManagementOffer(1)
        const offerId = await projects.getManagementOfferCounter()
        await expect(
            projects.connect(accounts[1]).cancelManagementOffer(offerId)
        ).to.be.revertedWith("onlyManager")
    })
    // ...Rest of contract setup

    it("Should revert if rating is out of range", async function () {
        await projects.connect(accounts[0]).proposeManagementOffer(1)
        const offerId = await projects.getManagementOfferCounter()

        await expect(
            projects.connect(accounts[1]).rateManagementOffer(offerId, 0)
        ).to.be.revertedWith("ratingOutOfRange")

        await expect(
            projects.connect(accounts[1]).rateManagementOffer(offerId, 11)
        ).to.be.revertedWith("ratingOutOfRange")
    })

    it("Should revert if manager rates own offer", async function () {
        await projects.connect(accounts[0]).proposeManagementOffer(1)
        const offerId = await projects.getManagementOfferCounter()

        await expect(
            projects.connect(accounts[0]).rateManagementOffer(offerId, 10)
        ).to.be.revertedWith("managerCannotRateOwnOffer")
    })

    it("Should revert if offer not open for rating", async function () {
        await projects.connect(accounts[0]).proposeManagementOffer(1)
        const offerId = await projects.getManagementOfferCounter()

        await projects.connect(accounts[0]).cancelManagementOffer(offerId)

        await expect(
            projects.connect(accounts[1]).rateManagementOffer(offerId, 10)
        ).to.be.revertedWith("offerNotActive")
    })

    it("Should revert if people have begun to rate removal offer", async function () {
        await projects.connect(accounts[0]).proposeManagementOffer(1)
        await projects.connect(accounts[2]).rateManagementOffer(1, 10)
        await projects.connect(accounts[3]).rateManagementOffer(1, 10)
        await projects.connect(accounts[4]).rateManagementOffer(1, 10)
        await projects.connect(accounts[5]).rateManagementOffer(1, 10)

        await projects.assignProjectManager(1)

        await projects.connect(accounts[2]).proposeRemoveManager(1)
        await projects.connect(accounts[3]).rateRemovalOffer(1, 10)

        await expect(projects.connect(accounts[2]).cancelRemovalOffer(1)).to.be.revertedWith(
            "cannotCancelOnceVotingBegins"
        )
    })

    it("Should revert if insufficient total raters", async function () {
        await projects.connect(accounts[0]).proposeManagementOffer(1)
        await projects.connect(accounts[1]).proposeManagementOffer(1)

        const offerId1 = await projects.getManagementOfferCounter()
        const offerId2 = offerId1 - 1

        await projects.connect(accounts[2]).rateManagementOffer(offerId1, 10)
        await projects.connect(accounts[2]).rateManagementOffer(offerId2, 8)

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
