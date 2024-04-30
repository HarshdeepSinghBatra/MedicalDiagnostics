const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const FullContractModule = buildModule("FullContractModule", (m) => {
  const fullContract = m.contract("FullContract");

  return { fullContract };
});

module.exports = FullContractModule;

// 0x5E798e38a10cBA3c4955BC845E3bC42b65b18E85