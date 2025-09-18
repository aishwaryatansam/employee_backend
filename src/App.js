import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Custom Sidebars
import HrSidebar from "layouts/dashboard/hr/sidebar/HrSidebar";
import EmployeeSidebar from "layouts/dashboard/employee/empsidebar";
import AdminSidebar from "layouts/dashboard/admin/adminsidebar";
import TlSidebar from "layouts/dashboard/tl/TLsidebar";
import CEOSidebar from "layouts/dashboard/ceo/comp/Sidebar/CEOSidebar";

// CEO-specific components
import CEORoutes from "routes/ceo.routes";

// Themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugin
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Routes
import routes from "routes";

// Context
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Pages
import EmployeeDetail from "layouts/dashboard/tl/page/EmployeeDetail";
import ForgotPassword from "layouts/authentication/ForgotPassword/ForgotPassword";
import ResetPassword from "layouts/authentication/ForgotPassword/ResetPassword";

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
  const [userRole, setUserRole] = useState("");
  const [currentLayout, setCurrentLayout] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role") || "employee";
    const layoutFromStorage = localStorage.getItem("layout") || "dashboard";
    setUserRole(role);
    setCurrentLayout(layoutFromStorage);
  }, []);

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

  const getRoutes = (allRoutes) =>
    allRoutes.flatMap((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route && route.component) {
        return <Route key={route.key} exact path={route.route} element={route.component} />;
      }

      return [];
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

  const SidebarComponent =
    userRole === "employee" ? (
      <EmployeeSidebar />
    ) : userRole === "admin" ? (
      <AdminSidebar />
    ) : userRole === "tl" ? (
      <TlSidebar />
    ) : userRole === "hr" ? (
      <HrSidebar />
    ) : userRole === "ceo" ? (
      <CEOSidebar />
    ) : null;

  const themeSelection = darkMode
    ? direction === "rtl"
      ? themeDarkRTL
      : themeDark
    : direction === "rtl"
    ? themeRTL
    : theme;

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeSelection}>
        <CssBaseline />
       {!pathname.startsWith("/authentication") && pathname !== "/reset-password" && currentLayout === "dashboard" && SidebarComponent}


        <Configurator />
        {configsButton}
        <Routes>
          {getRoutes(routes)}
          {userRole === "ceo" && getRoutes(CEORoutes)}
          <Route path="/employee/:id" element={<EmployeeDetail />} />
          <Route path="/" element={<Navigate to="/authentication/sign-in" />} />
          <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
          <Route path="/authentication/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={themeSelection}>
      <CssBaseline />
    {!pathname.startsWith("/authentication") && pathname !== "/reset-password" && currentLayout === "dashboard" && SidebarComponent}

      <Configurator />
      {configsButton}
      <Routes>
        {getRoutes(routes)}
        {userRole === "ceo" && getRoutes(CEORoutes)}
        <Route path="/employee/:id" element={<EmployeeDetail />} />
        <Route path="/authentication/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/authentication/sign-in" />} />
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
    </ThemeProvider>
  );
}
