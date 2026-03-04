import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseのURLとAnon Keyを取得（今回はモックなのでダミー値でも動作します）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
【Supabase (pgvector) テーブル作成SQL案】

-- 1. pgvector 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. profiles テーブル（または faces テーブル）の作成
CREATE TABLE IF NOT EXISTS faces (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,                    -- 人物名やキャラクター名
  embedding vector(512),                 -- 顔特徴のベクトルデータ（次元数はモデルに依存）
  image_url text,                        -- サンプル画像やアイコンのURL
  affiliate_url text,                    -- 送客用アフィリエイトリンク
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ベクトル検索用のインデックス作成（パフォーマンス向上のため）
-- IVFFlat や HNSW インデックスが利用可能（以下はHNSWの例）
CREATE INDEX ON faces USING hnsw (embedding vector_cosine_ops);

-- 4. 類似度検索用関数 (RPC) の作成
-- クライアントから vector を渡し、類似度順に取得する
CREATE OR REPLACE FUNCTION match_faces(
  query_embedding vector(512),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  name text,
  image_url text,
  affiliate_url text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    faces.id,
    faces.name,
    faces.image_url,
    faces.affiliate_url,
    1 - (faces.embedding <=> query_embedding) AS similarity
  FROM faces
  WHERE 1 - (faces.embedding <=> query_embedding) > match_threshold
  ORDER BY faces.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
*/
