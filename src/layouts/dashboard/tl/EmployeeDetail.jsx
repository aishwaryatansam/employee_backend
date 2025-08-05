import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./EmployeeDetail.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { Chip, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import FilterListIcon from "@mui/icons-material/FilterList";

const EmployeeDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("timeline");
  const [showPopupForm, setShowPopupForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hourlyDetails, setHourlyDetails] = useState({});
  const [formMode, setFormMode] = useState("Work");
  const [dayStatus, setDayStatus] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [checkInOut, setCheckInOut] = useState({ checkIn: "", checkOut: "" });
  const [employee, setEmployee] = useState(null);
  const [approvalFilter, setApprovalFilter] = useState("All");
  const members = JSON.parse(localStorage.getItem("tl_team_members")) || [];
  const [employees, setEmployees] = useState([]);
  const statusStyles = {
    All: { color: "default", label: "All", icon: <FilterListIcon fontSize="small" /> },
    Approved: { color: "success", label: "Approved", icon: <CheckCircleIcon fontSize="small" /> },
    Rejected: { color: "error", label: "Rejected", icon: <CancelIcon fontSize="small" /> },
    Pending: { color: "warning", label: "Pending", icon: <HourglassTopIcon fontSize="small" /> },
  };

  const selectedEmp = members.find((emp) => emp.id === id);

  localStorage.setItem("employee_hourly_details", JSON.stringify(hourlyDetails));

  const navigate = useNavigate();
  useEffect(() => {
    const empDetails = JSON.parse(localStorage.getItem(`employee_hourly_details_${id}`)) || {};
    setHourlyDetails(empDetails);
  }, [id]);
  useEffect(() => {
    localStorage.setItem(`employee_hourly_details_${id}`, JSON.stringify(hourlyDetails));
  }, [hourlyDetails, id]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tl_team_members")) || [];
    const found = stored.find((e, index) => index.toString() === id); // Assuming ID is index
    setEmployee(found);
  }, [id]);
  useEffect(() => {
    const empDayStatus = JSON.parse(localStorage.getItem(`employee_day_status_${id}`)) || {};
    setDayStatus(empDayStatus);
  }, [id]);
  useEffect(() => {
    localStorage.setItem(`employee_day_status_${id}`, JSON.stringify(dayStatus));
  }, [dayStatus, id]);
  useEffect(() => {
    const fetchData = () => {
      const storedEmployees = JSON.parse(localStorage.getItem("tl_team_members")) || [];
      const timesheetData = JSON.parse(localStorage.getItem("tl_timesheet_data")) || [];

      const timesheetMap = {};
      for (const entry of timesheetData) {
        const { employeeId, date, regular, overtime, sick, total } = entry;
        if (!timesheetMap[employeeId]) timesheetMap[employeeId] = {};
        timesheetMap[employeeId][date.toString()] = { regular, overtime, sick, total };
      }

      const enriched = storedEmployees.map((member) => ({
        ...member,
        timesheet: timesheetMap[member.id] || {},
      }));

      setEmployees(enriched);
    };

    fetchData();

    // Re-fetch when tab regains focus
    window.addEventListener("focus", fetchData);
    return () => window.removeEventListener("focus", fetchData);
  }, []);

  const getAllDatesInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const result = [];
    while (date.getMonth() === month) {
      result.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return result;
  };

  const daysInMonth = getAllDatesInMonth(selectedYear, selectedMonth);

  const phases = ["Design", "Development", "Testing", "Deployment"];
  const tasks = ["UI Fixes", "API Integration", "Bug Fixes", "Documentation"];

  const formatHour = (hour) => {
    if (hour === 12) return "12 PM";
    if (hour === 24) return "12 AM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const openEditPopup = (date) => {
    const formatted = formatDate(date);
    setSelectedDate(formatted);
    setFormMode(dayStatus[formatted] || "Work");

    // Load existing checkInOut if exists
    const saved = hourlyDetails[formatted]?._checkInOut || {};
    setCheckInOut({
      checkIn: saved.checkIn || "",
      checkOut: saved.checkOut || "",
    });

    setShowPopupForm(true);
  };

  const closeEditPopup = () => {
    setShowPopupForm(false);
    setSelectedDate(null);
    setCheckInOut({ checkIn: "", checkOut: "" });
  };
  const calculateMealBreak = (dayData) => {
    if (!dayData || !dayData[13] || Object.keys(dayData[13]).length === 0) {
      return "1hr";
    }
    return "0hr";
  };
  const calculateOvertime = (dayData) => {
    if (!dayData) return "0hr";
    const workedHours = Object.keys(dayData).filter(
      (h) => !isNaN(h) && Object.keys(dayData[h]).length > 0
    ).length;
    return workedHours > 9 ? `${workedHours - 9}hr` : "0hr";
  };
  const calculateWorkHours = (dayData) => {
    if (!dayData) return "0hr";
    const hours = Object.keys(dayData).filter(
      (h) => !isNaN(h) && Object.keys(dayData[h]).length > 0
    ).length;
    const overtime = typeof dayData.overtime === "number" ? dayData.overtime : 0;
    return `${hours}hr`;
  };

  const calculateDetails = (dayData) => {
    if (!dayData) return "-";
    const tasks = new Set();
    for (let h = 10; h <= 18; h++) {
      const hourData = dayData[h];
      if (hourData?.task) tasks.add(hourData.task);
    }
    return tasks.size > 0 ? [...tasks].join(", ") : "-";
  };

  const updateHourDetail = (hour, key, value) => {
    setHourlyDetails((prev) => {
      const currentDay = prev[selectedDate] || {};
      const currentHour = currentDay[hour] || {};
      return {
        ...prev,
        [selectedDate]: {
          ...currentDay,
          [hour]: {
            ...currentHour,
            [key]: value,
          },
        },
      };
    });
  };

  useEffect(() => {
    if (formMode === "Leave" && selectedDate) {
      setHourlyDetails((prev) => ({
        ...prev,
        [selectedDate]: {},
      }));
    }
  }, [formMode, selectedDate]);
  // Calculate total, regular, overtime, and holiday hours
  let totalHours = 0;
  let regularHours = 0;
  let overtimeHours = 0;
  let holidayHours = 0;
  let holidayDays = 0;
  let leaveDays = 0;
  let leaveHours = 0;

  let approvedHours = 0;
  let pendingHours = 0;
  let rejectedHours = 0;

  daysInMonth.forEach((date) => {
    const formatted = formatDate(date);
    const statusObj = dayStatus[formatted] || {};
    const data = hourlyDetails[formatted] || {};
    const status = statusObj.status || "Work";
    const approval = statusObj.approval || "Pending";

    let workHourCount = Object.keys(data).filter(
      (h) => !isNaN(h) && Object.keys(data[h] || {}).length > 0
    ).length;

    const overtime = typeof data.overtime === "number" ? data.overtime : 0;
    const total = workHourCount + overtime;

    totalHours += total;

    if (status === "Holiday") {
      holidayHours += 8;
      holidayDays += 1;
    } else if (status === "Leave") {
      leaveHours += 8;
      leaveDays += 1;
    } else if (status === "Work") {
      regularHours += workHourCount;
      overtimeHours += overtime;
    }

    if (approval === "Approved") approvedHours += total;
    else if (approval === "Pending") pendingHours += total;
    else if (approval === "Rejected") rejectedHours += total;
  });

  // For progress bar
  const approvedPercent = (approvedHours / totalHours) * 100 || 0;
  const overtimePercent = (overtimeHours / totalHours) * 100 || 0;
  const pendingPercent = (pendingHours / totalHours) * 100 || 0;

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <div className={`employee-detail-container ${showPopupForm ? "blur" : ""}`}>
          <div className="header">
            <Button
              startIcon={<ArrowBackIcon />}
              variant="text"
              color="primary"
              onClick={() => navigate("/timesheet")}
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                textTransform: "none",
                mb: 2, // optional: margin bottom
              }}
            >
              Back
            </Button>
            <h1>Time & Attendance</h1>
          </div>

          <div className="profile-section">
            <img src="https://via.placeholder.com/60" alt="Employee" className="profile-pic" />
            <div className="profile-info">
              <h2>{employee?.name || "Unknown"}</h2>
              <p className="role">
                {employee?.role || "-"} • {employee?.type || "-"}
              </p>
            </div>
            <div className="hours-summary">
              <p className="total">{totalHours} hrs Total</p>
              <p>{regularHours} hrs Regular</p>
              <p>{overtimeHours} hrs Overtime</p>
              <p>
                {holidayHours} hrs /{holidayDays} day Holiday
              </p>
              <p>
                {leaveHours} hrs/{leaveDays} day leave
              </p>
            </div>
            <br></br>
          </div>
          <div className="progress-section">
            <p className="progress-text">Hour breakdown: {totalHours} hrs</p>
            <div className="progress-bar">
              <div className="approved" style={{ width: `${approvedPercent}%` }}></div>
              <div className="overtime" style={{ width: `${overtimePercent}%` }}></div>
              <div className="pending" style={{ width: `${pendingPercent}%` }}></div>
            </div>
            <div className="progress-legend">
              <span className="legend green">Approved: {approvedHours} hrs</span>
              <span className="legend red">Overtime: {overtimeHours} hrs</span>
              <span className="legend orange">Pending: {pendingHours} hrs</span>
            </div>
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === "timecard" ? "active" : ""}`}
              onClick={() => setActiveTab("timecard")}
            >
              Timecard
            </button>
            <button
              className={`tab ${activeTab === "timeline" ? "active" : ""}`}
              onClick={() => setActiveTab("timeline")}
            >
              Timeline
            </button>
          </div>

          <Box display="flex" gap={2} mb={2} className="month-selector">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="month-select-label">Month</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {Array.from({ length: 16 }, (_, i) => (
                  <MenuItem key={i} value={2020 + i}>
                    {2020 + i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {activeTab === "timecard" && (
            <div className="timecard-view">
              <Box className="filter-bar" display="flex" alignItems="center" gap={2} mb={2}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="approval-filter-label">Filter by Approval</InputLabel>
                  <Select
                    labelId="approval-filter-label"
                    id="approval-filter"
                    value={approvalFilter}
                    label="Filter by Approval"
                    onChange={(e) => setApprovalFilter(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Meal Break</th>
                    <th>Overtime Hours</th>
                    <th>Regular Hours</th>
                    <th>Approval</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {daysInMonth
                    .filter((date) => {
                      const formatted = formatDate(date);
                      const currentApproval = dayStatus[formatted]?.approval || "Pending";

                      if (approvalFilter === "All") return true;
                      return currentApproval === approvalFilter;
                    })

                    .map((date, index) => {
                      const formatted = formatDate(date);
                      const statusObj = dayStatus[formatted];
                      const status = typeof statusObj?.status === "string" ? statusObj.status : "-";
                      const approval =
                        typeof statusObj?.approval === "string" ? statusObj.approval : "Pending";
                      const overtime = calculateOvertime(hourlyDetails[formatted]);

                      return (
                        <tr key={index}>
                          <td>{formatted}</td>
                          <td>{hourlyDetails[formatted]?._checkInOut?.checkIn || "-"}</td>
                          <td>{hourlyDetails[formatted]?._checkInOut?.checkOut || "-"}</td>

                          <td>{calculateMealBreak(hourlyDetails[formatted])}</td>
                          <td>
                            {status === "Work" && hourlyDetails[formatted]?.overtime > 0
                              ? hourlyDetails[formatted].overtime
                              : "-"}
                          </td>
                          <td>{calculateWorkHours(hourlyDetails[formatted])}</td>

                          <td>
                            {status === "Leave" ? (
                              "-"
                            ) : (
                              <span
                                className={
                                  approval === "Approved"
                                    ? "status-approved"
                                    : approval === "Rejected"
                                    ? "status-rejected"
                                    : "status-pending"
                                }
                              >
                                {approval}
                              </span>
                            )}
                          </td>
                          <td>{calculateDetails(hourlyDetails[formatted])}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="timeline-view">
              <Box
                className="filter-bar"
                display="flex"
                alignItems="center"
                gap={2}
                mb={2}
                sx={{ backgroundColor: "#f9f9f9", padding: "12px", borderRadius: 0, boxShadow: 1 }}
              >
                <Typography variant="subtitle1" fontWeight={500}>
                  Filter by Approval:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel id="approval-filter-label">Status</InputLabel>
                  <Select
                    labelId="approval-filter-label"
                    id="approval-filter"
                    value={approvalFilter}
                    label="Status"
                    onChange={(e) => setApprovalFilter(e.target.value)}
                    renderValue={(selected) => (
                      <Box display="flex" alignItems="center" gap={1}>
                        {statusStyles[selected]?.icon}
                        <Chip
                          label={statusStyles[selected]?.label}
                          color={statusStyles[selected]?.color}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    )}
                  >
                    {Object.entries(statusStyles).map(([key, { label, color, icon }]) => (
                      <MenuItem key={key} value={key}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {icon}
                          <Chip label={label} color={color} size="small" />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <div className="timeline-header">
                <div className="date-cell">Date</div>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="hour-label">
                    {formatHour(i + 10)} - {formatHour(i + 11)}
                  </div>
                ))}
                <div className="approval-cell">Edit</div>
              </div>
              {daysInMonth
                .filter((date) => {
                  const formatted = formatDate(date);
                  const currentApproval = dayStatus[formatted]?.approval || "Pending";
                  if (approvalFilter === "All") return true;
                  return currentApproval === approvalFilter;
                })
                .map((date, index) => {
                  const formatted = formatDate(date);
                  return (
                    <div className="timeline-row" key={index}>
                      <div className="date-cell">{formatted}</div>
                      {[...Array(9)].map((_, hourIdx) => {
                        const hour = 10 + hourIdx;
                        const hourData = hourlyDetails[formatted]?.[hour];
                        const isLeave = dayStatus[formatted]?.status === "Leave";
                        const isFilled = hourData && Object.keys(hourData).length > 0;

                        let colorClass = "";
                        if (hour === 13) colorClass = "break";
                        else if (dayStatus[formatted]?.status === "Holiday") colorClass = "holiday";
                        else if (dayStatus[formatted]?.status === "Leave") colorClass = "leave";
                        else if (isFilled) colorClass = "work";

                        return (
                          <div
                            key={hourIdx}
                            className={`hour-cell ${colorClass}`}
                            title={
                              isFilled
                                ? `${hourData.name || "-"} (${hourData.phase || "-"})`
                                : isLeave
                                ? "Leave"
                                : hour === 13
                                ? "Lunch Break"
                                : ""
                            }
                          />
                        );
                      })}
                      <div className="approval-cell">
                        <div className="approval-actions">
                          <button className="icon-btn edit-btn" onClick={() => openEditPopup(date)}>
                            ✎
                          </button>
                          <button
                            className="icon-btn approve-btn"
                            onClick={() => {
                              setDayStatus((prev) => ({
                                ...prev,
                                [formatted]: {
                                  ...(prev[formatted] || {}),
                                  approval: "Approved",
                                  status: prev[formatted]?.status || "Work",
                                },
                              }));
                            }}
                          >
                            ✓
                          </button>
                          <button
                            className="icon-btn reject-btn"
                            onClick={() => {
                              setDayStatus((prev) => ({
                                ...prev,
                                [formatted]: {
                                  ...(prev[formatted] || {}),
                                  approval: "Rejected",
                                  status: prev[formatted]?.status || "Work",
                                },
                              }));
                            }}
                          >
                            ✕
                          </button>
                          <div className="status-label">
                            {dayStatus[formatted]?.approval || "Pending"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              <div className="legend-container">
                <span className="legend-box work" /> Work
                <span className="legend-box leave" /> Leave
                <span className="legend-box break" /> Lunch Break
              </div>
            </div>
          )}
        </div>

        {showPopupForm && (
          <>
            <div className="overlay" onClick={closeEditPopup}></div>
            <div className="popup-form">
              <div className="popup-header">
                <h3>Edit Hour Details</h3>
                <button className="close-btn" onClick={closeEditPopup}>
                  ✖
                </button>
              </div>
              <div className="popup-content">
                <p className="popup-date">{selectedDate}</p>

                <div className="field-row">
                  <div className="field">
                    <label>Check-In Time</label>
                    <input
                      type="time"
                      value={checkInOut.checkIn}
                      onChange={(e) =>
                        setCheckInOut((prev) => ({ ...prev, checkIn: e.target.value }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Check-Out Time</label>
                    <input
                      type="time"
                      value={checkInOut.checkOut}
                      onChange={(e) =>
                        setCheckInOut((prev) => ({ ...prev, checkOut: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <select
                  value={formMode}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setFormMode(newStatus); // ✅ Correct function

                    if (newStatus !== "Work") {
                      setHourlyDetails((prev) => ({
                        ...prev,
                        [selectedDate]: {
                          ...prev[selectedDate],
                          overtime: 0,
                        },
                      }));
                    }
                  }}
                >
                  <option value="">Select Status</option>
                  <option value="Work">Work</option>
                  <option value="Leave">Leave</option>
                  <option value="Holiday">Holiday</option>
                </select>

                {formMode === "Work" && (
                  <div className="field">
                    <label>Overtime Hours</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={hourlyDetails[selectedDate]?.overtime || ""}
                      onChange={(e) =>
                        setHourlyDetails((prev) => ({
                          ...prev,
                          [selectedDate]: {
                            ...prev[selectedDate],
                            overtime: parseFloat(e.target.value) || 0,
                          },
                        }))
                      }
                    />
                  </div>
                )}

                {[...Array(9)].map((_, i) => {
                  const hour = 10 + i;
                  const hourData = hourlyDetails[selectedDate]?.[hour] || {};
                  return (
                    <div key={i} className="hour-block">
                      <h4>
                        {formatHour(hour)} - {formatHour(hour + 1)}
                      </h4>
                      <div className="field">
                        <label>Project Type</label>
                        <select
                          value={hourData.type || ""}
                          onChange={(e) => updateHourDetail(hour, "type", e.target.value)}
                          disabled={formMode === "Leave"}
                        >
                          <option value="">Select</option>
                          <option>Billable</option>
                          <option>Internal</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Project Name</label>
                        <input
                          type="text"
                          value={hourData.name || ""}
                          onChange={(e) => updateHourDetail(hour, "name", e.target.value)}
                          disabled={formMode === "Leave"}
                        />
                      </div>
                      <div className="field">
                        <label>Project Phase</label>
                        <select
                          value={hourData.phase || ""}
                          onChange={(e) => updateHourDetail(hour, "phase", e.target.value)}
                          disabled={formMode === "Leave"}
                        >
                          <option value="">Select Phase</option>
                          {phases.map((p, idx) => (
                            <option key={idx}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label>Project Task</label>
                        <select
                          value={hourData.task || ""}
                          onChange={(e) => updateHourDetail(hour, "task", e.target.value)}
                          disabled={formMode === "Leave"}
                        >
                          <option value="">Select Task</option>
                          {tasks.map((t, idx) => (
                            <option key={idx}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <hr />
                    </div>
                  );
                })}
              </div>

              <div className="popup-footer">
                <button className="cancel-btn" onClick={closeEditPopup}>
                  Cancel
                </button>
                <button
                  className="save-btn"
                  onClick={() => {
                    setDayStatus((prev) => ({
                      ...prev,
                      [selectedDate]: {
                        ...(prev[selectedDate] || {}),
                        status: formMode,
                      },
                    }));
                    setHourlyDetails((prev) => ({
                      ...prev,
                      [selectedDate]: {
                        ...prev[selectedDate],
                        _checkInOut: checkInOut,
                      },
                    }));
                    closeEditPopup();
                  }}
                >
                  Save
                </button>
                <button
                  className="approve-btn"
                  onClick={() => {
                    setDayStatus((prev) => ({
                      ...prev,
                      [selectedDate]: {
                        ...(prev[selectedDate] || {}),
                        approval: "Approved",
                        status: formMode,
                      },
                    }));
                    closeEditPopup();
                  }}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => {
                    setDayStatus((prev) => ({
                      ...prev,
                      [selectedDate]: {
                        ...(prev[selectedDate] || {}),
                        approval: "Rejected",
                        status: formMode,
                      },
                    }));
                    closeEditPopup();
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </>
        )}
      </DashboardLayout>
    </>
  );
};

export default EmployeeDetail;
