import express from "express";
import cors from "cors";
import mysql from "mysql2";
import {
  addMember,
  getMembers,
  deleteMember,
  updateMember,
} from "./controller/memberController.js";
import { createHrProjects, assignTeamLead } from "./controller/hrController.js";
import { addHourDetail, getHourDetailsByMonth } from "./controller/timesheetContoller.js";
const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee",
});

db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Use the controller function as route handler
app.post("/members", addMember(db));
// Add missing routes for full functionality
app.get("/api/members", getMembers(db)); // Fetch all members
app.delete("/api/members/:id", deleteMember(db));
app.put("/api/members/:id", updateMember(db));
//app.post("/api/projects", addProjects(db));
//app.get("/api/projects", getProjects(db));
app.post("/addHourDetail", addHourDetail(db));
app.post("/api/projects", createHrProjects(db));
app.post("/api/assign", assignTeamLead(db));
app.get("/getHourDetailsByMonth", getHourDetailsByMonth(db));
app.post("/addProjects", addProjects(db));
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
