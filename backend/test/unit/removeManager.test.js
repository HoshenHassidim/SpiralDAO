const { expect } = require('chai');

describe("removeManager", function () {
  let problems, solutions, membership, tokenManagement, projects, tasks
  let accounts, projectManagerAccount, projectId, removalOfferId, removalProposerAccount, solutionId, offerId

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
    solutionId = await solutions.getSolutionCounter()
    for (let i = 2; i < 6; i++) {
      await solutions.connect(accounts[i]).rateSolution(solutionId, 9)
    }

    await tokenManagement.connect(accounts[0]).authorizeContract(projects.address)

    projectManagerAccount = accounts[2]
    await projects.connect(projectManagerAccount).proposeOffer(solutionId)
    offerId = await projects.getOfferCounter()
    for (let i = 3; i < 7; i++) {
      await projects.connect(accounts[i]).rateOffer(offerId, 9)
    }
    projectId = solutionId
    projects.assignProjectManager(projectId)
    removalProposerAccount = accounts[0]
  })

  it('Should allow a member to propose the removal of a project manager', async function (){
    await projects.connect(removalProposerAccount).proposeRemoveManager(projectId);

    removalOfferId = await projects.getRemovalOfferCounter()
    const removalOfferDetails = await projects.viewRemovalOfferDetails(removalOfferId)

    expect(removalOfferDetails[0]).to.equal(removalOfferId)
    expect(removalOfferDetails[1]).to.equal(projectId)
    expect(removalOfferDetails[2]).to.equal(removalProposerAccount.address)
    expect(removalOfferDetails[5]).to.be.true 
  })

  it ("Should allow members to rate the managment removal offer", async function () {
    for (let i = 0; i < 3; i++) {
      if (accounts[i] == projectManagerAccount) continue;
      await projects.connect(accounts[i]).rateRemovalOffer(removalOfferId, 9)
    }
   
    const removalOfferDetails = await projects.viewRemovalOfferDetails(removalOfferId)
   
    expect(removalOfferDetails[3]).to.equal(18) // Total Ratings
    expect(removalOfferDetails[4]).to.equal(2) // Total number of raters

    projectManager = await projects.getProjectManager(projectId)
    expect(projectManager).to.equal(projectManagerAccount.address)
  })
  
  it('Should remove the project manager if the removal offer is successful', async function () {
    await projects.connect(accounts[5]).rateRemovalOffer(removalOfferId, 8);

    const removalOfferDetailsReCheck = await projects.viewRemovalOfferDetails(removalOfferId)

    expect(removalOfferDetailsReCheck[3]).to.equals(26)
    expect(removalOfferDetailsReCheck[4]).to.equals(3)

    // Remove the project manager
    await projects.removeProjectManager(removalOfferId)

    // Verify that the project manager has been removed
    const projectManager = await projects.getProjectManager(projectId)
    const projectDetails = await projects.viewProjectDetails(projectId)
    const removalOfferDetails = await projects.viewRemovalOfferDetails(removalOfferId)
    expect(projectManager).to.equal('0x0000000000000000000000000000000000000000');
    expect(projectDetails[1]).to.equal(true) // isOpenForManagementProposals should be true
    expect(projectDetails[2]).to.equal(false)
    expect(removalOfferDetails[5]).to.equal(false) // isOpenForRemovalRating should be false
  })

  it("Should allow new manager to be elected after one is removed", async function () {
    newPM = accounts[5]
    newRPA = accounts[3]
    await projects.connect(newPM).proposeOffer(solutionId)
    offerId = await projects.getOfferCounter()
    const offerDetails = projects.viewOfferDetails(offerId)

    // expect(offerDetails[0]).to.equal(offerId)
    // expect(offerDetails[1]).to.equal(projectId)
    expect(offerDetails[2]).to.equal(newPM.address)
    expect(offerDetails[5]).to.be.true
    
    for (let i = 0; i < 4; i++) {
      await projects.connect(accounts[i]).rateOffer(offerId, 9)
    }
    projects.assignProjectManager(projectId)

    await projects.connect(newRPA).proposeRemoveManager(projectId);
    removalOfferId = await projects.getRemovalOfferCounter()
    const removalOfferDetails = await projects.viewRemovalOfferDetails(removalOfferId)
    const projectManager = await projects.getProjectManager()

    expect(removalOfferDetails[0]).to.equal(removalOfferId)
    expect(removalOfferDetails[1]).to.equal(projectId)
    expect(removalOfferDetails[2]).to.equal(newRPA)
    expect(removalOfferDetails[5]).to.be.true
    expect(projectManager).to.equal(newPM)
  })
})