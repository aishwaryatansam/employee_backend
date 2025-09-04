export const createHrProject = (req, res) => {
  const { projectName, deadline, description } = req.body;
  if (!projectName || !deadline) {
    return res.status(400).json({ error: "Project Name and Deadline are required" });
  }

  const query = "INSERT INTO hr_projects (project_name, deadline, description) VALUES (?, ?, ?)";
  db.query(query, [projectName, deadline, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ projectId: result.insertId });
  });
};

export const getHrProjects = (req, res) => {
  db.query("SELECT * FROM hr_projects ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};