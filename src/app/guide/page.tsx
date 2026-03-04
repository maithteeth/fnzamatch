import React from 'react';
import Link from 'next/link';
import { BookOpen, Map, Zap, Database, Construction, ArrowLeft } from 'lucide-react';

export const metadata = {
    title: '使い方ガイドと今後のロードマップ | AI顔類似度判定',
    description: 'AI顔類似度判定の簡単な使い方と、今後のデータベース拡充・精度向上に向けた開発計画のご案内です。',
};

export default function GuidePage() {
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
                    ご利用ガイドと開発ロードマップ
                </h1>

                <div className="space-y-12">
                    {/* Section 1: Usage Guide */}
                    <section className="space-y-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                <BookOpen className="text-zinc-700 dark:text-zinc-300" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">ご利用ステップ（完全無料）</h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                                <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold mb-4">1</div>
                                <h3 className="font-bold mb-2">画像をアップロード</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    トップページから顔がはっきり写っている画像（ご自身や友人等）を選択、またはドラッグ＆ドロップします。正面顔が最も高精度に判定されます。
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                                <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold mb-4">2</div>
                                <h3 className="font-bold mb-2">AIが瞬時に解析</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    AIが画像から512次元の顔特徴量ベクトルを抽出し、独自の女優データベースからあなたに骨格や系統が「最も似ている」上位マッチを検索します。
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                                <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold mb-4">3</div>
                                <h3 className="font-bold mb-2">結果を確認＆シェア</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    似ている度（%）とともに結果が表示されます。「詳細を見る」から関連作品をチェックしたり、結果をX（LINE）で友達にシェアして楽しみましょう！
                                </p>
                            </div>
                        </div>

                        <div className="mx-6 md:mx-8 mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-500 text-sm flex items-start gap-2">
                            <span className="font-bold flex-shrink-0 mt-0.5">💡 高精度な判定のコツ:</span>
                            <span>マスクやサングラスをしていない、明るい場所で撮影された正面の写真をご利用いただくと、AIがより正確に顔の特徴を捉えることができます。複数人が写っている場合は、最も大きく写っている顔が対象となります。</span>
                        </div>
                    </section>

                    {/* Section 2: Roadmap */}
                    <section className="space-y-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                <Map className="text-zinc-700 dark:text-zinc-300" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold">今後の開発ロードマップ</h2>
                        </div>

                        <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                            <p>
                                当サービスは、現在<strong className="text-black dark:text-white border-b-2 border-dashed border-red-500">β版（テスト稼働中）</strong>としてサービスを提供しております。推論エンジンの基盤構築とUIの連携が完了し、安定稼働を確認した段階です。<br />今後は本番リリースに向けて、データベースの圧倒的な拡充と、さらなるAIアルゴリズムの進化を計画しております。
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <div className="flex-shrink-0 mt-1">
                                    <Database className="text-blue-500 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-black dark:text-white mb-2">1. 独自データベースの超大規模化（FANZA API連携）</h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        現在、判定の基礎となるデータベースはデモンストレーション用のβ版データとなっております。今後はFANZA公式APIとの完全な連携を行い、数千人を超える現役女優・過去の著名女優を含めた超大規模な顔特徴量データベースを構築します。これにより、マイナーな系統や細かい特徴の差異までを高精度にマッチング可能になります。
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <div className="flex-shrink-0 mt-1">
                                    <Zap className="text-amber-500 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-black dark:text-white mb-2">2. 推論エンジンの精度向上と軽量化モデルの導入</h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        ベクトル類似度を計算するHNSWインデックスのチューニングを行い、検索スピードをミリ秒単位まで高速化します。また、年代別トレンドやメイクの系統などを補正係数として扱うハイブリッド検索アルゴリズムを導入し、「似ている」という主観的な感覚により近い結果を出力するよう調整を続けてまいります。
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
                                <div className="flex-shrink-0 mt-1">
                                    <Construction className="text-zinc-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-black dark:text-white mb-2">3. UI/UXのアップデート</h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        お待ちいただいている間の判定アニメーションの強化、おもしろい診断結果時の特殊エフェクト、結果画像保存（スマホのアルバム保存）への対応など、シェア画面でのエンターテイメント性の向上を図るアップデートを随時実施予定です。
                                    </p>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>
            </div>
        </div>
    );
}
