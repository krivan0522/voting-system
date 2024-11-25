// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureVoting {
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint vote; // Candidate ID
    }

    address public admin;
    uint public candidateCount;
    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    mapping(uint => string) public auditTrail;

    event VoterRegistered(address voter);
    event CandidateRegistered(uint candidateId, string name, string party);
    event VoteCast(address voter, uint candidateId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerVoter(address _voter) public onlyAdmin {
        require(!voters[_voter].isRegistered, "Voter already registered");
        voters[_voter] = Voter({
            isRegistered: true,
            hasVoted: false,
            vote: 0
        });
        emit VoterRegistered(_voter);
    }

    function registerCandidate(string memory _name, string memory _party) public onlyAdmin {
        candidateCount++;
        candidates[candidateCount] = Candidate({
            id: candidateCount,
            name: _name,
            party: _party,
            voteCount: 0
        });
        emit CandidateRegistered(candidateCount, _name, _party);
    }

    function vote(uint _candidateId) public {
        require(voters[msg.sender].isRegistered, "Not registered to vote");
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].vote = _candidateId;
        candidates[_candidateId].voteCount++;

        // Add hash-based audit trail
        auditTrail[_candidateId] = string(
            abi.encodePacked(keccak256(
                abi.encodePacked(msg.sender, _candidateId, block.timestamp)
            ))
        );

        emit VoteCast(msg.sender, _candidateId);
    }

    function getAuditTrail(uint _candidateId) public view returns (string memory) {
        return auditTrail[_candidateId];
    }
}
