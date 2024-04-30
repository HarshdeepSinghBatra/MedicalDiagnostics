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
    }

    mapping(bytes32 => Policy) public policies;

    event PolicyCreated(bytes32 indexed policyId, address indexed holder, uint256 startDate, uint256 endDate);

    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        owner.transfer(address(this).balance);
    }


    function createPolicy(string memory name, uint256 _premiumAmount, uint256 _duration, uint256 _maturityAmount) external payable {
        // console.log(msg.value);
        require(msg.value == _premiumAmount, "Premium amount should be paid during policy creation");
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
            name: name
        });

        emit PolicyCreated(policyId, msg.sender, block.timestamp, endDate);
    }

    function cancelPolicy(bytes32 _policyId) external {
        require(policies[_policyId].holder == msg.sender, "You are not the holder of this policy");
        require(policies[_policyId].isActive, "Policy is already canceled");

        policies[_policyId].isActive = false;
    }

    function getPolicy(bytes32 _policyId) external view returns (string memory name, address holder, uint256 premiumAmount, uint256 startDate, uint256 endDate, bool isActive, uint256 maturityAmount) {
        Policy storage policy = policies[_policyId];
        return (policy.name, policy.holder, policy.premiumAmount, policy.startDate, policy.endDate, policy.isActive, policy.maturityAmount);
    }
}
