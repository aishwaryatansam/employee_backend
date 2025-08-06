import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import "../../Analytics/analytics.css";

const data = [
  { name: "Alice", hours: 10 },
  { name: "Bob", hours: 8 },
  { name: "Charlie", hours: 6 },
  { name: "David", hours: 5 },
  { name: "Eva", hours: 4 },
];

const UnderutilizedEmployeesChart = () => {
  return (
    <motion.div
      className="analytics-chart-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="analytics-chart-title">Underutilized Employees</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="hours" fill="#c04f62ff" barSize={40} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default UnderutilizedEmployeesChart;
