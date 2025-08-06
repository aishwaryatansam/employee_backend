import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../../Analytics/analytics.css";

// Sample weekly overtime data
const data = [
  { week: "Week 1", hours: 15 },
  { week: "Week 2", hours: 25 },
  { week: "Week 3", hours: 20 },
  { week: "Week 4", hours: 30 },
  { week: "Week 5", hours: 18 },
];

const OvertimeTrendChart = ({ month, department }) => {
  // In future, filter `data` based on month and department

  return (
    <div className="chart-container">
      <div className="chart-container fade-slide-in">
        <h4 className="chart-title">Overtime Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#f15a66ff"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OvertimeTrendChart;
