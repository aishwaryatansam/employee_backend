import adminRoutes from "./routes/admin.routes";
import employeeRoutes from "./routes/employee.routes";
import tlRoutes from "./routes/tl.routes";
import HRroutes from "./routes/hr.routes";
const routes = [...adminRoutes, ...employeeRoutes, ...tlRoutes, ...HRroutes];

export default routes;
