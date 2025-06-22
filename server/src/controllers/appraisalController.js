const Appraisal = require('../model/Appraisal');

// Create Self-Appraisal
const createAppraisal = async (req, res) => {
  try {
    const { selfReview } = req.body;

    const appraisal = await Appraisal.create({
      employeeId: req.user._id,
      selfReview,
      status: 'PendingManager'
    });

    res.status(201).json(appraisal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Appraisals Based on Role
const getAppraisals = async (req, res) => {
  try {
    let query = {};

    switch (req.user.role) {
      case 'Employee':
        query = { employeeId: req.user._id };
        break;
      case 'Manager':
        query = { status: { $in: ['Draft', 'PendingManager', 'Approved', 'PendingFeedback'] } };
        break;
      case 'Supervisor':
        query = { status: { $in: ['PendingSupervisor', 'PendingFeedback'] } };
        break;
      case 'Peer':
      case 'Junior':
        query = { status: 'PendingFeedback' };
        break;
      default:
        return res.status(403).json({ message: 'Role not allowed' });
    }

    const appraisals = await Appraisal.find(query)
      .populate('employeeId', 'name email department');

    res.json(appraisals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Appraisal with Role-Based Access
const getAppraisalById = async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id)
      .populate('employeeId', 'name email department')
      .populate('peerFeedbacks.reviewerId', 'name')
      .populate('juniorFeedbacks.reviewerId', 'name');

    if (!appraisal) return res.status(404).json({ message: 'Appraisal not found' });

    if (
      req.user.role === 'Employee' &&
      appraisal.employeeId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to access this appraisal' });
    }

    res.json(appraisal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manager Review & Forward (with Optional Final Approval)
const managerReview = async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id);
    if (!appraisal) return res.status(404).json({ message: 'Appraisal not found' });

    if (!['PendingManager', 'Draft'].includes(appraisal.status)) {
      return res.status(400).json({
        message: `Appraisal is in ${appraisal.status} state and cannot be reviewed by manager`
      });
    }

    if (req.body.finalApproval) {
      appraisal.status = 'Approved';
      appraisal.managerApproval = true;
    } else {
      appraisal.status = 'PendingSupervisor';
    }

    await appraisal.save();
    res.json(appraisal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supervisor Review & Forward
const supervisorReview = async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id);
    if (!appraisal) return res.status(404).json({ message: 'Appraisal not found' });

    if (appraisal.status !== 'PendingSupervisor') {
      return res.status(400).json({ message: 'Appraisal is not pending supervisor review' });
    }

    appraisal.status = 'PendingFeedback';
    appraisal.supervisorApproval = true;
    await appraisal.save();

    res.json(appraisal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit Peer/Junior Feedback
const submitFeedback = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const appraisal = await Appraisal.findById(req.params.id);
    if (!appraisal) return res.status(404).json({ message: 'Appraisal not found' });

    if (appraisal.status !== 'PendingFeedback') {
      return res.status(400).json({ message: 'Appraisal is not accepting feedback' });
    }

    const feedback = {
      reviewerId: req.user._id,
      comment,
      rating
    };

    if (req.user.role === 'Peer') {
      appraisal.peerFeedbacks.push(feedback);
    } else if (req.user.role === 'Junior') {
      appraisal.juniorFeedbacks.push(feedback);
    } else {
      return res.status(403).json({ message: 'Only Peer or Junior can submit feedback' });
    }

    await appraisal.save();
    res.json(appraisal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Final Approval by Manager
const approveAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id);
    if (!appraisal) return res.status(404).json({ message: 'Appraisal not found' });

    if (appraisal.status !== 'PendingFeedback' || !appraisal.supervisorApproval) {
      return res.status(400).json({ message: 'Appraisal cannot be approved at this stage' });
    }

    appraisal.status = 'Approved';
    appraisal.managerApproval = true;

    await appraisal.save();
    res.json(appraisal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppraisal,
  getAppraisals,
  getAppraisalById,
  managerReview,
  supervisorReview,
  submitFeedback,
  approveAppraisal
};
