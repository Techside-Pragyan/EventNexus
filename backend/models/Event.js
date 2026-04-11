const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide an event title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide an event description']
    },
    date: {
        type: Date,
        required: [true, 'Please provide an event date']
    },
    time: {
        type: String,
        required: [true, 'Please provide an event time']
    },
    location: {
        type: String,
        required: [true, 'Please provide an event location']
    },
    category: {
        type: String,
        required: [true, 'Please provide an event category'],
        enum: ['Tech', 'Music', 'Sports', 'Art', 'Food', 'Business', 'Other']
    },
    image: {
        secure_url: { type: String, default: '' },
        public_id: { type: String, default: '' }
    },
    ticketType: {
        type: String,
        enum: ['Free', 'Paid'],
        default: 'Free'
    },
    price: {
        type: Number,
        default: 0
    },
    maxAttendees: {
        type: Number,
        required: [true, 'Please provide maximum attendees limit']
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', eventSchema);
