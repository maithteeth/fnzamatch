import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, Database, Trash2, ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'AI技術とプライバシー保護について | AI顔類似度判定',
    description: '当サービスで利用している最新の顔認識AIアルゴリズムと、ユーザーの皆様の画像を保護するための強固なプライバシー保護方針について解説します。',
};

export default function AboutAIPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        トップへ戻る
                    </Link>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8 border-b-2 border-zinc-100 dark:border-zinc-800 pb-4">
                    AI判定アルゴリズムと安全性について
                </h1>

                <div className="space-y-12">
                    {/* Section 1: AI Technology */}
                    <section className="space-y-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                <Cpu className="text-zinc-700 dark:text-zinc-300" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">最先端の顔認識AI「特徴量ベクトル抽出」</h2>
                        </div>
                        <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-4">
                            <p>
                                当サービスでは、最先端のディープラーニング技術を活用した顔写真の「特徴量ベクトル抽出（Feature Vector Extraction）」アルゴリズムを採用しています。ユーザーの皆様がアップロードした画像は、単なるピクセルの集合体としてではなく、AIの目を通じて512次元の高度な数学的ベクトルデータへと瞬時に変換されます。
                            </p>
                            <p>
                                「特徴量」とは、目と目の距離、鼻の高さ、輪郭の形状、口元の角度など、人間の顔が持つ千差万別の個性をAIが数値化したものです。このベクトルデータは、見た目の雰囲気や系統といった抽象的な情報を含有しており、当サービスが独自に構築している膨大な女優データベース内のベクトル情報と、「コサイン類似度」などの数学的計算を用いて瞬時に照合されます。これにより、単なる画像検索とは次元が異なる、骨格やパーツの配置バランスに基づいた高精度な「似ている度（マッチング率）」の算出を実現しています。
                            </p>
                            <p>
                                当サービスでは推論エンジンとして、国際的な顔認識ベンチマークで高いスコアを誇る最先端のモデルをチューニングして組み込んでおり、照明の暗さや顔の角度がある程度異なっていても、本質的な顔の特徴を捉えることが可能です。
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Privacy Policy */}
                    <section className="space-y-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                <ShieldCheck className="text-zinc-700 dark:text-zinc-300" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">強固なプライバシー保護と画像の完全破棄</h2>
                        </div>
                        <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-4">
                            <p>
                                顔写真という極めて機微な個人情報を取り扱うにあたり、当サービスはユーザーの皆様のプライバシー保護を最優先事項としてシステムを設計しています。最も重要な方針として、<strong className="text-black dark:text-white">「アップロードされた画像データは一切保存されず、推論処理が完了した瞬間にサーバーのメモリ上から完全に破棄される」</strong>という厳格な仕組み（ゼロ・リテンション・ポリシー）を採用しています。
                            </p>
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 my-6">
                                <h3 className="text-lg font-bold text-black dark:text-white mb-3">安全なデータ処理フロー</h3>
                                <ul className="space-y-3 mb-0">
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>ブラウザ内での送信前処理: 画像は皆様のスマホやPCの中で圧縮・回転補正が行われ、必要最小限のデータ量として暗号化通信で送信されます。</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>メモリ上での一瞬の推論: サーバーに到達した画像データはハードディスク（ストレージ）には一切書き込まれません。一時メモリ（RAM）上で数ミリ秒のうちにベクトルデータとして抽出されます。</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span><Trash2 className="inline-block w-4 h-4 mr-1" />即時完全破棄: 特徴量が抽出され次第、元の画像データはメモリから安全に消去（パージ）されます。運営者であっても送信された画像を閲覧・復元することは物理的に不可能です。</span>
                                    </li>
                                </ul>
                            </div>
                            <p>
                                さらに、セキュリティの観点からDDos攻撃などを防ぐためのレートリミット（連続アクセス制限）を設けており、常に安全で安定したサービスを提供できるインフラを構築しております。顔の類似度判定というエンターテイメントを、情報漏洩のリスクを一切心配することなく、心ゆくまでお楽しみください。
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
