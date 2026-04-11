const express = require('express');
const { getEvents, getEvent, registerForEvent, getMyRegistrations, cancelRegistration } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getEvents);
router.get('/my-registrations', protect, getMyRegistrations);
router.get('/:id', getEvent);
router.post('/:id/register', protect, registerForEvent);
router.delete('/registration/:id', protect, cancelRegistration);

module.exports = router;
