import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

interface LocalInfo {
  id: string;
  name: string;
  category: "행사" | "혜택";
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public", "data", "local-info.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data: LocalInfo[] = JSON.parse(fileContent);

  return data.map((item) => ({
    id: item.id,
  }));
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), "public", "data", "local-info.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data: LocalInfo[] = JSON.parse(fileContent);

  const item = data.find((i) => i.id === id);

  if (!item) {
    notFound();
  }

  const isEvent = item.category === "행사";

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 selection:bg-orange-100 selection:text-orange-900">
      {/* 프리미엄 배경 그라데이션 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full ${isEvent ? 'bg-orange-100/40' : 'bg-green-100/30'} blur-[120px]`} />
        <div className="absolute top-[20%] -right-[10%] h-[35%] w-[35%] rounded-full bg-rose-100/20 blur-[100px]" />
      </div>

      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 border-b border-orange-50/50 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-sm">🌸</span>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              성남시 <span className="text-orange-500">생활 정보</span>
            </h1>
          </Link>
          <Link href="/" className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            목록으로 돌아가기
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20">
        <article className="space-y-12">
          {/* 상단 뱃지 및 제목 */}
          <div className="space-y-6 text-center">
            <span className={`inline-flex rounded-full ${isEvent ? 'bg-orange-100 text-orange-600 ring-orange-200' : 'bg-green-100 text-green-600 ring-green-200'} px-5 py-2 text-sm font-bold ring-1 ring-inset`}>
              {item.category}
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              {item.name}
            </h2>
          </div>

          {/* 핵심 정보 카드 */}
          <div className="grid gap-6 rounded-[2.5rem] bg-white border border-zinc-100 p-10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="space-y-2 text-center sm:text-left border-b sm:border-b-0 sm:border-r border-zinc-50 pb-6 sm:pb-0 sm:pr-6">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">기간</span>
                <p className="font-bold text-zinc-800">{isEvent ? `${item.startDate} ~ ${item.endDate}` : '상시 운영'}</p>
              </div>
              <div className="space-y-2 text-center sm:text-left border-b sm:border-b-0 sm:border-r border-zinc-50 pb-6 sm:pb-0 sm:pr-6">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">장소/범위</span>
                <p className="font-bold text-zinc-800">{item.location}</p>
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">지원대상</span>
                <p className="font-bold text-zinc-800">{item.target}</p>
              </div>
            </div>
          </div>

          {/* 상세 내용 섹션 */}
          <section className="space-y-8 prose prose-zinc max-w-none">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-1 rounded-full ${isEvent ? 'bg-orange-500' : 'bg-green-500'}`} />
              <h3 className="text-2xl font-bold m-0 italic text-zinc-800 tracking-tight">상세 정보 전문</h3>
            </div>
            <div className="rounded-[2.5rem] bg-zinc-900 p-10 sm:p-14 text-zinc-300 leading-[1.8] text-lg shadow-2xl relative overflow-hidden">
               <div className={`absolute top-0 right-0 h-40 w-40 ${isEvent ? 'bg-orange-500/10' : 'bg-green-500/10'} blur-[60px]`} />
               <p className="relative z-10 font-medium whitespace-pre-wrap">
                 {item.summary}
               </p>
               <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="text-sm text-zinc-500 font-bold italic">
                    * 본 내용은 실제 공공데이터 기반으로 AI가 정리한 내용입니다.
                  </div>
                  <a
                    href={item.link}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-zinc-900 transition-all hover:bg-orange-500 hover:text-white group active:scale-95"
                  >
                    공식 원본 사이트 방문하기
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </a>
               </div>
            </div>
          </section>

          {/* 하단 네비게이션 */}
          <div className="pt-20 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-500 font-bold transition-all group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7M21 12H3"/></svg>
              전체 리스트로 돌아가기
            </Link>
          </div>
        </article>
      </main>

      {/* 푸터 */}
      <footer className="mt-20 border-t border-zinc-100 py-12">
        <div className="mx-auto max-w-5xl px-6 text-center space-y-4">
          <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest leading-loose">
            성남시 데이터 플랫폼 × Gemini AI <br />
            © 2026 Seongnam Life Info.
          </p>
        </div>
      </footer>
    </div>
  );
}
