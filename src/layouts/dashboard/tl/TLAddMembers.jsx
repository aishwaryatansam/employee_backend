import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Fade,
  Grid,
  useTheme,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Person, Delete } from "@mui/icons-material";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import Slide from "@mui/material/Slide";
export default function TLAddMembers() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", role: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tl_team_members")) || [];
    setTeamMembers(stored);
  }, []);

  const addMember = () => {
    const { name, role, type } = newMember;
    if (name.trim() !== "" && role.trim() !== "" && type.trim() !== "") {
      const updated = [
        ...teamMembers,
        {
          id: teamMembers.length.toString(), // 👈 Add this line
          name: name.trim(),
          role,
          type,
        },
      ];
      setTeamMembers(updated);
      localStorage.setItem("tl_team_members", JSON.stringify(updated));
      setNewMember({ name: "", role: "", type: "" });
      setShowModal(false);
    }
  };

  const removeMember = (name) => {
    const updated = teamMembers.filter((member) => member.name !== name);
    setTeamMembers(updated);
    localStorage.setItem("tl_team_members", JSON.stringify(updated));
  };

  return (
    <MDBox
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
      }}
    >
      <MDBox flexGrow={1} sx={{ p: 0 }}>
        <MDBox p={{ xs: 1, sm: 3 }}>
          <MDBox
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              borderRadius: 3,
              bgcolor: theme.palette.background.paper,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <MDTypography variant="h5" fontWeight="bold" color="textPrimary">
                  Add Project Members
                </MDTypography>
              </Grid>
              <Grid item>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => setShowModal(true)}
                  sx={{ borderRadius: 2 }}
                >
                  + Add New Member
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>

          <MDBox sx={{ width: "100%" }}>
            <Grid container spacing={3}>
              {teamMembers.map((member) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={member.name}>
                  <Fade in>
                    <Slide in direction="up" timeout={500}>
                      <MDBox
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          bgcolor: theme.palette.background.paper,
                          transition: "box-shadow 0.3s",
                          boxShadow: 1,
                          "&:hover": {
                            boxShadow: 6,
                            bgcolor:
                              theme.palette.mode === "dark"
                                ? theme.palette.action.hover
                                : "#f7fafc",
                          },
                        }}
                      >
                        <MDBox display="flex" alignItems="center">
                          <MDAvatar
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              width: 48,
                              height: 48,
                            }}
                          >
                            <Person />
                          </MDAvatar>
                          <MDBox ml={2}>
                            <MDTypography fontWeight="medium" color="textPrimary">
                              {member.name}
                            </MDTypography>
                            <MDTypography variant="caption" color="textSecondary">
                              {member.role} <br></br>• {member.type}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                        <IconButton
                          color="error"
                          onClick={() => removeMember(member.name)}
                          sx={{ alignSelf: "flex-end", mt: 1 }}
                        >
                          <Delete />
                        </IconButton>
                      </MDBox>
                    </Slide>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </MDBox>

          {/* Add Member Dialog */}
          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
                backdropFilter: "blur(8px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Add Team Member
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Member Name"
                type="text"
                fullWidth
                variant="outlined"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Member Role"
                type="text"
                fullWidth
                variant="outlined"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Member Type</InputLabel>
                <Select
                  value={newMember.type}
                  onChange={(e) => setNewMember({ ...newMember, type: e.target.value })}
                  label="Member Type"
                >
                  <MenuItem value="Full-Time">Full-Time</MenuItem>
                  <MenuItem value="Part-Time">Part-Time</MenuItem>
                  <MenuItem value="Contractor">Contractor</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <MDButton
                onClick={() => setShowModal(false)}
                variant="outlined"
                color="dark"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </MDButton>
              <MDButton
                onClick={addMember}
                variant="gradient"
                color="info"
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Add Member
              </MDButton>
            </DialogActions>
          </Dialog>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
