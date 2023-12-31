const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    const membership = await get("Membership")
    const authorizationManagement = await get("AuthorizationManagement")
    const solutions = await get("Solutions")
    const tokenManagement = await get("TokenManagement")
    const arguments = [
        membership.address,
        authorizationManagement.address,
        solutions.address,
        tokenManagement.address,
    ]
    const projects = await deploy("Projects", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.FTMSCAN_API_KEY) {
        log("Verifying...")
        await verify(projects.address, arguments)
    }
}

module.exports.tags = ["all", "projects", "main"]
