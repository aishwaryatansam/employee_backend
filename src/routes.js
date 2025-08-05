import adminRoutes from "./routes/admin.routes";
import employeeRoutes from "./routes/employee.routes";
import tlRoutes from "./routes/tl.routes";

const routes = [...adminRoutes, ...employeeRoutes, ...tlRoutes];

export default routes;
