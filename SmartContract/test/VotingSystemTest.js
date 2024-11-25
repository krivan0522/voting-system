const VotingSystem = artifacts.require("VotingSystem");

contract("VotingSystem", (accounts) => {
    let contractInstance;

    // Test addresses
    const admin = accounts[0]; // Admin account
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const candidate1 = { name: "Alice", party: "Party A", manifesto: "Improve education" };
    const candidate2 = { name: "Bob", party: "Party B", manifesto: "Enhance healthcare" };

    beforeEach(async () => {
        contractInstance = await VotingSystem.new({ from: admin });
    });

    it("should deploy the contract with the correct admin", async () => {
        const contractAdmin = await contractInstance.admin();
        assert.equal(contractAdmin, admin, "Admin address does not match deployer address");
    });

    it("should allow admin to register voters", async () => {
        await contractInstance.registerVoter(voter1, "voter1PublicKey", { from: admin });

        const voter = await contractInstance.voters(voter1);
        assert.equal(voter.isRegistered, true, "Voter should be registered");
        assert.equal(voter.publicKey, "voter1PublicKey", "Public key should match");
    });

    it("should prevent non-admin from registering voters", async () => {
        try {
            await contractInstance.registerVoter(voter1, "voter1PublicKey", { from: voter1 });
            assert.fail("Non-admin should not be able to register voters");
        } catch (error) {
            assert(error.message.includes("Only admin can perform this action"), "Expected admin-only error");
        }
    });

    it("should allow admin to register candidates", async () => {
        await contractInstance.registerCandidate(candidate1.name, candidate1.party, candidate1.manifesto, { from: admin });

        const candidate = await contractInstance.candidates(1);
        assert.equal(candidate.name, candidate1.name, "Candidate name should match");
        assert.equal(candidate.party, candidate1.party, "Candidate party should match");
        assert.equal(candidate.manifesto, candidate1.manifesto, "Candidate manifesto should match");
    });

    it("should prevent non-admin from registering candidates", async () => {
        try {
            await contractInstance.registerCandidate(candidate1.name, candidate1.party, candidate1.manifesto, { from: voter1 });
            assert.fail("Non-admin should not be able to register candidates");
        } catch (error) {
            assert(error.message.includes("Only admin can perform this action"), "Expected admin-only error");
        }
    });

    it("should allow a registered voter to cast a vote", async () => {
        // Register voter and candidate
        await contractInstance.registerVoter(voter1, "voter1PublicKey", { from: admin });
        await contractInstance.registerCandidate(candidate1.name, candidate1.party, candidate1.manifesto, { from: admin });

        // Cast vote
        await contractInstance.vote(1, "quantumSafeHash", { from: voter1 });

        const candidate = await contractInstance.candidates(1);
        const voter = await contractInstance.voters(voter1);

        assert.equal(candidate.voteCount, 1, "Candidate vote count should be incremented");
        assert.equal(voter.hasVoted, true, "Voter should be marked as having voted");
    });

    it("should prevent unregistered voters from voting", async () => {
        try {
            await contractInstance.vote(1, "quantumSafeHash", { from: voter1 });
            assert.fail("Unregistered voter should not be able to vote");
        } catch (error) {
            assert(error.message.includes("You are not registered to vote"), "Expected unregistered voter error");
        }
    });

    it("should prevent double voting by the same voter", async () => {
        // Register voter and candidate
        await contractInstance.registerVoter(voter1, "voter1PublicKey", { from: admin });
        await contractInstance.registerCandidate(candidate1.name, candidate1.party, candidate1.manifesto, { from: admin });

        // Cast vote
        await contractInstance.vote(1, "quantumSafeHash", { from: voter1 });

        try {
            await contractInstance.vote(1, "anotherHash", { from: voter1 });
            assert.fail("Voter should not be able to vote twice");
        } catch (error) {
            assert(error.message.includes("You have already voted"), "Expected double-voting error");
        }
    });

    it("should allow admin to declare results", async () => {
        // Register candidates
        await contractInstance.registerCandidate(candidate1.name, candidate1.party, candidate1.manifesto, { from: admin });
        await contractInstance.registerCandidate(candidate2.name, candidate2.party, candidate2.manifesto, { from: admin });

        // Declare results (expect event emission)
        const tx = await contractInstance.declareResults({ from: admin });

        assert.equal(tx.logs.length, 2, "Should emit events for each candidate");
        assert.equal(tx.logs[0].event, "ResultsDeclared", "First event should be ResultsDeclared");
        assert.equal(tx.logs[1].event, "ResultsDeclared", "Second event should be ResultsDeclared");
    });

    it("should prevent non-admin from declaring results", async () => {
        try {
            await contractInstance.declareResults({ from: voter1 });
            assert.fail("Non-admin should not be able to declare results");
        } catch (error) {
            assert(error.message.includes("Only admin can perform this action"), "Expected admin-only error");
        }
    });
});
