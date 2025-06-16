"use client";

import { useState } from "react";
import { PDFUpload } from "@/components/pdf-viewer/PDFUpload";
import { PDFViewer } from "@/components/pdf-viewer/PDFViewer";
import { getTranslatedFileName } from "@/lib/utils";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [translatedFile, setTranslatedFile] = useState<File | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    // TODO: Implement translation logic here
    setIsTranslating(true);
    try {
      // Simulate translation process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setTranslatedFile(file); // Replace with actual translated file
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDownload = () => {
    if (!translatedFile) return;
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(translatedFile);
    link.download = getTranslatedFileName(translatedFile.name, "en");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">PDF Translator</h1>
          <p className="text-gray-600">
            Upload your PDF file and translate it to your desired language
          </p>
        </div>

        {!selectedFile ? (
          <PDFUpload onFileSelect={handleFileSelect} />
        ) : (
          <div className="space-y-4">
            {isTranslating ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Translating your document...</p>
              </div>
            ) : (
              <PDFViewer
                file={translatedFile || selectedFile}
                translated={!!translatedFile}
                onDownload={handleDownload}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
