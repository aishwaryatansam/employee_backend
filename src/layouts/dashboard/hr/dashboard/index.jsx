import React, { useState, useEffect } from "react";
import { Card, CardContent, Grid, Typography, Switch, Box } from "@mui/material";
import { Group, Assignment, EmojiEvents, BusinessCenter } from "@mui/icons-material";
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

const cardData = [
  {
    title: "Total Employees",
    value: 128,
    icon: <Group fontSize="medium" />,
    className: "card-info",
  },
  {
    title: "Ongoing Projects",
    value: 15,
    icon: <Assignment fontSize="medium" />,
    className: "card-success",
  },
  {
    title: "Completed Tasks",
    value: 284,
    icon: <EmojiEvents fontSize="medium" />,
    className: "card-warning",
  },
  {
    title: "Active Clients",
    value: 12,
    icon: <BusinessCenter fontSize="medium" />,
    className: "card-danger",
  },
];

const HrDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <HrSidebar />
      <Box sx={{ ml: "260px" }}>
        {" "}
        {/* Adjust sidebar width */}
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
              <Typography variant="body2" className="switch-label">
                Dark Mode
              </Typography>
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
                    <Counter value={item.value} duration={1500} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <div className="table-section">
            <Typography className="table-title">Recent Team Assignments</Typography>
            <table className="assignment-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Team Lead</th>
                  <th>Team Size</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Website Revamp</td>
                  <td>Alice Johnson</td>
                  <td>6</td>
                  <td>In Progress</td>
                </tr>
                <tr>
                  <td>Mobile App Development</td>
                  <td>Bob Smith</td>
                  <td>4</td>
                  <td>Completed</td>
                </tr>
                <tr>
                  <td>Internal Tools</td>
                  <td>Chris Lee</td>
                  <td>5</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default HrDashboard;
