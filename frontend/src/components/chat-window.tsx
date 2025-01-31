import { useState } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
}

export function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([]);

}

