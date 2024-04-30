// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract ClaimsContract {
    struct Claim {
        address holder;
        bytes32 policyId;
        uint256 amount;
        bool isApproved;
        bool isPaid;
    }

    mapping(bytes32 => Claim) public claims;

    event ClaimSubmitted(bytes32 indexed claimId, address indexed holder, bytes32 policyId, uint256 amount);
    event ClaimApproved(bytes32 indexed claimId, uint256 amount);
    event ClaimPaid(bytes32 indexed claimId);

    function submitClaim(bytes32 _policyId, uint256 _amount) external {
        require(_amount > 0, "Claim amount should be greater than zero");
        bytes32 claimId = keccak256(abi.encodePacked(msg.sender, block.timestamp, block.prevrandao));
        claims[claimId] = Claim({
            holder: msg.sender,
            policyId: _policyId,
            amount: _amount,
            isApproved: false,
            isPaid: false
        });

        emit ClaimSubmitted(claimId, msg.sender, _policyId, _amount);
    }

    function approveClaim(bytes32 _claimId) external {
        require(claims[_claimId].holder == msg.sender, "You are not authorized to approve this claim");
        require(!claims[_claimId].isApproved, "Claim is already approved");

        claims[_claimId].isApproved = true;
        emit ClaimApproved(_claimId, claims[_claimId].amount);
    }

    function payClaim(bytes32 _claimId) external payable {
        require(claims[_claimId].isApproved, "Claim is not approved yet");
        require(!claims[_claimId].isPaid, "Claim is already paid");

        address payable holder = payable(claims[_claimId].holder);
        holder.transfer(claims[_claimId].amount);
        // require(sent, "Transaction failed");
        claims[_claimId].isPaid = true;

        emit ClaimPaid(_claimId);
    }

    function getClaim(bytes32 _claimId) external view returns (address, bytes32, uint256, bool, bool) {
        Claim storage claim = claims[_claimId];
        return (claim.holder, claim.policyId, claim.amount, claim.isApproved, claim.isPaid);
    }
}
