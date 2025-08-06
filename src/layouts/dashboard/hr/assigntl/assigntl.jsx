import React, { useState } from "react";
import { Card, CardContent, Grid, Typography, TextField, Button, Box } from "@mui/material";
import HrSidebar from "layouts/dashboard/hr/sidebar/HrSidebar";
import HrNavbar from "layouts/dashboard/hr/navbar/HrNavbar";
import "./assigntl.css";

const AssignTL = () => {
  const [project, setProject] = useState("");
  const [teamLead, setTeamLead] = useState("");

  const handleAssign = (e) => {
    e.preventDefault();
    alert(`Assigned ${teamLead} to ${project}`);
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
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Team Lead"
                      variant="outlined"
                      margin="normal"
                      value={teamLead}
                      onChange={(e) => setTeamLead(e.target.value)}
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
