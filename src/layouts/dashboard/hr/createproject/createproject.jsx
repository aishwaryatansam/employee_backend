import React, { useState } from "react";
import { Card, CardContent, Grid, Typography, TextField, Button, Box } from "@mui/material";
import HrSidebar from "layouts/dashboard/hr/sidebar/HrSidebar";
import HrNavbar from "layouts/dashboard/hr/navbar/HrNavbar";
import "./createproject.css";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, deadline, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");

      alert(`Project Created Successfully! ID: ${data.projectId}`);
      setProjectName("");
      setDeadline("");
      setDescription("");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <HrSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "240px", mt: "80px" }}>
        <HrNavbar />
        <Box className="create-project-container">
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Card className="create-project-card">
                <CardContent>
                  <Typography variant="h4" className="project-title" gutterBottom>
                    Create New Project
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      variant="outlined"
                      margin="normal"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Deadline"
                      type="date"
                      variant="outlined"
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={3}
                      variant="outlined"
                      margin="normal"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <Box display="flex" justifyContent="center" mt={4}>
                      <Button variant="contained" type="submit" className="submit-btn">
                        Create Project
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

export default CreateProject;
