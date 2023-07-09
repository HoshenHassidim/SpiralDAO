const hre = require("hardhat")
const ethers = hre.ethers

async function main() {
    // Get the ContractFactory for our Membership contract
    const Membership = await hre.ethers.getContractFactory("Membership")

    // Deploy the contract
    const membership = await Membership.deploy()
    await membership.deployed()
    console.log("Membership contract deployed to:", membership.address)

    // Get the signers
    const [owner, addr1] = await ethers.getSigners()

    // Register a member using addr1
    const tx = await membership.connect(addr1).registerMember("username")
    console.log("Transaction submitted")

    // Wait for the transaction to be mined
    const receipt = await tx.wait()
    console.log("Transaction has been mined")

    // Parse the event from the transaction receipt
    const event = receipt.events?.filter((x) => {
        return x.event == "MemberRegistered"
    })[0]

    if (event) {
        const memberAddress = event.args.memberAddress
        console.log("MemberRegistered event found, memberAddress:", memberAddress)
        console.log(addr1.address)
    } else {
        console.log("No MemberRegistered event found")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
