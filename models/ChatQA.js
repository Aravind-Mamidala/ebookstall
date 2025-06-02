const mongoose = require('mongoose');

const chatQASchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        unique: true
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['general', 'books', 'orders', 'account', 'payment', 'shipping'],
        default: 'general'
    },
    keywords: [{
        type: String
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Add text indexes for better search
chatQASchema.index({ question: 'text', keywords: 'text' });

module.exports = mongoose.model('ChatQA', chatQASchema); 