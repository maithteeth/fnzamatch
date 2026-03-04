"use client";

import { useState, useCallback } from "react";
import { UploadCloud, Loader2, ExternalLink, ChevronRight, Twitter, MessageCircle, Link as LinkIcon } from "lucide-react";
import imageCompression from "browser-image-compression";

type MatchResult = {
    id: number;
    name: string;
    similarity: number;
    imageUrl: string;
    affiliateUrl: string;
};

export default function UploadArea() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<MatchResult[] | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("画像ファイルを選択してください。");
            return;
        }

        // 10MB制限 (圧縮前)
        const MAX_FILE_SIZE_MB = 10;
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`ファイルサイズは${MAX_FILE_SIZE_MB}MB以下にしてください。`);
            return;
        }

        setError(null);
        setWarning(null);
        setLoading(true);
        setResults(null);
        setPreviewUrl(URL.createObjectURL(file));

        try {
            // 画像の圧縮・Exif回転補正処理
            const options = {
                maxSizeMB: 1, // 最大1MBに圧縮
                maxWidthOrHeight: 800, // 最大幅・高さを800pxにリサイズ
                useWebWorker: true
            };

            const compressedFile = await imageCompression(file, options);
            console.log(`Compressed image from ${file.size / 1024}KB to ${compressedFile.size / 1024}KB`);

            const formData = new FormData();
            formData.append("image", compressedFile);

            const response = await fetch("/api/match", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("マッチング処理に失敗しました。");
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "マッチング処理に失敗しました。");
            }

            setResults(data.results);
            if (data.warning) {
                setWarning("複数人の顔が検出されました。最も大きく写っている顔を基準に判定しています。");
            }
        } catch (err: any) {
            setError(err.message || "予期せぬエラーが発生しました。");
        } finally {
            setLoading(false);
        }
    };

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    }, []);

    const reset = () => {
        setResults(null);
        setPreviewUrl(null);
        setError(null);
        setWarning(null);
    };

    // --- シェア設定 ---
    const getShareMessage = () => {
        if (!results || results.length === 0) return "";
        const bestMatch = results[0];
        const percent = Math.round(bestMatch.similarity * 100);
        return encodeURIComponent(`【診断結果】\nAI顔類似度判定の結果、 ${bestMatch.name} に ${percent}% 似てるみたい！🤖👀\n\n`);
    };

    const SHARE_URL = encodeURIComponent("https://ai-face-match.vercel.app"); // FIXME: 本番デプロイ時にURLを変更する

    const shareOnX = () => {
        window.open(`https://twitter.com/intent/tweet?text=${getShareMessage()}&url=${SHARE_URL}`, '_blank');
    };

    const shareOnLine = () => {
        window.open(`https://line.me/R/msg/text/?${getShareMessage()}%20${SHARE_URL}`, '_blank');
    };

    const copyLink = () => {
        navigator.clipboard.writeText("https://ai-face-match.vercel.app");
        alert("リンクをクリップボードにコピーしました！");
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-12">
            {/* Upload State */}
            {!loading && !results && (
                <div
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    className="relative group flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed border-zinc-300 bg-white/50 backdrop-blur-sm transition-all hover:border-black hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-white dark:hover:bg-zinc-800/80 cursor-pointer overflow-hidden"
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center text-center p-6 transition-transform group-hover:scale-105">
                        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                            <UploadCloud size={32} />
                        </div>
                        <p className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                            画像をドラッグ＆ドロップ
                        </p>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                またはクリックしてファイルを選択
                            </p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                対応形式: WebP, PNG, JPG, BMP (最大 10MB)
                            </p>
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 inline-block px-2 py-1 rounded-md mt-2">
                                🔒 画像はブラウザ内で圧縮後、安全に処理され即時破棄されます
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center w-full h-80 rounded-2xl border space-y-6 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full blur-xl bg-black/10 dark:bg-white/10 animate-pulse"></div>
                        <Loader2 size={48} className="animate-spin text-black dark:text-white relative z-10" />
                    </div>
                    <div className="space-y-2 text-center">
                        <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 animate-pulse">
                            顔特徴を抽出中...
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            データベースと照合しています（約3秒かかります）
                        </p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 text-center animate-fade-in-up">
                    <p className="font-medium">{error}</p>
                    <button onClick={reset} className="mt-4 text-sm underline hover:opacity-80">
                        もう一度試す
                    </button>
                </div>
            )}

            {/* Results State */}
            {results && !loading && (
                <div className="flex flex-col w-full rounded-2xl border bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-fade-in-up">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                        <h3 className="text-xl font-extrabold tracking-tight">判定結果</h3>
                        <button
                            onClick={reset}
                            className="text-sm font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                        >
                            別の画像を試す
                        </button>
                    </div>

                    {warning && (
                        <div className="mx-6 md:mx-8 mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-500 text-sm flex items-start gap-2">
                            <span className="font-bold flex-shrink-0 mt-0.5">⚠️ 注意:</span>
                            <span>{warning}</span>
                        </div>
                    )}

                    <div className="p-6 md:p-8 space-y-6">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            {/* Thumbnail of Uploaded Image */}
                            {previewUrl && (
                                <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-inner">
                                    <img src={previewUrl} alt="Uploaded" className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className="flex-1 w-full space-y-4">
                                {results.map((result, index) => (
                                    <div
                                        key={result.id}
                                        className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all ${index === 0
                                            ? "border-black dark:border-white bg-zinc-50 dark:bg-zinc-900/80 shadow-md"
                                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                                                <img src={result.imageUrl} alt={result.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-0.5">
                                                    {index === 0 ? "🏆 最も似ている系統" : `No.${index + 1} マッチ`}
                                                </span>
                                                <span className="font-bold text-lg dark:text-zinc-100">{result.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-end gap-1">
                                                <span className="text-2xl font-black leading-none">
                                                    {Math.round(result.similarity * 100)}
                                                </span>
                                                <span className="text-sm font-bold text-zinc-500 mb-0.5">%</span>
                                            </div>
                                            <a
                                                href={result.affiliateUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                            >
                                                詳細を見る <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- SNS Share Section --- */}
                        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col items-center">
                            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-4 tracking-wider">
                                結果をシェアする
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={shareOnX}
                                    className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer hover:scale-110"
                                    title="X (Twitter) でシェア"
                                >
                                    <Twitter size={20} fill="currentColor" />
                                </button>
                                <button
                                    onClick={shareOnLine}
                                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#06C755] text-white hover:brightness-110 transition-all shadow-sm cursor-pointer hover:scale-110"
                                    title="LINE で送る"
                                >
                                    <MessageCircle size={22} fill="currentColor" />
                                </button>
                                <button
                                    onClick={copyLink}
                                    className="flex items-center justify-center w-12 h-12 rounded-full border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-sm cursor-pointer hover:scale-110"
                                    title="リンクをコピー"
                                >
                                    <LinkIcon size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-zinc-100/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex flex-col-reverse md:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={reset}
                            className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-xl border-2 border-zinc-200 bg-white px-8 py-4 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 active:scale-95"
                        >
                            別の画像を試す
                        </button>
                        <a
                            href={results[0]?.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-black px-8 py-4 text-sm font-bold text-white transition-all hover:bg-zinc-800 hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-zinc-200 active:scale-95"
                        >
                            {results[0]?.name} の関連作品を見る（DMMへ）
                            <ChevronRight size={16} />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
