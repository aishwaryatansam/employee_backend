import React from "react";
import "./analytics.css";
import CEOSidebar from "../comp/Sidebar/CEOSidebar";
import NavBar from "../comp/navbar/NavBar";

import DepartmentHoursChart from "../comp/charts/DepartmentHoursChart";
import ProjectAllocationChart from "../comp/charts/ProjectAllocationChart";
import OvertimeTrendChart from "../comp/charts/OvertimeTrendChart";
import EmployeeTimeline from "../comp/charts/EmployeeTimeline";
  const weeklyData = {};
  data.forEach((entry) => {
    const week = `Week ${dayjs(entry.date).week()}`;
    const overtime = Number(entry.overtime || 0);
    weeklyData[week] = (weeklyData[week] || 0) + overtime;
  });

  const chartData = Object.keys(weeklyData).map((week) => ({
    week,
    overtime: weeklyData[week],
  }));
const Analytics = () => {
  return (
    <div className="analytics-container">
      <CEOSidebar />
      <NavBar />
      <h2 className="analytics-title">Analytics Overview</h2>

      <div className="analytics-grid">
        <div className="analytics-card fade-in-up">
          <h3>Department-wise Total Hours</h3>
          <DepartmentHoursChart />
        </div>

        <div className="analytics-card fade-in-up">
          <h3>Project Allocation</h3>
          <ProjectAllocationChart />
        </div>

        <div className="analytics-card fade-in-up">
          <h3>Overtime Trends</h3>
          <OvertimeTrendChart />
        </div>
        <div className="analytics-card fade-in-up">
          <h3>Employee Weekly Timeline</h3>
          <EmployeeTimeline />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
