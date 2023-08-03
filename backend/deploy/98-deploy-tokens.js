const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const arguments = ["name", "sym", "0x0000000000000000000000000000000000000000"]
    log("----------------------------------------------------")
    const tokens = await deploy("Tokens", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.FTMSCAN_API_KEY) {
        log("Verifying...")
        await verify(tokens.address, arguments)
    }
}

// module.exports.tags = ["all", "tokens"]
