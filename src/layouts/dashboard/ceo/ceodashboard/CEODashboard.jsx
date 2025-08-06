import React from "react";
import "./CEODashboard.css";
import CEOSidebar from "../comp/Sidebar/CEOSidebar";
import NavBar from "../comp/navbar/NavBar";
import SummaryCards from "../comp/SummaryCards";

const CEODashboard = () => {
  return (
    <div className="dashboard-container">
      <CEOSidebar />
      <div className="main-content">
        <NavBar />

        <div className="dashboard-header">
          <h2 className="dashboard-title">CEO Dashboard</h2>
          <p className="dashboard-subtitle">Key workforce insights at a glance</p>
        </div>

        <SummaryCards />

        <h3 className="section-title">AI-Powered Insights</h3>
        <div className="cards-row">
          <div className="info-card">
            <h4>AI-Based Productivity Score</h4>
            <p>
              <strong>Alice:</strong> <span className="green">92%</span>
            </p>
            <p>
              <strong>Bob:</strong> <span className="orange">76%</span>
            </p>
            <p>
              <strong>Charlie:</strong> <span className="blue">84%</span>
            </p>
          </div>

          <div className="info-card warning-card">
            <h4>⚠️ Anomaly Alerts</h4>
            <p>
              <strong>Bob:</strong> Unusual drop in logged hours
            </p>
            <p>
              <strong>Charlie:</strong> Sudden overtime spike
            </p>
          </div>

          <div className="info-card">
            <h4>📊 Workload Forecast</h4>
            <p>
              <strong>Alice:</strong> <span className="green">Light</span>
            </p>
            <p>
              <strong>Bob:</strong> <span className="orange">Moderate</span>
            </p>
            <p>
              <strong>Charlie:</strong> <span className="red">Heavy</span>
            </p>
          </div>
        </div>

        <h3 className="section-title">Operational Insights</h3>
        <div className="cards-row">
          <div className="info-card">
            <h4>Top Overtime Employees</h4>
            <ul>
              <li>Anjali - 14 hrs</li>
              <li>Rahul - 12 hrs</li>
              <li>Fatima - 10 hrs</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>Underutilized Employees</h4>
            <ul>
              <li>Priya - 3.1 hrs/day</li>
              <li>Ravi - 2.8 hrs/day</li>
              <li>Meena - 3.4 hrs/day</li>
            </ul>
          </div>

          <div className="info-card warning-card">
            <h4>Late Timesheet Submissions</h4>
            <ul>
              <li>
                Sundar - <span className="red">3 days</span>
              </li>
              <li>
                Divya - <span className="orange">2 days</span>
              </li>
              <li>
                Karthik - <span className="orange">2 days</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CEODashboard;
