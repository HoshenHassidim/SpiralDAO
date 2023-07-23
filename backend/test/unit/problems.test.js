// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Problems", function () {
//     let Problems;
//     let problems;
//     let Membership;
//     let membership;
//     let deployer;
//     let addr1;
//     let deployerAddress;
//     let addr1Address;

//     before(async function () {
//         Problems = await ethers.getContractFactory("Problems");
//         Membership = await ethers.getContractFactory("Membership");
//         [deployer, addr1] = await ethers.getSigners();

//         deployerAddress = await deployer.getAddress();
//         addr1Address = await addr1.getAddress();
//     });

//     beforeEach(async function () {
//         membership = await Membership.deploy();
//         await membership.deployed();

//         problems = await Problems.deploy(membership.address);
//         await problems.deployed();
//     });

//     describe("raiseProblem", function () {
//         it("Should raise a new problem successfully", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await problems.connect(deployer).raiseProblem("New Problem");

//             const problemDetails = await problems.viewProblemDetails(1);
//             expect(problemDetails[0]).to.equal(1); // Problem ID
//             expect(problemDetails[1]).to.equal(deployerAddress); // Creator address
//             expect(problemDetails[2]).to.equal("New Problem"); // Problem name
//             expect(problemDetails[3]).to.equal(0); // Rating sum
//             expect(problemDetails[4]).to.equal(0); // Rating count
//             expect(problemDetails[5]).to.equal(true); // Open for rating
//         });

//         it("Should revert when raising a problem with an empty name", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await expect(
//                 problems.connect(deployer).raiseProblem("")
//             ).to.be.revertedWith("nameRequired");
//         });

//         it("Should revert when raising a problem with an existing name", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await problems.connect(deployer).raiseProblem("New Problem");
//             await expect(
//                 problems.connect(addr1).raiseProblem("New Problem")
//             ).to.be.revertedWith("nameExists");
//         });
//     });

//     describe("cancelProblem", function () {
//         it("Should cancel a problem successfully", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await problems.connect(deployer).raiseProblem("New Problem");
//             await problems.connect(deployer).cancelProblem(1);

//             const problemDetails = await problems.viewProblemDetails(1);
//             expect(problemDetails[5]).to.equal(false); // Open for rating
//         });

//         it("Should revert when canceling a non-existent problem", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await expect(
//                 problems.connect(deployer).cancelProblem(1)
//             ).to.be.revertedWith("invalidProblemID");
//         });

//         it("Should revert when canceling a problem that has been rated", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await membership.connect(addr1).registerMember("addr1");
//             await problems.connect(deployer).raiseProblem("New Problem");
//             await problems.connect(addr1).rateProblem(1, 5);

//             await expect(
//                 problems.connect(deployer).cancelProblem(1)
//             ).to.be.revertedWith("problemAlreadyRated");
//         });
//     });

//     describe("rateProblem", function () {
//         it("Should rate a problem successfully", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await membership.connect(addr1).registerMember("addr1");
//             await problems.connect(deployer).raiseProblem("New Problem");
//             await problems.connect(addr1).rateProblem(1, 8);

//             const problemDetails = await problems.viewProblemDetails(1);
//             expect(problemDetails[3]).to.equal(8); // Rating sum
//             expect(problemDetails[4]).to.equal(1); // Rating count
//         });

//         it("Should revert when rating a non-existent problem", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await expect(
//                 problems.connect(deployer).rateProblem(1, 5)
//             ).to.be.revertedWith("invalidProblemID");
//         });

//         it("Should revert when rating a problem as the problem proposer", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await problems.connect(deployer).raiseProblem("New Problem");

//             await expect(
//                 problems.connect(deployer).rateProblem(1, 5)
//             ).to.be.revertedWith("problemProposerCannotRate");
//         });

//         it("Should revert when rating a problem after it has been closed for rating", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await membership.connect(addr1).registerMember("addr1");
//             await problems.connect(deployer).raiseProblem("New Problem");
//             await problems.connect(deployer).cancelProblem(1);

//             await expect(
//                 problems.connect(addr1).rateProblem(1, 7)
//             ).to.be.revertedWith("problemClosedForRating");
//         });

//         it("Should revert when rating a problem with an out-of-range rating", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await membership.connect(addr1).registerMember("addr1");
//             await problems.connect(deployer).raiseProblem("New Problem");

