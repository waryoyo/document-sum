import openai
from typing import Iterator

openai.api_key = "YOUR_API_KEY"


class RollingSummarizer:
    def __init__(self, model: str = "gpt-4o-mini", chunk_word_limit: int = 2048):
        self.model = model
        self.chunk_word_limit = chunk_word_limit
        self.summary = ""

    def _split_text(self, text: str) -> Iterator[str]:
        words = text.split()
        chunk = []
        for word in words:
            chunk.append(word)
            if len(chunk) >= self.chunk_word_limit and word.endswith("."):
                yield " ".join(chunk)
                chunk = []
        if chunk:
            yield " ".join(chunk)

    def _summarize_chunk(self, chunk: str) -> str:
        prompt = f"""
Here is the previous summary:
{self.summary}

Now summarize the following chunk:
{chunk}
"""
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a summarization assistant."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.1,
            )
            return response["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"Error during OpenAI summarization: {e}")
            return ""

    def summarize(self, text_iterator: Iterator[str]) -> str:
        for chunk in text_iterator:
            summary_part = self._summarize_chunk(chunk)
            if summary_part:
                self.summary += f" {summary_part}"
        return self.summary.strip()
