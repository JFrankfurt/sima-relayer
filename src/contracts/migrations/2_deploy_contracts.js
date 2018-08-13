const Relay = artifacts.require("Relay");

RINKEBY_ACCOUNTS = [
  "0x0000000000000000000000000000000000000000"
];

module.exports = function(deployer, network, accounts) {
  testAccounts = deployer.network_id === 4 ? RINKEBY_ACCOUNTS : accounts;
  testEnvironment = deployer.network_id !== 1;

  console.log("Deploying Relayer...");
  return deployer
    .deploy(Relay)
    .then(Relay.deployed)
    .then(t => {
      token = t;
      if (testEnvironment) {
        console.log("Setting up some test state...");
        const amount = new web3.BigNumber(web3.toWei(10000, "ether"));
        return token.distributeTokensForTesting(testAccounts, amount);
    }
    })
    .then(() => console.log("Deployment complete!"))
};
