const express = require('express');
const router = express.Router();
const Appraisal = require('../model/Appraisal');
const { protect, authorize } = require('../middleware/auth');
const { createAppraisal, getAppraisals, getAppraisalById, managerReview, supervisorReview, submitFeedback, approveAppraisal } = require('../controllers/appraisalController');


router.post('/', protect, authorize('Employee'), createAppraisal);
router.get('/', protect, getAppraisals);
router.get('/:id', protect, getAppraisalById);
router.put('/:id/manager', protect, authorize('Manager'), managerReview);
router.put('/:id/supervisor', protect, authorize('Supervisor'), supervisorReview);
router.post('/:id/feedback', protect, authorize('Peer', 'Junior'), submitFeedback);
router.put('/:id/approve', protect, authorize('Manager'), approveAppraisal );

module.exports = router;