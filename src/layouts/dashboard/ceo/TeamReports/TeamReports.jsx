import React from "react";
import "./teamreports.css";
import CEOSidebar from "../comp/Sidebar/CEOSidebar";
import NavBar from "../comp/navbar/NavBar";

const departments = [
  {
    name: "Engineering",
    totalHours: 1200,
    avgHours: "6.5 hrs/day",
    employees: 20,
    overtime: 180,
  },
  {
    name: "Marketing",
    totalHours: 950,
    avgHours: "5.8 hrs/day",
    employees: 15,
    overtime: 50,
  },
  {
    name: "Sales",
    totalHours: 1100,
    avgHours: "6.2 hrs/day",
    employees: 18,
    overtime: 120,
  },
];

const TeamReports = () => {
  return (
    <div className="team-reports-container">
      <CEOSidebar />
      <NavBar />
      <h2 className="team-reports-title">📊 Team Reports</h2>
      <p className="team-reports-subtitle">Department-wise productivity and timesheet analysis</p>

      <div className="team-cards">
        {departments.map((dept, index) => (
          <div key={index} className="team-card">
            <h3>{dept.name}</h3>
            <ul>
              <li>
                <strong>Total Hours:</strong> {dept.totalHours}
              </li>
              <li>
                <strong>Avg/Employee:</strong> {dept.avgHours}
              </li>
              <li>
                <strong>Employees:</strong> {dept.employees}
              </li>
              <li>
                <strong>Overtime:</strong> {dept.overtime} hrs
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamReports;
