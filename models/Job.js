import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary", "Freelancer"],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    jobCategory: {
type: String, 
enum: [ 
     "Technology",
    "Engineering",
    "Finance",
    "Marketing",
    "Sales",
    "Healthcare",
    "Education",
    "Design",
    "Human Resources",
    "Legal",
    "Customer Service",
], 
required: true,
    },

    salary: {
      type: Number,
      required: true,
      min: 300,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;