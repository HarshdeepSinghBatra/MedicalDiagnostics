const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const MedicalRecordsModule = buildModule("MedicalRecordsModule", (m) => {
  const medicalRecords = m.contract("MedicalRecords");

  return { medicalRecords };
});

module.exports = MedicalRecordsModule;

// 0xb3BD8627Dc9961830DF88684F3E12A6A4aCD1bac