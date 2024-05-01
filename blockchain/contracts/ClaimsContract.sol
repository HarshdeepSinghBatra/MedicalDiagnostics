// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

// import "hardhat/console.sol";

struct PatientRecord {
    uint256 _id;
    string name;
    address addr;
    address hospitalAddr;
    // address insuranceAddr;
    string aadhaarNo; 
    string phoneNo;
    string bloodGroup;
    string email;
    string[] medicalRecords; // record data (PDF/Image)
    uint256 date;
    string diagnosis;
    uint256 billAmount;
    bool isClaimed;
}

struct Policy {
    bytes32 _id;
    address holder;
    uint256 premiumAmount;
    uint256 startDate;
    uint256 endDate;
    bool isActive;
    uint256 maturityAmount;
    string name;
    string typeOfTreatment;
}

interface PolicyContractInterFace {
    function getPolicy(bytes32 _policyId) external view returns (Policy memory);
}

interface MedicalRecordInterface {
    function getRecordById(uint _recordId) external returns (PatientRecord memory patientRecord);
}

contract ClaimsContract {
    struct Claim {
        bytes32 _id;
        address holder;
        string typeOfTreatment;
        bytes32 policyId;
        uint256 recordId;
        uint256 amount;
        uint256 date;
        bool isApproved;
        bool isRejected;
        bool isPaid;
    }

    mapping(bytes32 => Claim) public claims;

    event ClaimSubmitted(bytes32 indexed claimId, address indexed holder, bytes32 policyId, uint256 amount);
    event ClaimApproved(bytes32 indexed claimId, uint256 amount);
    event ClaimPaid(bytes32 indexed claimId, uint256 recordId);

    PolicyContractInterFace public PContract;
    MedicalRecordInterface public MContract;

    constructor(address _policyContractAddr, address _medicalRecordAddr) {
        PContract = PolicyContractInterFace(_policyContractAddr);
        MContract = MedicalRecordInterface(_medicalRecordAddr);
    }

    function submitClaim(bytes32 _policyId, uint256 _recordId, uint256 _amount, string memory _typeOfTreatment) public {
        require(_amount > 0, "Claim amount should be greater than zero");
        bytes32 claimId = keccak256(abi.encodePacked(msg.sender, block.timestamp, block.prevrandao));
        claims[claimId] = Claim({
            _id: claimId,
            holder: msg.sender,
            policyId: _policyId,
            recordId: _recordId,
            amount: _amount,
            typeOfTreatment: _typeOfTreatment,
            date: block.timestamp,
            isApproved: false,
            isRejected: false,
            isPaid: false
        });

        emit ClaimSubmitted(claimId, msg.sender, _policyId, _amount);
    }

    function processClaim(bytes32 _claimId) public {
        require(!claims[_claimId].isApproved, "Claim is already approved");
        Policy memory userPolicy = PContract.getPolicy(claims[_claimId].policyId);
        PatientRecord memory record = MContract.getRecordById(claims[_claimId].recordId);
        // console.log(userPolicy.name);
        // console.log(record.name);
        // console.log(record.aadhaarNo);
        require(userPolicy.isActive, "Policy is not active");
        require(claims[_claimId].amount <= userPolicy.maturityAmount, "Claim amount exceeds coverage");
        require(!record.isClaimed, "Treatment already claimed");

        claims[_claimId].isApproved = true;
        
        emit ClaimApproved(_claimId, claims[_claimId].amount);
    }

    // function approveClaim(bytes32 _claimId) external {
    //     require(claims[_claimId].holder == msg.sender, "You are not authorized to approve this claim");
    //     require(!claims[_claimId].isApproved, "Claim is already approved");

    //     claims[_claimId].isApproved = true;
    //     emit ClaimApproved(_claimId, claims[_claimId].amount);
    // }

    function payClaim(bytes32 _claimId) public {
        require(claims[_claimId].isApproved, "Claim is not approved yet");
        require(!claims[_claimId].isPaid, "Claim is already paid");

        // address payable holder = payable(claims[_claimId].holder);
        // holder.transfer(claims[_claimId].amount);
        // require(sent, "Transaction failed");
        claims[_claimId].isPaid = true;
        PatientRecord memory record = MContract.getRecordById(claims[_claimId].recordId);
        
        emit ClaimPaid(_claimId, record._id);
    }

    function getClaim(bytes32 _claimId) public view returns (Claim memory userClaim) {
        Claim storage claim = claims[_claimId];
        return claim;
    }
}
