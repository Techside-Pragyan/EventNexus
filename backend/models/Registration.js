const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    qrCode: {
        type: String // Base64 or URL
    },
    status: {
        type: String,
        enum: ['Registered', 'Cancelled'],
        default: 'Registered'
    },
    paymentId: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Refunded', 'N/A'],
        default: 'N/A'
    }
});

module.exports = mongoose.model('Registration', registrationSchema);
