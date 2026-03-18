import fs from "fs";
import path from "path";
import Link from "next/link";

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

export default function Home() {
  const filePath = path.join(process.cwd(), "public", "data", "local-info.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data: LocalInfo[] = JSON.parse(fileContent);

  const events = data.filter((item) => item.category === "행사");
  const benefits = data.filter((item) => item.category === "혜택");

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 selection:bg-orange-100 selection:text-orange-900">
      {/* 프리미엄 배경 그라데이션 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-orange-100/40 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[35%] w-[35%] rounded-full bg-rose-100/30 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[30%] w-[30%] rounded-full bg-amber-50/50 blur-[80px]" />
      </div>

      {/* 상단 헤더: 글래스모피즘 적용 */}
      <header className="sticky top-0 z-30 border-b border-orange-50/50 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-sm">🌸</span>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
              성남시 <span className="text-orange-500">생활 정보</span>
            </h1>
          </Link>
          <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <Link href="/" className="hover:text-orange-500 transition-colors">홈</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">블로그</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">소개</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16 space-y-24">
        {/* 히로 섹션 */}
        <section className="text-center space-y-6 py-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/50 border border-orange-100 px-4 py-1.5 text-xs font-bold text-orange-600 shadow-sm backdrop-blur-sm">
            <span>New</span>
            <span className="h-3 w-[1px] bg-orange-200" />
            <span>오늘의 실시간 이벤트가 업데이트 되었습니다</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
            우리 동네 소식,<br />
            <span className="bg-gradient-to-r from-orange-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              가장 빠르게 만나보세요
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-500 leading-relaxed font-medium">
            공공데이터와 인공지능이 만났습니다. <br className="hidden sm:block" />
            성남시의 모든 축제, 행사, 그리고 복지 혜택을 매일 아침 전해드립니다.
          </p>
        </section>

        {/* 이번 달 행사/축제 섹션 */}
        <section>
          <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-zinc-900">✨ 이번 달 주요 오프라인 행사</h3>
              <p className="mt-1 text-zinc-500">이달에 꼭 가봐야 할 성남시의 즐거움</p>
            </div>
            <button className="text-sm font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-all group">
              전체보기 
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 5l7 7-7 7"/></svg>
            </button>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="group relative flex flex-col rounded-3xl bg-white border border-zinc-100 p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)] hover:border-orange-200/50"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <span className="inline-flex rounded-xl bg-orange-50 px-4 py-1.5 text-xs font-bold text-orange-600 ring-1 ring-inset ring-orange-100">
                      {event.category}
                    </span>
                    <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">🎡</span>
                  </div>
                  <h4 className="mb-3 text-xl font-bold leading-tight text-zinc-900 group-hover:text-orange-600 transition-colors">
                    {event.name}
                  </h4>
                  <div className="space-y-3 text-[14px] text-zinc-500">
                    <p className="flex items-center gap-2 font-medium">
                      <span className="text-lg">📅</span> {event.startDate} ~ {event.endDate}
                    </p>
                    <p className="flex items-center gap-2 font-medium">
                      <span className="text-lg">📍</span> {event.location}
                    </p>
                    <div className="pt-4 border-t border-zinc-50 mt-4 leading-relaxed line-clamp-3 text-zinc-600">
                      {event.summary}
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6">
                  <Link
                    href={`/detail/${event.id}`}
                    className="flex items-center justify-center w-full rounded-2xl bg-zinc-900 py-4 text-sm font-bold text-white transition-all transform hover:bg-orange-500 hover:shadow-lg active:scale-95"
                  >
                    내용 확인하기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 지원금/혜택 섹션 */}
        <section className="relative overflow-hidden rounded-[3rem] bg-zinc-900 px-8 py-20 sm:px-16">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-green-500/20 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
          
          <div className="relative z-10 mb-12 text-center sm:text-left">
            <h3 className="text-3xl font-bold text-white">💰 놓치면 아쉬운 복지/지원금</h3>
            <p className="mt-2 text-zinc-400">성남 시민이라면 누구나 받을 수 있는 혜택 모음</p>
          </div>

          <div className="relative z-10 grid gap-6 md:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="group flex flex-col rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <span className="rounded-xl bg-green-500/20 px-4 py-1.5 text-xs font-bold text-green-400">
                      {benefit.category}
                    </span>
                    <span className="text-xl">⭐</span>
                  </div>
                  <h4 className="mb-4 text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                    {benefit.name}
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm text-zinc-300 font-medium">
                      <span className="text-lg">👥</span> 대상: {benefit.target}
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-sm">
                      {benefit.summary}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/detail/${benefit.id}`}
                  className="mt-10 flex items-center justify-center gap-2 text-sm font-bold text-white hover:text-green-400 transition-colors"
                >
                  상세 조건 확인 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 하단 푸터: 디자인 강화 */}
      <footer className="mt-20 bg-white border-t border-zinc-100 pt-20 pb-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 mb-20">
            <div className="col-span-2 space-y-4 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-2xl font-bold">
                <span>🌸</span>
                <span>성남시 생활정보</span>
              </div>
              <p className="max-w-xs text-sm text-zinc-500 leading-relaxed font-medium">
                우리는 공공데이터를 활용하여 시민들에게 가장 유익한 정보를 전달하는 AI 저널리즘을 추구합니다.
              </p>
            </div>
            <div className="space-y-4 text-center sm:text-left">
              <h5 className="font-bold text-zinc-900">링크</h5>
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <Link href="#" className="hover:text-orange-500">이용약관</Link>
                <Link href="#" className="hover:text-orange-500">개인정보처리방침</Link>
                <Link href="#" className="hover:text-orange-500">광고문의</Link>
              </div>
            </div>
            <div className="space-y-4 text-center sm:text-left">
              <h5 className="font-bold text-zinc-900">데이터</h5>
              <div className="flex flex-col gap-2 text-sm text-zinc-500">
                <a href="https://www.data.go.kr" className="hover:text-orange-500 underline decoration-orange-200">공공데이터포털</a>
                <span className="text-xs italic text-zinc-400">마지막 업데이트: {new Date().toLocaleDateString("ko-KR")}</span>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-50 text-center">
            <p className="text-[12px] font-medium text-zinc-300 uppercase tracking-widest">
              © 2026 Seongnam Life Info. Empowered by Gemini AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
