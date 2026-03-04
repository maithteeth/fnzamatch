import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

# .env ファイルがあれば読み込む
load_dotenv()

# Supabaseの認証情報（本番環境のダッシュボードから取得設定してください）
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ダミーの登録用データ
# 実際の運用では画像フォルダを走査して `api/extract_vector` 等で得たベクトルを保存します
DUMMY_DATA = [
    {
        "name": "女優A",
        # 実際にはここにInsightFaceから取得した512次元のリストが入ります
        # ここではモックとして0.0〜1.0のランダムまたはダミー値512個のリストを用意します
        "embedding": [0.012] * 512,  
        "image_url": "https://example.com/images/a.jpg",
        "affiliate_url": "https://example.com/affiliate/a"
    },
    {
        "name": "女優B",
        "embedding": [0.034] * 512,
        "image_url": "https://example.com/images/b.jpg",
        "affiliate_url": "https://example.com/affiliate/b"
    }
]

def seed_database():
    print(f"Connecting to Supabase at {SUPABASE_URL}...")
    
    for item in DUMMY_DATA:
        # pgvectorプラグインの都合上、リストを文字列として扱う必要がある場合があります。
        # supabase-jsやpython-supabaseのバージョンに依存しますが、
        # 配列のまま渡すか、"[0.012, 0.013...]" のように文字列化して送ります。
        embedding_str = f"[{','.join(map(str, item['embedding']))}]"
        
        try:
            data, count = supabase.table('faces').insert({
                "name": item["name"],
                "embedding": embedding_str,
                "image_url": item["image_url"],
                "affiliate_url": item["affiliate_url"]
            }).execute()
            
            print(f"Successfully inserted: {item['name']}")
        except Exception as e:
            print(f"Failed to insert {item['name']}: {e}")

if __name__ == "__main__":
    # 実行前にSupabase上で `faces` テーブルの作成と
    # pgvector 拡張機能の有効化が完了している必要があります。
    print("Starting data seeding process...")
    seed_database()
    print("Done.")
