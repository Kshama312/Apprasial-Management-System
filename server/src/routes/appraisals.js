const express = require('express');
const router = express.Router();
const Appraisal = require('../model/Appraisal');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/appraisals
// @desc    Create self-appraisal
// @access  Private - Employee
router.post('/', protect, authorize('Employee'), async (req, res) => {
  try {
    const { selfReview } = req.body;
    
    const appraisal = await Appraisal.create({
      employeeId: req.user._id,
      selfReview,
      status: 'PendingManager'
    });


    
    res.status(201).json(appraisal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/appraisals
// @desc    Get all appraisals (filtered by role)
// @access  Private - All roles
router.get('/', protect, async (req, res) => {
  try {
    let appraisals;
   

    // Filter appraisals based on role
    switch (req.user.role) {
      case 'Employee':
        // Employees can only see their own appraisals
        appraisals = await Appraisal.find({ employeeId: req.user._id })
          .populate('employeeId', 'name email department');
        break;
      
      case 'Manager':
        // Managers can see all appraisals pending their review
        appraisals = await Appraisal.find({ 
          status: { $in: ['Draft','PendingManager','Approved','PendingFeedback'] }
        }).populate('employeeId', 'name email department');
        break;
      
      case 'Supervisor':
        // Supervisors can see appraisals pending their review
        appraisals = await Appraisal.find({ 
          status: { $in: ['PendingSupervisor', 'PendingFeedback'] }
        }).populate('employeeId', 'name email department');
        break;
      
      case 'Peer':
      case 'Junior':
        // Peers and Juniors can see appraisals pending their feedback
        appraisals = await Appraisal.find({ 
          status: 'PendingFeedback'
        }).populate('employeeId', 'name email department');
        break;
      
      default:
        appraisals = [];
    }
    
    res.json(appraisals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/appraisals/:id
// @desc    Get specific appraisal
// @access  Private - All roles (with access checks)
router.get('/:id', protect, async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id)
      .populate('employeeId', 'name email department')
      .populate('peerFeedbacks.reviewerId', 'name')
      .populate('juniorFeedbacks.reviewerId', 'name');
    
    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }
    
    // Check if user has access to this appraisal
    if (
      req.user.role === 'Employee' && 
      appraisal.employeeId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to access this appraisal' });
    }
    
    res.json(appraisal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/appraisals/:id/manager
// @desc    Manager review & forward
// @access  Private - Manager
router.put('/:id/manager', protect, authorize('Manager'), async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id);
    
    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }
    
    // Check if appraisal is in the right state
    if (appraisal.status !== 'Draft' && appraisal.status !== 'PendingManager') {
      return res.status(400).json({ 
        message: `Appraisal is in ${appraisal.status} state and cannot be forwarded by manager` 
      });
    }
    
    // Update appraisal status
    appraisal.status = 'PendingSupervisor';
    
    // If this is final approval
    if (req.body.finalApproval) {
      appraisal.managerApproval = true;
      
        appraisal.status = 'Approved';
      
    }
    
    await appraisal.save();
    
    res.json(appraisal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/appraisals/:id/supervisor
// @desc    Supervisor sends for feedback
// @access  Private - Supervisor
router.put('/:id/supervisor', protect, authorize('Supervisor'), async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id);
    
    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }
    
    // Check if appraisal is in the right state
    if (appraisal.status !== 'PendingSupervisor') {
      return res.status(400).json({ 
        message: `Appraisal is in ${appraisal.status} state and cannot be sent for feedback` 
      });
    }
    
    // Update appraisal status
    appraisal.status = 'PendingFeedback';
    
    // If supervisor is giving final approval
    
    
    await appraisal.save();
    
    res.json(appraisal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/appraisals/:id/feedback
// @desc    Submit feedback
// @access  Private - Peer/Junior
router.post('/:id/feedback', protect, authorize('Peer', 'Junior'), async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const appraisal = await Appraisal.findById(req.params.id);
    
    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }
    
    // Check if appraisal is in the right state
    if (appraisal.status !== 'PendingFeedback') {
      return res.status(400).json({ 
        message: `Appraisal is in ${appraisal.status} state and cannot receive feedback` 
      });
    }
    
    const feedback = {
      reviewerId: req.user._id,
      comment,
      rating
    };
    
    // Add feedback to the appropriate array based on user role
    if (req.user.role === 'Peer') {
      // Check if this peer has already given feedback
      const existingFeedbackIndex = appraisal.peerFeedbacks.findIndex(
        f => f.reviewerId.toString() === req.user._id.toString()
      );
      
      if (existingFeedbackIndex !== -1) {
        // Update existing feedback
        appraisal.peerFeedbacks[existingFeedbackIndex] = feedback;
      } else {
        // Add new feedback
        appraisal.peerFeedbacks.push(feedback);
      }
    } else if (req.user.role === 'Junior') {
      // Check if this junior has already given feedback
      const existingFeedbackIndex = appraisal.juniorFeedbacks.findIndex(
        f => f.reviewerId.toString() === req.user._id.toString()
      );
      
      if (existingFeedbackIndex !== -1) {
        // Update existing feedback
        appraisal.juniorFeedbacks[existingFeedbackIndex] = feedback;
      } else {
        // Add new feedback
        appraisal.juniorFeedbacks.push(feedback);
      }
    }
    
    await appraisal.save();
         
    res.json(appraisal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/appraisals/:id/approve
// @desc    Final approval
// @access  Private - Manager
router.put('/:id/approve', protect, authorize('Manager'), async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id);
    
    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }
    
    // Mark as approved
    appraisal.managerApproval = true;
    appraisal.status = 'Approved';
    
    
    await appraisal.save();
    
    res.json(appraisal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;