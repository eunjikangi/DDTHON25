"use client";

import { Button } from "@/components/ui/button";
import { UploadCloudIcon } from "lucide-react";

export default function StartupLanding() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/photo-1699891730676-037bed3c1bed.jpg')",
      }}
    >
      <div className="rounded-xl px-8 py-16 text-center flex flex-col items-center justify-center">
        <p className="text-white text-5xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
        Effortlessly translate PDFs
        </p>
        <p className="text-white text-5xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
        in seconds.
        </p>

          <p className="mt-6 max-w-2xl text-lg text-gray-200 md:text-xl dark:text-gray-300">
          현대적인 AI 번역 기술로 문서의 내용과 서식을 완벽하게 보존합니다.
        </p>

        <Button size="lg" className="group text-lg mt-10" onClick={() => {/* PDF 업로드 모달 또는 페이지로 이동 */}}>
            <UploadCloudIcon className="mr-2 h-5 w-5" />
            지금 PDF 업로드하기
          </Button>

      </div>
    </div>
  );
} 