const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const {
  createProject,
  addMembers,
  getMyProjects,
  deleteProject,
  removeMembers,
  getProjectById
} = require("../controllers/project.controller");

router.post("/", protect, createProject);
router.post("/add-member", protect, addMembers);
router.get("/", protect, getMyProjects);
router.delete("/:projectId", protect, deleteProject);
router.put("/remove-members", protect,removeMembers );
router.get("/:projectId", protect, getProjectById);

module.exports = router;
