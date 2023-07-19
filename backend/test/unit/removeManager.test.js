const { expect } = require('chai');

describe("removeManager", function () {
  let problems, solutions, membership, tokenManagement, projects, tasks
  let accounts, projectManagerAccount, projectId, removalOfferId, removalProposerAccount

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

    projectManagerAccount = accounts[2]
    await projects.connect(projectManagerAccount).proposeOffer(1)
    const offerId = await projects.getOfferCounter()
    for (let i = 3; i < 7; i++) {
      await projects.connect(accounts[i]).rateOffer(offerId, 9)
    }
    projectId = solutionId
    projects.assignProjectManager(projectId)
    removalProposerAccount = accounts[0]
  })

  it('is it working?', async function () {
    const manager = await projects.getProjectManager(projectId)
    expect(manager).to.equal(projectManagerAccount.address)
  })

  it('Should allow a member to propose the removal of a project manager', async function (){
    //!!! Something is very wrong here, proposeRemoveManager should be members only
    await projects.proposeRemoveManager(projectId);

    removalOfferId = await projects.getRemovalOfferCounter()
    //!! This should not need to be called from a member     
    const removalOfferDetails = await projects.connect(removalProposerAccount).viewRemovalOfferDetails(removalOfferId)

    expect(removalOfferDetails[0]).to.equal(removalOfferId)
    expect(removalOfferDetails[1]).to.equal(projectId)
    expect(removalOfferDetails[2]).to.equal(removalProposerAccount.address)
    expect(removalOfferDetails[5]).to.be.true 
  })
 
  it ("Should allow members to rate the managment removal offer", async function () {
    for (let i = 0; i < 5; i++) {
      if (accounts[i] == projectManagerAccount) continue;
      projects.connect(accounts[i]).rateRemovalOffer(removalOfferId, 9)
    }
   
    // Issue with is line
    const removalOfferDetails = await projects.viewRemovalOfferDetails(removalOfferId)
    
    expect(removalOfferDetails[3]).to.equal(36) // Total Ratings
    expect(removalOfferDetails[4]).to.equal(4) // Total number of raters

    projectManager = await projects.getProjectManager(projectId)
    expect(projectManager).to.equal(projectManagerAccount.address)
  })
  it('should remove the project manager if the removal offer is successful', async function () {
    // Propose a removal offer
    await projects.proposeRemoveManager(projectId);
    const removalOffers = await projects.viewProjectOffers(projectId);

    expect(removalOffers).to.have.lengthOf(1);
    removalOfferId = removalOffers[0];

    // Rate the removal offer
    await projects.rateRemovalOffer(removalOfferId, 8);

    // Remove the project manager
    await projects.removeProjectManager(removalOfferId);

    // Verify that the project manager has been removed
    const projectManager = await projects.getProjectManager(projectId);
    const projectDetails = await projects.viewProjectDetails(projectId);
    expect(projectManager).to.equal('0x0000000000000000000000000000000000000000');
    expect(projectDetails[1]).to.equal(true); // isOpenForManagementProposals should be true
  });

  it('should not remove the project manager if the removal offer does not meet the rating threshold', async function () {
    // Propose a removal offer
    await projects.proposeRemoveManager(projectId);
    const removalOffers = await projects.viewProjectOffers(projectId);

    expect(removalOffers).to.have.lengthOf(1);
    removalOfferId = removalOffers[0];

    // Rate the removal offer with a low rating
    await projects.rateRemovalOffer(removalOfferId, 5);

    // Try to remove the project manager
    await expect(projects.removeProjectManager(removalOfferId)).to.be.revertedWith(
      'insufficientTotalRatersForAllOffers'
    );

    // Verify that the project manager has not been removed
    const projectManager = await projects.getProjectManager(projectId);
    const projectDetails = await projects.viewProjectDetails(projectId);
    expect(projectManager).to.equal(manager.address);
    expect(projectDetails[1]).to.equal(false); // isOpenForManagementProposals should be false
  });

  it('should revert if the proposer tries to remove the project manager before rating the removal offer', async function () {
    // Propose a removal offer
    await projects.proposeRemoveManager(projectId);
    const removalOffers = await projects.viewProjectOffers(projectId);

    expect(removalOffers).to.have.lengthOf(1);
    removalOfferId = removalOffers[0];

    // Try to remove the project manager without rating the removal offer
    await expect(projects.removeProjectManager(removalOfferId)).to.be.revertedWith('notOpenForRating');

    // Verify that the project manager has not been removed
    const projectManager = await projects.getProjectManager(projectId);
    const projectDetails = await projects.viewProjectDetails(projectId);
    expect(projectManager).to.equal(manager.address);
    expect(projectDetails[1]).to.equal(false); // isOpenForManagementProposals should be false
  });
});
