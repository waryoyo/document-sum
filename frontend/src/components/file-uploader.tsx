"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, File, Upload } from "lucide-react";
import apiClient from "@/api/apiClient";

const allowedFileTypes = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/pdf",
];

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (
      acceptedFiles?.length > 0 &&
      allowedFileTypes.includes(acceptedFiles[0].type)
    ) {
      setFile(acceptedFiles[0]);
    } else {
      alert("Please upload a valid file type (doc, docx, txt, or pdf)");
    }
  }, []);

  const handleUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = () => setFile(null);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "application/pdf":
        return "PDF";
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "DOC";
      case "text/plain":
        return "TXT";
      default:
        return "FILE";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-primary bg-primary/10 dark:bg-primary/20"
                : "border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary"
            }
          `}
        >
          <input {...getInputProps()} accept=".doc,.docx,.txt,.pdf" />
          <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Drag & drop a file here, or click to select a file
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Supported file types: DOC, DOCX, TXT, PDF
          </p>
        </div>

        {file && (
          <div className="mt-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <File className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getFileIcon(file.type)} - {(file.size / 1024).toFixed(2)}{" "}
                    KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
        {file && (
          <Button className="w-full mt-4" onClick={handleUpload}>
            Upload File
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
