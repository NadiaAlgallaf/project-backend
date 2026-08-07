import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({

    jobTitle: {
        tpye: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String, 
        required: true 
    },
    jobType: {
        enum: ["Full-time", "Part-time","Contract","Remote"],
        required: true 

    },
    location: {
        type: String,
        required: true
    },
    Salary: {
        type: Number,
        required: true,
        minimum: 300

    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        
    }

}, {timestamps: true})


const Job = mongoose.model("Job", jobSchema);

export default Job



















const Job = mongoose.model("Job", jobSchema);

module.exports = Job