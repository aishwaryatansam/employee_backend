import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import reportsChartData from "layouts/dashboard/admin/data/reportsChartData";
import AdminSidebar from "./adminsidebar";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function AdminDashboard() {
  const { projectHours, weeklySubmissions, employeeTrends } = reportsChartData;

  // ✅ State for employee and department
  const [employeeCount, setEmployeeCount] = useState(null);
  const [departmentCount, setDepartmentCount] = useState(null);

  // ✅ State for projects
  const [projectCount, setProjectCount] = useState(null);
  const [ongoingProjects, setOngoingProjects] = useState(null);

  // ✅ State for Billable Projects
  const [billableProjects, setBillableProjects] = useState(null);

  useEffect(() => {
    // 🔹 Fetch employees
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/members");
        const data = await response.json();
        setEmployeeCount(data.length);

        const uniqueDepartments = new Set(data.map((emp) => emp.department));
        setDepartmentCount(uniqueDepartments.size);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    // 🔹 Fetch projects
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3001/getProjects");
        const data = await response.json();

        setProjectCount(data.length); // total projects
        setOngoingProjects(data.filter((p) => p.status === "Ongoing").length); // ongoing projects
        setBillableProjects(data.filter((p) => p.projectType === "Billable").length); // ✅ billable projects
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchEmployees();
    fetchProjects();
  }, []);

  return (
    <>
      <AdminSidebar />
      <MDBox ml="240px" py={5} px={5}>
        <DashboardNavbar />
        <MDBox py={3}>
          <Grid container spacing={3}>
            {/* ✅ Dynamic Projects */}
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="folder"
                  title="Total Projects"
                  count={projectCount !== null ? projectCount : "..."}
                  percentage={{
                    color: "success",
                    // amount: ongoingProjects !== null ? `+${ongoingProjects}` : "...",
                    // label: "Ongoing projects"
                  }}
                />
              </MDBox>
            </Grid>

            {/* ✅ Dynamic Billable Projects */}
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="hourglass_empty"
                  title="Billable Projects"
                  count={billableProjects !== null ? billableProjects : "..."}
                  percentage={{
                    color: "success",
                    amount: "",
                    // label: "projects marked as Billable"
                  }}
                />
              </MDBox>
            </Grid>

            {/* ✅ Dynamic Departments */}
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Departments"
                  count={departmentCount !== null ? departmentCount : "..."}
                  percentage={{
                    color: "success",
                    amount: "",
                    // label: "active departments"
                  }}
                />
              </MDBox>
            </Grid>

            {/* ✅ Dynamic Employees */}
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="person_add"
                  title="Total Employees"
                  count={employeeCount !== null ? employeeCount : "..."}
                  percentage={{
                    color: "success",
                    amount: "", // was "+40"
                    // label: "active employees"
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>

          {/* Charts (still static) */}
          <MDBox mt={4.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsBarChart
                    color="info"
                    title="Project-wise Logged Hours"
                    description="Logged hours across all active projects"
                    date="Updated just now"
                    chart={projectHours}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsLineChart
                    color="success"
                    title="Weekly Timesheet Submissions"
                    description="Submissions over the past 6 weeks"
                    date="Last synced 5 min ago"
                    chart={weeklySubmissions}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsLineChart
                    color="dark"
                    title="Employee Work Trends"
                    description="Average hours worked weekly"
                    date="Latest report"
                    chart={employeeTrends}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
    </>
  );
}

export default AdminDashboard;
