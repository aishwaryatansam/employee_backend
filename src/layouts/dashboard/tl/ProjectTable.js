// TLProjectTable.js
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
const ProjectTable = () => {
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("tl_project_data")) || [];
    setProjectList(storedProjects);
  }, []);

  return (
    <MDBox mt={4}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Project Overview
      </Typography>

      {projectList.length === 0 ? (
        <Typography>No projects found.</Typography>
      ) : (
        <Box mt={4} position="relative">
          <MDBox
            mx={8}
            mt={-3}
            mb={-4}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              Project Table
            </MDTypography>
          </MDBox>

          <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper}>
              <MDBox
                mx={8}
                mt={-3}
                mb={-4}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              ></MDBox>
              <Table sx={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 120 }}>
                      <strong>Project Name</strong>
                    </TableCell>
                    <TableCell sx={{ minWidth: 100 }}>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <strong>Start Date</strong>
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <strong>End Date</strong>
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <strong>Completed On</strong>
                    </TableCell>
                    <TableCell sx={{ minWidth: 120, whiteSpace: "normal", wordWrap: "break-word" }}>
                      <strong>Team Members</strong>
                    </TableCell>
                    <TableCell sx={{ minWidth: 130, whiteSpace: "normal", wordWrap: "break-word" }}>
                      <strong>Phases</strong>
                    </TableCell>
                    <TableCell sx={{ minWidth: 100, whiteSpace: "normal", wordWrap: "break-word" }}>
                      <strong>Tasks</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectList.map((project, index) => (
                    <TableRow key={index}>
                      <TableCell>{project.projectName}</TableCell>
                      <TableCell>
                        <Chip label={project.projectType} color="info" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={project.status} color="primary" size="small" />
                      </TableCell>
                      <TableCell>{project.startDate}</TableCell>
                      <TableCell>{project.endDate}</TableCell>
                      <TableCell>{project.completedDate || "N/A"}</TableCell>
                      <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                        {project.assignedMembers?.join(", ") || "None"}
                      </TableCell>

                      {/* Phases */}
                      <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                        {project.phases?.length > 0 ? (
                          <Box>
                            {project.phases.map((phase, pIndex) => (
                              <Typography
                                key={pIndex}
                                variant="body2"
                                fontWeight="medium"
                                sx={{ mb: 0.5 }}
                              >
                                • {phase.phaseName || "Unnamed Phase"}
                              </Typography>
                            ))}
                          </Box>
                        ) : (
                          "No Phases"
                        )}
                      </TableCell>

                      {/* Tasks */}
                      <TableCell sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                        {project.phases?.length > 0 ? (
                          <Box>
                            {project.phases.map((phase, pIndex) =>
                              phase.tasks?.map((task, tIndex) => (
                                <Typography
                                  key={`${pIndex}-${tIndex}`}
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                  sx={{ mb: 0.5 }}
                                >
                                  - {task.taskName || "Untitled Task"}{" "}
                                  {task.assignedTo && `(Assigned to: ${task.assignedTo})`}
                                </Typography>
                              ))
                            )}
                          </Box>
                        ) : (
                          "No Tasks"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
    </MDBox>
  );
};

export default ProjectTable;
