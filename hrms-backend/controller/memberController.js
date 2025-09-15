import bcrypt from "bcryptjs";

// controllers/memberController.js

//
/* ➕ Add new member
export const addMember = (db) => (req, res) => {
  const { fullName, email, phone, empId, department, role, password } = req.body;

  const sql = `
    INSERT INTO members (fullName, email, phone, empId, department, role, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [fullName, email, phone, empId, department, role, password], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, memberId: result.insertId });
  });
};*/
export const addMember = (db) => async (req, res) => {
  const { fullName, email, role, phone, empId, department, password } = req.body;

  try {
    console.log("Incoming body:", req.body); // 🔍 debug

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("Hashed password:", hashedPassword); // 🔍 check in console

    const sql = `
      INSERT INTO members (fullName, email, phone, empId, department, role, password)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [fullName, email, phone, empId, department, role, hashedPassword];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting member:", err);
        return res.status(500).json({ error: err.message || "Database error" });
      }
      res.status(201).json({ message: "Member added successfully" });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// controllers/memberController.js
export const getMembersByEmail = (db) => (req, res) => {
  const { email } = req.query; // ✅ extract email from query
  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  const sql = "SELECT * FROM members WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.length === 0)
      return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, data: results[0] });
  });
};

export const getMembersById = (db) => (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM members WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: "Member not found" });
    res.json(results[0]);
  });
};
// 📋 Get all members
export const getMembers = (db) => (req, res) => {
  const sql = `SELECT * FROM members`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("Fetched members:", results);
    res.json(results);
  });
};
export const getMemberById = (db) => (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM members WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (results.length > 0) {
      res.json(results[0]); // return single object
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  });
};

// 🗑️ Delete a member
export const deleteMember = (db) => (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM members WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
};

// ✏️ Update a member
export const updateMember = (db) => (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, empId, department, role, password } = req.body;

  const sql = `
    UPDATE members
    SET fullName = ?, email = ?, phone = ?, empId = ?, department = ?, role = ?, password = ?
    WHERE id = ?
  `;

  db.query(sql, [fullName, email, phone, empId, department, role, password, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
};

export const login = (db) => async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM members WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

      const user = results[0];

      let isMatch = false;

      try {
        // First try bcrypt
        isMatch = await bcrypt.compare(password, user.password);
      } catch (e) {
        isMatch = false;
      }

      // If bcrypt fails AND the DB password is raw text, check direct match
      if (!isMatch && user.password === password) {
        isMatch = true;
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({
        email: user.email,
        role: user.role,
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
