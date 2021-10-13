# smart-marketplace

Customization of https://github.com/dappuniversity/marketplace which is used in the https://www.dappuniversity.com/articles/how-to-build-a-blockchain-app tutorial.

Prereqs:

* install http://truffleframework.com/ganache local blockchain
* install https://nodejs.org/en/
* browser with Ethereum wallet like Metamask

Setup:
* clone this repo and run `npm install`
* add Ganache to wallet networks
* import frist three Ganache addresses to wallet for testing (deployer, seller and buyer)
* https://infura.io/ account and project
* get fake ETH for the three users on Rinkeby test network

Development:
* compile smart contracts: `npx truffle compile`
* re-deploy smart contracts to Ganache personal blockchain: `npx truffle migrate --reset`
* run smart contract tests: `npx truffle test`
* run web app locally: `npm run start`
* re-deploy web app: update package.json homepage URL and `npm run deploy`
* re-deploy smart contracts to Rinkeby test network: update config in truffle-config.js and `npx truffle migrate --network rinkeby --reset` with optional `--dry-run` flag
