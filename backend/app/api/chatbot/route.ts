import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Types
interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt with Sampark context
const SYSTEM_PROMPT = `You are Sampark AI Assistant for the civic grievance portal. Help citizens use the platform.

**About Sampark:**
Sampark connects citizens with urban local bodies to submit and track civic complaints with transparency.

**Key Features:**
- Submit grievances (potholes, waste, water, electricity, drainage)
- Track status with tracking ID (SMPK12345 format)
- User dashboard to view all grievances
- Admin dashboard for officials

**How to Use:**
- Submit: Fill form, select category, upload photos
- Track: Enter tracking ID to see updates
- Dashboard: Login to view all grievances

**Timelines:**
- Acknowledged within 24 hours
- Standard issues resolved in 48 hours

**Contact:** info@sampark.org | +91-123-4567890 (Mon-Sat, 9 AM-6 PM)

Keep responses concise, polite, and helpful. Guide users to relevant sections.`;

// POST /api/chatbot/chat - Handle chat messages
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ 
        error: 'AI service not configured. Please contact support.' 
      });
    }

    // Initialize the model (using gemini-2.0-flash-thinking-exp to try different quota pool)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    // Build conversation context
    let prompt = `${SYSTEM_PROMPT}\n\n`;
    
    // Add conversation history if exists (last 5 messages for context)
    if (conversationHistory.length > 0) {
      prompt += `Previous conversation:\n`;
      conversationHistory.slice(-5).forEach((msg: ChatMessage) => {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    // Add current user message
    prompt += `User: ${message}\nAssistant:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from AI');
    }

    res.json({ response: text });
  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
        return res.status(500).json({ 
          error: 'API configuration error. Please contact support.' 
        });
      }
      if (error.message?.includes('quota') || error.message?.includes('limit')) {
        return res.status(429).json({ 
          error: 'Service temporarily unavailable. Please try again later.' 
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to generate response. Please try again.' 
    });
  }
});

export default router;
