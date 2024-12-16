import { Message } from '@/shared/types/chat';
import { config } from '@/config/env';

interface OpenAIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private readonly apiKey: string;
  private readonly assistantId: string;
  private threadId: string | null = null;

  constructor() {
    this.apiKey = config.openAI.apiKey;
    this.assistantId = config.openAI.assistantId;
  }

  private async createThread(): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'OpenAI-Beta': 'assistants=v1'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`Failed to create thread: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.id;
  }

  private async addMessage(threadId: string, content: string): Promise<void> {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        role: 'user',
        content
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`Failed to add message: ${errorData.error?.message || 'Unknown error'}`);
    }
  }

  private async runAssistant(threadId: string): Promise<string> {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'OpenAI-Beta': 'assistants=v1'
      },
      body: JSON.stringify({
        assistant_id: this.assistantId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`Failed to run assistant: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.id;
  }

  private async waitForCompletion(threadId: string, runId: string): Promise<void> {
    let attempts = 0;
    const maxAttempts = 30; // 最多等待30次
    
    while (attempts < maxAttempts) {
      console.log(`Checking run status (attempt ${attempts + 1}/${maxAttempts})...`);
      
      const response = await fetch(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Failed to check run status: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Run status:', data.status);
      
      if (data.status === 'completed') {
        console.log('Run completed successfully');
        break;
      } else if (data.status === 'failed') {
        console.error('Run failed:', data);
        throw new Error(`Assistant run failed: ${data.last_error?.message || 'Unknown error'}`);
      } else if (data.status === 'expired') {
        throw new Error('Assistant run expired');
      } else if (data.status === 'cancelled') {
        throw new Error('Assistant run was cancelled');
      }

      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error('Assistant run timed out after maximum attempts');
      }

      // 增加等待時間
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒
    }
  }

  private async getMessages(threadId: string): Promise<OpenAIMessage[]> {
    const response = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error in getMessages:', errorData);
      throw new Error(`Failed to get messages: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Raw messages data:', data);
    return data.data.map((msg: any) => ({
      role: msg.role,
      content: msg.content[0].text.value
    }));
  }

  async sendMessage(content: string): Promise<string> {
    try {
      console.log('Starting to send message...');
      if (!this.threadId) {
        console.log('Creating new thread...');
        this.threadId = await this.createThread();
        console.log('Thread created:', this.threadId);
      }

      console.log('Adding message to thread...');
      await this.addMessage(this.threadId, content);
      console.log('Message added, running assistant...');
      const runId = await this.runAssistant(this.threadId);
      console.log('Assistant run started:', runId);
      await this.waitForCompletion(this.threadId, runId);
      console.log('Assistant run completed');
      
      console.log('Fetching messages...');
      const messages = await this.getMessages(this.threadId);
      console.log('Messages received:', messages);
      return messages[0].content;
    } catch (error) {
      console.error('Error in sendMessage:', {
        error,
        threadId: this.threadId,
        apiKey: this.apiKey.slice(0, 10) + '...',
        assistantId: this.assistantId
      });
      throw error;
    }
  }
}

export const openAIService = new OpenAIService(); 