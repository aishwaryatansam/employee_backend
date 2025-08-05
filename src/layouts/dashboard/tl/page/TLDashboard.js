// @mui components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Material Dashboard components
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import TLsidebar from "../TLsidebar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ProjectTable from "./ProjectTable";

// React + Calendar
import Calendar from "react-calendar";
import React, { useState, useRef, useEffect } from "react";

// Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function TLDashboard() {
  const dashboardRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("tl_project_data")) || [];
    setProjects(storedProjects);
  }, []);

  const efficiency = {
    Daily: "80%",
    Weekly: "75%",
    Monthly: "70%",
    Yearly: "85%",
  };

  const colors = ["info", "success", "warning", "error"];
  const icons = ["insights", "timeline", "leaderboard", "bar_chart"];
  const [timesheetData, setTimesheetData] = useState({});

  const [selectedEmployee, setSelectedEmployee] = useState(""); // 🔹 Fix: define this
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tl_team_members")) || [];
    setTeamMembers(stored);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("timesheet_data")) || {};
    setTimesheetData(data);
  }, []);
  const [viewType, setViewType] = useState("Weekly"); // Daily, Weekly, etc.
  const getChartData = () => {
    const employees = selectedEmployee ? [selectedEmployee] : Object.keys(timesheetData);
    const labelMap = {
      Daily: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      Weekly: ["Week 1", "Week 2", "Week 3", "Week 4"],
      Monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      Yearly: ["2020", "2021", "2022", "2023", "2024"],
    };

    const labels = labelMap[viewType] || [];
    const datasets = employees.map((emp, index) => {
      const color = ["#42a5f5", "#66bb6a", "#ffa726", "#ef5350", "#ab47bc"][index % 5];
      const data = new Array(labels.length).fill(0);

      const empData = timesheetData[emp] || {};
      Object.entries(empData).forEach(([dateStr, entries]) => {
        const date = new Date(dateStr);
        let labelIndex = -1;

        if (viewType === "Daily") {
          labelIndex = date.getDay(); // 0 (Sunday) to 6
        } else if (viewType === "Weekly") {
          const week = Math.ceil(date.getDate() / 7);
          labelIndex = week - 1;
        } else if (viewType === "Monthly") {
          labelIndex = date.getMonth(); // 0 to 11
        } else if (viewType === "Yearly") {
          const year = date.getFullYear();
          labelIndex = labels.indexOf(year.toString());
        }

        if (labelIndex >= 0 && labelIndex < data.length) {
          entries.forEach((entry) => {
            if (entry.approved) data[labelIndex] += parseFloat(entry.hours || 0);
          });
        }
      });

      return {
        label: emp,
        data,
        borderColor: color,
        backgroundColor: `${color}33`, // 20% opacity
        tension: 0.4,
        pointBackgroundColor: color,
      };
    });

    return { labels, datasets };
  };

  const lineChartDataMap = {
    Daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Daily Efficiency",
          data: [65, 70, 78, 82, 76, 80],
          borderColor: "#42a5f5",
          backgroundColor: "rgba(66, 165, 245, 0.2)",
          tension: 0.4,
          pointBackgroundColor: ["#42a5f5", "#66bb6a", "#ffa726", "#ef5350", "#ab47bc", "#26a69a"],
        },
      ],
    },
    Weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Weekly Efficiency",
          data: [70, 75, 78, 80],
          borderColor: "#66bb6a",
          backgroundColor: "rgba(102, 187, 106, 0.2)",
          tension: 0.4,
          pointBackgroundColor: ["#66bb6a", "#42a5f5", "#ffa726", "#ab47bc"],
        },
      ],
    },
    Monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        {
          label: "Monthly Efficiency",
          data: [68, 70, 72, 75, 78],
          borderColor: "#ffa726",
          backgroundColor: "rgba(255, 167, 38, 0.2)",
          tension: 0.4,
          pointBackgroundColor: ["#ffa726", "#66bb6a", "#42a5f5", "#ef5350", "#ab47bc"],
        },
      ],
    },
    Yearly: {
      labels: ["2020", "2021", "2022", "2023"],
      datasets: [
        {
          label: "Yearly Efficiency",
          data: [60, 68, 74, 85],
          borderColor: "#ef5350",
          backgroundColor: "rgba(239, 83, 80, 0.2)",
          tension: 0.4,
          pointBackgroundColor: ["#ef5350", "#42a5f5", "#ab47bc", "#26a69a"],
        },
      ],
    },
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: {
      y: { beginAtZero: true },
      x: { grid: { display: false } },
    },
  };

  const formatDate = (d) => d.toISOString().split("T")[0];

  return (
    <DashboardLayout>
      <TLsidebar />
      <MDBox py={3} ref={dashboardRef}>
        <MDBox mb={2} display="flex" gap={2} alignItems="center">
          <label style={{ fontWeight: 600 }}>Select Employee:</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              minWidth: "200px",
            }}
          >
            <option value="">All Employees</option>
            {teamMembers.map((member, index) => (
              <option key={index} value={member}>
                {member.name}
              </option>
            ))}
          </select>
        </MDBox>

        <Grid container spacing={3}>
          {Object.entries(efficiency).map(([label, value], i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <MDBox
                onClick={() => setSelected(label === selected ? null : label)}
                sx={{
                  cursor: "pointer",
                  border: label === selected ? "2px solid #2196f3" : "none",
                  borderRadius: "12px",
                }}
              >
                <ComplexStatisticsCard
                  color={colors[i % colors.length]}
                  icon={<Icon>{icons[i]}</Icon>}
                  title={label}
                  count={value}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Click to view",
                  }}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>

        {selected && (
          <MDBox mt={4}>
            {selected && (
              <MDBox mt={4}>
                <ReportsLineChart
                  color="info"
                  title={`${selected} Efficiency`}
                  description={`Showing ${viewType.toLowerCase()} data for ${
                    selectedEmployee || "all employees"
                  }`}
                  date="This month"
                  chart={getChartData()}
                  options={chartOptions}
                />
              </MDBox>
            )}
          </MDBox>
        )}
      </MDBox>
      <div className="mt-5">
        <ProjectTable projects={projects} />
      </div>

      <style>{`
        .present-day {
          background-color: #28a745 !important;
          color: white !important;
          border-radius: 6px;
        }
        .absent-day {
          background-color: #dc3545 !important;
          color: white !important;
          border-radius: 6px;
        }
        .custom-calendar {
          width: 100% !important;
          border: none !important;
          background: #ffffff !important;
          padding: 1.5rem !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          font-family: 'Roboto', sans-serif;
        }
        .react-calendar__navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .react-calendar__navigation button {
          background: none;
          border: none;
          font-size: 1.1rem;
          font-weight: bold;
          color: #1976d2;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
        .react-calendar__month-view__weekdays {
          text-align: center;
          font-weight: 600;
          color: #666;
        }
        .react-calendar__tile {
          padding: 0.75rem 0.5rem !important;
          font-weight: 500;
          border-radius: 8px;
        }
        .react-calendar__tile--now {
          background: #e3f2fd !important;
          color: #1976d2 !important;
        }
        .react-calendar__tile--active {
          background: #1976d2 !important;
          color: white !important;
        }
        .react-calendar__tile:enabled:hover {
          background: #f0f0f0 !important;
        }
      `}</style>
      <Footer />
    </DashboardLayout>
  );
}

export default TLDashboard;