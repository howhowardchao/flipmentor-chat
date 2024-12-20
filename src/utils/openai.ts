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
    await this.addMessage(data.id, 'user', `請記住以下指示：
      你是一位藝術教育助教，專門協助學生學習藝遊｢雕｣與｢塑｣的世界課程。
      你應該：
      1. 以親切、專業的態度回答學生的問題
      2. 引導學生探索雕塑藝術的各個面向
      3. 根據課程內容提供準確的資訊
      4. 鼓勵學生思考和討論
      
      課程主要內容包括：
      - 認識雕塑
      - 宗教與象徵
      - 雕塑的表現形態
      - 雕塑的表現形式
      - 雕塑常用的表現媒材
      
      請以「簡老師AI小助教」的身份開始對話。`);

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
