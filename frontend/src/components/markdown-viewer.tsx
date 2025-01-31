import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ScrollArea } from "./ui/scroll-area";

interface MarkdownViewerProps {
  text?: string;
  maxHeight?: string;
}

// TODO: Fix the markdown viewer
export const MarkdownViewer = ({ text }: MarkdownViewerProps) => {
  return (
    <ReactMarkdown
      className={`prose dark:prose-invert min-w-fit max-w-full`}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");

          return !inline && match ? (
            <SyntaxHighlighter
              style={dracula}
              PreTag="div"
              language={match[1]}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {text ?? "Loading..."}
    </ReactMarkdown>
  );
};
