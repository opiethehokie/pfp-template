const { assert } = require('chai')

const MyCollectible = artifacts.require('./MyCollectible.sol')

require('chai').use(require('chai-as-promised')).should()

contract('MyCollectible', (accounts) => {
  let contract

  before(async () => {
    contract = await MyCollectible.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'MyCollectible')
    })

    it('has a symbol', async () => {
      const name = await contract.symbol()
      assert.equal(name, 'PFP')
    })

    it('has a URI', async () => {
      const tokenURI = await contract.baseTokenURI()
      assert.equal(tokenURI, 'testuri')
    })

    it('has a provenance hash', async () => {
      const name = await contract.provenanceHash()
      assert.equal(name, 'testhash')
    })
  })

  describe('permissions', async () => {
    it('only owner can pause', async () => {
      await contract.pause(true, { from: accounts[2] }).should.be.rejectedWith('caller is not the owner')
      await contract.pause(false, { from: accounts[2] }).should.be.rejectedWith('caller is not the owner')
    })

    it('only owner can withdraw a balance', async () => {
      await contract.withdrawAll({ from: accounts[2] }).should.be.rejectedWith('caller is not the owner')
      await contract.withdrawAll().should.be.rejectedWith('No balance')
    })
  })

  describe('minting', async () => {
    it('only while sale is open', async () => {
      await contract.mint(accounts[1], 1, { value: web3.utils.toWei('.01', 'Ether') }).should.be.rejectedWith('token transfer while paused')
    })

    it('only one at a time', async () => {
      await contract.mint(accounts[1], 2, { value: web3.utils.toWei('.01', 'Ether') }).should.be.rejectedWith('Exceeds number')
    })

    it('does not mint below price', async () => {
      await contract.mint(accounts[1], 1, { value: web3.utils.toWei('.001', 'Ether') }).should.be.rejectedWith('Value below price')
    })

    it('creates new tokens up to limits', async () => {
      await contract.pause(false)
      const result = await contract.mint(accounts[1], 1, { value: web3.utils.toWei('.01', 'Ether') })
      assert.equal(await contract.totalMint(), 1)
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 0)
      assert.equal(event.from, '0x0000000000000000000000000000000000000000')
      assert.equal(event.to, accounts[1])
      await contract.mint(accounts[1], 1, { value: web3.utils.toWei('.01', 'Ether') })
      await contract.mint(accounts[1], 1, { value: web3.utils.toWei('.01', 'Ether') })
      await contract.mint(accounts[1], 1, { value: web3.utils.toWei('.01', 'Ether') })
      await contract.mint(accounts[1], 1, { value: web3.utils.toWei('.01', 'Ether') })
      await contract.mint(accounts[1], 1, { value: web3.utils.toWei('.01', 'Ether') })
      await contract.mint(accounts[1], 2, { value: web3.utils.toWei('.01', 'Ether') }).should.be.rejectedWith('Max limit')
      await contract.mint(accounts[1], 1, { value: web3.utils.toWei('.01', 'Ether') })
      await contract.mint(accounts[1], 1, { value: web3.utils.toWei('.01', 'Ether') }).should.be.rejectedWith('Sale end')
      const totalMint = await contract.totalMint()
      assert.equal(totalMint, 7)
    })
  })

  describe('withdraw', async () => {
    it('sends full balance', async () => {
      const oldOwnerBalance = new web3.utils.BN(await web3.eth.getBalance(accounts[0]))
      const totalMint = await contract.totalMint()
      const value = await contract.price(totalMint)
      const gas = new web3.utils.BN(5.9494 * 10**14)
      await contract.withdrawAll()
      const newOwnerBalance = new web3.utils.BN(await web3.eth.getBalance(accounts[0]))
      const expectedBalance = oldOwnerBalance.add(value).sub(gas)
      assert.equal(newOwnerBalance.toString(), expectedBalance.toString())
      assert.isTrue(newOwnerBalance.toString() > oldOwnerBalance.toString())
    })
  })

  describe('token ownership', async () => {
    it('knows what token ids belong to a wallet', async () => {
      const collectibles = await contract.walletOfOwner(accounts[1])
      assert.equal(collectibles.length, 7)
      collectibles.forEach((collectible, i) => {
        assert.equal(collectible.toString(), i)
      })
    });
  });
})
