"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// PDF 컴포넌트를 클라이언트 사이드에서만 로드
const PDFViewerComponent = dynamic(
  () => import("./PDFViewerComponent"),
  { ssr: false }
);

interface PDFViewerProps {
  file: File | string;
  translated?: boolean;
  onDownload?: () => void;
}

export function PDFViewer(props: PDFViewerProps) {
  return <PDFViewerComponent {...props} />;
}