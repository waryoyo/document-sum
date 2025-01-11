import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { LoadingAnimation } from "@/components/loading-spinner";
import { useNavigate } from "react-router";

interface HistoryItem {
  id: number;
  title: string;
  document_id: string;
  document_name: string;
  created_at: string;
  model_name: string;
}
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data, status } = await apiClient.get<HistoryItem[]>(
          "/api/summarize"
        );

        if (status !== 200) {
          console.error("Failed to fetch history items.");
          return;
        }
        setHistoryItems(data);
      } catch (err) {
        console.error("An error occurred while fetching the history.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (isLoading)
    return <LoadingAnimation text={"loading...."}></LoadingAnimation>;

  if (historyItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-lg font-medium text-muted-foreground">
          No summaries have been created yet.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/")}
        >
          Go back home
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Summary Title</TableHead>
          <TableHead>Document</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {historyItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {item.title ?? "No Title Available"}
            </TableCell>
            <TableCell>
              <Button variant="ghost" asChild>
                <a
                  href={`${API_BASE_URL}/api/document/files/${item.document_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.document_name}
                </a>
              </Button>
            </TableCell>
            <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
            <TableCell>{item.model_name}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                onClick={() => {
                  navigate(`/summary/${item.id}`);
                }}
              >
                View Summary
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
