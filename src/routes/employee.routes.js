// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard/employee/dashboard";
import YourTimesheet from "layouts/dashboard/employee/yourtimesheet";
import ViewReports from "layouts/dashboard/employee/viewreports";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Your Timesheet",
    key: "your-timesheet",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/yourtimesheet",
    component: <YourTimesheet />,
  },
  {
    type: "collapse",
    name: "Report View",
    key: "report-view",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/viewreport",
    component: <ViewReports />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

export default routes;
