// Webhook service for communicating with N8N
export interface WebhookPayload {
  type: 'text' | 'speech' | 'image+speech';
  content: string;
  language: 'en' | 'ur';
  farmerName?: string;
  crop?: string;
  query: string;
  image?: string;
  speech_text?: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  n8nResponse?: string;
  timestamp: string;
  error?: string;
}

class WebhookService {
  private readonly webhookUrl = 'http://localhost:5678/webhook';
  private readonly n8nWebhookUrl = 'https://8f12498ee627.ngrok-free.app/webhook/e321d96c-a2fe-48c1-96cf-3ceadf97016a';

  /**
   * Send data to N8N webhook via our backend server
   */
  async sendToWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
    try {
      console.log('📤 Sending to webhook:', payload);

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
      }

      const result: WebhookResponse = await response.json();
      console.log('📥 Webhook response:', result);

      return result;
    } catch (error) {
      console.error('❌ Webhook service error:', error);
      
      return {
        success: false,
        message: 'Failed to communicate with webhook service',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Send data directly to N8N webhook (fallback method)
   */
  async sendDirectToN8N(payload: WebhookPayload): Promise<WebhookResponse> {
    try {
      console.log('📤 Sending directly to N8N:', payload);

      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      
      console.log('📥 N8N direct response:', {
        status: response.status,
        data: responseText
      });

      return {
        success: response.ok,
        message: response.ok ? 'N8N webhook processed successfully' : 'N8N webhook failed',
        n8nResponse: responseText,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Direct N8N webhook error:', error);
      
      return {
        success: false,
        message: 'Failed to communicate with N8N webhook',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Check if webhook service is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.webhookUrl.replace('/webhook', '')}/health`);
      return response.ok;
    } catch (error) {
      console.warn('Webhook service health check failed:', error);
      return false;
    }
  }
}

export const webhookService = new WebhookService();