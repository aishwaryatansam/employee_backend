import adminRoutes from "./routes/admin.routes";
import employeeRoutes from "./routes/employee.routes";
import tlRoutes from "./routes/tl.routes";
import HRroutes from "./routes/hr.routes";
import CEOroutes from "routes/ceo.routes";

const routes = [...adminRoutes, ...employeeRoutes, ...tlRoutes, ...HRroutes, ...CEOroutes];

export default routes;
