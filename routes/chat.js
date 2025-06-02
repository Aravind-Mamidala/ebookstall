const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const ChatQA = require('../models/ChatQA');
const { v4: uuidv4 } = require('uuid');

// Initialize chat session
router.post('/init', async (req, res) => {
    try {
        const sessionId = uuidv4();
        const welcomeMessage = await ChatMessage.create({
            message: "Hello! Welcome to EBookStall. How can I help you today?",
            isBot: true,
            sessionId
        });
        res.json({ sessionId, message: welcomeMessage });
    } catch (error) {
        console.error('Init error:', error);
        res.status(500).json({ 
            error: "Failed to initialize chat session",
            message: { message: "I'm having trouble connecting. Please refresh the page and try again." }
        });
    }
});

// Send message and get response
router.post('/message', async (req, res) => {
    try {
        const { message, sessionId, userId } = req.body;

        if (!message || !sessionId) {
            throw new Error('Missing required fields');
        }

        // Save user message
        await ChatMessage.create({
            message,
            sessionId,
            user: userId || null,
            isBot: false
        });

        // Search for predefined answer
        const qaMatch = await ChatQA.find(
            { $text: { $search: message } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } }).limit(1);

        let botResponse;
        if (qaMatch.length > 0 && qaMatch[0].score > 1.0) {
            botResponse = qaMatch[0].answer;
        } else {
            // Enhanced keyword matching
            const lowercaseMsg = message.toLowerCase();
            if (lowercaseMsg.includes('book') || lowercaseMsg.includes('read') || lowercaseMsg.includes('purchase')) {
                botResponse = "We have a wide selection of books in our catalog. You can browse by category, search for specific titles, or tell me what genre you're interested in. Would you like me to help you find something specific?";
            } else if (lowercaseMsg.includes('payment') || lowercaseMsg.includes('pay') || lowercaseMsg.includes('price')) {
                botResponse = "We accept various payment methods including credit cards, debit cards, and digital wallets. All transactions are secure and encrypted. Would you like to know more about our payment options?";
            } else if (lowercaseMsg.includes('delivery') || lowercaseMsg.includes('shipping') || lowercaseMsg.includes('track')) {
                botResponse = "We offer standard and express shipping options. Once your order is placed, you'll receive tracking information via email. Would you like to know more about our shipping methods?";
            } else if (lowercaseMsg.includes('account') || lowercaseMsg.includes('login') || lowercaseMsg.includes('sign')) {
                botResponse = "You can create an account by clicking the 'Sign Up' button at the top of the page. If you already have an account, use the 'Login' button. Need help with your account?";
            } else if (lowercaseMsg.includes('help') || lowercaseMsg.includes('support')) {
                botResponse = "I'm here to help! You can ask me about our books, payment methods, shipping, or any other services. What specific information are you looking for?";
            } else {
                botResponse = "I understand you're asking about " + message + ". Could you please provide more details about what you'd like to know? I can help with information about our books, account management, orders, shipping, and more.";
            }
        }

        // Save bot response
        const botMessage = await ChatMessage.create({
            message: botResponse,
            sessionId,
            isBot: true
        });

        res.json({ message: botMessage });
    } catch (error) {
        console.error('Message error:', error);
        res.status(500).json({ 
            error: "Failed to process message",
            message: { 
                message: "I apologize, but I'm having trouble processing your request. Could you please try rephrasing your question?",
                isBot: true 
            }
        });
    }
});

// Get chat history
router.get('/history/:sessionId', async (req, res) => {
    try {
        const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
            .sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ 
            error: "Failed to fetch chat history",
            messages: []
        });
    }
});

module.exports = router; 