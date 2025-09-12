// ➕ Add new employee hour details
// Example Express controller
export const addHourDetail = (db) => (req, res) => {
  const { date, checkIn, checkOut, overtime, status, hourBlocks, email } = req.body;

  console.log("Received email:", email); // ✅ debug

  if (!email) return res.json({ success: false, error: "Email missing" });

  db.query("SELECT id FROM members WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!results.length) return res.json({ success: false, error: "Member not found" });

    const memberId = results[0].id;
    console.log("Fetched memberId:", memberId); // ✅ debug

    if (!memberId || memberId === 0)
      return res.json({ success: false, error: "Invalid memberId received" });

    const query = `
      INSERT INTO timesheet (date, checkIn, checkOut, overtime, status, hourBlocks, memberId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [date, checkIn, checkOut, overtime, status, JSON.stringify(hourBlocks || []), memberId],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        res.json({ success: true, data: result });
      }
    );
  });
};

// Get existing hour detail by date + email

// ✏️ Update employee hour details
export const updateEmployeeHours = (db) => (req, res) => {
  const { userId, date } = req.params;
  const { checkIn, checkOut, overtime, globalStatus, dayStatus, hourBlocks } = req.body;

  const sql = `
    UPDATE employee_hours
    SET check_in = ?, check_out = ?, overtime = ?, global_status = ?, day_status = ?, hour_details = ?
    WHERE userId = ? AND date = ?
  `;
  db.query(
    sql,
    [
      checkIn,
      checkOut,
      overtime,
      globalStatus,
      dayStatus,
      JSON.stringify(hourBlocks),
      userId,
      date,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
};

// 📂 Get employee hours for a given month
export const getHourDetailsByMonth = (db) => (req, res) => {
  const { year, month, memberId } = req.query; // 👈 include memberId
  if (!memberId) return res.json({ success: false, error: "memberId required" });

  const startDate = `${year}-${String(Number(month) + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(Number(month) + 1).padStart(2, "0")}-31`;

  const query = `
    SELECT * FROM timesheet
    WHERE memberId = ? AND date BETWEEN ? AND ?;
  `;
  db.query(query, [memberId, startDate, endDate], (err, results) => {
    if (err) return res.json({ success: false, error: err.message });
    res.json({ success: true, data: results });
  });
};
