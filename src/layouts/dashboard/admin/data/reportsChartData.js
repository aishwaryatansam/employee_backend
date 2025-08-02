const reportsChartData = {
  projectHours: {
    labels: ["Project A", "Project B", "Project C", "Project D"],
    datasets: {
      label: "Logged Hours",
      data: [120, 95, 150, 80],
    },
  },

  weeklySubmissions: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: {
      label: "Timesheet Submissions",
      data: [35, 42, 38, 50],
    },
  },

  employeeTrends: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: {
      label: "Active Employees",
      data: [15, 17, 14, 20],
    },
  },
};

export default reportsChartData;
