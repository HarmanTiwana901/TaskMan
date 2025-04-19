const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

app.post("/api/task-groups", async (req, res) => {
  try {
    const accessKey = Math.random().toString(36).substring(2, 15);
    await pool.query("INSERT INTO task_groups (access_key) VALUES ($1)", [accessKey]);
    res.json({ access_key: accessKey });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route to check if a task group exists
app.get("/api/task-groups/:accessKey", async (req, res) => {
  try {
    const { accessKey } = req.params;
    const result = await pool.query("SELECT 1 FROM task_groups WHERE access_key = $1", [accessKey]);
    res.json({ exists: result.rowCount > 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route to get tasks by access key
app.get("/api/tasks/:accessKey", async (req, res) => {
  try {
    const { accessKey } = req.params;
    const tasks = await pool.query(
      "SELECT * FROM tasks WHERE access_key = $1 ORDER BY id ASC",
      [accessKey]
    );
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route to add a new task to a task group
app.post("/api/tasks/:accessKey", async (req, res) => {
  try {
    const { accessKey } = req.params;
    const { title } = req.body;
    const newTask = await pool.query(
      "INSERT INTO tasks (title, access_key) VALUES ($1, $2) RETURNING *",
      [title, accessKey]
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route to toggle task completion status
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await pool.query(
      "UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route to delee a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route to delete a task group
app.delete("/api/task-groups/:accessKey", async (req, res) => {
  try {
    const { accessKey } = req.params;
    await pool.query("DELETE FROM tasks WHERE access_key = $1", [accessKey]);
    await pool.query("DELETE FROM task_groups WHERE access_key = $1", [accessKey]);
    res.json({ message: "Task group and associated tasks deleted." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// serve tasks.html for /tasks/ :accessKey 
app.get("/tasks/:accessKey", async (req, res) => {
  const { accessKey } = req.params;
  try {
    const result = await pool.query("SELECT 1 FROM task_groups WHERE access_key = $1", [accessKey]);
    if (result.rowCount === 0) {
      return res.status(404).send("Access key not found.");
    }
    res.sendFile(path.join(__dirname, "public", "tasks.html"));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`TaskMan backend running on port ${PORT}`);
});
