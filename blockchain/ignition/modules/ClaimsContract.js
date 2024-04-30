const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ClaimsModule = buildModule("ClaimsModule", (m) => {
  const claims = m.contract("ClaimsContract");

  return { claims };
});

module.exports = ClaimsModule;

// 0x3Fd43db2bCce52ba08d8e89A11ac747a383667e2