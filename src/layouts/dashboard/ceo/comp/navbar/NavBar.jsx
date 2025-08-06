import React from "react";
import { AppBar, Paper, Box, IconButton, Typography, InputBase, Breadcrumbs } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import { FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const getBreadcrumbs = (pathname) => {
  const paths = pathname.split("/").filter((x) => x);
  return paths.map((path, idx) => (
    <Typography
      key={idx}
      color={idx === paths.length - 1 ? "textPrimary" : "inherit"}
      fontWeight={idx === paths.length - 1 ? "bold" : "normal"}
      fontSize="14px"
    >
      {capitalize(path)}
    </Typography>
  ));
};

const NavBar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: "calc(100% - 250px)",
        ml: "250px",
        backgroundColor: "transparent",
        boxShadow: "none",
        zIndex: 1101,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          mx: 2,
          mt: 2,
          px: 3,
          py: 1.5,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Left Section: Toggle + Home/Breadcrumbs */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={onToggleSidebar}>
            <MenuIcon sx={{ color: "#344767" }} />
          </IconButton>
          <HomeIcon sx={{ color: "#344767", fontSize: 22 }} />
          <Breadcrumbs separator="/" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Box>

        {/* Right Section: Icons + Search */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f0f2f5",
              px: 2,
              py: 0.5,
              borderRadius: "8px",
              mr: 2,
              width: "200px",
            }}
          >
            <SearchIcon sx={{ color: "#344767", mr: 1 }} />
            <InputBase
              placeholder="Search…"
              fullWidth
              sx={{ fontSize: "14px", color: "#344767" }}
            />
          </Box>

          <IconButton>
            <NotificationsIcon sx={{ color: "#344767" }} />
          </IconButton>
          <IconButton>
            <SettingsIcon sx={{ color: "#344767" }} />
          </IconButton>
          <IconButton>
            <FaUserCircle style={{ fontSize: "22px", color: "#344767" }} />
          </IconButton>
        </Box>
      </Paper>
    </AppBar>
  );
};

export default NavBar;
