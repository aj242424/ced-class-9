const Cert = artifacts.require("Cert");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
_deployer.deploy(Cert);
};
