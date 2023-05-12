import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
  issueNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  issueDetails: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'progress', 'completed'],
    default: 'pending',
  },
  assigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Issue', IssueSchema);
