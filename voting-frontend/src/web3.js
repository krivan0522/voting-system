import Web3 from "web3";
import {CONTRACT_ABI as ContractABI, CONTRACT_ADDRESS} from "./contracts/VotingSystem";

const getWeb3 = async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        return web3;
    } else {
        alert("MetaMask is required to use this application.");
    }
};

const getContract = async (web3) => {
    try {
        // Fetch the network ID and convert it to a standard string
        const networkId = (await web3.eth.net.getId()).toString();

        // Retrieve the deployed network configuration
        const deployedNetwork = CONTRACT_ADDRESS;
        if (!deployedNetwork) {
            console.error("Contract not deployed on this network:", networkId);
            alert(`Contract not found on network ID: ${networkId}. Please switch MetaMask to the correct network.`);
            return null;
        }

        // Return the contract instance
        console.log("Using contract at:", deployedNetwork);
        return new web3.eth.Contract(ContractABI, deployedNetwork);
    } catch (error) {
        console.error("Error in getContract:", error);
        alert("Failed to load contract. Check console for details.");
        return null;
    }
};

export { getWeb3, getContract };
