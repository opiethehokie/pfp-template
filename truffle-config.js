require('babel-register');
require('babel-polyfill');
require('dotenv').config()

const HDWalletProvider = require('truffle-hdwallet-provider-privkey');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider([process.env.INFURA_PROJECT_SECRET], `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`),
      network_id: 4
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "pragma",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
}
