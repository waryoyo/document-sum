import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import apiClient from "@/api/apiClient";

interface HistoryItem {
  id: number;
  summaryTitle: string;
  summary: string;
  document: string;
  createdAt: string;
  model: string;
}

export function HistoryList() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data, status } = await apiClient.get<HistoryItem[]>("/history");

        if (status !== 200) {
          setError("Failed to fetch history items.");
          return;
        }
        setHistoryItems(data);
      } catch (err) {
        setError("An error occurred while fetching the history.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
          <TableRow key={item.id}></TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
