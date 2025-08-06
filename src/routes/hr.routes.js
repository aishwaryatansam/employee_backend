import HRDashboard from "layouts/dashboard/hr/dashboard/index";
import CreateProject from "layouts/dashboard/hr/createproject/createproject";
import CompanyOverview from "layouts/dashboard/hr/companyoverview/companyoverview";
import AssignTL from "layouts/dashboard/hr/assigntl/assigntl";

// @mui icons
import Icon from "@mui/material/Icon";

const HRroutes = [
  {
    type: "collapse",
    name: "HR Dashboard",
    key: "hr-dashboard",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/hr/dashboard",
    component: <HRDashboard />,
  },
  {
    type: "collapse",
    name: "Create Project",
    key: "create-project",
    icon: <Icon fontSize="small">add_circle</Icon>,
    route: "/hr/create-project",
    component: <CreateProject />,
  },
  {
    type: "collapse",
    name: "Company Overview",
    key: "company-overview",
    icon: <Icon fontSize="small">business</Icon>,
    route: "/hr/company-overview",
    component: <CompanyOverview />,
  },
  {
    type: "collapse",
    name: "Assign TL",
    key: "assign-tl",
    icon: <i className="material-icons">supervisor_account</i>,
    route: "/hr/assign-tl",
    component: <AssignTL />,
  },
];

export default HRroutes;
