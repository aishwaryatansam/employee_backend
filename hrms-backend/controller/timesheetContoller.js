// ➕ Add new employee hour details
export const addEmployeeHours = (db) => (req, res) => {
  const { userId, date } = req.params;
  const { checkIn, checkOut, overtime, globalStatus, dayStatus, hourBlocks } = req.body;

  const sql = `
    INSERT INTO employee_hours
      (userId, date, check_in, check_out, overtime, global_status, day_status, hour_details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      userId,
      date,
      checkIn,
      checkOut,
      overtime,
      globalStatus,
      dayStatus,
      JSON.stringify(hourBlocks),
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, insertedId: result.insertId });
    }
  );
};

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
export const getEmployeeHours = (db) => (req, res) => {
  const { userId, year, month } = req.params;
  const sql = `
    SELECT * FROM employee_hours
    WHERE userId = ? AND YEAR(date) = ? AND MONTH(date) = ?
  `;
  db.query(sql, [userId, year, month], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
