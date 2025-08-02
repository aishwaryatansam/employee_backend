import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Tables() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [formData, setFormData] = useState({
    projectType: "",
    projectName: "",
    phase: "",
    task: "",
    hours: "",
  });
  const [entries, setEntries] = useState({});
  const [editProfileData, setEditProfileData] = useState({
    name: localStorage.getItem("employeeName") || "",
    photo: localStorage.getItem("employeePhoto") || "",
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayColors = [
    "#6610f2", // Monday
    "#0d6efd", // Tuesday
    "#198754", // Wednesday
    "#fd7e14", // Thursday
    "#dc3545", // Friday
    "#20c997", // Saturday
    "#6f42c1", // Sunday
  ];

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = (startOfMonth.getDay() + 6) % 7; // Start with Monday
  const totalDays = endOfMonth.getDate();

  const handlePrev = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNext = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setFormVisible(true);
  };

  const handleAddEntry = () => {
    if (
      !formData.projectType ||
      !formData.projectName ||
      !formData.phase ||
      !formData.task ||
      !formData.hours
    )
      return;

    const dateKey = selectedDate.toDateString();
    const newEntry = { ...formData };
    setEntries((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEntry],
    }));
    setFormVisible(false);
    setSelectedDate(null);
    setFormData({ projectType: "", projectName: "", phase: "", task: "", hours: "" });
  };

  const handleEditProfile = () => {
    localStorage.setItem("employeeName", editProfileData.name);
    localStorage.setItem("employeePhoto", editProfileData.photo);
    setEditProfileVisible(false);
    window.location.reload();
  };

  const renderCalendar = () => {
    const boxes = [];
    for (let i = 0; i < startDay; i++) {
      boxes.push(<div key={`empty-${i}`} className="border p-3 bg-transparent"></div>);
    }
    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = dateObj.toDateString();
      const isSelected = selectedDate && dateKey === selectedDate.toDateString();
      boxes.push(
        <div
          key={day}
          className={`border rounded p-2 bg-light ${isSelected ? "border-primary border-3" : ""}`}
          style={{ cursor: "pointer", height: "120px", overflowY: "auto" }}
          onClick={() => handleDateClick(dateObj)}
        >
          <div className="fw-bold">{day}</div>
          {entries[dateKey]?.map((entry, idx) => (
            <div key={idx} className="small">
              <strong>{entry.projectType}</strong>
              <br />
              {entry.projectName} - {entry.phase}
              <br />
              {entry.task} ({entry.hours}h)
            </div>
          ))}
        </div>
      );
    }
    return boxes;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-primary" onClick={handlePrev}>
            &lt; Prev
          </button>
          <h4>
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
          </h4>
          <button className="btn btn-outline-primary" onClick={handleNext}>
            Next &gt;
          </button>
        </div>

        <div className="d-grid" style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" }}>
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className="fw-bold text-center text-white py-2 rounded"
              style={{ backgroundColor: dayColors[index] }}
            >
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>

        {/* Add Entry Modal */}
        {formVisible && (
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Entry - {selectedDate?.toDateString()}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setFormVisible(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {[
                    {
                      label: "Select Project Type",
                      options: ["Internal", "Billable"],
                      field: "projectType",
                    },
                    {
                      label: "Project Name",
                      type: "text",
                      field: "projectName",
                    },
                    {
                      label: "Select Phase",
                      options: ["Planning", "Development", "Testing"],
                      field: "phase",
                    },
                    {
                      label: "Select Task",
                      options: ["Coding", "Review", "Bug Fix"],
                      field: "task",
                    },
                  ].map(({ label, options, field, type = "select" }) => (
                    <div key={field} className="mb-3">
                      {type === "select" ? (
                        <select
                          className="form-select"
                          value={formData[field]}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        >
                          <option value="">{label}</option>
                          {options.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="form-control"
                          placeholder={label}
                          value={formData[field]}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                  <div className="mb-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Hours Worked"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setFormVisible(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddEntry}>
                    Add Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {editProfileVisible && (
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Profile</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditProfileVisible(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {["name", "photo"].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">
                        {field === "name" ? "Name" : "Photo URL"}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={editProfileData[field]}
                        onChange={(e) =>
                          setEditProfileData({
                            ...editProfileData,
                            [field]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditProfileVisible(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleEditProfile}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
