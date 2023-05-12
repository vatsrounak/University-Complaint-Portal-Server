import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide a your institute email"],
    unique: true,
    // validate: {
    //   validator: function (email) {
    //     const emailRegex = /^[\w-]+(\.[\w-]+)*@nitp\.ac\.in$/;
    //     return emailRegex.test(email);
    //   },
    //   message: "Email address must end with @nitp.ac.in",
    // },
  },
  name: {
    type: String,
  },
  otp: {
    type: String,
  },
  mobile: {
    type: String,
  },
  department: {
    type: String,
  },
  place: {
    type: String,
  },
  issues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
});

export default mongoose.model("Student", StudentSchema);
