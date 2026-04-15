const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');

// @desc    Create new event
// @route   POST /api/admin/events
// @access  Private/Admin
exports.createEvent = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;
        
        if (req.file) {
            req.body.image = {
                secure_url: `/uploads/${req.file.filename}`,
                public_id: req.file.filename
            };
        }

        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (req.file) {
            req.body.image = {
                secure_url: `/uploads/${req.file.filename}`,
                public_id: req.file.filename
            };
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        await event.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalEvents = await Event.countDocuments();
        const totalRegistrations = await Registration.countDocuments({ status: 'Registered' });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalEvents,
                totalRegistrations
            }
        });
    } catch (err) {
        next(err);
    }
};
