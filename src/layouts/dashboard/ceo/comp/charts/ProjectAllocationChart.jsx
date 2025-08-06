import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../../Analytics/analytics.css";

// Sample data (replace with dynamic data as needed)
const data = [
  { name: "Project A", value: 800 },
  { name: "Project B", value: 500 },
  { name: "Project C", value: 300 },
  { name: "Project D", value: 200 },
];

// Material Dashboard 2 professional color scheme
const COLORS = ["#004d40", "#00796b", "#26a69a", "#4db6ac", "#80cbc4"];

const ProjectAllocationChart = ({ month, department }) => {
  // You can later use month/department props to filter real data

  return (
    <div className="chart-container">
      <div className="chart-container fade-in-up">
        <h4 className="chart-title">Project Allocation</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label={({ name }) => name}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectAllocationChart;
