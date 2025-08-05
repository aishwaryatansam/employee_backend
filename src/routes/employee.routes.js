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
    route: "/dashboard",
    component: <Dashboard />,
  },

  {
    type: "collapse",
    name: "Timesheet",
    key: "employee-time",
    icon: <Icon fontSize="small">access_time</Icon>,
    route: "/employee-time",
    component: <EmployeeTime />,
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
