const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Solutions', function () {
    let membershipContract;
    let problemsContract;
    let solutionsContract;
    let owner;
    let member1;
    let member2;

    beforeEach(async function () {
        [owner, member1, member2] = await ethers.getSigners();

        const Membership = await ethers.getContractFactory('Membership');
        membershipContract = await Membership.deploy();
        await membershipContract.deployed();

        const Problems = await ethers.getContractFactory('Problems');
        problemsContract = await Problems.deploy(membershipContract.address);
        await problemsContract.deployed();

        const Solutions = await ethers.getContractFactory('Solutions');
        solutionsContract = await Solutions.deploy(membershipContract.address, problemsContract.address);
        await solutionsContract.deployed();
    });

    describe('Propose Solution', function () {
        it('should allow a member to propose a solution', async function () {
            const problemId = 1;
            const solutionName = 'My Solution';

            await membershipContract.registerMember('Member1');
            await problemsContract.raiseProblem('My Problem');

            await solutionsContract.connect(member1).proposeSolution(problemId, solutionName);

            const solutionDetails = await solutionsContract.viewSolutionDetails(1);
            expect(solutionDetails.creator).to.equal(member1.address);
            expect(solutionDetails.name).to.equal(solutionName);
        });

        it('should revert if the problem ID is invalid', async function () {
            const invalidProblemId = 999;
            const solutionName = 'My Solution';

            await membershipContract.registerMember('Member1');

            await expect(
                solutionsContract.connect(member1).proposeSolution(invalidProblemId, solutionName)
            ).to.be.revertedWith('invalidID');
        });

        it('should revert if the solution name is empty', async function () {
            const problemId = 1;
            const solutionName = '';

            await membershipContract.registerMember('Member1');
            await problemsContract.raiseProblem('My Problem');

            await expect(
                solutionsContract.connect(member1).proposeSolution(problemId, solutionName)
            ).to.be.revertedWith('nameCannotBeEmpty');
        });

        it('should revert if the solution name already exists', async function () {
            const problemId = 1;
            const solutionName = 'My Solution';

            await membershipContract.registerMember('Member1');
            await problemsContract.raiseProblem('My Problem');

            await solutionsContract.connect(member1).proposeSolution(problemId, solutionName);

            await expect(
                solutionsContract.connect(member1).proposeSolution(problemId, solutionName)
            ).to.be.revertedWith('nameAlreadyExists');
        });

        it('should revert if the problem does not meet the rating criteria', async function () {
            const problemId = 1;
            const solutionName = 'My Solution';

            await membershipContract.registerMember('Member1');
            await problemsContract.raiseProblem('My Problem');

            await expect(
                solutionsContract.connect(member1).proposeSolution(problemId, solutionName)
            ).to.be.revertedWith('problemDoesNotMeetCriteria');
        });
    });

    describe('Cancel Solution', function () {
        beforeEach(async function () {
            await membershipContract.registerMember('Member1');
            await problemsContract.raiseProblem('My Problem');
            await solutionsContract.connect(member1).proposeSolution(1, 'My Solution');
        });

        it('should allow the creator to cancel the solution', async function () {
            await solutionsContract.connect(member1).cancelSolution(1);

            const solutionDetails = await solutionsContract.viewSolutionDetails(1);
            expect(solutionDetails.isOpenForRating).to.be.false;
        });

        it('should revert if the solution ID is invalid', async function () {
            const invalidSolutionId = 999;

            await expect(
                solutionsContract.connect(member1).cancelSolution(invalidSolutionId)
            ).to.be.revertedWith('invalidID');
        });

        it('should revert if the solution is not open for rating', async function () {
            await solutionsContract.connect(member1).rateSolution(1, 5);

            await expect(
                solutionsContract.connect(member1).cancelSolution(1)
            ).to.be.revertedWith('solutionAlreadyRated');
        });

        it('should revert if a non-creator tries to cancel the solution', async function () {
            await expect(
                solutionsContract.connect(member2).cancelSolution(1)
            ).to.be.revertedWith('onlySolutionCreatorCanPerform');
        });
    });

    describe('Change Solution Name', function () {
        beforeEach(async function () {
            await membershipContract.registerMember('Member1');
            await problemsContract.raiseProblem('My Problem');
            await solutionsContract.connect(member1).proposeSolution(1, 'My Solution');
        });

        it('should allow the creator to change the solution name', async function () {
            const newSolutionName = 'New Solution Name';

            await solutionsContract.connect(member1).changeSolutionName(1, newSolutionName);

            const solutionDetails = await solutionsContract.viewSolutionDetails(1);
            expect(solutionDetails.name).to.equal(newSolutionName);
        });

        it('should revert if the solution ID is invalid', async function () {
            const invalidSolutionId = 999;
            const newSolutionName = 'New Solution Name';

            await expect(
                solutionsContract.connect(member1).changeSolutionName(invalidSolutionId, newSolutionName)
            ).to.be.revertedWith('invalidID');
        });

        it('should revert if the new solution name is empty', async function () {
            const newSolutionName = '';

            await expect(
                solutionsContract.connect(member1).changeSolutionName(1, newSolutionName)
            ).to.be.revertedWith('nameCannotBeEmpty');
        });

        it('should revert if the new solution name already exists', async function () {
            const newSolutionName = 'New Solution Name';

            await solutionsContract.connect(member1).proposeSolution(1, newSolutionName);

            await expect(
                solutionsContract.connect(member1).changeSolutionName(1, newSolutionName)
            ).to.be.revertedWith('nameAlreadyExists');
        });

        it('should revert if a non-creator tries to change the solution name', async function () {
            const newSolutionName = 'New Solution Name';

            await expect(
                solutionsContract.connect(member2).changeSolutionName(1, newSolutionName)
            ).to.be.revertedWith('onlySolutionCreatorCanPerform');
        });

        it('should revert if the solution has already been rated', async function () {
            await solutionsContract.connect(member1).rateSolution(1, 5);

            const newSolutionName = 'New Solution Name';

            await expect(
                solutionsContract.connect(member1).changeSolutionName(1, newSolutionName)
            ).to.be.revertedWith('solutonClosedForRating');
        });
    });

    describe('Rate Solution', function () {
        beforeEach(async function () {
            await membershipContract.registerMember('Member1');
            await membershipContract.registerMember('Member2');
            await problemsContract.raiseProblem('My Problem');
            await solutionsContract.connect(member1).proposeSolution(1, 'My Solution');
        });

        it('should allow a member to rate a solution', async function () {
            const rating = 7;

            await solutionsContract.connect(member2).rateSolution(1, rating);

            const solutionDetails = await solutionsContract.viewSolutionDetails(1);
            expect(solutionDetails.ratingSum).to.equal(rating);
            expect(solutionDetails.numberOfRaters).to.equal(1);
        });

        it('should revert if the solution ID is invalid', async function () {
            const invalidSolutionId = 999;
            const rating = 7;

            await expect(
                solutionsContract.connect(member2).rateSolution(invalidSolutionId, rating)
            ).to.be.revertedWith('invalidID');
        });

        it('should revert if the solution is closed for rating', async function () {
            const rating = 7;

            await solutionsContract.connect(member1).rateSolution(1, rating);

            await expect(
                solutionsContract.connect(member2).rateSolution(1, rating)
            ).to.be.revertedWith('solutonClosedForRating');
        });

        it('should revert if the member has already rated the solution', async function () {
            const rating1 = 7;
            const rating2 = 8;

            await solutionsContract.connect(member2).rateSolution(1, rating1);

            await expect(
                solutionsContract.connect(member2).rateSolution(1, rating2)
            ).to.be.revertedWith('solutionAlreadyRated');
        });

        it('should revert if the creator tries to rate their own solution', async function () {
            const rating = 7;

            await expect(
                solutionsContract.connect(member1).rateSolution(1, rating)
            ).to.be.revertedWith('creatorCannotRateOwnProblem');
        });

        it('should revert if the rating is out of range', async function () {
            const invalidRating = 11;

            await expect(
                solutionsContract.connect(member2).rateSolution(1, invalidRating)
            ).to.be.revertedWith('ratingOutOfRange');
        });
    });

    describe('Can Become Project', function () {
        it('should return false if the solution does not meet the rating requirements', async function () {
            await membershipContract.registerMember('Member1');
            await membershipContract.registerMember('Member2');
            await problemsContract.raiseProblem('My Problem');
            await solutionsContract.connect(member1).proposeSolution(1, 'Solution1');
            await solutionsContract.connect(member2).proposeSolution(1, 'Solution2');

            const canBecomeProject = await solutionsContract.canBecomeProject(1);
            expect(canBecomeProject).to.be.false;
        });

        it('should return false if the total ratings for the problem do not meet the requirements', async function () {
            await membershipContract.registerMember('Member1');
            await membershipContract.registerMember('Member2');
            await problemsContract.raiseProblem('My Problem');
            await solutionsContract.connect(member1).proposeSolution(1, 'Solution1');
            await solutionsContract.connect(member2).proposeSolution(1, 'Solution2');
            await solutionsContract.connect(member1).rateSolution(1, 8);
            await solutionsContract.connect(member2).rateSolution(1, 6);

            const canBecomeProject = await solutionsContract.canBecomeProject(1);
            expect(canBecomeProject).to.be.false;
        });

        it('should return true if the solution meets all rating and total rating requirements', async function () {
            await membershipContract.registerMember('Member1');
            await membershipContract.registerMember('Member2');
            await membershipContract.registerMember('Member3');
            await problemsContract.raiseProblem('My Problem');
            await solutionsContract.connect(member1).proposeSolution(1, 'Solution1');
            await solutionsContract.connect(member2).proposeSolution(1, 'Solution2');
            await solutionsContract.connect(member3).proposeSolution(1, 'Solution3');
            await solutionsContract.connect(member1).rateSolution(1, 8);
            await solutionsContract.connect(member2).rateSolution(1, 9);
            await solutionsContract.connect(member3).rateSolution(1, 7);

            const canBecomeProject = await solutionsContract.canBecomeProject(1);
            expect(canBecomeProject).to.be.true;
        });
    });
});
