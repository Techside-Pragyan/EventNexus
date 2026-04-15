const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const QRCode = require('qrcode');
const sendEmail = require('../utils/email');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
    try {
        const { category, location, date, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            query.date = { $gte: searchDate, $lt: nextDay };
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const events = await Event.find(query).sort({ date: 1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.attendees.length >= event.maxAttendees) {
            return res.status(400).json({ success: false, message: 'Event is full' });
        }

        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({ success: false, message: 'Already registered for this event' });
        }

        const ticketId = uuidv4();
        const qrCodeData = await QRCode.toDataURL(JSON.stringify({
            ticketId,
            eventId: event._id,
            userId: req.user.id
        }));

        const registration = await Registration.create({
            user: req.user.id,
            event: event._id,
            ticketId,
            qrCode: qrCodeData,
            status: 'Registered'
        });

        event.attendees.push(req.user.id);
        await event.save();

        const user = await User.findById(req.user.id);
        user.registeredEvents.push(event._id);
        await user.save();

        // Send Email Notification
        try {
            await sendEmail({
                email: user.email,
                subject: `Registration Successful: ${event.title}`,
                html: `
                    <h1>Registration Confirmed!</h1>
                    <p>Hi ${user.name},</p>
                    <p>You have successfully registered for <strong>${event.title}</strong>.</p>
                    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p>Your Ticket ID is: <strong>${ticketId}</strong></p>
                    <p>See you there!</p>
                `
            });
        } catch (err) {
            console.error('Email could not be sent', err);
        }

        res.status(201).json({ success: true, data: registration });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user's registered events
// @route   GET /api/events/my-registrations
// @access  Private
exports.getMyRegistrations = async (req, res, next) => {
    try {
        const registrations = await Registration.find({ user: req.user.id, status: 'Registered' }).populate('event');
        res.status(200).json({ success: true, count: registrations.length, data: registrations });
    } catch (err) {
        next(err);
    }
};

// @desc    Cancel registration
// @route   DELETE /api/events/registration/:id
// @access  Private
exports.cancelRegistration = async (req, res, next) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }

        if (registration.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        registration.status = 'Cancelled';
        await registration.save();

        const event = await Event.findById(registration.event);
        if (event) {
            event.attendees = event.attendees.filter(id => id.toString() !== req.user.id);
            await event.save();
        }

        const user = await User.findById(req.user.id);
        if (user) {
            user.registeredEvents = user.registeredEvents.filter(id => id.toString() !== registration.event.toString());
            await user.save();
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
