const hre = require("hardhat")
const { ethers } = hre

async function main() {
    // Get the ContractFactory for our Tasks contract
    const Tasks = await hre.ethers.getContractFactory("Tasks")

    // Assuming that the contract has been deployed, we connect to it using its deployed address
    // Replace "deployed_tasks_address" with the actual address
    const tasks = Tasks.attach("0xFf06f3C6158C3b80209d8Aa0F452Af9ea94eC3F6")

    // Create a new signer using the Fantom Testnet private key
    const fantomSigner = new ethers.Wallet(process.env.FANTOM_TESTNET_PRIVATE_KEY, ethers.provider)

    try {
        // Call the rateTaskOffer function with offerId 1 and rating 10
        const tx = await tasks.connect(fantomSigner).rateTaskOffer(3, 9)
        console.log("Transaction submitted")

        // Wait for the transaction to be mined
        const receipt = await tx.wait()
        console.log("Transaction has been mined")

        // Assuming that TaskOfferRated event is emitted when a task offer is rated
        const event = receipt.events?.filter((x) => {
            return x.event == "TaskOfferRated"
        })[0]

        if (event) {
            const offerId = event.args.offerId
            const rating = event.args.rating
            console.log(`TaskOfferRated event found, offerId: ${offerId}, rating: ${rating}`)
        } else {
            console.log("No TaskOfferRated event found")
        }
    } catch (error) {
        // If the transaction failed, log the error message
        console.error("Transaction failed:", error.message)

        // Check if the error contains a data field
        if (error.error && error.error.data) {
            const data = error.error.data

            // The first 10 characters of the data field is '0x' followed by the 4-byte function selector
            // The rest is the encoded revert reason
            const encodedReason = "0x" + data.slice(10)

            // Decode the revert reason
            const reason = ethers.utils.toUtf8String(encodedReason)

            console.error("Revert reason:", reason)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
