import { action, observable, computed } from 'mobx'
import Eth from 'ethjs-query'
import BN from 'bn.js'

const GET_CURRENT_USER_DELAY = 1000
const REFRESH_NETWORK_VERSION_DELAY = 1000

class User {
  @observable balanceWei = new BN(0);
  @observable allowanceWei = new BN(0);

  constructor(props) {
    Object.assign(this, props)
  }

  @computed
  get balance() {
    return Eth.fromWei(this.balanceWei, 'ether')
  }

  @computed
  get allowance() {
    return Eth.fromWei(this.allowanceWei, 'ether')
  }
}

export class Store {
  @observable currentUser;
  @observable networkVersion;
  @observable loadingContracts = true;
  @observable loadingCurrentUser = true;

  constructor() {
    const ethOptions = { interval: 3000 }
    if (
      typeof window.web3 !== 'undefined' &&
      typeof window.web3.currentProvider !== 'undefined'
    ) {
      this.eth = new Eth(window.web3.currentProvider, ethOptions)
    } else {
      this.eth = new Eth(
        new Eth.HttpProvider('http://localhost:8545'),
        ethOptions
      )
    }
    window.eth = this.eth
    this.getNetworkVersion()
    this.getCurrentUser()
  }

  @action
  async getNetworkVersion() {
    this.networkVersion = await this.eth.net_version()
    this.loadingContracts = false
    this.getNetworkVersionTimeout = setTimeout(
      () => this.getNetworkVersion(),
      REFRESH_NETWORK_VERSION_DELAY
    )
  }

  @computed
  get relayerReady() {
    return !!this.relayer
  }

  @computed
  get relayer() {
    if (!this.networkVersion) return null
    try {
      return new Relayer(this.eth.currentProvider, this.networkVersion)
    } catch (err) {
      return null
    }
  }

  @action
  async getCurrentUser() {
    const accounts = await this.eth.accounts()

    if (!this.currentUser || accounts[0] !== this.currentUser.address) {
      this.loadingCurrentUser = !!accounts[0] // Set to false if nothing to load
      this.currentUser = new User({ address: accounts[0] })
    }

    if (this.relayerReady && this.currentUser && this.currentUser.address) {
      this.loadingCurrentUser = false
    }

    this.getCurrentUserTimeout = setTimeout(
      () => this.getCurrentUser(),
      GET_CURRENT_USER_DELAY
    )
  }
}
