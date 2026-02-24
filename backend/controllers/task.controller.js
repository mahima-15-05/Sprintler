const Task = require("../models/task.model");
const Project = require("../models/project.model");

const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo } = req.body;

    if (!title || !projectId)
      return res
        .status(400)
        .json({ message: "Title and Project ID is required" });

    //checking if project exists
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (assignedTo) {
      const existingUser = project.members.find(
        (m) => assignedTo.toString() === m.user.toString(),
      );

      if (!existingUser)
        return res.status(400).json({
          message: "The assigned user is not the member of this project",
        });
    }

    //only project members can create tasks
    const user = project.members.find(
      (m) => req.user._id.toString() === m.user.toString(),
    );

    if (!user)
      return res
        .status(401)
        .json({ message: "You are not a member of this project" });

    //create task
    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo: assignedTo || null,
    });

    return res.status(201).json({ message: "Task created", task });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;
    if (!taskId || !status)
      return res.status(400).json({ message: "Task ID and status required" });

    if (!["todo", "in-progress", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    //check if user is the member of the project
    const project = await Project.findById(task.project);
    const prevStatus = task.status;

    const isMember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );

    if (!isMember)
      return res
        .status(403)
        .json({ message: "You are not the member of the project" });

    task.status = status;
    await task.save();

    return res.status(200).json({
      message: `Task's status updated successfully from ${prevStatus} to ${task.status}`,
      task,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const getTaskByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
    }

    //checking membership
    const isMember = project.members.find(
      (m) => req.user._id.toString() === m.user.toString(),
    );

    if (!isMember)
      return res
        .status(403)
        .json({ message: "You are not the member of the project" });

    // list all the associated tasks

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ message: "Tasks fetched successfully", tasks });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, assignedTo } = req.body;

    // if task exists
    const task = await Task.findById(taskId).populate("project");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // if user is member of the project or not
     const isMember = task.project.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    
    if (!isMember)
      return res
        .status(403)
        .json({ message: "You are not the member of this project" });

         if (assignedTo) {
      const existingUser = task.project.members.some((m) => assignedTo.toString() === m.user.toString(),
      );

      if (!existingUser)
        return res.status(400).json({
          message: "The assigned user is not the member of this project",
        });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();
    return res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = { createTask, updateTaskStatus, getTaskByProject, updateTask };
