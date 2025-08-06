import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../Analytics/analytics.css";

const data = [
  {
    name: "Emp A",
    Meetings: 5,
    Coding: 20,
    Breaks: 3,
    Reviews: 4,
  },
  {
    name: "Emp B",
    Meetings: 7,
    Coding: 18,
    Breaks: 2,
    Reviews: 5,
  },
  {
    name: "Emp C",
    Meetings: 4,
    Coding: 22,
    Breaks: 1,
    Reviews: 3,
  },
  {
    name: "Emp D",
    Meetings: 6,
    Coding: 19,
    Breaks: 2,
    Reviews: 6,
  },
];

const EmployeeTimeline = ({ month, department }) => {
  return (
    <div className="chart-container fade-slide-in">
      <h3 className="chart-title">Employee Weekly Timeline</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Meetings" stackId="a" fill="#20349bff" />
          <Bar dataKey="Coding" stackId="a" fill="#57a0b3f6" />
          <Bar dataKey="Breaks" stackId="a" fill="#bd2e23ff" />
          <Bar dataKey="Reviews" stackId="a" fill="hsla(212, 79%, 58%, 1.00)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeTimeline;
