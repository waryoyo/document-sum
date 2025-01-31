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
import { useNavigate, useParams } from "react-router";
import apiClient from "@/api/apiClient";
import { LoadingAnimation } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { MarkdownViewer } from "@/components/markdown-viewer";

interface Summary {
  text: string;
}

export default function SummaryPage() {
  const { summaryId } = useParams<{ summaryId: string }>();
  const [summaryData, setSummaryData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      if (!summaryId) {
        console.error("No document ID provided");
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
    <div className="w-full flex flex-col items-center justify-center p-4 gap-y-4">
      <div>
        <Button
          variant="outline"
          className="mb-8"
          onClick={() => {
            navigate("/");
          }}
        >
          Go back home
        </Button>
        <Card className="min-w-[50vw]">
          <CardHeader>
            <CardTitle>Document Summary</CardTitle>
            <CardDescription>
              AI-generated summary of the uploaded document
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <ScrollArea
              className={`h-[50vh] rounded-md border py-4 px-8 border-none`}
            >
              <MarkdownViewer text={summaryData} />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
