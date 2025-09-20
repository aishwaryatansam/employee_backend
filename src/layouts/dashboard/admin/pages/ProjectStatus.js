import React, { useState } from "react";
import { Search, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Timesheet.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Dashboard } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import TLAddProject from "./TLAddProject";

import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Timesheet = () => {
  const { id } = useParams(); // ✅ This gives you the `id` from URL like /timesheet/:id
  const today = new Date().getDate();
  const [selectedDate, setSelectedDate] = useState(today);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0 = Jan
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const [employeeData, setEmployeeData] = useState([]);
  const [hourDetails, setHourDetails] = useState([]);
  const [projects, setProjects] = useState([]); // not undefined
  const [selectedProjectDetails, setSelectedProjectDetails] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMembers(data);
        }
      })
      .catch((err) => console.error("Error fetching members:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/getProjects") // ✅ your API
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
          console.log("Projects fetched:", data);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/getHourDetailsByMonthForCeo")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setTimecardData(data.data);
        }
      })
      .catch((err) => console.error("Fetch error (CEO):", err));
  }, []);

  // helper

  const [activeTab, setActiveTab] = useState("timesheet");

  const [employees, setEmployees] = useState([]);
  const [hourlyDetails, setHourlyDetails] = useState({});
  useEffect(() => {
    if (!id) return;
    localStorage.setItem(`employee_hourly_details_${id}`, JSON.stringify(hourlyDetails));
  }, [hourlyDetails, id]);
  const rows = employees.map((emp) => {
    const data = emp.timesheet?.[selectedDate.toString()] || {};
    return [emp.name, emp.role, emp.type];
  });

  /*
const handleRowClick = async (project) => {
  try {
    const res = await fetch(`http://localhost:3001/getHourDetailsByMonthForCeo?projectId=${project.id}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      setSelectedProjectDetails(data.data);
    }
  } catch (err) {
    console.error("Error fetching project details:", err);
  }
};

*/
  // Convert project startDate to month/year and filter

  const filteredProjects = projects.filter((p) => {
    if (!p.startDate) return false;
    const start = new Date(p.startDate);
    return start.getMonth() === selectedMonth && start.getFullYear() === selectedYear;
  });
  if (filteredProjects.length === 0 && selectedProjectDetails.length > 0) {
    setSelectedProjectDetails([]);
  }
  const handleRowClick = async (project) => {
    try {
      const res = await fetch("http://localhost:3001/getHourDetailsByMonthForCeo");
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const filtered = data.data
          .map((entry) => {
            try {
              const blocks = entry.hourBlocks ? JSON.parse(entry.hourBlocks) : [];

              // Filter blocks for the clicked project
              const projectBlocks = blocks.filter((b) => b.projectName === project.projectName);

              if (projectBlocks.length > 0) {
                // Find member fullName by memberId
                const member = members.find((m) => m.id === entry.memberId);
                return {
                  fullname: member?.fullName || `Unknown (${entry.memberId})`,
                  role: entry.role || "-",
                  regularHours: entry.regularHours || 0,
                  overtimeHours: entry.overtimeHours || 0,
                  totalHours: entry.totalHours || 0,
                  hourBlocks: projectBlocks.map((b) => ({
                    ...b,
                    fullName: member?.fullName || `Unknown (${entry.memberId})`,
                  })),
                };
              }
              return null;
            } catch (e) {
              console.error("Invalid hourBlocks JSON:", e);
              return null;
            }
          })
          .filter(Boolean);

        setSelectedProjectDetails(filtered);
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
    }
  };

  const leaveDays = [5, 18, 27]; // e.g. 5th, 18th, 27th of selected month
  // Dummy leave days for demo (could be pulled from DB later)
  const header = ["Name", "Role", "Type", "Regular", "Overtime", "Total Hours"];
  /*  const header = ["Name", "Role", "Type", "Regular", "Overtime", "Sick Leave", "Total Hours"];*/

  const handleCreateReport = () => {
    let csvContent = "Project Name,Employee,Hour,Project Type,Project Phase,Project Task\n";

    if (filteredProjects.length === 0) {
      csvContent = `Project Name\nNo projects found for ${selectedMonth + 1}/${selectedYear}`;
    } else {
      filteredProjects.forEach((project) => {
        // use selectedProjectDetails if already clicked
        const projectDetails = selectedProjectDetails.filter((entry) =>
          entry.hourBlocks.some((b) => b.projectName === project.projectName)
        );

        if (projectDetails.length > 0) {
          projectDetails.forEach((entry) => {
            entry.hourBlocks.forEach((b) => {
              csvContent += `${project.projectName},${entry.fullname},${b.hour},${
                b.projectType || "-"
              },${b.projectPhase || "-"},${b.projectTask || "-"}\n`;
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
    link.setAttribute("download", `timesheet-${selectedMonth + 1}-${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Timesheet report downloaded!");
  };

  const AddProject = () => (
    <div>
      <h3>Add Project View</h3>
      {/* your form here */}
    </div>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container">
        <div className="main">
          <h1 className="title">Time & Attendance</h1>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === "timesheet" ? "active" : ""}`}
              onClick={() => setActiveTab("timesheet")}
            >
              Timesheet
            </button>

            <button
              className={`tab ${activeTab === "addProject" ? "active" : ""}`}
              onClick={() => setActiveTab("addProject")}
            >
              Add Project
            </button>
          </div>
          {activeTab === "timesheet" && (
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
                        {[
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ].map((m, i) => (
                          <MenuItem key={i} value={i}>
                            {m}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl size="small" style={{ minWidth: 100 }}>
                      <InputLabel id="year-label">Year</InputLabel>
                      <Select
                        labelId="year-label"
                        value={selectedYear}
                        label="Year"
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                      >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(
                          (y) => (
                            <MenuItem key={y} value={y}>
                              {y}
                            </MenuItem>
                          )
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

              <div className="calendar">
                {[...Array(getDaysInMonth(selectedMonth, selectedYear))].map((_, i) => {
                  const day = i + 1;
                  const date = new Date(selectedYear, selectedMonth, day);
                  const weekday = date.getDay(); // 0 = Sunday, 6 = Saturday

                  // Check if this day is Saturday, and if it's the 2nd Saturday
                  const isSaturday = weekday === 6;
                  let saturdayCount = 0;
                  for (let d = 1; d <= day; d++) {
                    const tempDate = new Date(selectedYear, selectedMonth, d);
                    if (tempDate.getDay() === 6) saturdayCount++;
                  }
                  const isSecondSaturday = isSaturday && saturdayCount === 2;
                  const isSunday = weekday === 0;
                  const isSelected = selectedDate === day;

                  // Apply colors: red for second Saturday or Sunday, green otherwise
                  let dayStyle = {
                    backgroundColor: isSecondSaturday || isSunday ? "#ff0000" : "#00c853", // red or green
                    color: "white",
                    padding: "5px",
                    margin: "4px",
                    width: "25px",
                    height: "25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                    cursor: "pointer",
                  };

                  return (
                    <div key={i} style={dayStyle} onClick={() => setSelectedDate(day)}>
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Search & Buttons */}
              <div className="search-bar">
                {/* <div className="search">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Search employee"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                  />
                </div>
              */}
              </div>

              {/* Table */}
              <table className="table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredProjects) && filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <tr key={project.id} onClick={() => handleRowClick(project)}>
                        <td>{project.projectName}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>
                        No projects found for {selectedMonth + 1}/{selectedYear}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {selectedProjectDetails.length > 0 && (
                <div className="project-details">
                  <h3>Project Details</h3>
                  <table className="table">
                    <tbody>
                      {selectedProjectDetails.map((detail, index) => {
                        const blocks = Array.isArray(detail.hourBlocks) ? detail.hourBlocks : [];

                        return (
                          <React.Fragment key={index}>
                            {/* HourBlocks nested table */}
                            {blocks.length > 0 && (
                              <tr>
                                <td colSpan={5}>
                                  <table className="table table-sm table-bordered">
                                    <thead>
                                      <tr>
                                        <th>Employee</th>
                                        <th>Hour</th>
                                        <th>Project Type</th>
                                        <th>Project Name</th>
                                        <th>Project Phase</th>
                                        <th>Project Task</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {blocks.map((b, i) => (
                                        <tr key={i}>
                                          <td>{b.fullName}</td>
                                          <td>{b.hour}</td>
                                          <td>{b.projectType || "-"}</td>
                                          <td>{b.projectName || "-"}</td>
                                          <td>{b.projectPhase || "-"}</td>
                                          <td>{b.projectTask || "-"}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Your full Timesheet layout (calendar, table, etc) goes here */}
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

export default Timesheet;
