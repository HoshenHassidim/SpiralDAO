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
        const TokenManagement = await ethers.getContractFactory("TokenManagement")
        const Membership = await ethers.getContractFactory("Membership")

        tokenManagement = await TokenManagement.deploy()
        await tokenManagement.deployed()

        membership = await Membership.deploy(tokenManagement.address)
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

    describe("changeUsername", function () {
        it("Should change username successfully", async function () {
            let oldUsername = "deployer"
            let newUsername = "NewName"
            await membership.connect(deployer).registerMember(oldUsername)
            await membership.connect(deployer).changeName(newUsername)
            let isTaken = await membership.isUsernameTaken(oldUsername)
            let isName = await membership.isUsernameTaken(newUsername)
            expect(isTaken).to.be.false
            expect(isName).to.be.true
        })

        it("Should not change to taken username", async function () {
            let oldUsername = "deployer"
            let newUsername = "NewName"
            await membership.connect(deployer).registerMember(oldUsername)
            await membership.connect(addr1).registerMember(newUsername)
            await expect(membership.connect(addr1).changeName(oldUsername)).to.be.revertedWith(
               "UsernameAlreadyExists" 
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
            for (let i = 1; i <= 5; i++) expect(userDetails[i]).to.equal(0)
        })
    })
})
