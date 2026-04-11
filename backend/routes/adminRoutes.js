const express = require('express');
const { createEvent, updateEvent, deleteEvent, getUsers, getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here are admin only
router.use(protect);
router.use(authorize('admin'));

router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/users', getUsers);
router.get('/stats', getStats);

module.exports = router;
