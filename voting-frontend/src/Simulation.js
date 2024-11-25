import React from 'react'
import { Button } from '@mui/material';
import { AdminID } from './utils';
import { ethers } from "ethers";

const Simulation = ({contract}) => {
    function generateRandomAddress() {
        // Generate a random wallet using ethers.js
        const randomWallet = ethers.Wallet.createRandom();
        return randomWallet.address; // Returns a valid Ethereum address
    }
    
    const randomAddress = generateRandomAddress();
    console.log(randomAddress);
    
    function generateRandomVote(candidateCount) {
        const randomVote = Math.floor(Math.random() * candidateCount) + 1;  // Random number between 1 and candidateCount
        return randomVote;
    }
    
    const randomVote = generateRandomVote(8);
    console.log(randomVote);
    
    function generateRandomVoters(numVoters, candidateCount) {
        const voters = [];
        for (let i = 0; i < numVoters; i++) {
            const address = generateRandomAddress();
            const vote = generateRandomVote(candidateCount);
            voters.push({
                address: address,
                vote: vote
            });
        }
        return voters;
    }
    const randomVoters = generateRandomVoters(10, 3);
    console.log(randomVoters);


    async function registerVoters(voters) {
        for (let i = 0; i < voters.length; i++) {
            const voter = voters[i];

            try {
                await contract.methods
                    .registerVoter(voter.address)
                    .send({ from: AdminID}); // Admin account
                console.log(`Registered voter: ${voter.address}`);
            } catch (error) {
                console.error(`Error registering voter ${voter.address}:`, error);
            }
        }
    }


    async function simulateVotes(voters) {
        for (let i = 0; i < voters.length; i++) {
            const voter = voters[i];
            const fromAddress = voter.address;  // Simulate voter address
            const vote = voter.vote;  // Candidate ID chosen by the voter
            
            // Send vote to the smart contract (assuming `vote()` is the function)
            await contract.methods.vote(vote).send({ from: fromAddress })
                .then(receipt => {
                    console.log(`Voter ${fromAddress} voted for candidate ${vote}`);
                })
                .catch(error => {
                    console.log(`Error voting with address ${fromAddress}:`, error);
                });
        }
    }

    const handleSimulateVotes = async () => {
        console.log("Registering voters...");
        await registerVoters(randomVoters);

        console.log("Simulating votes...");
        await simulateVotes(randomVoters);
    };
    
    return (
        <div className='container w-100 h-100 d-flex justify-content-center align-items-center flex-column p-5 mt-5'>
            {/* <Button variant='contained' onClick={()=>handleSimulateVotes()}>Simulate Votes</Button> */}
            <h1>Be a Proud Voter </h1>
            <h1>Every Vote Matters.</h1>
            <img src={`/voting_hand_with_tricolour-scaled.webp`} width={350} alt="hand" />
        </div>
    )
}

export default Simulation
