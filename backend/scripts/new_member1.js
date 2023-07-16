const hre = require("hardhat")
const { ethers } = hre

async function main() {
    // Get the ContractFactory for our Membership contract
    const Membership = await hre.ethers.getContractFactory("Membership")

    // Deploy the contract
    const membership = await Membership.deploy()
    await membership.deployed()
    console.log("Membership contract deployed to:", membership.address)

    // Create a new signer using the Fantom Testnet private key
    const fantomSigner = new ethers.Wallet(process.env.FANTOM_TESTNET_PRIVATE_KEY, ethers.provider)

    // Register a new member using fantomSigner
    const tx = await membership.connect(fantomSigner).registerMember("member1")
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
    } else {
        console.log("No MemberRegistered event found")
    }

    // Get member's username
    const memberUsername = await membership.connect(fantomSigner).getMember(fantomSigner.address)
    console.log("The member's username is:", memberUsername)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
