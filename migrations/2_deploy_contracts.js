const MyCollectible = artifacts.require("MyCollectible");

module.exports = function (deployer) {
  deployer.deploy(MyCollectible);
};