//             await expect(
//                 problems.connect(addr1).rateProblem(1, 15)
//             ).to.be.revertedWith("ratingOutOfRange");
//         });
//     });

//     describe("changeProblemName", function () {
//         it("Should change the name of a problem successfully", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await problems.connect(deployer).raiseProblem("Old Problem Name");
//             await problems.connect(deployer).changeProblemName(1, "New Problem Name");

//             const problemDetails = await problems.viewProblemDetails(1);
//             expect(problemDetails[2]).to.equal("New Problem Name"); // New problem name
//         });

//         it("Should revert when changing the name of a non-existent problem", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await expect(
//                 problems.connect(deployer).changeProblemName(1, "New Problem Name")
//             ).to.be.revertedWith("invalidProblemID");
//         });

//         it("Should revert when changing the name to an empty name", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await problems.connect(deployer).raiseProblem("Old Problem Name");

//             await expect(
//                 problems.connect(deployer).changeProblemName(1, "")
//             ).to.be.revertedWith("nameRequired");
//         });

//         it("Should revert when changing the name to an existing name", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await membership.connect(addr1).registerMember("addr1");
//             await problems.connect(deployer).raiseProblem("Old Problem Name");
//             await problems.connect(addr1).raiseProblem("Another Problem");
//             await expect(
//                 problems.connect(deployer).changeProblemName(1, "Another Problem")
//             ).to.be.revertedWith("userNameAlreadyExists");
//         });

//         it("Should revert when changing the name of a problem after it has been rated", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await membership.connect(addr1).registerMember("addr1");
//             await problems.connect(deployer).raiseProblem("Old Problem Name");
//             await problems.connect(addr1).rateProblem(1, 9);

//             await expect(
//                 problems.connect(deployer).changeProblemName(1, "New Problem Name")
//             ).to.be.revertedWith("cannotChangeNameAfterProblemHasBeenRated");
//         });

//         it("Should revert when changing the name of a problem by a non-creator member", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await membership.connect(addr1).registerMember("addr1");
//             await problems.connect(deployer).raiseProblem("Old Problem Name");

//             await expect(
//                 problems.connect(addr1).changeProblemName(1, "New Problem Name")
//             ).to.be.revertedWith("onlyCreatorCanChangeProblemName");
//         });
//     });

//     describe("meetsRatingCriteria", function () {
//         it("Should return false for a problem that doesn't meet the rating criteria", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await membership.connect(addr1).registerMember("addr1");
//             await problems.connect(deployer).raiseProblem("Problem 1");
//             await problems.connect(addr1).rateProblem(1, 6);

//             const meetsCriteria = await problems.meetsRatingCriteria(1);
//             expect(meetsCriteria).to.equal(false);
//         });

//         it("Should return true for a problem that meets the rating criteria", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await membership.connect(addr1).registerMember("addr1");
//             await membership.connect(addr1).registerMember("addr2");
//             await problems.connect(deployer).raiseProblem("Problem 1");
//             await problems.connect(addr1).rateProblem(1, 9);
//             await problems.connect(addr2).rateProblem(1, 8);

//             const meetsCriteria = await problems.meetsRatingCriteria(1);
//             expect(meetsCriteria).to.equal(true);
//         });

//         it("Should revert when checking the rating criteria for a non-existent problem", async function () {
//             await expect(
//                 problems.meetsRatingCriteria(1)
//             ).to.be.revertedWith("invalidProblemID");
//         });
//     });

//     describe("getProblemCounter", function () {
//         it("Should return the correct problem counter", async function () {
//             const problemCounter = await problems.getProblemCounter();
//             expect(problemCounter).to.equal(0);
//         });
//     });

//     describe("isProblemNameTaken", function () {
//         it("Should return false for a non-taken problem name", async function () {
//             const isTaken = await problems.isProblemNameTaken("New Problem");
//             expect(isTaken).to.equal(false);
//         });

//         it("Should return true for a taken problem name", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await problems.connect(deployer).raiseProblem("New Problem");

//             const isTaken = await problems.isProblemNameTaken("New Problem");
//             expect(isTaken).to.equal(true);
//         });
//     });

//     describe("getProblemCreator", function () {
//         it("Should return the correct creator address of a problem", async function () {
//             await membership.connect(deployer).registerMember("deployer");
//             await membership.connect(addr1).registerMember("addr1");
//             await problems.connect(deployer).raiseProblem("New Problem");

