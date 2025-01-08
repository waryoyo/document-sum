import openai
from typing import Iterator

openai.api_key = "REMOVED"


import openai
from typing import Iterator, Tuple


class RollingSummarizer:
    def __init__(self, model: str = "gpt-4o-mini", chunk_word_limit: int = 2048):
        self.model = model
        self.chunk_word_limit = chunk_word_limit
        self.summary = ""

    def _split_text(self, text: str) -> Iterator[Tuple[int, int, str]]:
        words = text.split()
        start_idx = 0
        chunk = []
        for i, word in enumerate(words):
            chunk.append(word)
            if len(chunk) >= self.chunk_word_limit and word.endswith("."):
                end_idx = i + 1  # +1 because end index is inclusive
                yield start_idx, end_idx, " ".join(chunk)
                start_idx = end_idx
                chunk = []
        if chunk:
            end_idx = len(words)
            yield start_idx, end_idx, " ".join(chunk)

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

    def summarize(self, text: str) -> Iterator[Tuple[int, int, str]]:
        for start_idx, end_idx, chunk in self._split_text(text):
            summary_part = self._summarize_chunk(chunk)
            if summary_part:
                self.summary += f" {summary_part}"
                yield start_idx, end_idx, summary_part
