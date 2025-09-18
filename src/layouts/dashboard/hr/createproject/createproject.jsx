import React, { useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import HrSidebar from "layouts/dashboard/hr/sidebar/HrSidebar";
import HrNavbar from "layouts/dashboard/hr/navbar/HrNavbar";
import "./createproject.css";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = projectName.trim();
    const trimmedClient = client.trim();
    const trimmedDeadline = deadline.trim();

    if (!trimmedName || !trimmedClient || !trimmedDeadline) {
      alert("❌ Project Name, Client, and Deadline are required.");
      return;
    }

    const payload = {
      projectName: trimmedName,
      deadline: trimmedDeadline,
      description: description.trim(),
      client: trimmedClient,
    };

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");

      alert(`✅ Project Created Successfully! ID: ${data.projectId}`);
      setProjectName("");
      setDeadline("");
      setDescription("");
      setClient("");
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
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
                      label="Client"
                      variant="outlined"
                      margin="normal"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
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
                      <Button
                        variant="contained"
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Project"}
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