//             const creator = await problems.getProblemCreator(1);
//             expect(creator).to.equal(deployerAddress);
//         });

//         it("Should revert when getting the creator of a non-existent problem", async function () {
//             await expect(
//                 problems.getProblemCreator(1)
//             ).to.be.revertedWith("invalidProblemID");
//         });
//     });
// });
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Problems", function () {
    let Problems;
    let problems;
    let Membership;
    let membership;
    let deployer;
    let addr1;
    let addr2;
    let deployerAddress;
    let addr1Address;

    before(async function () {
        Problems = await ethers.getContractFactory("Problems");
        Membership = await ethers.getContractFactory("Membership");
        [deployer, addr1, addr2] = await ethers.getSigners();

        deployerAddress = await deployer.getAddress();
        addr1Address = await addr1.getAddress();
    });

    beforeEach(async function () {
        membership = await Membership.deploy();
        await membership.deployed();

        problems = await Problems.deploy(membership.address);
        await problems.deployed();
    });

    describe("raiseProblem", function () {
        it("Should raise a new problem successfully", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await problems.connect(deployer).raiseProblem("New Problem");

            const problemDetails = await problems.viewProblemDetails(1);
            expect(problemDetails[0]).to.equal(1); // Problem ID
            expect(problemDetails[1]).to.equal(deployerAddress); // Creator address
            expect(problemDetails[2]).to.equal("New Problem"); // Problem name
            expect(problemDetails[3]).to.equal(0); // Rating sum
            expect(problemDetails[4]).to.equal(0); // Rating count
            expect(problemDetails[5]).to.equal(true); // Open for rating
        });

        it("Should revert when raising a problem with an empty name", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await expect(
                problems.connect(deployer).raiseProblem("")
            ).to.be.revertedWith("nameRequired");
        });

        it("Should revert when raising a problem with an existing name", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await problems.connect(deployer).raiseProblem("New Problem");
            await expect(
                problems.connect(deployer).raiseProblem("New Problem")
            ).to.be.revertedWith("nameExists");
        });
    });

    describe("cancelProblem", function () {
        it("Should cancel a problem successfully", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await problems.connect(deployer).raiseProblem("New Problem");
            await problems.connect(deployer).cancelProblem(1);

            const problemDetails = await problems.viewProblemDetails(1);
            expect(problemDetails[5]).to.equal(false); // Open for rating
        });

        it("Should revert when canceling a non-existent problem", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await expect(
                problems.connect(deployer).cancelProblem(1)
            ).to.be.revertedWith("problemDoesNotExist");
        });

        it("Should revert when canceling a problem that has been rated", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await membership.connect(addr1).registerMember("addr1");
            await problems.connect(deployer).raiseProblem("New Problem");
            await problems.connect(addr1).rateProblem(1, 5);

            await expect(
                problems.connect(deployer).cancelProblem(1)
            ).to.be.revertedWith("problemAlreadyRated");
        });
    });

    describe("rateProblem", function () {
        it("Should rate a problem successfully", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await membership.connect(addr1).registerMember("addr1");
            await problems.connect(deployer).raiseProblem("New Problem");
            await problems.connect(addr1).rateProblem(1, 8);

            const problemDetails = await problems.viewProblemDetails(1);
            expect(problemDetails[3]).to.equal(8); // Rating sum
            expect(problemDetails[4]).to.equal(1); // Rating count
        });

        it("Should revert when rating a non-existent problem", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await expect(
                problems.connect(deployer).rateProblem(1, 5)
            ).to.be.revertedWith("invalidProblemID");
        });

        it("Should revert when rating a problem as the problem proposer", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await problems.connect(deployer).raiseProblem("New Problem");

            await expect(
                problems.connect(deployer).rateProblem(1, 5)
            ).to.be.revertedWith("problemProposerCannotRate");
        });

        it("Should revert when rating a problem after it has been closed for rating", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await membership.connect(addr1).registerMember("addr1");
            await problems.connect(deployer).raiseProblem("New Problem");
            await problems.connect(deployer).cancelProblem(1);

            await expect(
                problems.connect(addr1).rateProblem(1, 7)
            ).to.be.revertedWith("problemClosedForRating");
        });

        it("Should revert when rating a problem with an out-of-range rating", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await membership.connect(addr1).registerMember("addr1");
            await problems.connect(deployer).raiseProblem("New Problem");

            await expect(
                problems.connect(addr1).rateProblem(1, 15)
            ).to.be.revertedWith("ratingOutOfRange");
        });
    });

    describe("changeProblemName", function () {
        it("Should change the name of a problem successfully", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await problems.connect(deployer).raiseProblem("Old Problem Name");
            await problems.connect(deployer).changeProblemName(1, "New Problem Name");

            const problemDetails = await problems.viewProblemDetails(1);
            expect(problemDetails[2]).to.equal("New Problem Name"); // New problem name
        });

        it("Should revert when changing the name of a non-existent problem", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await expect(
                problems.connect(deployer).changeProblemName(1, "New Problem Name")
            ).to.be.revertedWith("invalidProblemID");
        });

        it("Should revert when changing the name to an empty name", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await problems.connect(deployer).raiseProblem("Old Problem Name");

            await expect(
                problems.connect(deployer).changeProblemName(1, "")
            ).to.be.revertedWith("nameRequired");
        });

        it("Should revert when changing the name to an existing name", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await membership.connect(addr1).registerMember("addr1");
            await problems.connect(deployer).raiseProblem("Old Problem Name");
            await problems.connect(addr1).raiseProblem("Another Problem");
            await expect(
                problems.connect(deployer).changeProblemName(1, "Another Problem")
            ).to.be.revertedWith("userNameAlreadyExists");
        });

        it("Should revert when changing the name of a problem after it has been rated", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await membership.connect(addr1).registerMember("addr1");
            await problems.connect(deployer).raiseProblem("Old Problem Name");
            await problems.connect(addr1).rateProblem(1, 9);

            await expect(
                problems.connect(deployer).changeProblemName(1, "New Problem Name")
            ).to.be.revertedWith("cannotChangeNameAfterProblemHasBeenRated");
        });

        it("Should revert when changing the name of a problem by a non-creator member", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await membership.connect(addr1).registerMember("addr1");
            await problems.connect(deployer).raiseProblem("Old Problem Name");

            await expect(
                problems.connect(addr1).changeProblemName(1, "New Problem Name")
            ).to.be.revertedWith("onlyCreatorCanChangeProblemName");
        });
    });

    describe("meetsRatingCriteria", function () {
        it("Should return false for a problem that doesn't meet the rating criteria", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await membership.connect(addr1).registerMember("addr1");
            await problems.connect(deployer).raiseProblem("Problem 1");
            await problems.connect(addr1).rateProblem(1, 6);

            const meetsCriteria = await problems.meetsRatingCriteria(1);
            expect(meetsCriteria).to.equal(false);
        });

        it("Should return true for a problem that meets the rating criteria", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await membership.connect(addr1).registerMember("addr1");
            await membership.connect(addr2).registerMember("addr2");
            await problems.connect(deployer).raiseProblem("Problem 1");
            await problems.connect(addr1).rateProblem(1, 9);
            await problems.connect(addr2).rateProblem(1, 8);

            const meetsCriteria = await problems.meetsRatingCriteria(1);
            expect(meetsCriteria).to.equal(true);
        });

        it("Should revert when checking the rating criteria for a non-existent problem", async function () {
            await expect(
                problems.meetsRatingCriteria(1)
            ).to.be.revertedWith("problemDoesNotExist");
        });
    });

    describe("getProblemCounter", function () {
        it("Should return the correct problem counter", async function () {
            const problemCounter = await problems.getProblemCounter();
            expect(problemCounter).to.equal(0);
        });
    });

    describe("isProblemNameTaken", function () {
        it("Should return false for a non-taken problem name", async function () {
            const isTaken = await problems.isProblemNameTaken("New Problem");
            expect(isTaken).to.equal(false);
        });

        it("Should return true for a taken problem name", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await problems.connect(deployer).raiseProblem("New Problem");

            const isTaken = await problems.isProblemNameTaken("New Problem");
            expect(isTaken).to.equal(true);
        });
    });

    describe("getProblemCreator", function () {
        it("Should return the correct creator address of a problem", async function () {
            await membership.connect(deployer).registerMember("deployer");
            await membership.connect(addr1).registerMember("addr1");
            await problems.connect(deployer).raiseProblem("New Problem");

            const creator = await problems.getProblemCreator(1);
            expect(creator).to.equal(deployerAddress);
        });

        it("Should revert when getting the creator of a non-existent problem", async function () {
            await expect(
                problems.getProblemCreator(1)
            ).to.be.revertedWith("invalidProblemID");
        });
    });
});
