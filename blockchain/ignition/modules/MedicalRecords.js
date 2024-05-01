const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const MedicalRecordsModule = buildModule("MedicalRecordsModule", (m) => {
  const medicalRecords = m.contract("MedicalRecords");

  return { medicalRecords };
});

module.exports = MedicalRecordsModule;

// 0x06EBEC24eeBddD0df0C71bFC47f023Cb1B95d20b