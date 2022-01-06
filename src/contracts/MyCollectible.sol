// SPDX-License-Identifier: Apache-2.0

pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyCollectible is ERC721Enumerable, Ownable, ERC721Burnable, ERC721Pausable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;

    uint256 public constant MAX_COLLECTIBLES = 7;
    uint256 public constant MAX_BY_MINT = 1;
    uint256 public constant PRICE = 1 * 10**15; // 1 ETH is 10**18 WEI

    string public baseTokenURI;
    string public provenanceHash;

    event CreateMyCollectible(uint256 indexed id);

    constructor(string memory baseURI, string memory provenance) ERC721("MyCollectible", "PFP") {
        baseTokenURI = baseURI;
        provenanceHash = provenance;
        pause(true);
    }

    modifier saleIsOpen() {
        require(_totalSupply() < MAX_COLLECTIBLES, "Sale end");
        _;
    }

    function _totalSupply() internal view returns (uint256) {
        return _tokenIdTracker.current();
    }

    function totalMint() external view returns (uint256) {
        return _totalSupply();
    }

    function mint(address to, uint256 count) external payable saleIsOpen {
        require(_totalSupply() + count <= MAX_COLLECTIBLES, "Max limit");
        require(count <= MAX_BY_MINT, "Exceeds number");
        require(msg.value >= price(count), "Value below price");
        for (uint256 i = 0; i < count; i++) {
            _mintAnElement(to);
        }
    }

    function _mintAnElement(address to) private {
        uint256 id = _totalSupply();
        _tokenIdTracker.increment();
        _safeMint(to, id);
        emit CreateMyCollectible(id);
    }

    function price(uint256 count) public pure returns (uint256) {
        return PRICE.mul(count);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function walletOfOwner(address walletOwner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(walletOwner);
        uint256[] memory tokensId = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(walletOwner, i);
        }
        return tokensId;
    }

    function pause(bool val) public onlyOwner {
        if (val) {
            _pause();
            return;
        }
        _unpause();
    }

    function withdrawAll() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        address payable recipient = payable(address(msg.sender));
        recipient.transfer(balance);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
