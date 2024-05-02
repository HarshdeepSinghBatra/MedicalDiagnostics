const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ClaimsModule = buildModule("ClaimsModule", (m) => {
  const claims = m.contract("ClaimsContract", ["0x9a150d8Bb583eFc8ee3bE74B8c2B4f33AB230754", "0xE76173e361de0d92A63A05548Fd62a73A15e92DB"]);
  // const claims = m.contract("ClaimsContract", ["0x5FbDB2315678afecb367f032d93F642f64180aa3", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"]);  // localhost

  return { claims };
});

module.exports = ClaimsModule;

// 0xb2eC74B68fa7199Be3e9447DcDe89D3dD58285F1


// 0x5FbDB2315678afecb367f032d93F642f64180aa3    pol   localhost
// 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512   med
// 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0   claim