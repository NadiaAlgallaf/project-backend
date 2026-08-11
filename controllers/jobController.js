import Job from '../models/Job.js'
import Application from '../models/Application.js'

// Create Job
export const createJob = async (req, res) => {
  try {
    req.body.createdBy = req.user._id

    const job = await Job.create(req.body)

    res.status(201).json({
      success: true,
      job
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// GET all jobs + filter jobs
export const getAllJobs = async (req, res) => {
  try {
    const { jobCategory, jobType } = req.query

    const filter = {}

    if (jobCategory) {
      filter.jobCategory = jobCategory
    }

    if (jobType) {
      filter.jobType = jobType
    }

    const jobs = await Job.find(filter).sort('-createdAt')

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// GET job by ID
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    res.status(200).json({
      success: true,
      job
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Update Job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    if (job.createdBy.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this job'
      })
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      job: updatedJob
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Only the employer who created the job can delete it
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this job'
      })
    }

    await job.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// GET my jobs
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user._id
    })

    //count the number of applicants
    const jobWithCount = []

    for (let job of jobs) {
      const applicationCount = await Application.countDocuments({
        job: job._id
      })

      jobWithCount.push({
        ...job.toObject(),
        applicationCount: applicationCount
      })
    }

    res.status(200).json({
      success: true,
      count: jobWithCount.length,
      jobs: jobWithCount
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
