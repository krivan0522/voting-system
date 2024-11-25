import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
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
