// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard/employee/dashboard";
import YourTimesheet from "layouts/dashboard/employee/yourtimesheet";
import ViewReports from "layouts/dashboard/employee/viewreports";
import SignIn from "layouts/authentication/sign-in";
import EmployeeTime from "layouts/dashboard/employee/EmployeeDetails";

// @mui icons
import Icon from "@mui/material/Icon";

const employeeRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/tldashboard",
    component: <TLDashboard />,
  },
  {
    type: "collapse",
    name: "Timesheet",
    key: "timesheet",
    icon: <Icon fontSize="small">schedule</Icon>,
    route: "/timesheet",
    component: <Timesheet />,
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

export default employeeRoutes;
