import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../../Analytics/analytics.css";

const sampleData = [
  { department: "Engineering", hours: 1620 },
  { department: "Marketing", hours: 980 },
  { department: "Sales", hours: 1340 },
  { department: "HR", hours: 650 },
];

const DepartmentHoursChart = ({ month, department }) => {
  // You can use month/department props to filter actual data in real use
  return (
    <div className="chart-container">
      <div className="chart-container fade-in-up">
        <h4 className="chart-title">Department-wise Total Hours</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sampleData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="url(#gradient)" radius={[10, 10, 0, 0]} />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1abfe8ff" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#42adf4ff" stopOpacity={0.5} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentHoursChart;
