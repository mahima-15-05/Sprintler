const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const {
  createProject,
  addMembers,
  getMyProjects,
} = require("../controllers/project.controller");

router.post("/", protect, createProject);
router.post("/add-member", protect, addMembers);
router.get("/", protect, getMyProjects);

module.exports = router;
