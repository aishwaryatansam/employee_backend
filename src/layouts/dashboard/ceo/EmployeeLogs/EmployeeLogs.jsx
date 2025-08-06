import React, { useState } from "react";
import "./employeelogs.css";
import CEOSidebar from "../comp/Sidebar/CEOSidebar";
import NavBar from "../comp/navbar/NavBar";

const mockData = {
  Alice: [
    { date: "2025-07-01", project: "Alpha", hours: 8, status: "Approved" },
    { date: "2025-07-02", project: "Alpha", hours: 7, status: "Pending" },
  ],
  Bob: [
    { date: "2025-07-01", project: "Beta", hours: 6, status: "Approved" },
    { date: "2025-07-02", project: "Gamma", hours: 5, status: "Rejected" },
  ],
};

export default function EmployeeLogs() {
  const [search, setSearch] = useState("");

  const filteredEmployees = Object.keys(mockData).filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="employee-logs-container">
      <CEOSidebar />
      <NavBar />
      <h2 className="title">📋 Employee Logs</h2>
      <p className="subtitle">Search and review timesheet entries by employee.</p>

      <input
        type="text"
        placeholder="🔍 Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {filteredEmployees.length === 0 && <p className="no-results">No employees found.</p>}

      {filteredEmployees.map((employee) => (
        <div key={employee} className="employee-block">
          <h3 className="employee-name">{employee}</h3>
          <table className="log-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockData[employee].map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.project}</td>
                  <td>{entry.hours}</td>
                  <td className={`status ${entry.status.toLowerCase()}`}>{entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
