import Image from "next/image";
import Link from "next/link";
import UploadArea from "@/components/UploadArea";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80 md:px-8 transition-all">
        <div className="flex items-center gap-3 font-bold tracking-tight">
          <div className="h-6 w-6 rounded-sm bg-black dark:bg-white flex items-center justify-center rotate-45 transition-transform hover:rotate-90 duration-500">
            <div className="h-2 w-2 rounded-full bg-white dark:bg-black" />
          </div>
          <span className="text-lg">AI顔類似度判定（仮）</span>
        </div>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/about-ai" className="hidden md:block text-sm font-medium hover:text-zinc-500 transition-colors">
            AI技術と安全性
          </Link>
          <Link href="/guide" className="hidden md:block text-sm font-medium hover:text-zinc-500 transition-colors">
            ご利用ガイド
          </Link>
          <a href="#contact" className="text-sm font-medium hover:text-zinc-500 transition-colors">
            Contact
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center md:py-48 flex-grow h-[calc(100vh-4rem)] min-h-[600px] overflow-hidden">
          {/* Subtle background gradient / noise can go here if needed, keeping it B&W */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-100 via-white to-white dark:from-zinc-900 dark:via-black dark:to-black opacity-50"></div>

          <div className="animate-fade-in-up">
            <div className="mb-6 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 shadow-sm transition-all hover:scale-105 cursor-default">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-black dark:bg-white animate-ping"></span>
              Coming Soon
            </div>
            <h1 className="mt-4 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl transition-all">
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 pb-2">
                顔系統判定
              </span>
              <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl font-bold dark:text-zinc-300">
                最先端AIで、あなたの顔を分析
              </span>
            </h1>
            <p className="mt-8 max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 md:text-xl leading-relaxed">
              最先端AIによる顔系統判定、現在鋭意開発中（Coming Soon）
              <br />
              最新のディープラーニング技術を用いて、あなたの顔の系統を数万件のデータと照合。新たな発見が、あなたを待っています。
            </p>
            <UploadArea />
          </div>
        </section>

        {/* Feature Preview Section */}
        <section id="features" className="border-t border-zinc-200 bg-zinc-50 py-32 px-4 dark:border-zinc-900/50 dark:bg-black">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-20 md:mb-24">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">機能プレビュー</h2>
              <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                リリースに向けて準備中の主な機能をご紹介します。洗練されたUIと直感的な操作性で、プレミアムな体験を提供します。
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="group flex flex-col space-y-4 rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 transition-colors group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold pt-4">超高精度分析</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  最新のディープラーニングモデルを搭載。数百万のパラメータから顔のパーツ配置やバランスを瞬時に、そして正確に解析します。
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group flex flex-col space-y-4 rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 transition-colors group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold pt-4">系統マッチング</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  独自のビッグデータとの照合により、あなたに最も似ている顔系統を分析。意外なマッチング結果を楽しむことができます。
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group flex flex-col space-y-4 rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 transition-colors group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold pt-4">シームレスな共有</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  判定結果は美しくデザインされた画像として自動生成。ワンタップで各種SNSへ共有し、話題を作ることができます。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-900 dark:bg-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 px-4 md:flex-row md:items-start">
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <div className="flex items-center gap-3 font-bold tracking-tight">
              <div className="h-6 w-6 rounded-sm bg-black dark:bg-white flex items-center justify-center rotate-45">
                <div className="h-2 w-2 rounded-full bg-white dark:bg-black" />
              </div>
              <span className="text-xl">AI顔類似度判定サービス（仮）</span>
            </div>
            <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
              現在鋭意開発中。革新的な顔認識技術で、新しい価値を提供します。
            </p>
          </div>
          <div className="flex flex-col md:items-end text-center md:text-right">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">コンテンツ</h4>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 mb-8">
              <p><Link href="/about-ai" className="hover:text-black dark:hover:text-white transition-colors">AI判定とプライバシー方針</Link></p>
              <p><Link href="/guide" className="hover:text-black dark:hover:text-white transition-colors">ご利用ガイドとロードマップ</Link></p>
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">運営者情報</h4>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <p>運営: AI顔類似度サービス開発チーム</p>
              <p>Email: <a href="mailto:contact@example.com" className="hover:text-black dark:hover:text-white transition-colors">contact@example.com</a></p>
              <p className="pt-2 text-xs text-zinc-400 dark:text-zinc-500 max-w-xs">
                ※当サイトはティザーサイトです。サービス内容・仕様は開発状況により変更される場合があります。
              </p>
            </div>
          </div>
        </div>
        <div className="mt-16 text-center text-sm font-medium text-zinc-400 dark:text-zinc-600">
          &copy; {new Date().getFullYear()} AI Face Similarity Service. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
