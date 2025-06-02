const mongoose = require('mongoose');
const ChatQA = require('../models/ChatQA');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ebookstall', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const seedData = [
    {
        question: "How do I create an account?",
        answer: "To create an account, click on the 'Sign Up' button in the top right corner. Fill in your details including name, email, and password. Once submitted, you'll receive a confirmation email to verify your account.",
        category: "account",
        keywords: ["signup", "register", "create account", "join"]
    },
    {
        question: "How can I find books?",
        answer: "You can browse books by category using the navigation menu, use the search bar to find specific titles or authors, or check out our featured and recommended sections on the homepage.",
        category: "books",
        keywords: ["search books", "find books", "browse", "catalog"]
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), PayPal, and digital wallets. All payments are processed securely.",
        category: "payment",
        keywords: ["payment", "pay", "credit card", "debit card", "paypal"]
    },
    {
        question: "How do I track my order?",
        answer: "Once your order is confirmed, you'll receive a tracking number via email. You can also view your order status by logging into your account and visiting the 'My Orders' section.",
        category: "orders",
        keywords: ["track order", "order status", "shipping status"]
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for physical books in original condition. Digital books are non-refundable once downloaded. Please contact our customer service for return authorization.",
        category: "general",
        keywords: ["returns", "refund", "return policy"]
    },
    {
        question: "How do I download my ebook?",
        answer: "After purchase, you can download your ebook from the 'My Library' section in your account. We support multiple formats including PDF, EPUB, and MOBI.",
        category: "books",
        keywords: ["download", "ebook format", "access book"]
    },
    {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can see the exact shipping cost during checkout.",
        category: "shipping",
        keywords: ["international shipping", "worldwide", "delivery"]
    },
    {
        question: "How do I add books to my wishlist?",
        answer: "To add a book to your wishlist, click the heart icon on any book page. You'll need to be logged in to use this feature. You can view your wishlist anytime from your account menu.",
        category: "books",
        keywords: ["wishlist", "save for later", "bookmark"]
    },
    {
        question: "What formats are your ebooks available in?",
        answer: "Our ebooks are available in multiple formats including PDF, EPUB, and MOBI. You can choose your preferred format during purchase or download multiple formats if needed.",
        category: "books",
        keywords: ["format", "file type", "epub", "pdf", "mobi"]
    },
    {
        question: "How can I contact customer support?",
        answer: "You can reach our customer support team through the 'Contact Us' page, email us at support@ebookstall.com, or use this chat feature. We typically respond within 24 hours.",
        category: "general",
        keywords: ["support", "help", "contact", "customer service"]
    }
];

async function seedChatQA() {
    try {
        // Clear existing data
        await ChatQA.deleteMany({});
        
        // Insert new data
        await ChatQA.insertMany(seedData);
        
        console.log('Successfully seeded chat Q&A data!');
    } catch (error) {
        console.error('Error seeding chat Q&A data:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedChatQA(); 