const { frontEndContractsFile, frontEndAbiLocation } = require("../helper-hardhat-config")
require("dotenv").config()
const fs = require("fs")
const { network } = require("hardhat")

const Contracts = ["Membership", "Problems", "Solutions", "TokenManagement", "Projects", "Tasks"]

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { get } = deployments

    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        for (let index = 0; index < Contracts.length; index++) {
            try {
                await updateContractAddresses(Contracts[index], get)
                await updateAbi(Contracts[index], get)
            } catch (error) {
                console.error(`Error updating contract ${Contracts[index]}: ${error}`)
            }
        }

        console.log("Front end written!")
    }

    async function updateAbi(Contract, get) {
        const contractInstance = await get(Contract)
        fs.writeFileSync(
            `${frontEndAbiLocation}${Contract}.json`,
            JSON.stringify(contractInstance.abi)
        )
    }

    async function updateContractAddresses(Contract, get) {
        const chainId = network.config.chainId.toString()
        const contractInstance = await get(Contract)
        const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))

        if (!(chainId in contractAddresses)) {
            contractAddresses[chainId] = {}
        }
        if (!(Contract in contractAddresses[chainId])) {
            contractAddresses[chainId][Contract] = []
        }

        if (!contractAddresses[chainId][Contract].includes(contractInstance.address)) {
            contractAddresses[chainId][Contract].push(contractInstance.address)
        }

        fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
    }
}

module.exports.tags = ["all", "frontend"]
