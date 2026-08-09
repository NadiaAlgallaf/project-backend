const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const authorizeRole = require('../middleware/authorizeRole')
const {
  createApplication,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} = require('../controllers/application.controller')

// Create application (Jobseeker)
router.post('/', verifyToken, authorizeRole('JobSeeker'), createApplication)

// Get applications (Jobseeker)
router.get(
  '/my-applications',
  verifyToken,
  authorizeRole('JobSeeker'),
  getMyApplications
)

// Get all applications for one job (Employer)
router.get(
  '/job/:jobId',
  verifyToken,
  authorizeRole('Employer'),
  getJobApplications
)

// Update application status (Empolyer)
router.put(
  '/:id/status',
  verifyToken,
  authorizeRole('Employer'),
  updateApplicationStatus
)

module.exports = router
