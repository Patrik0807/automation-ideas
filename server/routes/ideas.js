const express = require('express');
const router = express.Router();
const {
  getIdeas,
  getIdea,
  createIdea,
  updateIdea,
  updateStatus,
  deleteIdea,
  getStats
} = require('../controllers/ideaController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Stats must be before /:id to avoid conflict
router.get('/stats/summary', protect, getStats);

router
  .route('/')
  .get(protect, getIdeas)
  .post(protect, upload.array('images', 5), createIdea);

router
  .route('/:id')
  .get(protect, getIdea)
  .put(protect, upload.array('images', 5), updateIdea)
  .delete(protect, deleteIdea);

// Admin-only status update
router.patch('/:id/status', protect, adminOnly, updateStatus);

module.exports = router;
