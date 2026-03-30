const express = require("express");
const router = express.Router();
const { createTask, updateTaskStatus, getTaskByProject, updateTask, deleteTask } = require("../controllers/task.controller");
const protect = require("../middleware/auth.middleware");

router.post("/", protect, createTask);
router.put("/update-status", protect, updateTaskStatus);
router.get("/:projectId", protect, getTaskByProject);
router.put("/:taskId", protect, updateTask);
router.delete("/:taskId", protect, deleteTask);

module.exports = router;
