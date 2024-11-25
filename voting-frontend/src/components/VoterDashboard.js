import React, { useState, useEffect } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, Grid2 as Grid, Typography } from "@mui/material";

const VoterDashboard = ({ contract, accounts }) => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState("");

    useEffect(() => {
        const loadCandidates = async () => {
            const count = await contract.methods.candidateCount().call();
            const candidateList = [];

            for (let i = 1; i <= count; i++) {
                const candidate = await contract.methods.candidates(i).call();
                candidateList.push(candidate);
            }

            setCandidates(candidateList);
        };

        loadCandidates();
    }, [contract]);

    const handleVote = async () => {
        if (!selectedCandidate) {
            alert("Please select a candidate!");
            return;
        }

        try {
            await contract.methods.vote(selectedCandidate).send({ from: accounts[0] });
            alert("Vote cast successfully!");
        } catch (err) {
            console.error("Error casting vote:", err);
            alert("Error: " + err.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Voter Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item className={`w-100`}>
                    <FormControl fullWidth>
                        <InputLabel>Choose Candidate</InputLabel>
                        <Select
                            value={selectedCandidate}
                            onChange={(e) => setSelectedCandidate(e.target.value)}
                            label="Choose Candidate"
                        >
                            {candidates.map((candidate) => (
                                <MenuItem key={parseInt(candidate.id.toString(),10)} value={parseInt(candidate.id.toString(),10)}>
                                    {candidate.name} ({candidate.party})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item >
                    <Button variant="contained" color="primary" onClick={handleVote}>
                        Vote
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default VoterDashboard;
