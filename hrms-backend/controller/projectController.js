// controllers/projectController.js

export const addProjects = (db) => (req, res) => {
  const {
    projectName,
    projectType,
    description,
    startDate,
    endDate,
    completedDate,
    status,
    assignedMembers,
    phases,
  } = req.body;

  const sqlProject = `
    INSERT INTO projects (project_name, project_type, description, start_date, end_date, completed_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sqlProject,
    [projectName, projectType, description, startDate, endDate, completedDate || null, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const projectId = result.insertId;

      // Insert members
      if (assignedMembers?.length > 0) {
        assignedMembers.forEach((member) => {
          db.query(
            `INSERT INTO project_members (project_id, member_name) VALUES (?, ?)`,
            [projectId, member],
            (err) => err && console.error("❌ Member Insert Error:", err)
          );
        });
      }

      // Insert phases + tasks
      if (phases?.length > 0) {
        phases.forEach((phase) => {
          db.query(
            `INSERT INTO phases (project_id, phase_name) VALUES (?, ?)`,
            [projectId, phase.phaseName],
            (err, phaseResult) => {
              if (err) {
                console.error("❌ Phase Insert Error:", err);
                return;
              }

              const phaseId = phaseResult.insertId;

              if (phase.tasks?.length > 0) {
                phase.tasks.forEach((task) => {
                  db.query(
                    `INSERT INTO tasks (phase_id, task_name, assigned_to) VALUES (?, ?, ?)`,
                    [phaseId, task.taskName, task.assignedTo],
                    (err) => err && console.error("❌ Task Insert Error:", err)
                  );
                });
              }
            }
          );
        });
      }

      res.json({ message: "✅ Project created successfully!", projectId });
    }
  );
};

export const getProjects = (db) => (req, res) => {
  const sql = `
    SELECT p.*, ph.id AS phase_id, ph.phase_name, t.id AS task_id, t.task_name, t.assigned_to, m.member_name
    FROM projects p
    LEFT JOIN phases ph ON p.id = ph.project_id
    LEFT JOIN tasks t ON ph.id = t.phase_id
    LEFT JOIN project_members m ON p.id = m.project_id
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const projects = {};
    rows.forEach((row) => {
      if (!projects[row.id]) {
        projects[row.id] = {
          id: row.id,
          projectName: row.project_name,
          projectType: row.project_type,
          description: row.description,
          startDate: row.start_date,
          endDate: row.end_date,
          completedDate: row.completed_date,
          status: row.status,
          members: [],
          phases: [],
        };
      }

      if (row.member_name && !projects[row.id].members.includes(row.member_name)) {
        projects[row.id].members.push(row.member_name);
      }

      if (row.phase_id) {
        let phase = projects[row.id].phases.find((p) => p.id === row.phase_id);
        if (!phase) {
          phase = { id: row.phase_id, phaseName: row.phase_name, tasks: [] };
          projects[row.id].phases.push(phase);
        }
        if (row.task_id) {
          phase.tasks.push({
            id: row.task_id,
            taskName: row.task_name,
            assignedTo: row.assigned_to,
          });
        }
      }
    });

    res.json(Object.values(projects));
  });
};
