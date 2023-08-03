const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const arguments = []
    log("----------------------------------------------------")
    const authorizationManagement = await deploy("AuthorizationManagement", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.FTMSCAN_API_KEY) {
        log("Verifying...")
        await verify(authorizationManagement.address, arguments)
    }
}

module.exports.tags = ["all", "authorization", "main"]
