// ... 前面的代碼保持不變 ...

  private async waitForCompletion(threadId: string, runId: string): Promise<void> {
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      console.log(`Checking run status (attempt ${attempts + 1}/${maxAttempts})...`);
      
      const response = await fetch(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        }
      );
      // ... 其餘代碼保持不變 ...
    }
  }

  private async getMessages(threadId: string): Promise<OpenAIMessage[]> {
    const response = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      }
    );
    // ... 其餘代碼保持不變 ...
  }
