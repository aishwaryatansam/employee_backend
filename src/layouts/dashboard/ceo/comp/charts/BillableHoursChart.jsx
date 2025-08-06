import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../../Analytics/analytics.css";

const data = [
  { name: "Week 1", Billable: 32, NonBillable: 8 },
  { name: "Week 2", Billable: 35, NonBillable: 5 },
  { name: "Week 3", Billable: 28, NonBillable: 12 },
  { name: "Week 4", Billable: 40, NonBillable: 4 },
];

const BillableHoursChart = ({ month, department }) => {
  return (
    <div className="chart-container fade-slide-in">
      <h3 className="chart-title">Billable vs Non-Billable Hours</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="Billable" fill="#4CAF50" radius={[4, 4, 0, 0]} />
          <Bar dataKey="NonBillable" fill="#E91E63" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BillableHoursChart;
