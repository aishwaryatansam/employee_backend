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
import TLAddMembers from "layouts/tables/TLAddMembers";
import TLAddProject from "layouts/tables/TLAddProject";
import EmployeeDetail from "../employeeDetails/EmployeeDetail";
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
  const [hourlyData, setHourlyData] = useState({});

  useEffect(() => {
    const allData = JSON.parse(localStorage.getItem("timesheet_entries") || "[]");
    console.log("All timesheet entries:", allData);
  }, []);

  const [activeTab, setActiveTab] = useState("timesheet");

  const handleRemindApprovers = () => {
    const pendingEmployees = employees.filter((emp) => emp.status === "Pending"); // example status field
    if (pendingEmployees.length === 0) {
      toast.info("No pending approvals.");
    } else {
      toast.success(`Reminder sent to ${pendingEmployees.length} approver(s)!`);
    }
  };
  const [employees, setEmployees] = useState([]);
  const [hourlyDetails, setHourlyDetails] = useState({});
  useEffect(() => {
    if (!id) return;
    localStorage.setItem(`employee_hourly_details_${id}`, JSON.stringify(hourlyDetails));
  }, [hourlyDetails, id]);
  const rows = employees.map((emp) => {
    const data = emp.timesheet?.[selectedDate.toString()] || {};
    return [
      emp.name,
      emp.role,
      emp.type,
      data.regular || "-",
      data.overtime ? `${data.overtime} Hours` : "-",
      data.sick ? `${data.sick} Hours` : "-",
      data.total ? `${data.total} Hours` : "-",
    ];
  });

  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem("tl_team_members")) || [];
    const timesheetData = JSON.parse(localStorage.getItem("tl_timesheet_data")) || [];

    const timesheetMap = {};
    for (const entry of timesheetData) {
      const { employeeId, date, regular, overtime, sick, total } = entry;
      if (!timesheetMap[employeeId]) timesheetMap[employeeId] = {};
      timesheetMap[employeeId][date.toString()] = { regular, overtime, sick, total };
    }

    const enriched = storedEmployees.map((member) => {
      return {
        ...member,
        timesheet: timesheetMap[member.id] || {},
      };
    });

    setEmployees(enriched);
  }, []);

  {
    /*useEffect(() => {
  const storedEmployees = JSON.parse(localStorage.getItem("tl_team_members")) || [];
  const timesheetData = JSON.parse(localStorage.getItem("tl_timesheet_data")) || [];

  // Map from ID to full timesheet (per-day entries)
  const timesheetMap = {};
  for (const entry of timesheetData) {
    const { employeeId, date, regular, overtime, sick, total } = entry;
    if (!timesheetMap[employeeId]) timesheetMap[employeeId] = {};
    timesheetMap[employeeId][Number(date)] = { regular, overtime, sick, total };
  }

  const enriched = storedEmployees.map((member, index) => {
    const localHourlyDetails = JSON.parse(localStorage.getItem(`employee_hourly_details_${index}`)) || {};
    return {
      ...member,
      timesheet: {
        ...timesheetMap[member.id],
        ...localHourlyDetails,
      },
    };
  });

  setEmployees(enriched);
}, []);
*/
  }

  const handleRowClick = (index) => {
    navigate(`/employee/${index}`);
  };
  const leaveDays = [5, 18, 27]; // e.g. 5th, 18th, 27th of selected month
  // Dummy leave days for demo (could be pulled from DB later)
  const header = ["Name", "Role", "Type", "Regular", "Overtime", "Sick Leave", "Total Hours"];

  const handleCreateReport = () => {
    if (!selectedDate) {
      toast.warning("Please select a date to generate a report.");
      return;
    }

    {
      /*const rows = employees.map((emp) => {
  const data = emp.timesheet?.[selectedDate] || {};
  return [
    emp.name,
    emp.role,
    emp.type,
    data.regular ? `${data.regular} Hours` : "-",
    data.overtime ? `${data.overtime} Hours` : "-",
    data.sick ? `${data.sick} Hours` : "-",
    data.total ? `${data.total} Hours` : "-",
  ];
});
*/
    }

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `timesheet-${selectedDate}-${selectedMonth + 1}-${selectedYear}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Timesheet report downloaded!");
  };

  const AddMembers = () => (
    <div>
      <h3>Add Members View</h3>
      {/* your form here */}
    </div>
  );
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
              className={`tab ${activeTab === "addMembers" ? "active" : ""}`}
              onClick={() => setActiveTab("addMembers")}
            >
              Add Members
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
                        label="Month"
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
                <div className="search">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Search employee"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                  />
                </div>
                <div className="actions">
                  <button className="btn outline" onClick={handleRemindApprovers}>
                    Remind Approvers
                  </button>
                </div>
              </div>

              {/* Table */}
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Regular</th>
                    <th>Overtime</th>
                    <th>Sick Leave</th>

                    <th>Total Hour</th>
                  </tr>
                </thead>
                <tbody>
                  {employees
                    .filter(
                      (emp) =>
                        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((emp, i) => {
                      const dayData = emp.timesheet?.[selectedDate];
                      return (
                        <tr key={i} onClick={() => handleRowClick(i)} className="clickable-row">
                          <td>
                            <p className="name">{emp.name}</p>
                            <p className="role">{emp.role}</p>
                          </td>
                          <td>{emp.type}</td>
                          <td>{dayData ? `${dayData.regular} Hours` : "-"}</td>
                          <td>{dayData ? `${dayData.overtime} Hours` : "-"}</td>
                          <td>{dayData ? `${dayData.sick} Hours` : "-"}</td>
                          <td>{dayData ? `${dayData.total} Hours` : "-"}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {/* Your full Timesheet layout (calendar, table, etc) goes here */}
            </>
          )}

          {activeTab === "addMembers" && <TLAddMembers />}
          {activeTab === "addProject" && <TLAddProject />}
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default Timesheet;
