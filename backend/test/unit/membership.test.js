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

    describe("registerMember", function () {
        it("Should register a new member successfully", async function () {
            await membership.connect(deployer).registerMember("deployer")
            let isMember = await membership.isRegisteredMember(deployerAddress)
            expect(isMember).to.equal(true)
        })

        it("Should not register a member with an existing username", async function () {
            await membership.connect(deployer).registerMember("common")
            await expect(membership.connect(addr1).registerMember("common")).to.be.revertedWith(
                "UsernameAlreadyExists"
            )
        })

        it("Should not register a member twice", async function () {
            await membership.connect(deployer).registerMember("deployer")
            await expect(
                membership.connect(deployer).registerMember("deployer")
            ).to.be.revertedWith("AlreadyMember")
        })
    })

    describe("unregisterMember", function () {
        it("Should unregister a member successfully", async function () {
            await membership.connect(deployer).registerMember("deployer")
            await membership.connect(deployer).unregisterMember()
            let isMember = await membership.isRegisteredMember(deployerAddress)
            expect(isMember).to.equal(false)
        })

        it("Should not unregister a non-member", async function () {
            await expect(membership.connect(deployer).unregisterMember()).to.be.revertedWith(
                "NotMember"
            )
        })
    })

    describe("isRegisteredMember", function () {
        it("Should return false for non-member", async function () {
            let isMember = await membership.isRegisteredMember(deployerAddress)
            expect(isMember).to.equal(false)
        })

        it("Should return true for member", async function () {
            await membership.connect(deployer).registerMember("deployer")
            let isMember = await membership.isRegisteredMember(deployerAddress)
            expect(isMember).to.equal(true)
        })
    })

    describe("isUsernameTaken", function () {
        it("Should return false for non-taken username", async function () {
            let isTaken = await membership.isUsernameTaken("deployer")
            expect(isTaken).to.equal(false)
        })

        it("Should return true for taken username", async function () {
            await membership.connect(deployer).registerMember("deployer")
            let isTaken = await membership.isUsernameTaken("deployer")
            expect(isTaken).to.equal(true)
        })
    })

    describe("viewMemberDetails", function () {
        it("Should return the details of a member", async function () {
            await membership.connect(deployer).registerMember("deployer")
            let userDetails = await membership.viewMemberDetails(deployerAddress)
            expect(userDetails[0]).to.equal("deployer")
        })

        it("Should revert when attempting to get username of non-member", async function () {
            await expect(membership.viewMemberDetails(deployerAddress)).to.be.revertedWith(
                "NotMember"
            )
        })
    })
})
