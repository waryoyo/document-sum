# import openai
import json
from typing import Iterator
from groq import Groq
from typing import Iterator, Tuple
from pydantic import BaseModel
from tokenizers import Tokenizer


class final_summary(BaseModel):
    title: str
    description: str


class RollingSummarizer:
    def __init__(
        self, model: str = "llama-3.3-70b-versatile", chunk_word_limit: int = 2048
    ):
        self.client = Groq(
            api_key="REMOVED"
        )
        self.model = model
        self.chunk_word_limit = chunk_word_limit
        self.summary = ""
        # self.tokenizer = Tokenizer.from_pretrained("unsloth/Llama-3.3-70B-Instruct")

        self.total_input_tokens = 0
        self.total_output_tokens = 0

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

    def _summarize_chunk(self, chunk: str) -> object:
        prompt = f"""
Here is the previous summary:
{self.summary}

Now summarize the following chunk:
{chunk}
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a summarization assistant."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.1,
            )
            self.total_input_tokens += response.usage.prompt_tokens
            self.total_output_tokens += response.usage.completion_tokens
            return response.choices[0].message
        except Exception as e:
            print(f"Error during OpenAI summarization: {e}")
            return ""

    def obtain_title_description(self) -> final_summary:
        # TODO: this is kinda lame right now, in future try to use openai which supports json schema for models or wait till groq supports that
        prompt = f"""
return the title and a short description about this whole document based on this summary in json:
{self.summary}

The JSON object must use the schema: {json.dumps(final_summary.model_json_schema(), indent=2)}
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a summarization assistant."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.1,
                stream=False,
                response_format={"type": "json_object"},
            )
            self.total_input_tokens += response.usage.prompt_tokens
            self.total_output_tokens += response.usage.completion_tokens
            return final_summary.model_validate_json(
                response.choices[0].message.content
            )
        except Exception as e:
            print(f"Error during OpenAI summarization: {e}")
            return ""

    def summarize(self, text: str) -> Iterator[Tuple[int, int, str]]:
        for start_idx, end_idx, chunk in self._split_text(text):
            summary_part = self._summarize_chunk(chunk)
            if summary_part:
                self.summary += f" {summary_part.content}"
                yield (start_idx, end_idx, summary_part.content)
