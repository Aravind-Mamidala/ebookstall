const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow anonymous users
    },
    message: {
        type: String,
        required: true
    },
    isBot: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    sessionId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema); 