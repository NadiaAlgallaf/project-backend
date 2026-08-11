import Application from '../models/Application.js'
import Job from '../models/Job.js'

// Create application
export const createApplication = async (req, res) => {
  try {
    const { job, resumeUrl } = req.body

    if (!job || !resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Job and resume URL are required'
      })
    }

    const existingJob = await Job.findById(job)

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    const application = await Application.create({
      applicant: req.user._id,
      job,
      resumeUrl
    })

    res.status(201).json({
      success: true,
      application
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You already applied for this job'
      })
    }

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
// Get my applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id
    }).populate('job')

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get applications for one job
export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view these applications'
      })
    }

    const applications = await Application.find({
      job: req.params.jobId
    }).populate('applicant')

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Update application Status
export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    const job = await Job.findById(application.job)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this application'
      })
    }

    application.status = req.body.status

    await application.save()

    res.status(200).json({
      success: true,
      application
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Delete - Withdraw application
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      })
    }

    // Only the applicant can withdraw their application
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to withdraw this application'
      })
    }

    await application.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//Update Interview Date
export const updateInterviewDate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    application.interviewDate = req.body.interviewDate

    await application.save()

    res.status(200).json(application)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
