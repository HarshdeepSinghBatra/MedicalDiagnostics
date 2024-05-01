// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

// import "hardhat/console.sol";

contract PolicyContract {
    struct Policy {
        address holder;
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

    event PolicyCreated(bytes32 indexed policyId, address indexed holder, uint256 startDate, uint256 endDate);
    event ReturnUserPolicies(Policy[] userPolicies);

    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        owner.transfer(address(this).balance);
    }


    function createPolicy(string memory name, string memory _typeOfTreatment, uint256 _premiumAmount, uint256 _duration, uint256 _maturityAmount) public {
        // console.log(msg.value);
        // require(msg.value == _premiumAmount, "Premium amount should be paid during policy creation");
        // console.log(_premiumAmount);
        require(_duration > 0, "Policy duration should be greater than zero");

        uint256 endDate = block.timestamp + _duration;
        bytes32 policyId = keccak256(abi.encodePacked(msg.sender, block.timestamp, block.prevrandao));

        policies[policyId] = Policy({
            holder: msg.sender,
            premiumAmount: _premiumAmount,
            startDate: block.timestamp,
            endDate: endDate,
            isActive: true,
            maturityAmount: _maturityAmount,
            name: name,
            typeOfTreatment: _typeOfTreatment
        });
        userPolicies[msg.sender].push(policyId);

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
}
