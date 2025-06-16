"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Search, Download, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// PDF.js 워커 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerComponentProps {
  file: File | string;
  translated?: boolean;
  onDownload?: () => void;
}

export default function PDFViewerComponent({
  file,
  translated = false,
  onDownload,
}: PDFViewerComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.0);
  const [inputPage, setInputPage] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // IntersectionObserver로 현재 보이는 페이지 감지
  useEffect(() => {
    if (!numPages) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        // 가장 많이 보이는 페이지를 찾음
        let maxRatio = 0;
        let visiblePage = currentPage;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const pageNum = Number(entry.target.getAttribute("data-page"));
            if (pageNum) visiblePage = pageNum;
          }
        });
        setCurrentPage(visiblePage);
        setInputPage("");
      },
      {
        root: containerRef.current,
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
      }
    );
    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line
  }, [numPages, scale]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputPage(value);
  };

  const handlePageInputBlur = () => {
    if (!inputPage) return;
    const page = Math.max(1, Math.min(Number(inputPage), numPages || 1));
    scrollToPage(page);
    setInputPage("");
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePageInputBlur();
    }
  };

  // 페이지로 스크롤 이동
  const scrollToPage = useCallback((page: number) => {
    const ref = pageRefs.current[page - 1];
    if (ref && containerRef.current) {
      const container = containerRef.current;
      container.scrollTo({
        top: ref.offsetTop - container.offsetTop,
        behavior: "smooth",
      });
    }
  }, []);

  // 이전/다음 페이지 버튼 클릭 시 스크롤 이동
  const handlePrevPage = () => {
    if (currentPage > 1) scrollToPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (numPages && currentPage < numPages) scrollToPage(currentPage + 1);
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-100 rounded-lg border shadow">
      {/* 상단 컨트롤 바 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b rounded-t-lg">
        <div className="flex items-center gap-2">
          {/* 페이지네이션 버튼 */}
          <button
            onClick={handlePrevPage}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={currentPage <= 1}
            aria-label="이전 페이지"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {/* 페이지 입력창 */}
          <input
            type="text"
            value={inputPage !== "" ? inputPage : currentPage}
            onChange={handlePageInputChange}
            onBlur={handlePageInputBlur}
            onKeyDown={handlePageInputKeyDown}
            className="w-12 text-center border rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="페이지 번호 입력"
          />
          <span className="text-sm text-gray-600">/ {numPages || '-'}</span>
          <button
            onClick={handleNextPage}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={numPages !== null && currentPage >= numPages}
            aria-label="다음 페이지"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* 확대/축소 버튼 */}
          <button
            onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="축소"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="확대"
          >
            <Plus className="w-4 h-4" />
          </button>
          {/* 다운로드 버튼 */}
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="다운로드"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      {/* PDF 뷰어 영역 (세로 스크롤) */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-gray-200 flex flex-col items-center px-2 py-4 gap-4"
        style={{ minHeight: 400, maxHeight: 700 }}
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-full text-red-500">
              PDF를 불러오는데 실패했습니다.
            </div>
          }
        >
          {Array.from(new Array(numPages || 0), (_, idx) => (
            <div
              key={idx}
              data-page={idx + 1}
              ref={el => (pageRefs.current[idx] = el)}
              className="w-full flex justify-center"
            >
              <Page
                pageNumber={idx + 1}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg bg-white rounded"
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
} 
