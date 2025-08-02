import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Tables() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay() || 7;
  const totalDays = endOfMonth.getDate();

  const handlePrev = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const handleNext = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const renderCalendar = () => {
    const boxes = [];
    for (let i = 1; i < startDay; i++) {
      boxes.push(<div key={`empty-${i}`} className="border p-3 bg-transparent"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = dateObj.toDateString();
      const isSelected = selectedDate && dateKey === selectedDate.toDateString();

      boxes.push(
        <div
          key={day}
          className={`border rounded shadow-sm p-2 ${
            isSelected ? "border-3 bg-info text-light" : "bg-white hover-shadow"
          }`}
          style={{
            cursor: "pointer",
            height: "100px",
            textAlign: "center",
            transition: "all 0.3s",
          }}
          onClick={() => handleDateClick(dateObj)}
        >
          <div
            className="fw-bold fs-5"
            style={isSelected ? { textShadow: "1px 1px 2px rgba(0,0,0,0.5)" } : {}}
          >
            {day}
          </div>
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
          <h4 className="fw-bold text-primary">
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
              className="fw-bold text-center py-2 rounded text-white"
              style={{
                backgroundColor: [
                  "#6f42c1",
                  "#6610f2",
                  "#0d6efd",
                  "#198754",
                  "#fd7e14",
                  "#dc3545",
                  "#20c997",
                ][index],
              }}
            >
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
