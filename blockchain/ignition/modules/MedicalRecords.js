const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const MedicalRecordsModule = buildModule("MedicalRecordsModule", (m) => {
  const medicalRecords = m.contract("MedicalRecords");

  return { medicalRecords };
});

module.exports = MedicalRecordsModule;

// 0xE76173e361de0d92A63A05548Fd62a73A15e92DB