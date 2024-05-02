// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

// import "hardhat/console.sol";

// interface PolicyContract {
//     function createPolicy(string memory _name, uint256 _premiumAmount, uint256 _duration, uint256 _maturityAmount) external payable returns (bytes32);
// }

contract MedicalRecords {

    mapping(address=>bytes32[]) public insurancePolicies; // Stores the policy ID: mapping(patientAddr => array of policyIds)

    struct PatientRecord {
        uint256 _id;
        string name;
        address addr;
        address hospitalAddr;
        // address insuranceAddr;
        string aadhaarNo; 
        string email;
        string[] medicalRecords; // record data (PDF/Image)
        uint256 date;
        string diagnosis;
        string typeOfTreatment;
        uint256 billAmount;
        bool isClaimed;
    }

    // struct InsuranceClaim {
    //     uint256 claimId; // Auto-generated ID for each claim
    //     uint256 date; // Timestamp of the claim
    //     uint256 amount; // Amount claimed
    //     string status; // "Submitted", "Approved", "Rejected"
    // }

    mapping(uint256 => PatientRecord) public patientRecords;
    mapping(address => uint256[]) public patientAddrToRecordId;
    mapping(address => uint256[]) public hospitalAddrToRecordId;
    uint public recordIndex;

    event RecordCreated(uint indexed recordID, address patientAddr);
    event ReturnRecordById(PatientRecord patientRecord);
    event ReturnPatientRecords(PatientRecord[] patientRecord, bytes32[] patientPolicies);
    event ReturnHospitalRecords(PatientRecord[] patientRecord);

    // Function to register a new patient
    function addPatientRecord(
        string memory _name,
        string memory _aadhaarNo,
        string memory _email,
        string memory _diagnosis,
        string memory _typeOfTreatment,
        string[] memory _medicalRecords,
        uint256 _billAmount,
        address _patientAddr
    ) public {
        PatientRecord storage newPatient = patientRecords[recordIndex];
        newPatient._id = recordIndex;
        newPatient.name = _name;
        newPatient.addr = _patientAddr;
        newPatient.aadhaarNo = _aadhaarNo;
        newPatient.email = _email;
        newPatient.date = block.timestamp;
        newPatient.diagnosis = _diagnosis;
        newPatient.typeOfTreatment = _typeOfTreatment;
        newPatient.billAmount = _billAmount;
        newPatient.medicalRecords = _medicalRecords;
        newPatient.hospitalAddr = msg.sender;
        newPatient.isClaimed = false;
        patientAddrToRecordId[_patientAddr].push(recordIndex);
        hospitalAddrToRecordId[msg.sender].push(recordIndex);
        emit RecordCreated(recordIndex, _patientAddr);
        recordIndex++;
    }


    // Function to add a medical record (PDF/Image)
    function addRecordFiles(string memory recordFile, address _patientAddr, uint256 _recordId) public {
        require(patientRecords[_recordId].addr == _patientAddr, "Patient record not present");
        patientRecords[_recordId].medicalRecords.push(recordFile);
    }

    function updateClaimStatus(uint256 _recordId) public {
        patientRecords[_recordId].isClaimed = true;
    }

    // Function to get patient details (restricted access for authorized personnel)
    function getPatientRecords(address _patientAddr) public returns (PatientRecord[] memory patientRecord, bytes32[] memory patientPolicies) {        
        require(patientAddrToRecordId[_patientAddr].length > 0, "Patient records not present"); // Allow access from this contract
        
        uint256[] memory recordIds = patientAddrToRecordId[_patientAddr];
        PatientRecord[] memory records = new PatientRecord[](recordIds.length);
        for (uint i = 0; i < recordIds.length; i++) {
            records[i] = getRecordById(recordIds[i]);
        }

        emit ReturnPatientRecords(records, insurancePolicies[_patientAddr]);
        return (records, insurancePolicies[_patientAddr]);
    }

    function getRecordById(uint _recordId) public returns (PatientRecord memory patientRecord) {
        require(patientRecords[_recordId].addr != address(0), "Patient record not present"); // Allow access from this contract
        // Add other authorized roles here (e.g., doctor, hospital)
        // require(msg.sender == address(this) || msg.sender == patientRecords[_recordId].addr ||msg.sender == patientRecords[_recordId].hospitalAddr, "Unauthorized access");
        emit ReturnRecordById(patientRecords[_recordId]);
        return patientRecords[_recordId];
    }

    function getAllRecordsByHospital() public returns (PatientRecord[] memory patientRecord) {
      require(hospitalAddrToRecordId[msg.sender].length > 0, "Patient records not present"); // Allow access from this contract
        
      uint256[] memory recordIds = hospitalAddrToRecordId[msg.sender];
      PatientRecord[] memory records = new PatientRecord[](recordIds.length);
      for (uint i = 0; i < recordIds.length; i++) {
          records[i] = getRecordById(recordIds[i]);
      }

      emit ReturnHospitalRecords(records);
      return (records);
    }
}
