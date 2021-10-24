# smart-marketplace

Customization of https://github.com/dappuniversity/marketplace and https://github.com/dappuniversity/nft which are used in https://www.dappuniversity.com/ tutorials.

Prereqs:

* install http://truffleframework.com/ganache local blockchain
* install https://nodejs.org/en/
* browser with Ethereum wallet like Metamask

Misc Setup:
* clone this repo and run `npm install`
* add Ganache to wallet networks
* import first Ganache addresses to wallet for testing
* https://infura.io/ account and project
* get fake ETH for the test user on the Rinkeby test network

Generate NFT art:
* `npx nft-generate`

Contract Development:
* compile: `npx truffle compile`
* re-deploy to Ganache personal blockchain: `npx truffle migrate --reset`
* run tests: `npx truffle test`
* re-deploy to Rinkeby test network: set env var `RINKEBY_PRIVATE_KEY` and `npx truffle migrate --network rinkeby --reset` with optional `--dry-run` flag

Webapp Development:
* run locally: `npm run start`
* re-deploy to GitHub pages: update package.json homepage URL and `npm run deploy`

Verification:
* TODO smart contract
* TODO view on OpenSea
