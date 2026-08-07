const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({

    jobTitle: {
        tpye: String,
        required: true, 
        trim: true

    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    jobDescription: {
        type: String, 
        required: true,
        trim: true
    },
    jobType: {
        type: String,
        enum: ["Full-time", "Part-time","Contract","Remote"],
        required: true 

    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
        min: 300

    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        
    }

}, {timestamps: true})


module.exports = mongoose.model("Job", jobSchema);
