import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { cn, isValidPDF, formatFileSize } from "@/lib/utils";

interface PDFUploadProps {
  onFileSelect: (file: File) => void;
}

export function PDFUpload({ onFileSelect }: PDFUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError("");
      const file = acceptedFiles[0];
      
      if (!file) {
        setError("Please select a file");
        return;
      }

      if (!isValidPDF(file)) {
        setError("Please upload a valid PDF file");
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setSelectedFile(null);
    setError("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
          error && "border-red-500 bg-red-50"
        )}
      >
        <input {...getInputProps()} />
        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <File className="h-6 w-6 text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragActive
                ? "Drop the PDF file here"
                : "Drag and drop a PDF file here, or click to select"}
            </p>
            <p className="text-xs text-gray-500">Only PDF files are supported</p>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
} 