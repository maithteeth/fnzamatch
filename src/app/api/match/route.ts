import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// レートリミットの設定: 1つのIPにつき、通常は1分間に5回まで
// (※Vercel KVが未設定の場合は一時的にスキップするフェールセーフを入れています)
const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
});

// FastAPI側の推論エンジンのURL
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const image = formData.get('image');

        if (!image) {
            return NextResponse.json(
                { error: 'Image file is required.' },
                { status: 400 }
            );
        }

        // 1. IPアドレスベースのレートリミット (DDoS対策)
        // 開発環境やVercel KVが未設定の場合はスキップ
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
            const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
            const { success } = await ratelimit.limit(ip);

            if (!success) {
                return NextResponse.json(
                    { error: 'リクエストが多すぎます。しばらく待ってから再度お試しください。' },
                    { status: 429 }
                );
            }
        }

        // 1. Python (FastAPI) バックエンドへ画像を送信し、特徴量ベクトルを取得
        console.log("Sending image to FastAPI for inference...");
        const fastApiResponse = await fetch(`${FASTAPI_URL}/extract_vector`, {
            method: 'POST',
            body: formData, // そのまま画像を転送
        });

        if (!fastApiResponse.ok) {
            const errorData = await fastApiResponse.json().catch(() => null);
            console.error("FastAPI Error:", errorData || fastApiResponse.statusText);

            // 顔が検出できなかった場合などの具体的なエラーメッセージをフロントに返す
            const errorMessage = errorData?.detail || 'Failed to extract face features from image.';
            return NextResponse.json(
                { error: errorMessage },
                { status: fastApiResponse.status }
            );
        }

        const { vector, warning } = await fastApiResponse.json();

        if (!vector || !Array.isArray(vector)) {
            throw new Error("Invalid vector format received from inference engine.");
        }
        console.log(`Successfully extracted ${vector.length}-dimensional vector.`);

        // 2. Supabase(pgvector)で類似度検索を行う
        console.log("Querying Supabase pgvector for similar faces...");

        // DBがまだセットアップされていない場合はモックデータを返すためのフラグ
        const USE_MOCK_DB = process.env.USE_MOCK_DB === "true" || true;

        if (USE_MOCK_DB) {
            // --- モックデータ返却処理 (DB完全移行後に削除) ---
            // 実際のベクトル抽出の待機時間（AI推論そのもの）は経過しているため、すぐ返却
            console.log("Returning Mock Data due to USE_MOCK_DB=true");
            const mockResults = [
                {
                    id: 1,
                    name: '美少女キャラクターA',
                    similarity: 0.98,
                    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80',
                    affiliateUrl: 'https://example.com/affiliate/A',
                },
                {
                    id: 2,
                    name: 'クール系お姉さんB',
                    similarity: 0.85,
                    imageUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop&q=80',
                    affiliateUrl: 'https://example.com/affiliate/B',
                },
                {
                    id: 3,
                    name: '癒やし系ヒロインC',
                    similarity: 0.72,
                    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
                    affiliateUrl: 'https://example.com/affiliate/C',
                },
            ];
            return NextResponse.json({ results: mockResults, success: true, warning });
            // ---------------------------------------------
        }

        // --- 実際のDB検索処理 ---
        // vectorize関数の呼び出し。ベクトルの配列を文字列 `[0.1, 0.2, ...]` の形式で渡す
        const vectorString = `[${vector.join(',')}]`;
        const { data: matchedFaces, error: supabaseError } = await supabase
            .rpc('match_faces', {
                query_embedding: vectorString,
                match_threshold: 0.5, // 類似度のしきい値(今回は0.5以上)
                match_count: 5 // 上位5件
            });

        if (supabaseError) {
            console.error("Supabase RPC Error:", supabaseError);
            throw new Error("Failed to query similar faces from database.");
        }

        // 検索結果の整形
        const results = matchedFaces.map((face: any) => ({
            id: face.id,
            name: face.name,
            similarity: face.similarity,
            imageUrl: face.image_url,
            affiliateUrl: face.affiliate_url
        }));

        return NextResponse.json({ results, success: true, warning });

    } catch (error: any) {
        console.error('Match API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
