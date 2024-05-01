const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PolicyModule = buildModule("PolicyModule", (m) => {
  const policy = m.contract("PolicyContract");

  return { policy };
});

module.exports = PolicyModule;

// 0x973EaCb48790546D44C8a6b1E576dadb16723f10