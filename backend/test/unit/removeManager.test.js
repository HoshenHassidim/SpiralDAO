const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("removeManager", function () {
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

    for (let i = 0; i < 8; i++) {
      const name = String(i)
      await membership.connect(accounts[i]).registerMember(name)
    }

    await problems.connect(accounts[0]).raiseProblem("Problem 1")
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
