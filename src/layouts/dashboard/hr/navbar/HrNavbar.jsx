import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const HrNavbar = () => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: "calc(100% - 240px)",
        ml: "240px",
        backgroundColor: "#ffffff",
        color: "#344767",
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.03)",
      }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          HR Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default HrNavbar;
