import AdminDashboard from "layouts/dashboard/admin";
import MembersTable from "layouts/dashboard/admin/pages/MembersTable";
import AddMember from "layouts/dashboard/admin/pages/AddMember";
import Icon from "@mui/material/Icon";
import SignIn from "layouts/authentication/sign-in";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";

const adminRoutes = [
  {
    type: "collapse",
    name: "Admin Dashboard",
    key: "admin-dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard/admin",
    component: <AdminDashboard />,
  },
  {
    type: "collapse",
    name: "Employees",
    key: "members",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/members",
    component: <MembersTable />,
  },
  {
    type: "collapse",
    name: "Add Member",
    key: "add-member",
    icon: <Icon fontSize="small">person_add</Icon>,
    route: "/add-member",
    component: <AddMember />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
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

export default adminRoutes;
