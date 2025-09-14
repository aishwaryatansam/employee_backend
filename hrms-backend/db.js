import express from "express";
import cors from "cors";
import mysql from "mysql2";
import {
  addMember,
  getMembers,
  deleteMember,
  updateMember,
  getMembersByEmail,
  getMemberById,
} from "./controller/memberController.js";
import { createHrProjects, assignTeamLead } from "./controller/hrController.js";
import {
  addHourDetail,
  getHourDetailsByMonth,
  insertApprovalStatus,
} from "./controller/timesheetContoller.js";
import { addProjects, getProjects, updateProject, deleteProject} from "./controller/projectController.js";

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
app.post("/insertApprovalStatus/:timesheetId", insertApprovalStatus(db));
app.post("/members", addMember(db));
app.get("/api/members", getMembers(db));
app.get("/api/member/:id", getMemberById(db));
app.delete("/api/members/:id", deleteMember(db));
app.put("/api/members/:id", updateMember(db));
app.post("/addHourDetail", addHourDetail(db));
app.post("/api/projects", createHrProjects(db));
app.post("/api/assign", assignTeamLead(db));
app.get("/api/members/byEmail", getMembersByEmail(db));
app.get("/getHourDetailsByMonth", getHourDetailsByMonth(db));
app.post("/addProjects", addProjects(db));

app.get("/getProjects", getProjects(db));
app.put("/updateProject/:id", updateProject(db));
app.delete("/deleteProject/:project_id", deleteProject(db));


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
