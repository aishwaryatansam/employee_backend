// @mui components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Material Dashboard components
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";

// React + Calendar
import Calendar from "react-calendar";
import React, { useState, useRef } from "react";

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

function EmployeeDashboard() {
  const dashboardRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const efficiency = {
    Daily: "80%",
    Weekly: "75%",
    Monthly: "70%",
    Yearly: "85%",
  };
  const presentPercent = "75%";
  const absentPercent = "25%";
  const presentDates = [];
  const absentDates = [];

  const colors = ["info", "success", "warning", "error"];
  const icons = ["insights", "timeline", "leaderboard", "bar_chart"];

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
      <DashboardNavbar />
      <MDBox py={3} ref={dashboardRef}>
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
            <ReportsLineChart
              color="info"
              title={`${selected} Efficiency`}
              description="Line chart for selected period"
              date="This month"
              chart={lineChartDataMap[selected]}
              options={chartOptions}
            />
          </MDBox>
        )}

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={6}>
            <MDBox sx={{ borderRadius: "16px", padding: 2 }}>
              <ComplexStatisticsCard
                color="success"
                icon={<Icon>check_circle</Icon>}
                title="Present %"
                count={presentPercent}
                percentage={{ color: "success", amount: "", label: "Today" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDBox sx={{ borderRadius: "16px", padding: 2 }}>
              <ComplexStatisticsCard
                color="error"
                icon={<Icon>highlight_off</Icon>}
                title="Absent %"
                count={absentPercent}
                percentage={{ color: "error", amount: "", label: "Today" }}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4}>
          <MDBox bgColor="white" p={3} borderRadius="lg">
            <h5 style={{ marginBottom: "16px" }}>Attendance Calendar</h5>
            <Calendar
              value={calendarDate}
              onChange={setCalendarDate}
              tileClassName={({ date }) => {
                const f = formatDate(date);
                if (presentDates.includes(f)) return "present-day";
                if (absentDates.includes(f)) return "absent-day";
                return null;
              }}
              className="custom-calendar"
              prev2Label={null}
              next2Label={null}
              formatShortWeekday={(locale, date) =>
                date.toLocaleDateString(locale, { weekday: "short" })[0]
              }
            />
          </MDBox>
        </MDBox>
      </MDBox>

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

export default EmployeeDashboard;
