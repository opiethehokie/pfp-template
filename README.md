# smart-marketplace

Customization of https://github.com/dappuniversity/marketplace and https://github.com/dappuniversity/nft which are used in https://www.dappuniversity.com/ tutorials.

Prereqs:

* install http://truffleframework.com/ganache local blockchain
* install https://nodejs.org/en/
* browser with Ethereum wallet like Metamask
* https://www.pinata.cloud/ account and API key (IPFS storage)
* https://infura.io/ account (deploying contract)
* https://etherscan.io/ account and API key (verifying contract)

Misc Setup:
* clone this repo and run `npm install`
* add Ganache to wallet networks
* import some Ganache addresses to wallet for testing
* get fake ETH for the test user(s) on the Rinkeby test network
* populate .env file

Generate NFT art:
* create layers in `images` directory
* combine layers into PNGs: `npx nft-generate`
* `node ipfs.js` to store PNGs and associated metadata on IPFS plus generate the base URI and provenance hash needed when deploying the contract 
* optional: submarine metadata  in the Pinata UI until some later date to prevent trait sniping

Contract Development:
* compile: `npx truffle compile`
* run tests: `npx truffle test`
* re-deploy to Ganache personal blockchain: `npx truffle migrate --reset`
* re-deploy to Rinkeby test network: `npx truffle migrate --network rinkeby --reset` with optional `--dry-run` flag
* verify contract: `npx truffle run verify MyCollectible --network rinkeby`

Webapp Development:
* run locally: `npm run start`
* unpause contract e.g. via `npx truffle console`
* re-deploy to GitHub pages: update package.json homepage URL and `npm run deploy`
