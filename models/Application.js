import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },

    resumeUrl: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Interview', 'Accepted', 'Rejected'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
)

applicationSchema.index({ applicant: 1, job: 1 }, { unique: true })

const Application = mongoose.model('Application', applicationSchema)

export default Application
