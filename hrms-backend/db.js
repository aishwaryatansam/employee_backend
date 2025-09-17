import express from "express";
import cors from "cors";
import mysql from "mysql2";
import path from "path";
import { fileURLToPath } from "url";

// Controllers
import {
  getEmployeeCount,
  addMember,
  getMembers,
  deleteMember,
  updateMember,
  getMembersByEmail,
  getMemberById,
  login,
} from "./controller/memberController.js";

import { createHrProjects, assignTeamLead } from "./controller/hrController.js";


import {
  addHourDetail,
  getHourDetailsByMonth,
  insertApprovalStatus,
} from "./controller/timesheetContoller.js";

import {
  addProjects,
  getProjects,
  updateProject,
  deleteProject,
} from "./controller/projectController.js";

// Setup
const app = express();
const PORT = 3001;

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database");
});

// ------------------- Routes ------------------- //
// Timesheet
app.post("/insertApprovalStatus/:timesheetId", insertApprovalStatus(db));
app.post("/addHourDetail", addHourDetail(db));
app.get("/getHourDetailsByMonth", getHourDetailsByMonth(db));

// Member
app.post("/members", addMember(db));
app.get("/api/members", getMembers(db));
app.get("/api/member/:id", getMemberById(db));
app.delete("/api/members/:id", deleteMember(db));
app.put("/api/members/:id", updateMember(db));
app.get("/api/members/byEmail", getMembersByEmail(db));
app.post("/login", login(db));
app.get("/api/hr/employee-count", getEmployeeCount(db));


// Projects
app.post("/api/projects", createHrProjects(db));
app.post("/api/assign", assignTeamLead(db));
app.post("/addProjects", addProjects(db));
app.get("/getProjects", getProjects(db));
app.put("/updateProject/:id", updateProject(db));
app.delete("/deleteProject/:project_id", deleteProject(db));

// ------------------- Server ------------------- //
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});