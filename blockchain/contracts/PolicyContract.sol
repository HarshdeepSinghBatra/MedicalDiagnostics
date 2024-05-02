// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

// import "hardhat/console.sol";

contract PolicyContract {
    struct Policy {
        bytes32 _id;
        address holder;
        address insurerAddr;
        uint256 premiumAmount;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
        uint256 maturityAmount;
        string name;
        string typeOfTreatment;
    }

    mapping(bytes32 => Policy) public policies;
    mapping(address => bytes32[]) public userPolicies;
    mapping(address => bytes32[]) public insurerPolicies;

    event PolicyCreated(bytes32 indexed policyId, address indexed holder, uint256 startDate, uint256 endDate);
    event ReturnUserPolicies(Policy[] userPolicies);
    event ReturnInsurerPolicies(Policy[] insurerPolicies);

    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        owner.transfer(address(this).balance);
    }


    function createPolicy(address _insurerAddr, string memory _name, string memory _typeOfTreatment, uint256 _premiumAmount, uint256 _duration, uint256 _maturityAmount) external {
        // console.log(msg.value);
        // require(msg.value == _premiumAmount, "Premium amount should be paid during policy creation");
        // console.log(_premiumAmount);
        require(_duration > 0, "Policy duration should be greater than zero");

        uint256 endDate = block.timestamp + _duration * 86400;
        bytes32 policyId = keccak256(abi.encodePacked(msg.sender, block.timestamp, block.prevrandao));

        policies[policyId] = Policy({
            _id: policyId,
            holder: msg.sender,
            insurerAddr: _insurerAddr,
            premiumAmount: _premiumAmount,
            startDate: block.timestamp,
            endDate: endDate,
            isActive: true,
            maturityAmount: _maturityAmount,
            name: _name,
            typeOfTreatment: _typeOfTreatment
        });
        userPolicies[msg.sender].push(policyId);
        insurerPolicies[_insurerAddr].push(policyId);

        emit PolicyCreated(policyId, msg.sender, block.timestamp, endDate);
    }

    function cancelPolicy(bytes32 _policyId) external {
        require(policies[_policyId].holder == msg.sender, "You are not the holder of this policy");
        require(policies[_policyId].isActive, "Policy is already canceled");

        policies[_policyId].isActive = false;
    }

    function getPolicy(bytes32 _policyId) public view returns (Policy memory) {
        Policy storage policy = policies[_policyId];
        return policy;
    }

    function getUserPolicies(address _userAddr) public returns (Policy[] memory UserPolicies) {
        require(userPolicies[_userAddr].length > 0, "User policies not present"); // Allow access from this contract
        
        bytes32[] memory policyIds = userPolicies[_userAddr];
        Policy[] memory records = new Policy[](policyIds.length);
        for (uint i = 0; i < policyIds.length; i++) {
            records[i] = getPolicy(policyIds[i]);
        }

        emit ReturnUserPolicies(records);
        return (records);
    }
    function getInsurerPolicies(address _insurerAddr) public returns (Policy[] memory InsurerPolicies) {
        require(insurerPolicies[_insurerAddr].length > 0, "Insurer policies not present"); // Allow access from this contract
        
        bytes32[] memory policyIds = insurerPolicies[_insurerAddr];
        Policy[] memory records = new Policy[](policyIds.length);
        for (uint i = 0; i < policyIds.length; i++) {
            records[i] = getPolicy(policyIds[i]);
        }

        emit ReturnInsurerPolicies(records);
        return (records);
    }
}
