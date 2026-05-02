const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS allows your frontend to talk to your backend (useful if you ever separate them again)
app.use(cors({
    origin: '*' 
}));
app.use(express.json());

// Serve the frontend static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Booking Endpoint
app.post('/api/book', async (req, res) => {
    const { name, email, telegram, website, goal, packageType } = req.body;

    console.log('🎯 New Lead Received:', req.body);

    // ==========================================
    // Send to Telegram instantly
    // ==========================================
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    // Only attempt to send if the environment variables are set up in Render
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const message = `🚨 *New Lead: ${packageType}* \n\n*Name:* ${name}\n*Email:* ${email}\n*Telegram:* ${telegram}\n*Website:* ${website}\n*Goal:* ${goal}`;
        
        try {
            // Render uses Node 18+ by default, which has native fetch()
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
            
            if (response.ok) {
                console.log("✅ Telegram notification sent.");
            } else {
                console.error("❌ Telegram API responded with an error:", await response.text());
            }
        } catch (error) {
            console.error("❌ Telegram notification failed", error);
        }
    } else {
        console.log("⚠️ Skipping Telegram notification: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables in Render Dashboard.");
    }

    // Respond to the frontend
    res.status(200).json({ 
        success: true, 
        message: 'Booking received successfully' 
    });
});

// Catch-all route: Send the frontend for any other requests
// This ensures that if someone visits your URL, they see the index.html page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
