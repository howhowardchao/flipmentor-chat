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
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create thread: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    await this.addMessage(data.id, 'user', `你好，我是新加入的學生，請你依照Assistant的System instructions裡面的課程引導歡迎詞，向我介紹這門課程。`);

    return data.id;
  }

  private async addMessage(threadId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role,
        content
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to add message: ${errorData.error?.message || 'Unknown error'}`);
    }
  }

  private async waitForCompletion(threadId: string, runId: string): Promise<void> {
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      const response = await fetch(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to check run status: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      if (data.status === 'completed') break;
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  async sendMessage(content: string): Promise<string> {
    if (!this.threadId) {
      this.threadId = await this.createThread();
      const initRunResponse = await fetch(`https://api.openai.com/v1/threads/${this.threadId}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: this.assistantId
        })
      });

      if (!initRunResponse.ok) {
        const errorData = await initRunResponse.json();
        throw new Error(`Failed to run initial assistant: ${errorData.error?.message || 'Unknown error'}`);
      }

      const initRunData = await initRunResponse.json();
      await this.waitForCompletion(this.threadId, initRunData.id);
    }

    const runsResponse = await fetch(
      `https://api.openai.com/v1/threads/${this.threadId}/runs`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    );

    if (!runsResponse.ok) {
      const errorData = await runsResponse.json();
      throw new Error(`Failed to check runs: ${errorData.error?.message || 'Unknown error'}`);
    }

    const runsData = await runsResponse.json();
    const activeRuns = runsData.data.filter((run: any) => 
      ['queued', 'in_progress', 'requires_action'].includes(run.status)
    );

    if (activeRuns.length > 0) {
      throw new Error('請等待上一個請求完成');
    }

    const response = await fetch(`https://api.openai.com/v1/threads/${this.threadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send message: ${errorData.error?.message || 'Unknown error'}`);
    }

    const runResponse = await fetch(`https://api.openai.com/v1/threads/${this.threadId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: this.assistantId
      })
    });

    if (!runResponse.ok) {
      const errorData = await runResponse.json();
      throw new Error(`Failed to run assistant: ${errorData.error?.message || 'Unknown error'}`);
    }

    const runData = await runResponse.json();
    await this.waitForCompletion(this.threadId, runData.id);

    const messagesResponse = await fetch(
      `https://api.openai.com/v1/threads/${this.threadId}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    );

    if (!messagesResponse.ok) {
      const errorData = await messagesResponse.json();
      throw new Error(`Failed to get messages: ${errorData.error?.message || 'Unknown error'}`);
    }

    const messagesData = await messagesResponse.json();
    return messagesData.data[0].content[0].text.value;
  }
}

export const openAIService = new OpenAIService();
