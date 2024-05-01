const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PolicyModule = buildModule("PolicyModule", (m) => {
  const policy = m.contract("PolicyContract");

  return { policy };
});

module.exports = PolicyModule;

// 0x33B00823Cc2FAa953951a17040Cf711a04fb2127