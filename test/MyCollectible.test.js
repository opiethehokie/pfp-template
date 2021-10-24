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
      assert.equal(name, 'MYCOLLECTIBLE')
    })
  })

  describe('minting', async () => {
    it('creates a new token', async () => {
      const result = await contract.mint('#EC058E')
      const totalSupply = await contract.totalSupply()
      assert.equal(totalSupply, 1)
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1)
      assert.equal(event.from, '0x0000000000000000000000000000000000000000')
      assert.equal(event.to, accounts[0])
      await contract.mint('#EC058E').should.be.rejected
    })
  })

  describe('indexing', async () => {
    it('lists collectibles', async () => {
      await contract.mint('#5386E4')
      await contract.mint('#FFFFFF')
      await contract.mint('#000000')
      const totalSupply = await contract.totalSupply()
      const result = []
      for (var i = 0; i < totalSupply; i++) {
        const collectible = await contract.collectibles(i)
        result.push(collectible)
      }
      assert.equal(result.join(','), ['#EC058E', '#5386E4', '#FFFFFF', '#000000'].join(','))
    })
  })

})
