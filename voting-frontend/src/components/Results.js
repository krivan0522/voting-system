import React, { useState, useEffect } from "react";

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
            console.log("Candidates:", candidateList);
            setCandidates(candidateList);
        };
        loadResults();
    }, [contract]);

    return (
        <div>
            <h2>Results</h2>
            <ul>
                {candidates.map((c) => (
                    <li key={c.id}>
                        {c.name} ({c.party}): {c.voteCount.toString()} votes
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Results;
