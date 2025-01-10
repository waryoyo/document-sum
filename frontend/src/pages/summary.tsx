import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  dracula,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useParams } from "react-router";
import apiClient from "@/api/apiClient";
import { LoadingAnimation } from "@/components/loading-spinner";

interface Summary {
  text: string;
}

export default function SummaryPage() {
  const { summaryId } = useParams<{ summaryId: string }>();
  const [summaryData, setSummaryData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!summaryId) {
        setError("No document ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/api/summarize/${summaryId}`);
        const summaries: Summary[] = response.data.summaries;
        const combinedSummary = summaries
          .map((summary) => summary.text)
          .join("\n\n");
        setSummaryData(combinedSummary);
      } catch (err) {
        setError("Failed to fetch summary data. Please try again later.");
        console.error("Error fetching summary:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [summaryId]);

  if (isLoading) {
    return <LoadingAnimation text={"Loading summary..."} />;
  }

  return (
    <div className="w-full flex items-center justify-center p-4">
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Document Summary</CardTitle>
          <CardDescription>
            AI-generated summary of the uploaded document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh] max-w-[50vw] rounded-md border py-4 px-8 border-none prose dark:prose-invert">
            <ReactMarkdown
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
              {summaryData}
            </ReactMarkdown>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
