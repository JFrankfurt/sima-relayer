import Eth from 'ethjs-query'
import EthContract from 'ethjs-contract'
import EthAbi from 'ethjs-abi'
import RelayBuild from '../Relay.json'

export default class Relay {
  constructor(provider, networkVersion) {
    if (!provider) {
      throw new Error('web3 provider must be specified')
    }
    this.eth = new Eth(provider)
    const relayAddress = (RelayBuild.networks[networkVersion] || {}).address
    if (!relayAddress) {
      throw new Error('Relay smart contract not found. Try another Ethereum network.')
    }
    this.relay = EthContract(this.eth)(RelayBuild.abi).at(relayAddress)
    this.relay.decodeLogs = logs => EthAbi.logDecoder(RelayBuild.abi)(logs)
  }
}
