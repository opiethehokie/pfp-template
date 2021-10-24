// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MyCollectible is ERC721, ERC721Enumerable {
    string[] public collectibles;
    mapping(string => bool) _collectibleExists;

    constructor() ERC721("MyCollectible", "MYCOLLECTIBLE") {}

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    //TODO metadata
    //TODO checks around max, public, see https://github.com/steve-ng/pokerface-nft/blob/main/contracts/PokerFaces.sol
    function mint(string memory _collectible) public {
        require(!_collectibleExists[_collectible], 'Duplicate');
        collectibles.push(_collectible);
        uint256 _uid = collectibles.length;
        _mint(msg.sender, _uid);
        _collectibleExists[_collectible] = true;
    }
}
