import adminRoutes from "./routes/admin.routes";
import employeeRoutes from "./routes/employee.routes";

const routes = [ ...adminRoutes, ...employeeRoutes ];

export default routes;
