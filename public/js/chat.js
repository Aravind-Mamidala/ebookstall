class ChatBox {
    constructor() {
        this.sessionId = null;
        this.isOpen = false;
        this.initialize();
    }

    async initialize() {
        // Create chat UI
        this.createChatUI();
        
        try {
            // Initialize chat session
            const response = await fetch('/chat/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error('Failed to initialize chat');
            }
            
            const data = await response.json();
            this.sessionId = data.sessionId;
            
            // Add welcome message
            this.addMessage(data.message.message, true);
        } catch (error) {
            console.error('Chat initialization error:', error);
            this.addMessage("I'm having trouble connecting. Please refresh the page to try again.", true);
        }
    }

    createChatUI() {
        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-icon" id="chat-icon">
                <i class="fas fa-comments"></i>
            </div>
            <div class="chat-box" id="chat-box">
                <div class="chat-header">
                    <h3>EBookStall Assistant</h3>
                    <button class="minimize-btn" id="minimize-btn">−</button>
                </div>
                <div class="chat-messages" id="chat-messages"></div>
                <div class="chat-input-container">
                    <input type="text" id="chat-input" placeholder="Type your message...">
                    <button id="send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(chatContainer);

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        const chatIcon = document.getElementById('chat-icon');
        const minimizeBtn = document.getElementById('minimize-btn');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');

        chatIcon.addEventListener('click', () => this.toggleChat());
        minimizeBtn.addEventListener('click', () => this.toggleChat());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        sendBtn.addEventListener('click', () => this.sendMessage());
    }

    toggleChat() {
        const chatBox = document.getElementById('chat-box');
        const chatIcon = document.getElementById('chat-icon');
        
        this.isOpen = !this.isOpen;
        chatBox.style.display = this.isOpen ? 'flex' : 'none';
        chatIcon.style.display = this.isOpen ? 'none' : 'flex';
        
        if (this.isOpen) {
            const chatInput = document.getElementById('chat-input');
            chatInput.focus();
        }
    }

    addMessage(message, isBot) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${isBot ? 'bot' : 'user'}`;
        messageElement.innerHTML = `
            <div class="message-content">
                ${isBot ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message || !this.sessionId) return;
        
        // Add user message to chat
        this.addMessage(message, false);
        chatInput.value = '';

        try {
            const response = await fetch('/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    sessionId: this.sessionId,
                    userId: window.userId // If user is logged in
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            
            const data = await response.json();
            this.addMessage(data.message.message, true);
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('I apologize, but I\'m having trouble processing your request. Could you please try again?', true);
        }
    }
}

// Initialize chat when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new ChatBox();
}); 