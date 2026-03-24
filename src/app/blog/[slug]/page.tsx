import { getPostData, getSortedPostsData } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 selection:bg-orange-100 selection:text-orange-900">
      {/* 프리미엄 배경 그라데이션 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-orange-100/40 blur-[120px]" />
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
          <Link href="/blog" className="text-sm font-bold text-zinc-500 hover:text-orange-500 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            블로그 목록으로 돌아가기
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20">
        <article className="space-y-12">
          {/* 상단 정보 */}
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-orange-600">
              <span>{post.category}</span>
              <span className="h-1 w-1 rounded-full bg-zinc-300" />
              <time>{post.date}</time>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl leading-[1.2]">
              {post.title}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600 ring-1 ring-inset ring-orange-100">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 본문 컨텐츠 */}
          <section className="rounded-[2.5rem] bg-white border border-zinc-100 p-8 sm:p-14 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            <div className="prose prose-zinc prose-lg max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900
              prose-p:text-zinc-600 prose-p:leading-relaxed
              prose-a:text-orange-500 prose-a:font-bold hover:prose-a:text-orange-600
              prose-blockquote:border-l-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:rounded-r-xl
              prose-strong:text-zinc-900 prose-strong:font-bold
              prose-img:rounded-3xl prose-img:shadow-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content || ""}
              </ReactMarkdown>
            </div>
          </section>

          {/* 하단 네비게이션 */}
          <div className="pt-20 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-500 font-bold transition-all group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7M21 12H3"/></svg>
              전체 블로그 리스트로 돌아가기
            </Link>
          </div>
        </article>
      </main>

      {/* 푸터 */}
      <footer className="mt-20 border-t border-zinc-100 py-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest leading-loose">
            성남시 데이터 플랫폼 × Gemini AI <br />
            © 2026 Seongnam Life Info.
          </p>
        </div>
      </footer>
    </div>
  );
}
