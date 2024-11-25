import React, { useState, useEffect } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend, ResponsiveContainer as PieResponsiveContainer } from "recharts";

const Results = ({ contract }) => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const loadResults = async () => {
            const count = await contract.methods.candidateCount().call();
            const candidateList = [];

            for (let i = 1; i <= count; i++) {
                const candidate = await contract.methods.candidates(i).call();
                candidateList.push(candidate);
            }

            setCandidates(candidateList);
        };

        loadResults();
    }, [contract]);

    // Prepare data for the charts
    const chartData = candidates.map((candidate) => ({
        name: candidate.name,
        votes: parseInt(candidate.voteCount.toString()),
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#19FF19', '#1919FF'];

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Election Results
            </Typography>

            {/* Grid container for side-by-side charts */}
            <Grid container spacing={0}>
                {/* Bar Chart */}
                <Grid item xs={12} sm={12} className={`w-50 h-100`}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Votes by Candidate (Bar Chart)
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="votes" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Grid>

                {/* Pie Chart */}
                <Grid item xs={12} sm={12} className={`w-50 h-100`}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Votes Distribution (Pie Chart)
                    </Typography>
                    <PieResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="votes"
                                nameKey="name"
                                outerRadius={150}
                                fill="#8884d8"
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <PieTooltip />
                            <PieLegend />
                        </PieChart>
                    </PieResponsiveContainer>
                </Grid>
            </Grid>
        </div>
    );
};

export default Results;
