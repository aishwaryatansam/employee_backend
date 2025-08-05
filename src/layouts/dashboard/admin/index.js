import React from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import reportsChartData from "layouts/dashboard/admin/data/reportsChartData";
import AdminSidebar from "./adminsidebar"; // ✅ import your sidebar
import DashboardNavbar from "examples/Navbars/DashboardNavbar"; // ✅ also needed for top navbar

function AdminDashboard() {
  const { projectHours, weeklySubmissions, employeeTrends } = reportsChartData;

  return (
    <>
      <AdminSidebar /> {/* ✅ Render the sidebar */}
      <MDBox ml="240px" py={5} px={5}>
        <DashboardNavbar />
        <MDBox py={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="folder"
                  title="Total Projects"
                  count={10}
                  percentage={{
                    color: "success",
                    amount: "+5",
                    label: "On going projects",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="hourglass_empty"
                  title="Billable Hours"
                  count="460"
                  percentage={{
                    color: "success",
                    amount: "+3%",
                    label: "than last month",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Departments"
                  count="6"
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "than yesterday",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="person_add"
                  title="Total Employees"
                  count="+50"
                  percentage={{
                    color: "success",
                    amount: "+40",
                    label: "active employees",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
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
