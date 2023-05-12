import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "staff"],
    default: "staff",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  assignedIssues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
  completedIssues: [
    {
      issue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue",
        required: true,
      },
      completedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model("Staff", StaffSchema);
