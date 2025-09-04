import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  OutlinedInput,
  Box,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import { useTheme } from "@mui/material/styles";
function TLAddProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [projectType, setProjectType] = useState("Billable");
  const [projectData, setProjectData] = useState([]);

  const [projectsList, setProjectsList] = useState(() => {
    const stored = localStorage.getItem("tl_project_data");
    return stored ? JSON.parse(stored) : [];
  });
  const [phases, setPhases] = useState([
    { phaseName: "", tasks: [{ taskName: "", assignedTo: "" }] },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const theme = useTheme();

  const handleEditProject = (index) => {
    const project = projectsList[index];
    setProjectName(project.projectName);
    setDescription(project.description);
    setStatus(project.status);
    setStartDate(project.startDate);
    setEndDate(project.endDate);
    setCompletedDate(project.completedDate || "");
    //setSelectedMembers(project.assignedMembers);
    setProjectType(project.projectType);
    setPhases(project.phases);
    setIsEditing(true);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleStatusChange = (value) => {
    setStatus(value);
    if (value === "Completed") {
      const today = new Date().toISOString().split("T")[0];
      setCompletedDate(today);
    } else {
      setCompletedDate("");
    }
  };
  const mColumns = [
    { Header: "Project Name", accessor: "projectName" },
    { Header: "Project Type", accessor: "projectType" },
    { Header: "Phase", accessor: "phase" },
    { Header: "Task", accessor: "task" },
    { Header: "Assigned Member", accessor: "assignedMember" },
  ];
  const mRows = projectData.flatMap((project) =>
    project.projectPhases.flatMap((phase) =>
      phase.phaseTasks.map((task) => ({
        projectName: project.projectName,
        projectType: project.projectType,
        phase: phase.phaseName,
        task: task.taskName,
        assignedMember: task.assignedMember,
      }))
    )
  );

  useEffect(() => {
    const storedTeam = JSON.parse(localStorage.getItem("tl_team_members")) || [];
    setTeamMembers(storedTeam);

    const storedProjects = JSON.parse(localStorage.getItem("tl_project_data")) || [];
    setProjectsList(storedProjects);
  }, []);

  useEffect(() => {
    const storedTeam = JSON.parse(localStorage.getItem("tl_team_members")) || [];
    setTeamMembers(storedTeam);
  }, []);
  const handleAddPhase = () => {
    setPhases([...phases, { phaseName: "", tasks: [{ taskName: "", assignedTo: "" }] }]);
  };

  const handleRemovePhase = (index) => {
    const updatedPhases = [...phases];
    updatedPhases.splice(index, 1);
    setPhases(updatedPhases);
  };
  const handlePhaseNameChange = (index, value) => {
    const updatedPhases = [...phases];
    updatedPhases[index].phaseName = value;
    setPhases(updatedPhases);
  };
  const handleTaskChange = (phaseIndex, taskIndex, key, value) => {
    const updatedPhases = [...phases];
    updatedPhases[phaseIndex].tasks[taskIndex][key] = value;
    setPhases(updatedPhases);
  };
  const handleAddTask = (phaseIndex) => {
    const updatedPhases = [...phases];
    updatedPhases[phaseIndex].tasks.push({ taskName: "", assignedTo: "" });
    setPhases(updatedPhases);
  };

  const handleRemoveTask = (phaseIndex, taskIndex) => {
    const updatedPhases = [...phases];
    updatedPhases[phaseIndex].tasks.splice(taskIndex, 1);
    setPhases(updatedPhases);
  };

  const handlePhaseChange = (index, value) => {
    const updated = [...phases];
    updated[index].phaseName = value;
    setPhases(updated);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName || !startDate || !endDate || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newProject = {
      projectName,
      projectType,
      description,
      startDate,
      endDate,
      completedDate: completedDate || null,
      status,
      /*assignedMembers: selectedMembers,
      phases: phases.map((p) => ({
        phaseName: p.phaseName,
        tasks: p.tasks.map((t) => ({
          taskName: t.taskName,
          assignedTo: t.assignedTo,
        })),
      })),*/
    };

    try {
      let res;
      if (isEditing) {
        const projectId = projectsList[editingIndex].id;
        res = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject),
        });
      } else {
        res = await fetch("http://localhost:3001/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save project");
      }

      const data = await res.json();

      if (isEditing) {
        toast.success("✅ Project updated successfully!");
        const updated = [...projectsList];
        updated[editingIndex] = { ...newProject, id: projectsList[editingIndex].id };
        setProjectsList(updated);
        setIsEditing(false);
        setEditingIndex(null);
      } else {
        toast.success("✅ Project added successfully!");
        setProjectsList((prev) => [...prev, { ...newProject, id: data.projectId }]);
      }

      // Reset form
      setProjectName("");
      setDescription("");
      setStatus("Ongoing");
      setStartDate("");
      setEndDate("");
      setCompletedDate("");
      setSelectedMembers([]);
      setProjectType("Billable");
      setPhases([{ phaseName: "", tasks: [{ taskName: "", assignedTo: "" }] }]);
    } catch (err) {
      toast.error("❌ " + err.message);
    }
  };

  return (
    <div>
      <MDBox pt={4} pb={3}>
        <Grid container spacing={2} alignItems="center" mb={1}>
          <Grid item xs={12}>
            {" "}
            {/*<Grid item xs={12}>
          <Card>
              
              <MDBox pt={3}>
           <DataTable
 table={{ columns: mColumns, rows: mRows }} 
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                /> 
              </MDBox>
            </Card>
          </Grid>*/}
            <br></br>{" "}
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
              <MDBox
                mx={2}
                mt={-10}
                mb={2}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Add Project
                </MDTypography>
              </MDBox>

              <br></br>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Project Type</InputLabel>
                      <Select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        input={<OutlinedInput label="Project Type" />}
                      >
                        <MenuItem value="Billable">Billable</MenuItem>
                        <MenuItem value="Internal">Internal</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Box mt={4} gap={12}>
                    {" "}
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Project Phases
                    </Typography>
                    {phases.map((phase, phaseIndex) => (
                      <Box
                        key={phaseIndex}
                        mb={3}
                        p={2}
                        sx={{
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                        }}
                      >
                        {" "}
                        <TextField
                          fullWidth
                          label={`Phase ${phaseIndex + 1} Name`}
                          value={phase.phaseName}
                          onChange={(e) => handlePhaseChange(phaseIndex, e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        {phase.tasks.map((task, taskIndex) => (
                          <Grid container spacing={2} alignItems="center" mb={1} key={taskIndex}>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                label="Task Name"
                                value={task.taskName}
                                onChange={(e) =>
                                  handleTaskChange(
                                    phaseIndex,
                                    taskIndex,
                                    "taskName",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl fullWidth>
                                <InputLabel>Assign To</InputLabel>
                                <TextField
                                  value={task.assignedTo}
                                  onChange={(e) =>
                                    handleTaskChange(
                                      phaseIndex,
                                      taskIndex,
                                      "assignedTo",
                                      e.target.value
                                    )
                                  }
                                  input={<OutlinedInput label="Assign To" />}
                                >
                                  {teamMembers.map((member, idx) => (
                                    <MenuItem key={idx} value={member.name}>
                                      {member.name}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </FormControl>
                            </Grid>
                          </Grid>
                        ))}
                        <Box mt={4} display="flex" gap={2}>
                          <MDButton
                            onClick={() => handleAddTask(phaseIndex)}
                            variant="gradient"
                            color="info"
                            size="small"
                          >
                            Add Task
                          </MDButton>
                          <Button
                            onClick={() => handleRemoveTask(phaseIndex, taskIndex)}
                            variant="contained"
                            size="small"
                            color="error"
                          >
                            Remove Task
                          </Button>
                        </Box>
                      </Box>
                    ))}
                    <Box mt={4} display="flex" gap={2}>
                      <MDButton
                        onClick={handleAddPhase}
                        variant="gradient"
                        color="info"
                        size="small"
                      >
                        Add Phase
                      </MDButton>
                      <Button
                        onClick={() => handleRemovePhase(phaseIndex)}
                        variant="contained"
                        size="small"
                        color="error"
                      >
                        Remove Phase
                      </Button>
                    </Box>
                  </Box>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Start Date"
                      InputLabelProps={{ shrink: true }}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="End Date"
                      InputLabelProps={{ shrink: true }}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Completed Date (Optional)"
                      InputLabelProps={{ shrink: true }}
                      value={completedDate}
                      onChange={(e) => setCompletedDate(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        input={<OutlinedInput label="Status" />}
                      >
                        <MenuItem value="Ongoing">Ongoing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Assign Members</InputLabel>
                      <Select
                        multiple
                        value={selectedMembers}
                        onChange={(e) => setSelectedMembers(e.target.value)}
                        input={<OutlinedInput label="Assign Members" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 224,
                              width: 250,
                            },
                          },
                        }}
                      >
                        {teamMembers.map((member, index) => (
                          <MenuItem key={index} value={member.name}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <input
                                type="checkbox"
                                checked={selectedMembers.indexOf(member.name) > -1}
                                readOnly
                                style={{ pointerEvents: "none" }}
                              />
                              <Typography variant="body2">{member.name}</Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box mt={4} display="flex" gap={2}>
                  <MDButton type="submit" variant="gradient" color="info">
                    {isEditing ? "Update Project" : "Save Project"}
                  </MDButton>

                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setProjectName("");
                      setDescription("");
                      setStatus("Ongoing");
                      setStartDate("");
                      setEndDate("");
                      setCompletedDate("");
                      setSelectedMembers([]);
                      setProjectType("Billable");
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Existing Projects
          </Typography>

          {projectsList.length === 0 ? (
            <Typography>No projects found.</Typography>
          ) : (
            <Grid container spacing={2} alignItems="center" mb={1}>
              {projectsList.map((project, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      boxShadow: 4,
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {project.projectName}
                    </Typography>
                    <Typography variant="body2">{project.description}</Typography>
                    <Typography variant="body2">
                      <strong>Type:</strong> {project.projectType}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {project.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Start:</strong> {project.startDate}
                    </Typography>
                    <Typography variant="body2">
                      <strong>End:</strong> {project.endDate}
                    </Typography>
                    {project.completedDate && (
                      <Typography variant="body2">
                        <strong>Completed:</strong> {project.completedDate}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      <strong>Members:</strong>{" "}
                      {project.assignedMembers.length > 0
                        ? project.assignedMembers.join(", ")
                        : "None"}
                    </Typography>

                    {project.phases && project.phases.length > 0 && (
                      <Box mt={1}>
                        <Typography variant="body2" fontWeight="bold">
                          Phases:
                        </Typography>
                        {project.phases.map((phase, pIndex) => (
                          <Box key={pIndex} ml={2} mt={1}>
                            <Typography variant="body2">
                              <strong>Phase {pIndex + 1}:</strong> {phase.phaseName || "(No Name)"}
                            </Typography>
                            {phase.tasks && phase.tasks.length > 0 ? (
                              <ul style={{ marginTop: 4 }}>
                                {phase.tasks.map((task, tIndex) => (
                                  <li key={tIndex}>
                                    {task.taskName || "Untitled Task"}{" "}
                                    {task.assignedTo ? `(Assigned to: ${task.assignedTo})` : ""}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <Typography variant="caption" ml={1}>
                                No tasks
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                    <Box mt={2} display="flex" gap={1}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        size="small"
                        onClick={() => handleEditProject(index)}
                        disabled={project.status === "Completed"}
                      >
                        Edit
                      </MDButton>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteProject(index)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </MDBox>
      <ToastContainer />
    </div>
  );
}

export default TLAddProject;
