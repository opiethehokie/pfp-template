require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require('truffle-hdwallet-provider-privkey');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(['deployer private key'], `https://rinkeby.infura.io/v3/d458c7d43d474c5b85c10d15172026b9`),
      network_id: 4
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
