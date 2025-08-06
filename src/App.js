import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Custom sidebars
import HrSidebar from "layouts/dashboard/hr/sidebar/HrSidebar";
import EmployeeSidebar from "layouts/dashboard/employee/empsidebar";
import AdminSidebar from "layouts/dashboard/admin/adminsidebar";
import TlSidebar from "layouts/dashboard/tl/TLsidebar";
import EmployeeDetail from "layouts/dashboard/tl/page/EmployeeDetail";
// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// All routes
import routes from "routes";

// Context
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // ✅ Track user role and layout
  const [userRole, setUserRole] = useState("");
  const [currentLayout, setCurrentLayout] = useState("");

  // ✅ Load role and layout from localStorage
  useEffect(() => {
    const role = localStorage.getItem("role") || "employee";
    const layoutFromStorage = localStorage.getItem("layout") || "dashboard";
    setUserRole(role);
    setCurrentLayout(layoutFromStorage);
  }, []);

  // RTL setup
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Generate routes
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  // ✅ Choose sidebar based on role
  const SidebarComponent =
    userRole === "employee" ? (
      <EmployeeSidebar />
    ) : userRole === "admin" ? (
      <AdminSidebar />
    ) : userRole === "tl" ? (
      <TlSidebar />
    ) : userRole === "hr" ? (
      <HrSidebar />
    ) : null;

  const renderLayout = (
    <>
      {SidebarComponent}
      <Configurator />
      {configsButton}
    </>
  );

  // Main JSX
  const themeSelection = darkMode
    ? direction === "rtl"
      ? themeDarkRTL
      : themeDark
    : direction === "rtl"
    ? themeRTL
    : theme;

  const AppContent = (
    <>
      {currentLayout === "dashboard" && renderLayout}
      <Routes>
        {getRoutes(routes)}
        <Route path="/employee/:id" element={<EmployeeDetail />} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/authentication/sign-in" />} />

        {/* Catch-all for unmatched routes */}
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
    </>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeSelection}>
        <CssBaseline />
        {AppContent}
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={themeSelection}>
      <CssBaseline />
      {AppContent}
    </ThemeProvider>
  );
}
