const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/verify-token");
const authorizeRole = require("../middleware/authorizeRole");

const {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

// GET all jobs (Public)
// POST create a job (Employers only)
router
  .route("/")
  .get(getAllJobs)
  .post(
    verifyToken,
    authorizeRole("Employer"),
    createJob
  );

// GET single job (Public)
// update job (Owner Employer only)
// DELETE job (Owner Employer only)
router
  .route("/:id")
  .get(getJob)
  .patch(
    verifyToken,
    authorizeRole("Employer"),
    updateJob
  )
  .delete(
    verifyToken,
    authorizeRole("Employer"),
    deleteJob
  )

module.exports = router 