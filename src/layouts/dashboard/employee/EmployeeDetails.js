import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./EmployeeDetails.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("timecard");
  const [showPopupForm, setShowPopupForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hourlyDetails, setHourlyDetails] = useState({});
  const [formMode, setFormMode] = useState({});
  const [dayStatus, setDayStatus] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [checkInOut, setCheckInOut] = useState({ checkIn: "", checkOut: "" });
  const [overtimeHours, setOvertimeHours] = useState("");
  const [employee, setEmployee] = useState([]);
  const [timecardData, setTimecardData] = useState([]);

  const padTime = (t) => (t && t.match(/^\d{2}:\d{2}$/) ? t + ":00" : t || "00:00:00");
  const handleSaveTimesheet = async () => {
    const date = selectedDate;
    const dayData = hourlyDetails[date] || {};
    const status = formMode;
    const checkIn = padTime(checkInOut.checkIn);
    const checkOut = padTime(checkInOut.checkOut);
    const overtime = parseFloat(overtimeHours) || 0;
    const hourBlocks = [];
    for (let hour = 10; hour <= 18; hour++) {
      const details = dayData[hour] || {};
      hourBlocks.push({
        hour,
        projectType: details.type || "",
        projectName: details.name || "",
        projectPhase: details.phase || "",
        projectTask: details.task || "",
      });
    }
    const body = { date, checkIn, checkOut, overtime, status, hourBlocks };
    try {
      const response = await fetch("http://localhost:3001/addHourDetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (result.success) {
        alert("✅ Timesheet saved successfully!");
      } else {
        alert("❌ Error: " + (result.error || "Could not save"));
      }
    } catch (e) {
      console.error("Save failed:", e);
      alert("⚠️ Network error! Please try again.");
    }
  };

  // Fetch backend data (optional, for future use)
  useEffect(() => {
    const monthToSend = selectedMonth; // API expects 1-12
    const url = `http://localhost:3001/getHourDetailsByMonth?year=${selectedYear}&month=${monthToSend}`;
    console.log("Fetching URL:", url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        if (data.success && data.data) {
          setTimecardData(data.data);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [selectedMonth, selectedYear]);

  // populate popup when opened
  useEffect(() => {
    if (!showPopupForm || !selectedDate || !timecardData) return;

    // find record for selectedDate
    const entry = timecardData.find(
      (d) => new Date(d.date).toISOString().slice(0, 10) === selectedDate
    );

    if (entry) {
      // check-in / check-out
      setCheckInOut({
        checkIn: entry.checkIn || "",
        checkOut: entry.checkOut || "",
      });

      // overtime + status
      setOvertimeHours(entry.overtime || 0);
      setFormMode(entry.status || "Work");

      // hourBlocks parsing
      try {
        const parsed = JSON.parse(entry.hourBlocks || "[]");
        const mapped = {};
        parsed.forEach((block) => {
          mapped[block.hour] = {
            type: block.projectType || "",
            name: block.projectName || "",
            phase: block.projectPhase || "",
            task: block.projectTask || "",
          };
        });

        setHourlyDetails((prev) => ({
          ...prev,
          [selectedDate]: mapped,
        }));
      } catch (err) {
        console.error("Error parsing hourBlocks:", err);
      }
    }
  }, [showPopupForm, selectedDate, timecardData]);

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

  // Returns "2025-09-01" for a Date object
  function formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const openEditPopup = (date) => {
    const formatted = formatDate(date);
    setSelectedDate(formatted);
    setFormMode(dayStatus[formatted] || "Work");
    const saved = hourlyDetails[formatted]?._checkInOut || {};
    setCheckInOut({
      checkIn: saved.checkIn || "",
      checkOut: saved.checkOut || "",
    });
    setOvertimeHours(hourlyDetails[formatted]?._overtime || "");
    setShowPopupForm(true);
  };
  const closeEditPopup = () => {
    setShowPopupForm(false);
    setSelectedDate(null);
    setCheckInOut({ checkIn: "", checkOut: "" });
    setOvertimeHours("");
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

  // Calculate work hours for a day (all filled hour blocks except break hour 13)
  const getWorkHours = (details = {}) => {
    let count = 0;
    for (let hour = 10; hour <= 18; hour++) {
      if (hour === 13) continue; // lunch break
      const hd = details[hour];
      if (hd && hd.type) count++;
    }
    return count;
  };

  // For meal break, just say 1hr 1-2pm for now, or customize
  const getMealBreak = () => "1 hr";

  return (
    <MDBox sx={{ fontSize: "0.875rem" }}>
      <DashboardLayout>
        <DashboardNavbar />
        <>
          <div className={`employee-detail-container ${showPopupForm ? "blur" : ""}`}>
            <div className="header">
              <Link to="/" className="back-link">
                ← Back
              </Link>
              <h1>Time & Attendance</h1>
            </div>
            <div className="profile-section">
              <img src="https://via.placeholder.com/60" alt="Employee" className="profile-pic" />
              <div className="profile-info">
                <h2>Ralph Edwards</h2>
                <p className="role">Product Designer • Hourly</p>
              </div>
              <div className="hours-summary">
                <p className="total">264 hrs Total</p>
                <p>172 hrs Regular</p>
                <p>24 hrs Overtime</p>
                <p>20 hrs Holiday</p>
              </div>
            </div>
            <div className="progress-section">
              <p className="progress-text">Hour breakdown: 264 hrs</p>
              <div className="progress-bar">
                <div className="approved" style={{ width: "70%" }}></div>
                <div className="overtime" style={{ width: "20%" }}></div>
                <div className="pending" style={{ width: "10%" }}></div>
              </div>
              <div className="progress-legend">
                <span className="legend green">Approved: 132 hrs</span>
                <span className="legend red">Overtime: 40 hrs</span>
                <span className="legend orange">Pending: 10 hrs</span>
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
            <div className="month-selector">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {Array.from({ length: 16 }, (_, i) => (
                  <option key={i} value={2020 + i}>
                    {2020 + i}
                  </option>
                ))}
              </select>
            </div>

            {activeTab === "timecard" && (
              <div className="timecard-view">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Meal Break</th>
                      <th>Work Hours</th>
                      <th>Overtime</th>
                      <th>Approval</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timecardData.map((row) => {
                      const hourBlocks = JSON.parse(row.hourBlocks || "[]"); // parse JSON string
                      const details = row.hourBlocks || "-";
                      return (
                        <tr key={row.id}>
                          <td>{formatDate(row.date)}</td> {/* Date */}
                          <td>{row.checkIn}</td> {/* Check-in */}
                          <td>{row.checkOut}</td> {/* Check-out */}
                          <td>{row.mealBreak || "1 hr"}</td> {/* Meal Break */}
                          <td>{getWorkHours(hourBlocks)}</td> {/* Work Hours */}
                          <td>{row.overtime || 0}</td> {/* Overtime */}
                          <td>{row.approval || "Pending"}</td> {/* Approval */}
                          <td>
                            {JSON.parse(row.hourBlocks || "[]").map((block, idx) => (
                              <div key={idx}>
                                Hour: {block.hour},Project Type: {block.projectType || "-"},Project
                                Name: {block.projectName || "-"},Project Phase:{" "}
                                {block.projectPhase || "-"}, Project Task:{" "}
                                {block.projectTask || "-"}
                              </div>
                            ))}
                          </td>
                          {/* Details */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="timeline-view">
                <div className="timeline-header">
                  <div className="date-cell">Date</div>
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="hour-label">
                      {formatHour(i + 10)} - {formatHour(i + 11)}
                    </div>
                  ))}
                  <div className="approval-cell">Edit</div>
                </div>
                {daysInMonth.map((date, index) => {
                  const formatted = formatDate(date);
                  return (
                    <div className="timeline-row" key={index}>
                      <div className="date-cell">{formatted}</div>
                      {[...Array(9)].map((_, hourIdx) => {
                        const hour = 10 + hourIdx;
                        const hourData = hourlyDetails[formatted]?.[hour];
                        const isLeave = dayStatus[formatted] === "Leave";
                        const isFilled = hourData && Object.keys(hourData).length > 0;
                        let colorClass = "";
                        if (hour === 13) colorClass = "break";
                        else if (isLeave) colorClass = "leave";
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
                        <button className="icon-btn edit-btn" onClick={() => openEditPopup(date)}>
                          ✎
                        </button>
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
                  <div className="field">
                    <label>Overtime (in hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={overtimeHours}
                      onChange={(e) => setOvertimeHours(e.target.value)}
                      disabled={formMode === "Leave"}
                    />
                  </div>
                  <div className="field">
                    <label>Global Status</label>
                    <select value={formMode} onChange={(e) => setFormMode(e.target.value)}>
                      <option value="Work">Work</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </div>
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
                      setDayStatus((prev) => ({ ...prev, [selectedDate]: formMode }));
                      setHourlyDetails((prev) => ({
                        ...prev,
                        [selectedDate]: {
                          ...prev[selectedDate],
                          _checkInOut: checkInOut,
                          _overtime: overtimeHours,
                        },
                      }));
                      closeEditPopup();
                      handleSaveTimesheet();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      </DashboardLayout>
    </MDBox>
  );
};

export default EmployeeDetails;
