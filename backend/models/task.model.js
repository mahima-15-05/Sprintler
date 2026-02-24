const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["todo", "in-progress", "done"] , default:"todo"},
  },
  { timestamps: true },
);

// Ensure task title is unique within a project
// taskSchema.index({ title: 1, project: 1 }, { unique: true });


module.exports = mongoose.model("Task", TaskSchema);
