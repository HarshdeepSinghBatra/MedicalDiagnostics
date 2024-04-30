const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PolicyModule = buildModule("PolicyModule", (m) => {
  const policy = m.contract("PolicyContract");

  return { policy };
});

module.exports = PolicyModule;

// 0xF335eeb01Bb34CFDA2602e85E7Bd5Ea25Ce59bA2