const Project = require("../models/project.model");
const mongoose = require("mongoose");
const User = require("../models/user.model");

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }
    const existingProject = await Project.findOne({
      name,
      "members.user": req.user._id,
    });
    if (existingProject) {
      return res
        .status(400)
        .json({ message: "You already have a project with this name" });
    }

    const project = await Project.create({
      name,
      description,
      members: [
        { user: req.user._id, role: "admin" }, // creator is an admin
      ],
    });

    return res.status(201).json({
      message: "Project Created successfully",
      project,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

const addMembers = async (req, res) => {
  try {
    const { projectId, userId, role } = req.body;
    if (!projectId || !userId) {
      return res.status(400).json("Project ID and user ID are required");
    }
    const registeredUser = await User.findById(userId);

    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid projectId or userId" });
    }
    if (!registeredUser)
      return res
        .status(401)
        .json({
          message:
            "Member cannot be added, unregistered" ||
            "No used found with this id",
        });
    const project = await Project.findById(projectId);
    console.log("Project ", project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const adminUser = project.members.find(
      (m) =>
        m.user.toString() === req.user._id.toString() && m.role === "admin",
    );

    if (!adminUser)
      return res.status(401).json({ message: "Only admins can add members" });

    //check if the user we are adding is already a member of the project?
    const existingMember = project.members.find((m) => {
      return m.user.toString() === userId;
    });
    if (existingMember)
      return res.status(400).json({ message: "User is already a member" });

    // add member
    project.members.push({
      user: userId,
      role: role || "member",
    });

    await project.save();

    return res.status(200).json({ message: "Member added", project });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getMyProjects = async (req, res) => {
  try {

    
    const projects = await Project.find({
      "members.user": req.user._id,
    }).sort({ createdAt: -1 });
    
    if(!projects)
        return res.status(404).json({message:"No available projects"})


    res.status(200).json({message:"Projects fetched successfully", projects})
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = { createProject, addMembers, getMyProjects };
