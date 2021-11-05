const MyCollectible = artifacts.require("MyCollectible");

module.exports = function (deployer) {
  deployer.deploy(MyCollectible, 'ipfs://QmaFqMdDwTmHxYGRDv5X35wekimj1dKTgpme1rbbQoqbqh', '5970ba04317e12a38770cf972f05698c94eb9251dd04cab393cd182569c7bfaf');
};