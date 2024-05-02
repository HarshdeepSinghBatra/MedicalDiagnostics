const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PolicyModule = buildModule("PolicyModule", (m) => {
  const policy = m.contract("PolicyContract");

  return { policy };
});

module.exports = PolicyModule;

// 0x9a150d8Bb583eFc8ee3bE74B8c2B4f33AB230754