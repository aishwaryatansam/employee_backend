import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {
  Box,
  Card,
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

//  Import the MemberContext
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
      id: Date.now(), // generate unique id
      ...formData,
    };

    addMember(newMember); // ✅ add to context

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
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
          Add New Member
        </Typography>

        <Card
          sx={{
            maxWidth: 600,
            mx: "auto",
            p: 4,
            borderRadius: 5,
            boxShadow: 6,
            backgroundColor: "#f0f7ff",
            border: "1px solid #c2e0ff",
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Department (optional)"
              name="department"
              value={formData.department}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="role-label">Role *</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role *"
                sx={{
                  height: "56px",
                  backgroundColor: "#fff",
                  borderRadius: 2,
                }}
              >
                <MenuItem value="hr">HR</MenuItem>
                <MenuItem value="tl">Team Lead</MenuItem>
                <MenuItem value="ceo">CEO</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password *"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
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
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                Try: <strong>Secure@2025!</strong>
              </Typography>
            )}

            <Box sx={{ textAlign: "right", mt: 4 }}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                  color: "#fff",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  boxShadow: 3,
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    background: "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
                  },
                }}
              >
                Add Member
              </Button>
            </Box>
          </form>
        </Card>

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
    </DashboardLayout>
  );
};

export default AddMember;
