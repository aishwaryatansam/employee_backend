import React from "react";
import { NavLink } from "react-router-dom";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Button from "@mui/material/Button"; // for logout button
import logo from "assets/images/logos/tansamlogo.png";

// Base style for sidebar links
const baseLinkStyle = {
  display: "flex",
  alignItems: "center",
  padding: "10px 18px",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: 500,
  transition: "all 0.2s ease-in-out",
  borderRadius: "10px",
  margin: "8px 14px",
};

const activeStyle = {
  backgroundColor: "#1A73E8",
};

const EmployeeSidebar = () => {
  return (
    <MDBox
      className="sidebar"
      sx={{
        width: "240px",
        height: "calc(100vh - 30px)",
        backgroundColor: "#00569A",
        position: "fixed",
        top: "15px",
        left: "15px",
        color: "#fff",
        borderTopLeftRadius: "18px",
        borderBottomLeftRadius: "18px",
        paddingTop: "20px",
        paddingBottom: "20px",
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top content */}
      <MDBox>
        {/* Logo / Brand */}
         <MDBox px={3} mb={2} display="flex" alignItems="center" gap={1}>
          <MDTypography variant="h6" color="white" fontWeight="bold">
            Timesheet
          </MDTypography>
          <img
            src={logo} // ✅ imported logo used here
            alt="Logo"
            style={{ width: "30px", height: "30px", objectFit: "contain" }}
          />
        </MDBox>

        {/* Navigation Links */}
        <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
          {[
            // { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
            { to: "/employee-time", icon: "access_time", label: "Timesheet" },
            // { to: "/authentication/sign-in", icon: "login", label: "Sign In" },
          ].map(({ to, icon, label }) => (
            <li key={label}>
              <NavLink
                to={to}
                style={({ isActive }) => ({
                  ...baseLinkStyle,
                  ...(isActive ? activeStyle : {}),
                })}
              >
                <Icon fontSize="small" sx={{ mr: 1 }}>
                  {icon}
                </Icon>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </MDBox>

      {/* Logout button at the bottom */}
      <MDBox px={2}>
        <NavLink to="/authentication/sign-in" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 500,
              color: "#fff", // 👈 This makes Logout text white
            }}
            startIcon={<Icon>logout</Icon>}
          >
            Logout
          </Button>
        </NavLink>
      </MDBox>
    </MDBox>
  );
};

export default EmployeeSidebar;
