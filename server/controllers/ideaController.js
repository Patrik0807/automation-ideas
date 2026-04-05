const Idea = require('../models/Idea');
const Counter = require('../models/Counter');

// @desc    Get all ideas (with search/filter)
// @route   GET /api/ideas
const getIdeas = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const ideas = await Idea.aggregate([
      { $match: query },
      {
        $addFields: {
          priorityWeight: {
            $switch: {
              branches: [
                { case: { $eq: ['$priority', 'High'] }, then: 1 },
                { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                { case: { $eq: ['$priority', 'Low'] }, then: 3 }
              ],
              default: 4
            }
          }
        }
      },
      { $sort: { priorityWeight: 1, createdAt: -1 } }
    ]);

    // Manually populate submittedBy since aggregate doesn't support .populate() directly
    const populatedIdeas = await Idea.populate(ideas, {
      path: 'submittedBy',
      select: 'name email department'
    });

    res.json(populatedIdeas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single idea by ID
// @route   GET /api/ideas/:id
const getIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('submittedBy', 'name email department')
      .populate('statusHistory.updatedBy', 'name');

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new idea
// @route   POST /api/ideas
const createIdea = async (req, res) => {
  try {
    const { 
      title, 
      problemStatement, 
      description, 
      category, 
      priority, 
      technicalFeasibility,
      submittedByName 
    } = req.body;

    // Prefix Mapper per Category
    const prefixMap = {
      'Software': 'S',
      'Mechanical': 'M',
      'Controls': 'C',
      'Electrical': 'E',
      'Other': 'O'
    };
    const prefix = prefixMap[category] || 'O';

    // Increment counter for prefix atomically
    const counter = await Counter.findOneAndUpdate(
      { _id: prefix },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const customId = `${prefix}${counter.seq}`;

    // Impact may come as JSON string from FormData
    let impact = req.body.impact;
    if (typeof impact === 'string') {
      try { impact = JSON.parse(impact); } catch (e) { impact = {}; }
    }

    // Collect uploaded image paths
    const images = req.files
      ? req.files.map((file) => file.path)
      : [];

    const idea = await Idea.create({
      customId,
      title,
      problemStatement,
      description,
      category,
      priority,
      technicalFeasibility: technicalFeasibility || 'Medium',
      impact,
      images,
      submittedBy: req.user ? req.user._id : null,
      submittedByName: req.user ? req.user.name : submittedByName,
      statusHistory: [
        {
          status: 'Pending',
          date: new Date(),
          note: 'Idea submitted',
          updatedBy: req.user ? req.user._id : null
        }
      ]
    });

    const populated = await idea.populate('submittedBy', 'name email department');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update idea details
// @route   PUT /api/ideas/:id
const updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Only admin can update
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Not authorized. Admin privileges required.' });
    }

    // Impact may come as JSON string from FormData
    let impact = req.body.impact;
    if (typeof impact === 'string') {
      try { impact = JSON.parse(impact); } catch (e) { impact = {}; }
    }

    const { title, problemStatement, description, category, priority, technicalFeasibility } = req.body;
    if (title) idea.title = title;
    if (problemStatement) idea.problemStatement = problemStatement;
    if (description) idea.description = description;
    if (category) idea.category = category;
    if (priority) idea.priority = priority;
    if (technicalFeasibility) idea.technicalFeasibility = technicalFeasibility;
    if (impact) idea.impact = { ...idea.impact, ...impact };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      idea.images = [...(idea.images || []), ...newImages];
    }

    await idea.save();
    const populated = await idea.populate('submittedBy', 'name email department');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update idea status (admin only)
// @route   PATCH /api/ideas/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Pending', 'Approved', 'In Progress', 'Implemented', 'Rejected'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status' });
    }

    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    idea.status = status;
    idea.statusHistory.push({
      status,
      date: new Date(),
      note: note || `Status updated to ${status}`,
      updatedBy: req.user._id
    });

    await idea.save();
    const populated = await idea.populate([
      { path: 'submittedBy', select: 'name email department' },
      { path: 'statusHistory.updatedBy', select: 'name' }
    ]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an idea
// @route   DELETE /api/ideas/:id
const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Not authorized. Admin privileges required.' });
    }

    await idea.deleteOne();
    res.json({ message: 'Idea removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get summary stats
// @route   GET /api/ideas/stats/summary
const getStats = async (req, res) => {
  try {
    const total = await Idea.countDocuments();
    const byStatus = await Idea.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byCategory = await Idea.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({ total, byStatus, byCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIdeas,
  getIdea,
  createIdea,
  updateIdea,
  updateStatus,
  deleteIdea,
  getStats
};
