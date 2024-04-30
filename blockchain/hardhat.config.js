require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */
const sepoliaURL = "https://sepolia.infura.io/v3/6bb5631acba044e8998f0117ec478bc4"
const PRIVATE_KEY = "99ed94c57b09d14a8864bcd0d4679d793f0dca130720f958fdc284baaea13b98"
const etherscanAPIKey = "EXVKPPKMR4BWCNC5KI6IUMGK4MFC9QNJIV"

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
