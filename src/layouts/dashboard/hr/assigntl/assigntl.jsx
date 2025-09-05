import React, { useState } from "react";
import { Card, CardContent, Grid, Typography, TextField, Button, Box } from "@mui/material";
import HrSidebar from "layouts/dashboard/hr/sidebar/HrSidebar";
import HrNavbar from "layouts/dashboard/hr/navbar/HrNavbar";
import "./assigntl.css";

const AssignTL = () => {
  const [projectName, setProjectName] = useState("");
  const [teamLeadName, setTeamLeadName] = useState("");

  const handleAssign = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, teamLeadName }), // ✅ camelCase
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign team lead");

      alert(`✅ Team Lead assigned successfully! ID: ${data.assignmentId}`);
      setProjectName("");
      setTeamLeadName("");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <HrSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "240px", mt: "80px" }}>
        <HrNavbar />
        <Box className="assign-tl-container">
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Card className="assign-tl-card">
                <CardContent>
                  <Typography variant="h4" className="assign-title" gutterBottom>
                    Assign Team Lead
                  </Typography>
                  <form onSubmit={handleAssign}>
                    <TextField
                      fullWidth
                      label="Project"
                      variant="outlined"
                      margin="normal"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Team Lead"
                      variant="outlined"
                      margin="normal"
                      value={teamLeadName}
                      onChange={(e) => setTeamLeadName(e.target.value)}
                      required
                    />
                    <Box display="flex" justifyContent="center" mt={4}>
                      <Button variant="contained" type="submit" className="assign-btn">
                        Assign
                      </Button>
                    </Box>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignTL;
