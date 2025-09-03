// controllers/memberController.js
export const addMember = (db) => (req, res) => {
  const { fullName, email, phone, empId, department, role, password } = req.body;
  const sql = `INSERT INTO members (fullName, email, phone, empId, department, role, password)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [fullName, email, phone, empId, department, role, password], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, memberId: result.insertId });
  });
};
