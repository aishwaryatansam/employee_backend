import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import logo from "assets/images/logos/tansamlogo.png";

import { useNavigate } from "react-router-dom";
import users from "data/users"; // Update path based on your structure

function Basic() {
  const [empid, setEmpid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // ✅ prevent default form submission

    const user = users.find((u) => u.empid === empid && u.password === password);

    if (user) {
      // ✅ Set login-related data in localStorage
      localStorage.setItem("role", user.role);
      localStorage.setItem("layout", "dashboard");
      localStorage.setItem("loggedIn", "true"); // optional if you want to protect routes

      // ✅ Redirect based on role
      if (user.role === "admin") {
        navigate("/dashboard/admin");
      } else if (user.role === "employee") {
        navigate("/dashboard");
      } else if (user.role === "tl") {
        navigate("/tldashboard");
      } else if (user.role === "hr") {
        navigate("/hr/dashboard");
      }
    } else {
      alert("Invalid EMPID or Password");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
            Login
          </MDTypography>
        </MDBox>
        <MDBox pt={1} pb={2} px={3}>
          <form onSubmit={handleLogin}>
            <img
              src={logo}
              alt="Company Logo"
              style={{ display: "block", margin: "0px auto 5px auto", width: "60px" }}
            />
            <MDBox mb={2} mt={2}>
              <MDInput
                type="text"
                label="EMPID"
                value={empid}
                onChange={(e) => setEmpid(e.target.value)}
                fullWidth
                size="small"
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                size="small"
              />
            </MDBox>
            <MDBox mt={3} mb={1}>
              <MDButton
                type="submit" // ✅ use type="submit" since wrapped in <form>
                variant="gradient"
                color="info"
                fullWidth
                size="small"
              >
                Login
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
