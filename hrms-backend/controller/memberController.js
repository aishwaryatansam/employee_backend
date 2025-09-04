// controllers/memberController.js

// ➕ Add new member
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


