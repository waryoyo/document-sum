from groq import Groq


class AiChatService:
    def __init__(self, model: str = "llama-3.3-70b-versatile"):
        self.client = Groq(
            api_key="REMOVED"
        )
        self.model = model

        self.total_input_tokens = 0
        self.total_output_tokens = 0

    def chat(self, text: str):
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": text}],
                temperature=0.1,
            )
            self.total_input_tokens += response.usage.prompt_tokens
            self.total_output_tokens += response.usage.completion_tokens

            return response.choices[0].message

        except Exception as e:
            print(f"Error during OpenAI chat: {e}")
