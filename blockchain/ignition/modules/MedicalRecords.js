const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const MedicalRecordsModule = buildModule("MedicalRecordsModule", (m) => {
  const medicalRecords = m.contract("MedicalRecords");

  return { medicalRecords };
});

module.exports = MedicalRecordsModule;

// 0x63bfEA0ce1A42A10f6c03f97366Ff3539e3543a1