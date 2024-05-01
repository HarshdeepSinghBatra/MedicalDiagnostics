const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ClaimsModule = buildModule("ClaimsModule", (m) => {
  const claims = m.contract("ClaimsContract", ["0x973EaCb48790546D44C8a6b1E576dadb16723f10", "0xb3BD8627Dc9961830DF88684F3E12A6A4aCD1bac"]);
  // const claims = m.contract("ClaimsContract", ["0x5FbDB2315678afecb367f032d93F642f64180aa3", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"]);  // localhost

  return { claims };
});

module.exports = ClaimsModule;

// 0x6D25BaaB1B68f7d12d6C9A70105B96a9D9012560


// 0x5FbDB2315678afecb367f032d93F642f64180aa3    pol   localhost
// 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512   med
// 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9   claim