const Marketplace = artifacts.require('./Marketplace.sol')

require('chai').use(require('chai-as-promised')).should()

contract('Marketplace', ([deployer, seller, buyer]) => {
  let marketplace

  before(async () => {
    marketplace = await Marketplace.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await marketplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await marketplace.name()
      assert.equal(name, 'smart marketplace')
    })
  })

  describe('products', async () => {
    let result, productCount

    before(async () => {
      await marketplace.createProduct('iPhone 7', web3.utils.toWei('.5', 'Ether'), { from: seller })
      result = await marketplace.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), { from: seller })
      productCount = await marketplace.productCount()
    })

    it('creates products', async () => {
      await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
      await marketplace.createProduct('iPhone X', 0, { from: seller }).should.be.rejected;
      assert.equal(productCount, 2)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.visible, true, 'visible is correct')
    })

    it('hides products', async () => {
      await marketplace.hideProduct(productCount + 1, { from: seller }).should.be.rejected;
      await marketplace.hideProduct(productCount, { from: buyer }).should.be.rejected;
      result = await marketplace.hideProduct(productCount, { from: seller })
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.visible, false, 'visible is correct')
    })

    it('sells products', async () => {
      let price
      price = web3.utils.toWei('.5', 'Ether')
      price = new web3.utils.BN(price)
      await marketplace.purchaseProduct(99, { from: buyer, value: price }).should.be.rejected; // product doesn't exist
      await marketplace.purchaseProduct(1, { from: buyer, value: web3.utils.toWei('0.1', 'Ether') }).should.be.rejected; // not enough ether
      await marketplace.purchaseProduct(1, { from: seller, value: price }).should.be.rejected; // buyer can't be seller
      await marketplace.purchaseProduct(2, { from: seller, value: price }).should.be.rejected; // product not visible
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)
      result = await marketplace.purchaseProduct(1, { from: buyer, value: price })
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone 7', 'name is correct')
      assert.equal(event.price, '500000000000000000', 'price is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.visible, true, 'visible is correct')
      let newSellerBalance
      newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new web3.utils.BN(newSellerBalance)
      const exepectedBalance = oldSellerBalance.add(price)
      assert.equal(newSellerBalance.toString(), exepectedBalance.toString())
      await marketplace.purchaseProduct(productCount, { from: buyer, value: price }).should.be.rejected; // can't be purchased twice
    })
  })
})
