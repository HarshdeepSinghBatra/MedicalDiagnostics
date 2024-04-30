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
    }

    mapping(bytes32 => Policy) public policies;

    event PolicyCreated(bytes32 indexed policyId, address indexed holder, uint256 startDate, uint256 endDate);

    function createPolicy(uint256 _premiumAmount, uint256 _duration) external payable {
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
            isActive: true
        });

        emit PolicyCreated(policyId, msg.sender, block.timestamp, endDate);
    }

    function cancelPolicy(bytes32 _policyId) external {
        require(policies[_policyId].holder == msg.sender, "You are not the holder of this policy");
        require(policies[_policyId].isActive, "Policy is already canceled");

        policies[_policyId].isActive = false;
    }

    function getPolicy(bytes32 _policyId) external view returns (address, uint256, uint256, uint256, bool) {
        Policy storage policy = policies[_policyId];
        return (policy.holder, policy.premiumAmount, policy.startDate, policy.endDate, policy.isActive);
    }
}
