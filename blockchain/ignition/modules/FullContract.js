const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const FullContractModule = buildModule("FullContractModule", (m) => {
  const fullContract = m.contract("FullContract");

  return { fullContract };
});

module.exports = FullContractModule;

// 0xc26E25111431Fb12380F0dd48B4d872754444369