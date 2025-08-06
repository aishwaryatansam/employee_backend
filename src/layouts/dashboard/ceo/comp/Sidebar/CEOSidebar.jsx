import React from "react";
import { NavLink } from "react-router-dom";
import Icon from "@mui/material/Icon";
import { Box, Typography, Button } from "@mui/material";

const menuItems = [
  { name: "Dashboard", to: "/ceo-dashboard", icon: "dashboard" },
  { name: "Analytics", to: "/analytics", icon: "analytics" },
  { name: "Employee Logs", to: "/employee-logs", icon: "assignment" },
  { name: "Team Reports", to: "/team-reports", icon: "groups" },
];

const CEOSidebar = () => {
  return (
    <Box
      sx={{
        width: "250px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#292828ff", // Dark theme
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "2px 0 10px rgba(44, 42, 42, 0.38)",
        paddingY: 2,
        zIndex: 1100,
        borderTopLeftRadius: "20px",
        borderBottomLeftRadius: "20px",

        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
      }}
    >
      {/* Top: Logo and Navigation */}
      <Box>
        <Box sx={{ paddingX: 3, marginBottom: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="white">
            CEO Dashboard
          </Typography>
        </Box>

        <Box component="ul" sx={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map(({ name, to, icon }) => (
            <NavLink
              key={name}
              to={to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                color: isActive ? "#ffffff" : "#a0a0a0",
                backgroundColor: isActive ? "#1a73e8" : "transparent",
                textDecoration: "none",
                borderRadius: "10px",
                margin: "8px 12px",
                transition: "all 0.3s ease",
              })}
            >
              <Icon sx={{ marginRight: "12px" }}>{icon}</Icon>
              <Typography variant="body1" fontWeight={500}>
                {name}
              </Typography>
            </NavLink>
          ))}
        </Box>
      </Box>

      {/* Bottom: Logout */}
      <Box sx={{ paddingX: 2 }}>
        <NavLink to="/authentication/sign-in" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Icon>logout</Icon>}
            sx={{
              backgroundColor: "#1a73e8",
              color: "#ffffff",
              fontWeight: 500,
              borderRadius: "10px",
              textTransform: "none",
              paddingY: 1.2,
              "&:hover": {
                backgroundColor: "#1665c1",
              },
            }}
          >
            Logout
          </Button>
        </NavLink>
      </Box>
    </Box>
  );
};

export default CEOSidebar;
