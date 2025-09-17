import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Switch,
  Box,
} from "@mui/material";
import {
  Group,
  Assignment,
  EmojiEvents,
  BusinessCenter,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import HrSidebar from "layouts/dashboard/hr/sidebar/HrSidebar";
import HrNavbar from "layouts/dashboard/hr/navbar/HrNavbar";
import "./hrdashboard.css";

const Counter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 10);
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(interval);
      }
      setCount(Math.ceil(start));
    }, 10);

    return () => clearInterval(interval);
  }, [value, duration]);

  return <h3>{count}</h3>;
};

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  duration: PropTypes.number,
};

const HrDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [employeeCount, setEmployeeCount] = useState(null);
  const [ongoingProjects, setOngoingProjects] = useState(null);
  const [completedProjects, setCompletedProjects] = useState(null);
  const [activeClients, setActiveClients] = useState(null);

  useEffect(() => {
    // Fetch employee count
    fetch("http://localhost:3001/api/hr/employee-count")
      .then((res) => res.json())
      .then((data) => setEmployeeCount(data.totalEmployees))
      .catch((err) => console.error("Employee count error:", err));

    // Fetch project data and derive metrics
    fetch("http://localhost:3001/getProjects")
      .then((res) => res.json())
      .then((projects) => {
        // Count ongoing and completed projects
        setOngoingProjects(projects.filter((p) => p.status === "Ongoing").length);
        setCompletedProjects(projects.filter((p) => p.status === "Completed").length);

        // Count unique clients from hr_project table
        const uniqueClients = new Set();
        projects.forEach((project) => {
          const clientName = project.client?.trim().toLowerCase();
          if (clientName) {
            uniqueClients.add(clientName);
          }
        });
        setActiveClients(uniqueClients.size);
      })
      .catch((err) => console.error("Project fetch error:", err));
  }, []);

  const cardData = [
    {
      title: "Total Employees",
      value: employeeCount ?? 0,
      icon: <Group fontSize="medium" />,
      className: "card-info",
    },
    {
      title: "Ongoing Projects",
      value: ongoingProjects ?? 0,
      icon: <Assignment fontSize="medium" />,
      className: "card-success",
    },
    {
      title: "Completed Projects",
      value: completedProjects ?? 0,
      icon: <EmojiEvents fontSize="medium" />,
      className: "card-warning",
    },
    {
      title: "Active Clients",
      value: activeClients ?? 0,
      icon: <BusinessCenter fontSize="medium" />,
      className: "card-danger",
    },
  ];

  return (
    <>
      <HrSidebar />
      <Box sx={{ ml: "260px" }}>
        <HrNavbar />
        <Box
          className={`hr-dashboard-container ${darkMode ? "dark-mode" : "light-mode"}`}
          sx={{ pt: 12, px: 3 }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <header className="hr-dashboard-header">
              <h2 className="hr-title">HR Dashboard</h2>
              <p className="hr-subtitle">Projects and Assignments Overview</p>
            </header>
            <div className="theme-switch">
              <Typography variant="body2" className="switch-label">Dark Mode</Typography>
              <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </div>
          </Box>

          <Grid container spacing={3} className="summary-row">
            {cardData.map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card className={`summary-card ${item.className}`}>
                  <div className="card-icon-container">{item.icon}</div>
                  <CardContent className="card-content">
                    <h5>{item.title}</h5>
                    {item.value === null ? (
                      <Typography variant="body2">Loading...</Typography>
                    ) : (
                      <Counter value={item.value} duration={1500} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default HrDashboard;