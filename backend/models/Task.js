const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["TO DO", "IN PROGRESS", "COMPLETED"],
      default: "TO DO"
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    addedBy: {
      type: String,
      default: "Krishna"
    },
    addedOn: {
      type: String,
      default: () => new Date().toLocaleDateString("en-GB")
    },
    completedBy: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);
