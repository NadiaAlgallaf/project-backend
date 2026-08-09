const express = require('express')

const router = express.Router()

const verifyToken = require('../middleware/verifyToken')
const validateObjectId = require('../middleware/validateObjectId')
const authorizeRole = require('../middleware/authorizeRole')

const {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController')

// GET all jobs - Public
// POST create a job - Employers only
router
  .route('/')
  .get(getAllJobs)
  .post(verifyToken, authorizeRole('Employer'), createJob)

// GET single job - Public
// PATCH update job - Owner Employer only
// DELETE job - Owner Employer only
router
  .route('/:id')
  .get(validateObjectId, getJob)
  .patch(verifyToken, validateObjectId, authorizeRole('Employer'), updateJob)
  .delete(verifyToken, validateObjectId, authorizeRole('Employer'), deleteJob)

module.exports = router
