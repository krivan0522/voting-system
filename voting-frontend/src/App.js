import React, { useState, useEffect } from "react";
import { getWeb3, getContract } from "./web3";
import AdminPanel from "./components/AdminPanel";
import VoterDashboard from "./components/VoterDashboard";
import Results from "./components/Results";
import { CssBaseline, Container } from "@mui/material";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Simulation from "./Simulation";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();
        const accounts = await web3Instance.eth.getAccounts();
        const contractInstance = await getContract(web3Instance);
        
        setWeb3(web3Instance);
        setAccounts(accounts);
        setContract(contractInstance);
      } catch (error) {
        console.error("Error loading Web3, accounts, or contract:", error);
        alert("Failed to load Web3. Check the console for details.");
      }
    };
    init();
  }, []);

  if (!web3 || !accounts.length || !contract) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <Router>
      <div>
        <CssBaseline />
        <Header />
        <Container style={{ marginTop: "20px" }}>
          <Routes>
            <Route path="/" element={<Simulation contract={contract}/>}/>  
            <Route path="/admin" element={<AdminPanel contract={contract} accounts={accounts}/>}/>
            <Route path="/voter" element={<VoterDashboard contract={contract} accounts={accounts}/>}/>
            <Route path="/results" element={<Results contract={contract}/>}/>
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;
