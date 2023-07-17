require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const FANTOM_TESTNET_RPC_URL =
    process.env.FANTOM_TESTNET_RPC_URL || "https://rpc.testnet.fantom.network"
const FANTOM_TESTNET_PRIVATE_KEY = process.env.FANTOM_TESTNET_PRIVATE_KEY
const FTMSCAN_API_KEY = process.env.FTMSCAN_API_KEY
const FANTOM_TESTNET_ADDRESS = process.env.FANTOM_TESTNET_ADDRESS

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            // chainId: 31337,
            // gasPrice: 130000000000,
        },
        fantomtest: {
            url: FANTOM_TESTNET_RPC_URL,
            accounts: [FANTOM_TESTNET_PRIVATE_KEY],
            chainId: 4002,
            saveDeployments: true,
            blockConfirmations: 6,
        },
        // sepolia: {
        //     url: SEPOLIA_RPC_URL,
        //     accounts: [PRIVATE_KEY],
        //     chainId: 11155111,
        //     blockConfirmations: 6,
        // },
        // mainnet: {
        //     url: process.env.MAINNET_RPC_URL,
        //     accounts: [PRIVATE_KEY],
        //     chainId: 1,
        //     blockConfirmations: 6,
        // },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.8",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    etherscan: {
        apiKey: {
            ftmTestnet: FTMSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
}
