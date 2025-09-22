import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "./Timesheet.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import AdminSidebar from "layouts/dashboard/admin/adminsidebar";
import Footer from "examples/Footer";
import TLAddProject from "./TLAddProject";

const ProjectStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [projects, setProjects] = useState([]);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("projectStatus");

  useEffect(() => {
  // Clear previous project details and selected employee when month/year changes
  setSelectedProjectDetails(null);
  setSelectedEmployee(null);
}, [selectedMonth, selectedYear]);

  // Fetch members
  useEffect(() => {
    fetch("http://localhost:3001/api/members")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setMembers(data))
      .catch((err) => console.error("Error fetching members:", err));
  }, []);

  // Fetch projects
  useEffect(() => {
    fetch("http://localhost:3001/getProjects")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // Filter projects active in selected month
  const filteredProjects = projects.filter((p) => {
    if (!p.startDate || !p.endDate) return false;

    const projectStart = new Date(p.startDate);
    const projectEnd = new Date(p.endDate);

    const monthStart = new Date(selectedYear, selectedMonth, 1);
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);

    return projectStart <= monthEnd && projectEnd >= monthStart;
  });

  if (filteredProjects.length === 0 && selectedProjectDetails?.length > 0) {
    setSelectedProjectDetails(null);
  }

  // Handle project click
  const handleRowClick = async (project) => {
    setSelectedEmployee(null); // clear previous selection
    try {
      const res = await fetch("http://localhost:3001/getHourDetailsByMonthForCeo");
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const monthFilteredData = data.data.filter((entry) => {
          const entryDate = new Date(entry.date || entry.startDate);
          const monthStart = new Date(selectedYear, selectedMonth, 1);
          const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);
          return entryDate >= monthStart && entryDate <= monthEnd;
        });

        const filtered = monthFilteredData
          .map((entry) => {
            const blocks = entry.hourBlocks ? JSON.parse(entry.hourBlocks) : [];
            const projectBlocks = blocks.filter((b) => b.projectName === project.projectName);
            if (projectBlocks.length > 0) {
              const member = members.find((m) => m.id === entry.memberId);
              return {
                fullname: member?.fullName || `Unknown (${entry.memberId})`,
                role: entry.role || "-",
                totalHours: entry.totalHours || 0,
                hourBlocks: projectBlocks.map((b) => ({
                  ...b,
                  fullName: member?.fullName || `Unknown (${entry.memberId})`,
                })),
              };
            }
            return null;
          })
          .filter(Boolean);

        setSelectedProjectDetails(filtered);
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
    }
  };

  // CSV report
  const handleCreateReport = () => {
    let csvContent = "Project Name,Employee,Hour,Project Type,Project Phase,Project Task\n";

    if (filteredProjects.length === 0) {
      csvContent = `Project Name\nNo projects found for ${selectedMonth + 1}/${selectedYear}`;
    } else {
      filteredProjects.forEach((project) => {
        const projectDetails = selectedProjectDetails?.filter((entry) =>
          entry.hourBlocks.some((b) => b.projectName === project.projectName)
        ) || [];

        if (projectDetails.length > 0) {
          projectDetails.forEach((entry) => {
            entry.hourBlocks.forEach((b) => {
              csvContent += `${project.projectName},${entry.fullname},${b.hour},${b.projectType || "-"},${b.projectPhase || "-"},${b.projectTask || "-"}\n`;
            });
          });
        } else {
          csvContent += `${project.projectName},,,,-,-\n`;
        }
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `projectstatus-${selectedMonth + 1}-${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Project Status report downloaded!");
  };

  return (
    <DashboardLayout>
      <AdminSidebar />
      <DashboardNavbar />
      <div className="container">
        <div className="main">
          <h1 className="title">Project Status</h1>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === "projectStatus" ? "active" : ""}`}
              onClick={() => setActiveTab("projectStatus")}
            >
              Project Status
            </button>
            <button
              className={`tab ${activeTab === "addProject" ? "active" : ""}`}
              onClick={() => setActiveTab("addProject")}
            >
              Add Project
            </button>
          </div>

          {activeTab === "projectStatus" && (
            <>
              {/* Period Selector */}
              <div className="period">
                <div>
                  <p className="period-label">Time period:</p>
                  <div className="date-picker" style={{ display: "flex", gap: "1rem" }}>
                    <FormControl size="small" style={{ minWidth: 120 }}>
                      <InputLabel id="month-label">Month</InputLabel>
                      <Select
                        labelId="month-label"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      >
                        {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(
                          (m, i) => <MenuItem key={i} value={i}>{m}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    <FormControl size="small" style={{ minWidth: 100 }}>
                      <InputLabel id="year-label">Year</InputLabel>
                      <Select
                        labelId="year-label"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                      >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(
                          (y) => <MenuItem key={y} value={y}>{y}</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="buttons">
                  <button className="btn light" onClick={handleCreateReport}>
                    <FileText size={16} /> Create Report
                  </button>
                </div>
              </div>

              {/* Project Table */}
              <table className="table">
                <thead>
                  <tr><th>Project Name</th></tr>
                </thead>
                <tbody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <tr key={project.id} onClick={() => handleRowClick(project)}>
                        <td>{project.projectName}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td>No projects found for {selectedMonth + 1}/{selectedYear}</td></tr>
                  )}
                </tbody>
              </table>

              {/* Project Details */}
              {selectedProjectDetails && selectedProjectDetails.length > 0 && (
                <div className="project-details">
                  <h3>Employees in Project</h3>
                  <table className="table">
                    <thead>
                      <tr><th>Employee</th></tr>
    
                      {/* <th>Role</th><th>Total Hours</th> */}
                                      </thead>
                    <tbody>
                      {selectedProjectDetails.map((detail, index) => (
                        <tr key={index} onClick={() => setSelectedEmployee(detail)} style={{ cursor: "pointer" }}>
                          <td>{detail.fullname}</td>
                          {/* <td>{detail.role}</td>
                          <td>{detail.totalHours}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {selectedEmployee && (
                    <div className="employee-details">
                      <h4>Details for {selectedEmployee.fullname}</h4>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Hour</th><th>Project Type</th><th>Project Name</th><th>Project Phase</th><th>Project Task</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEmployee.hourBlocks.map((b, i) => (
                            <tr key={i}>
                              <td>{b.hour}</td>
                              <td>{b.projectType || "-"}</td>
                              <td>{b.projectName || "-"}</td>
                              <td>{b.projectPhase || "-"}</td>
                              <td>{b.projectTask || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "addProject" && <TLAddProject />}
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default ProjectStatus;
