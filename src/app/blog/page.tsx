import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 selection:bg-orange-100 selection:text-orange-900">
      {/* 프리미엄 배경 그라데이션 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-orange-100/40 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[35%] w-[35%] rounded-full bg-rose-100/30 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[30%] w-[30%] rounded-full bg-amber-50/50 blur-[80px]" />
      </div>

      {/* 상단 헤더: 메가 내비게이션 스타일 */}
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
            <Link href="/blog" className="text-orange-500 font-bold">블로그</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">소개</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-20 space-y-20">
        {/* 히로 섹션 */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5 text-xs font-bold text-orange-600 shadow-sm">
            <span>AI Journal</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
            우리 동네 <span className="bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text text-transparent">정보 저장소</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-500 leading-relaxed font-medium">
            인공지능이 매일 아침 성남시의 유익한 정보를 정리하여 전해드립니다.
          </p>
        </section>

        {/* 블로그 포스트 리스트 */}
        <section className="space-y-16">
          {allPostsData.length > 0 ? (
            <div className="flex flex-col gap-16">
              {allPostsData.map((post) => (
                <article key={post.slug} className="group relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
                  <div className="relative w-full md:w-80 shrink-0 aspect-[16/10] md:aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-zinc-100 transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(249,115,22,0.2)] group-hover:-translate-y-1">
                    {post.image ? (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-white to-rose-50/50" />
                          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30 transition-opacity group-hover:opacity-50">
                            ✨
                          </div>
                        </>
                    )}
                  </div>
                  
                  <div className="space-y-5 flex-1">
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-orange-600">
                      <span className="bg-orange-50 px-2 py-0.5 rounded-md">{post.category}</span>
                      <time className="text-zinc-400">{post.date}</time>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-extrabold leading-tight text-zinc-900 group-hover:text-orange-500 transition-colors sm:text-3xl">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-lg text-zinc-500 leading-relaxed line-clamp-2 font-medium">
                        {post.summary}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-zinc-500 ring-1 ring-inset ring-zinc-100 shadow-sm transition-all group-hover:ring-orange-100 group-hover:bg-orange-50/30">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        자세히 보기
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-[3rem] bg-white border border-zinc-100 shadow-sm px-10">
              <span className="text-4xl mb-4 block opacity-50">📭</span>
              <p className="text-lg font-bold text-zinc-900">아직 등록된 포스트가 없습니다.</p>
              <p className="mt-2 text-zinc-500 font-medium">새로운 소식을 준비 중이니 조금만 기다려 주세요!</p>
            </div>
          )}
        </section>
      </main>

      {/* 푸터 */}
      <footer className="mt-20 border-t border-zinc-100 py-12 bg-white">
        <div className="mx-auto max-w-5xl px-6 text-center space-y-4">
          <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
            © 2026 Seongnam Life Info. Empowered by Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
