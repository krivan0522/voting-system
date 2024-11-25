import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }} >
                    <img src="/logo.svg" alt="logo" width={50} height={50} className="mx-2" />
                    Blockchain Voting System
                </Typography>
                <Button color="inherit" href="/voter">
                    Voter Dashboard
                </Button>
                <Button color="inherit" href="/admin">
                    Admin Panel
                </Button>
                <Button color="inherit" href="/results">
                    Results
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
