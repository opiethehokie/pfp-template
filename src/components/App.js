import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MyCollectible from '../abis/MyCollectible.json'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      price: 0,
      mintedSoFar: 0,
      totalCollectibles: 0,
      provenanceHash: '',
      collectibles: [],
      openseaDomain: '',
      etherscanDomain: ''
    }
  }

  async componentDidMount() {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      window.web3 = new Web3(window.ethereum)
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. Consider trying MetaMask.')
      return
    }
    const accounts = await window.web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await window.web3.eth.net.getId()
    await this.loadContract(networkId)
    window.ethereum.on('accountsChanged', (newAccounts) => this.setState({ account: window.web3.utils.toChecksumAddress(newAccounts[0]) }))
    window.ethereum.on('chainChanged', (newNetworkId) => this.loadContract(parseInt(newNetworkId, 16)))
    this.sub = this.state.contract.events.CreateMyCollectible({}).on('data', () => this.loadBlockchainData())
  }

  async componentWillUnmount() {
    window.ethereum.removeListener('accountsChanged', this.state.account)
    window.ethereum.removeListener('chainChanged', this.state.account)
    this.sub.unsubscribe()
  }

  async loadContract(networkId) {
    networkId = networkId === 1337 ? 5777 : networkId
    const networkData = MyCollectible.networks[networkId]
    if (networkData) {
      const contract = new window.web3.eth.Contract(MyCollectible.abi, networkData.address)
      this.setState({ contract })
      const openseaDomain = networkId === 1 ? 'opensea.io' : 'testnets.opensea.io'
      this.setState({ openseaDomain })
      const etherscanDomain = networkId === 1 ? 'etherscan.io' : 'rinkeby.etherscan.io'
      this.setState({ etherscanDomain })
      await this.loadBlockchainData()
    } else {
      window.alert('MyCollectible contract not deployed to detected network.')
    }
  }

  async loadBlockchainData() {
    const mintedSoFar = await this.state.contract.methods.totalSupply().call()
    this.setState({ mintedSoFar })
    const totalCollectibles = await this.state.contract.methods.MAX_COLLECTIBLES().call()
    this.setState({ totalCollectibles })
    const provenanceHash = await this.state.contract.methods.provenanceHash().call()
    this.setState({ provenanceHash })
    const price = await this.state.contract.methods.price(1).call()
    this.setState({ price })
    const tokenIds = await this.state.contract.methods.walletOfOwner(this.state.account).call()
    const collectibles = await Promise.all(tokenIds.map(async tokenId => {
      const response = await fetch(`https://ipfs.io/ipfs/QmaFqMdDwTmHxYGRDv5X35wekimj1dKTgpme1rbbQoqbqh/${tokenId}`)
      const metadata = await response.json()
      return metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }))
    this.setState({ collectibles })
  }

  mint = () => {
    this.state.contract.methods.mint(this.state.account, 1).send({ from: this.state.account, value: this.state.price })
      .once('receipt', (receipt) => {
        console.log(receipt)
        this.setState({ mintedSoFar: this.state.mintedSoFar + 1 })
      })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="title">My Collectible</span></small>
            </li>
          </ul>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              {this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <div className="content">
                  <form className="input-group" onSubmit={(event) => {
                    event.preventDefault()
                    this.mint()
                  }}>
                    <button type="submit" className="btn btn-block btn-primary">MINT {this.state.price / 10 ** 18} ETH</button>
                  </form>
                  <span>{this.state.mintedSoFar}/{this.state.totalCollectibles}</span>
                </div>
              }
            </main>
          </div>
          <hr />
          <div className="row text-center">
            {this.state.collectibles.map((collectible, i) => {
              return (
                <div key={i} className="col-md-3 mb-3">
                  <a href={`https://${this.state.openseaDomain}/assets/${this.state.contract?.options.address}/${i}`} target="_blank" rel="noreferrer">
                    <img className="w-50 p-3" src={collectible} alt="" />
                  </a>
                </div>
              )
            })}
          </div>
          <hr />
          <div><a href={`https://${this.state.etherscanDomain}/address/${this.state.contract?.options.address}#code`} target="_blank" rel="noreferrer">contract</a></div>
          <div>provenance hash: {this.state.provenanceHash}</div>
        </div>
      </div>
    );
  }
}

export default App;
