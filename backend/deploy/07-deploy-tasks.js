const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    const membership = await get("Membership")
    const projects = await get("Projects")
    const tokenManagement = await get("TokenManagement")
    const authorizationManagement = await get("AuthorizationManagement")
    const arguments = [
        membership.address,
        projects.address,
        tokenManagement.address,
        authorizationManagement.address,
    ]
    const tasks = await deploy("Tasks", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.FTMSCAN_API_KEY) {
        log("Verifying...")
        await verify(tasks.address, arguments)
    }
}

module.exports.tags = ["all", "tasks", "main"]
