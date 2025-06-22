const mongoose = require('mongoose');

// Embedded Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AppraisalSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ["Draft", "PendingManager", "PendingFeedback","PendingSupervisor", "Approved"],
    default: "Draft"
  },
  selfReview: {
    type: String,
    required: true
  },
  peerFeedbacks: [FeedbackSchema],
  juniorFeedbacks: [FeedbackSchema],
  managerApproval: {
    type: Boolean,
    default: false
  },
  supervisorApproval: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appraisal', AppraisalSchema);