const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PolicyModule = buildModule("PolicyModule", (m) => {
  const policy = m.contract("PolicyContract");

  return { policy };
});

module.exports = PolicyModule;

// 0x72112c6dcc644A5949DFba1FaAC29d7d9fdE462B