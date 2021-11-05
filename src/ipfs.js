const fs = require('fs');
const crypto = require('crypto');
const pinataSDK = require('@pinata/sdk');
require('dotenv').config()

const baseMetadata = require('../output/metadata.json');

const total = 7;
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

(async () => {
  const pngHashes = [];
  for (let i = 0; i < total; i++) {
    const name = `output/${i}.png`;
    const png = fs.readFileSync(`output/${i}.png`);
    const pngHash = crypto.createHash('sha256');
    pngHash.update(png);
    pngHashes.push(pngHash.digest('hex'))
    const pngPinResult = await pinata.pinFromFS(name, {});
    const metadata = {
      image: `ipfs://${pngPinResult.IpfsHash}`,
      attributes: baseMetadata[i].attributes
    };
    fs.writeFileSync(`metadata/${i}`, JSON.stringify(metadata));
  }
  const metadataPinResult = await pinata.pinFromFS('metadata\\', {});
  console.log('base URI = ipfs://' + metadataPinResult.IpfsHash);
  const hash = crypto.createHash('sha256');
  hash.update(pngHashes.join(''));
  console.log('provenance hash = ' + hash.digest('hex'));
})();
