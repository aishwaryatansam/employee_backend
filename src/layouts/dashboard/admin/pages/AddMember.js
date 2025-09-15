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

const AddMembers = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "hr",
    phone: "",
    empId: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must include uppercase, lowercase, number, special character and be at least 8 characters long."
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add member");
      }

      // success
      setOpenSnackbar(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        role: "hr",
        empId: "",
        department: "",
        password: "",
      });
      setShowExample(false);
    } catch (error) {
      alert("Failed to add member: " + error.message);
    }
  };

  return (
    <Box py={3} px={2} sx={{ display: "flex" }}>
      <AdminSidebar />
      <Box sx={{ ml: "240px", width: "100%" }}>
        <DashboardNavbar />
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
            {/* Header */}
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
              <Typography variant="subtitle2">Enter details to register</Typography>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
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
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: "block" }}
                    >
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

export default AddMembers;
