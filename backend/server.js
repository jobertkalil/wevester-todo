const express = require("express");
const knex = require("knex");
const cors = require("cors");
require("dotenv").config();

// DB connection via knex
const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
});

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

const apiV1 = express.Router();

// Create
apiV1.post("/tasks", async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const [task] = await db("tasks")
      .insert({ title, description, completed })
      .returning("*");
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Get all
apiV1.get("/tasks", async (req, res) => {
  try {
    const tasks = await db("tasks").select("*");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Get task by ID
apiV1.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await db("tasks").where("id", id).first();
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Update
apiV1.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const [task] = await db("tasks")
      .where("id", id)
      .update({ title, description, completed })
      .returning("*");
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// TODO: ideally, this should only be archive/soft-delete
// Delete
apiV1.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await db("tasks").where("id", id).del().returning("*");
    if (!task.length) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.use("/api/v1", apiV1);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
