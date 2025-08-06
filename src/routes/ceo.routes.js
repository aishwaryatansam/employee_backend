import CEODashboard from "layouts/dashboard/ceo/ceodashboard/CEODashboard";
import Analytics from "layouts/dashboard/ceo/Analytics/Analytics";
import EmployeeLogs from "layouts/dashboard/ceo/EmployeeLogs/EmployeeLogs";
import TeamReports from "layouts/dashboard/ceo/TeamReports/TeamReports";

// @mui icons
import Icon from "@mui/material/Icon";

const CEOroutes = [
  {
    type: "collapse",
    name: "CEO Dashboard",
    key: "ceo-dashboard",
    icon: <Icon fontSize="small">business</Icon>,
    route: "/ceo-dashboard",
    component: <CEODashboard />,
  },
  {
    type: "collapse",
    name: "Analytics",
    key: "analytics",
    icon: <Icon fontSize="small">analytics</Icon>,
    route: "/Analytics",
    component: <Analytics />,
  },
  {
    type: "collapse",
    name: "Employee Logs",
    key: "employee-logs",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/employee-logs",
    component: <EmployeeLogs />,
  },
  {
    type: "collapse",
    name: "Team Reports",
    key: "team-reports",
    icon: <Icon fontSize="small">groups</Icon>,
    route: "/team-reports",
    component: <TeamReports />,
  },
];

export default CEOroutes;
