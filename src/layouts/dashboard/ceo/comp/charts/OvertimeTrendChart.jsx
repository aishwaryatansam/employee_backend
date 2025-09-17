import React, { useEffect, useState } from "react"; 
import PropTypes from "prop-types";
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

const OvertimeTrendChart = ({ month, department }) => {
  const [chartData, setChartData] = useState([]);

useEffect(() => {
  fetch("http://localhost:3001/getHourDetailsByMonthForCeo")
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.data) {
        // Group by week
        const weekMap = {};

        data.data.forEach((item) => {
          const date = new Date(item.date);
          const weekNumber = Math.ceil(date.getDate() / 7); // simple week calculation
          const weekLabel = `Week ${weekNumber}`;

          const overtime = parseFloat(item.overtime) || 0;

          if (weekMap[weekLabel]) {
            weekMap[weekLabel] += overtime;
          } else {
            weekMap[weekLabel] = overtime;
          }
        });

        // Format for chart
        const formatted = Object.keys(weekMap).map((week) => ({
          week,
          hours: weekMap[week],
        }));

        setChartData(formatted);
      }
    })
    .catch((err) => console.error("Fetch error (CEO):", err));
}, [month]);


  return (
    <div className="chart-container">
      <div className="chart-container fade-slide-in">
        <h4 className="chart-title">Overtime Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="week" 
              stroke="#555" 
              interval={0} 
              tick={{ fontSize: 12 }} 
            />
            <YAxis 
              stroke="#555" 
              allowDecimals={false} 
              domain={['auto', 'auto']} // dynamically adjusts based on overtime
            />
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
