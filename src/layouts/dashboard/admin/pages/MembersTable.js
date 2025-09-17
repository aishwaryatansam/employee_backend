import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import AdminSidebar from "layouts/dashboard/admin/adminsidebar";

function MembersTable() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [newImageBase64, setNewImageBase64] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/members")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error("Failed to fetch members:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      const res = await fetch(`http://localhost:3001/api/members/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      } else {
        console.error("Failed to delete member");
      }
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    const payload = {
      ...editingMember,
      imagePath: newImageBase64 || editingMember.imagePath,
    };

    try {
      const res = await fetch(
        `http://localhost:3001/api/members/${editingMember.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === editingMember.id ? { ...payload, id: m.id } : m
          )
        );
        setEditingMember(null);
        setNewImageBase64(null);
      } else {
        console.error("Failed to update member");
      }
    } catch (err) {
      console.error("Error updating member:", err);
    }
  };

  return (
    <Box py={3} px={2} sx={{ display: "flex" }}>
      <AdminSidebar />
      <MDBox ml="240px" py={3} px={2} sx={{ width: "100%" }}>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card
                sx={{
                  backgroundColor: isDark ? "#1e1e2f" : "#fff",
                  color: isDark ? "#e0e0e0" : "#000",
                }}
              >
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Employee Table
                  </MDTypography>
                </MDBox>

                <MDBox pt={3} px={2}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      backgroundColor: isDark ? "#2c2c3e" : "#fff",
                      color: isDark ? "#e0e0e0" : "#000",
                    }}
                  >
                    <thead>
                      <tr
                        style={{ backgroundColor: isDark ? "#33334d" : "#f0f0f0" }}
                      >
                        {[
                          "Employee ID",
                          "Name",
                          "Email",
                          "Phone",
                          "Role",
                          "Image",
                          "Actions",
                        ].map((head) => (
                          <th
                            key={head}
                            style={{
                              padding: "12px",
                              fontWeight: "600",
                              fontSize: "1rem",
                              textAlign: "center",
                            }}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr
                          key={member.id}
                          style={{ fontSize: "0.9rem", textAlign: "center" }}
                        >
                          <td style={{ padding: "10px" }}>{member.empId}</td>
                          <td style={{ padding: "10px" }}>{member.fullName}</td>
                          <td style={{ padding: "10px" }}>{member.email}</td>
                          <td style={{ padding: "10px" }}>{member.phone}</td>
                          <td style={{ padding: "10px" }}>{member.role}</td>
                          <td style={{ padding: "10px" }}>
                            {member.imagePath ? (
                              <img
                                src={`http://localhost:3001${member.imagePath}`}
                                alt="Profile"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "1px solid #ccc",
                                }}
                              />
                            ) : (
                              "No Image"
                            )}
                          </td>
                          <td style={{ padding: "10px" }}>
                            <IconButton
                              color="primary"
                              onClick={() => setEditingMember(member)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(member.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </MDBox>

      {/* ✅ Edit Modal */}
      <Modal open={!!editingMember} onClose={() => setEditingMember(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: isDark ? "#2a2a3b" : "background.paper",
            color: isDark ? "#e0e0e0" : "#000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <MDTypography variant="h6" mb={2}>
            Edit Member
          </MDTypography>
          {editingMember && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="fullName"
                value={editingMember.fullName}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={editingMember.email}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone"
                name="phone"
                value={editingMember.phone}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Employee ID"
                name="empId"
                value={editingMember.empId}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Role"
                name="role"
                value={editingMember.role}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Department"
                name="department"
                value={editingMember.department || ""}
                onChange={handleEditChange}
              />

              <TextField
                fullWidth
                margin="normal"
                type="file"
                inputProps={{ accept: "image/*" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = reader.result.split(",")[1];
                      setNewImageBase64(base64);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              {newImageBase64 ? (
                <Box mt={2} textAlign="center">
                  <img
                    src={`data:image/jpeg;base64,${newImageBase64}`}
                    alt="New Preview"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      border: "1px solid #ccc",
                    }}
                  />
                </Box>
              ) : editingMember.imagePath ? (
                <Box mt={2} textAlign="center">
                  <img
                    src={`http://localhost:3001${editingMember.imagePath}`}
                    alt="Current Profile"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      border: "1px solid #ccc",
                    }}
                  />
                </Box>
              ) : null}

              <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <button onClick={handleEditSubmit} className="btn btn-primary">
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingMember(null);
                    setNewImageBase64(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default MembersTable;
