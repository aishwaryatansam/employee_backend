import React, { useState } from "react";
import {
  Box,
  Card,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import AdminSidebar from "layouts/dashboard/admin/adminsidebar";
import { useMemberContext } from "context/MemberContext";

const AddMember = () => {
  const { addMember } = useMemberContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "hr",
    phone: "",
    employeeId: "",
    department: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setShowExample(value.length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must include uppercase, lowercase, number, special character and be at least 8 characters long."
      );
      return;
    }

    const newMember = {
      id: Date.now(),
      ...formData,
    };

    addMember(newMember);
    setOpenSnackbar(true);

    setFormData({
      name: "",
      email: "",
      role: "hr",
      phone: "",
      employeeId: "",
      department: "",
      password: "",
    });
    setShowExample(false);
  };

  return (
    <Box py={3} px={2}  sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <Box sx={{ ml: "240px", width: "100%" }}>
        <DashboardNavbar />

        {/* Page Content */}
        <Box sx={{ p: 4 }}>
          <Card
            sx={{
              maxWidth: 900,
              mx: "auto",
              p: 4,
              borderRadius: 5,
              boxShadow: 6,
              backgroundColor: "#ffffff",
            }}
          >
            {/* Header Banner */}
            <Box
              sx={{
                background: "linear-gradient(to right, #2196f3, #21cbf3)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "30px",
                textAlign: "center",
                color: "#fff",
                boxShadow: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Add New Member
              </Typography>
              <Typography variant="subtitle2">
                Enter your email and password to register
              </Typography>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Department (optional)"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel id="role-label">Role *</InputLabel>
                    <Select
                      labelId="role-label"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      label="Role *"
                    >
                      <MenuItem value="hr">HR</MenuItem>
                      <MenuItem value="tl">Team Lead</MenuItem>
                      <MenuItem value="ceo">CEO</MenuItem>
                      <MenuItem value="employee">Employee</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    label="Password *"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {showExample && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                      Try: <strong>Secure@2025!</strong>
                    </Typography>
                  )}
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    background: "linear-gradient(to right, #1976d2, #42a5f5)",
                    color: "#fff",
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    borderRadius: "30px",
                    boxShadow: 3,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      background: "linear-gradient(to right, #1565c0, #1e88e5)",
                    },
                  }}
                >
                  Add Member
                </Button>
              </Box>
            </form>
          </Card>

          {/* Snackbar */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Member added successfully!
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};

export default AddMember;
