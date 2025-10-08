const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5678;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// N8N Webhook URL
const N8N_WEBHOOK_URL = 'https://8f12498ee627.ngrok-free.app/webhook/e321d96c-a2fe-48c1-96cf-3ceadf97016a'; 

// Webhook endpoint to receive POST requests
app.post('/webhook', async (req, res) => {
  try {
    console.log('📥 Incoming webhook request:', {
      timestamp: new Date().toISOString(),
      headers: req.headers,
      body: req.body
    });

    // Forward the request to N8N webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const responseData = await response.text();
    
    console.log('📤 N8N webhook response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    // Send response back to frontend
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      n8nResponse: responseData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    webhookUrl: N8N_WEBHOOK_URL
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on http://localhost:${PORT}`);
  console.log(`🔗 N8N Webhook URL: ${N8N_WEBHOOK_URL}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;