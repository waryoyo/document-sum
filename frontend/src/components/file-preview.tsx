"use client";

import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { LoadingAnimation } from "./loading-spinner";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { ScrollArea } from "./ui/scroll-area";

interface FilePreviewProps {
  file: File;
}

export function FilePreview({ file }: FilePreviewProps) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const isPdf = file.type === "application/pdf";
  const isDoc =
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isTxt = file.type === "text/plain";

  useEffect(() => {
    if (isTxt) {
      extractText(file);
    }
  }, [file, isTxt]);

  const extractText = async (file: File) => {
    setLoading(true);
    const text = await file.text();
    setText(text);
    setLoading(false);
  };

  if (loading) {
    return <LoadingAnimation text={"Loading..."}></LoadingAnimation>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">File Preview</h2>
        {isPdf && (
          <div>
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={console.error}
              onError={console.error}
              className="flex justify-center"
            >
              <Page pageNumber={pageNumber} height={500} />
            </Document>
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <p>
                Page {pageNumber} of {numPages}
              </p>
              <Button
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={pageNumber >= (numPages || 0)}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {isTxt && (
          <ScrollArea
            className={`h-[40vh] rounded-md border py-0 px-0 border-none`}
          >
            <MarkdownViewer text={text ?? ""} />
          </ScrollArea>
        )}

        {isDoc && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Preview not available for Word documents.
              <br />
              file.name: {file.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
