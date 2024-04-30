require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('dotenv').config({ path: require('find-config')('.env') })


/** @type import('hardhat/config').HardhatUserConfig */
const sepoliaURL = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
const PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY
const etherscanAPIKey = process.env.ETHERSCAN_API_KEY

module.exports = {
  solidity: "0.8.24",
  networks: {
    localhost: {},
    sepolia: {
      url: sepoliaURL,
      accounts: [PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: etherscanAPIKey
  },
  sourcify: {
    enabled: true
  }
}
