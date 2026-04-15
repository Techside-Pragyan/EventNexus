const express = require('express');
const { createEvent, updateEvent, deleteEvent, getUsers, getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// All routes here are admin only
router.use(protect);
router.use(authorize('admin'));

router.post('/events', upload.single('image'), createEvent);
router.put('/events/:id', upload.single('image'), updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/users', getUsers);
router.get('/stats', getStats);

module.exports = router;
