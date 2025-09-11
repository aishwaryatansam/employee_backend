import { useState, useEffect } from "react";

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
import bgImage from "assets/images/background.png";
import logo from "assets/images/logos/tansamlogo.png";

import { useNavigate } from "react-router-dom";

function Basic() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch members from backend
  useEffect(() => {
    fetch("http://localhost:3001/api/members")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error("Failed to fetch members:", err));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Find user by email & password
    const user = members.find((u) => u.email === email && u.password.trim() === password.trim());

    if (user) {
      // ✅ Store login info
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);

      // ✅ Redirect based on role
      if (user.role === "admin") {
        navigate("/dashboard/admin");
      } else if (user.role === "employee") {
        navigate("/dashboard");
      } else if (user.role === "tl") {
        navigate("/tldashboard");
      } else if (user.role === "hr") {
        navigate("/hr/dashboard");
      } else if (user.role === "ceo") {
        navigate("/ceo-dashboard");
      }
    } else {
      alert("Invalid Email or Password");
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
              style={{
                display: "block",
                margin: "0px auto 5px auto",
                width: "60px",
              }}
            />
            <MDBox mb={2} mt={2}>
              <MDInput
                type="text"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <MDButton type="submit" variant="gradient" color="info" fullWidth size="small">
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
