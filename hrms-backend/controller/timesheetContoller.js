// ➕ Add new employee hour details
// Example Express controller
export const addHourDetail = (db) => (req, res) => {
  const { date, checkIn, checkOut, overtime, status, hourBlocks } = req.body;

  const query = `
    INSERT INTO timesheet (date, checkIn, checkOut, overtime, status, hourBlocks)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      checkIn = VALUES(checkIn),
      checkOut = VALUES(checkOut),
      overtime = VALUES(overtime),
      status = VALUES(status),
      hourBlocks = VALUES(hourBlocks)
  `;

  db.query(
    query,
    [date, checkIn, checkOut, overtime, status, JSON.stringify(hourBlocks)],
    (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.json({ success: false, error: err.message });
      }
      res.json({ success: true });
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
export const getHourDetail = (db) => (req, res) => {
  const { date } = req.query; // expects 'YYYY-MM-DD'

  const query = `
    SELECT date, checkIn, checkOut, overtime, status, hourBlocks
    FROM timesheet WHERE date = ?
  `;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.json({ success: false, error: err.message });
    }
    if (results.length === 0) {
      return res.json({ success: true, data: null });
    }
    const row = results[0];
    res.json({
      success: true,
      data: {
        date: row.date ? row.date.toISOString().slice(0, 10) : null, // e.g., "2025-09-06"
        checkIn: row.checkIn || null,
        checkOut: row.checkOut || null,
        overtime: row.overtime !== null ? parseFloat(row.overtime) : 0,
        status: row.status || null,
        hourBlocks: row.hourBlocks ? JSON.parse(row.hourBlocks) : [],
      },
    });
  });
};
