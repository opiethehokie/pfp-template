# smart-marketplace

Template for PFP NFTs. Demonstrates how to create PNGs from layers and store them on IPFS with the necessary metadata. Contains a smart contract for minting the NFTs and a web app for interacting with the contract. Example purposes only.

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

Generate images:
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

Post-minting as contract owner:
* edit collection on OpenSea (images, description, royalties, etc.)
* claim ETH e.g. via `npx truffle console`
* renounce ownership e.g. via `npx truffle console`

TODOs:
* terms (like BAYC)
* way to do air drop and combine with originals to create something new (like MAYC)
