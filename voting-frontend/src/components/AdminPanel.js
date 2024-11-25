import React, { useState } from "react";
import { TextField, Button, Grid2 as Grid, Typography } from "@mui/material";
import { AdminID } from "../utils";

const AdminPanel = ({ contract, accounts }) => {
    const [candidateName, setCandidateName] = useState("");
    const [candidateParty, setCandidateParty] = useState("");
    const [voterAddress, setVoterAddress] = useState("");

    const registerCandidate = async () => {
        try {
            await contract.methods
                .registerCandidate(candidateName, candidateParty)
                .send({ from: AdminID });
            alert("Candidate registered successfully!");
        } catch (err) {
            console.error("Error registering candidate:", err);
            alert("Error: " + err.message);
        }
    };

    const registerVoter = async () => {
        try {
            await contract.methods
                .registerVoter(voterAddress)
                .send({ from: accounts[0] });
            alert("Voter registered successfully!");
        } catch (err) {
            console.error("Error registering voter:", err);
            alert("Error: " + err.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Admin Panel
            </Typography>
            <Grid container spacing={3} flexDirection={"column"} className="mb-5">
                <Typography variant="h6" >
                    Candidate Registration
                </Typography>
                <Grid item xs={12}>
                    <TextField
                        label="Candidate Name"
                        fullWidth
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Party"
                        fullWidth
                        value={candidateParty}
                        onChange={(e) => setCandidateParty(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={registerCandidate}
                    >
                        Register Candidate
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={3} flexDirection={"column"}>    
            <Typography variant="h6">
                    Voter Registration
                </Typography>
                <Grid item xs={12}>
                    <TextField
                        label="Voter Address"
                        fullWidth
                        value={voterAddress}
                        onChange={(e) => setVoterAddress(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={registerVoter}>
                        Register Voter
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default AdminPanel;
