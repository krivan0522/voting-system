const SecureVoting = artifacts.require("SecureVoting");

module.exports = function (deployer) {
    deployer.deploy(SecureVoting);
};
