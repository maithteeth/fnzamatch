import os
import json
import requests
import cv2
import numpy as np
import insightface
from insightface.app import FaceAnalysis
from supabase import create_client, Client
from dotenv import load_dotenv, find_dotenv

# 明示的に上位階層にある .env を探して読み込む
load_dotenv(find_dotenv())

# --- 設定値 ---
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("🚨 エラー: .env ファイルに SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が設定されていません。")

# InsightFaceモデル設定
FACE_APP = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
FACE_APP.prepare(ctx_id=0, det_size=(640, 640))

# Supabaseクライアント初期化
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# 1. サンプル用のモックJSONデータ定義 (DMM APIのレスポンスを模倣)
MOCK_DMM_RESPONSE = {
    "result": {
        "status": "200",
        "result_count": 3,
        "total_count": 3,
        "items": [
            {
                "id": "item1001",
                "name": "女優ダミー・ユイ",
                "affiliateURL": "https://al.dmm.co.jp/?lurl=https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=dummy1/",
                "imageURL": {
                    "large": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop&q=80"
                }
            },
            {
                "id": "item1002",
                "name": "女優ダミー・サクラ",
                "affiliateURL": "https://al.dmm.co.jp/?lurl=https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=dummy2/",
                "imageURL": {
                    "large": "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=500&h=500&fit=crop&q=80"
                }
            },
            {
                "id": "item1003",
                "name": "女優ダミー・レイ",
                "affiliateURL": "https://al.dmm.co.jp/?lurl=https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=dummy3/",
                "imageURL": {
                    "large": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop&q=80"
                }
            }
        ]
    }
}


def download_image(url: str) -> np.ndarray:
    """URLから画像をダウンロードし、OpenCV形式のNumPy配列で返す"""
    print(f"Downloading image from: {url}")
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    
    # メモリ上で画像をデコード
    image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    
    if image is None:
        raise ValueError(f"Failed to decode image from URL: {url}")
        
    return image


def extract_face_vector(image: np.ndarray) -> list[float]:
    """InsightFaceを使って画像を解析し、顔の特徴量ベクトル(512次元)を抽出する"""
    faces = FACE_APP.get(image)
    
    if not faces:
        raise ValueError("No faces detected in the image.")
        
    # 複数人検出された場合は、バウンディングボックスの面積が最大の顔を採用
    if len(faces) > 1:
        print(f"Warning: Detected {len(faces)} faces. Selecting the largest one.")
        faces = sorted(faces, key=lambda f: (f.bbox[2]-f.bbox[0]) * (f.bbox[3]-f.bbox[1]), reverse=True)
        
    target_face = faces[0]
    # np.ndarray を Pythonのリストに変換
    return target_face.embedding.tolist()


def upsert_to_supabase(item_id: str, name: str, vector: list[float], image_url: str, affiliate_url: str):
    """Supabaseの 'faces' テーブルへデータをUpsert（挿入or更新）する"""
    vector_str = f"[{','.join(map(str, vector))}]"
    
    try:
        # Supabaseのupsert機能を利用（idが重複する場合は更新）
        # ※facesテーブルの 'item_id' カラムをUNIQUE制約にしておくと安全にupsertできます
        response = supabase.table('faces').upsert({
            "name": name,
            "embedding": vector_str,
            "image_url": image_url,
            "affiliate_url": affiliate_url
            # "item_id": item_id  # ※テーブルにitem_idカラムを追加しておく運用がおすすめです
        }).execute()
        
        print(f"✅ Successfully upserted: {name}")
    except Exception as e:
        print(f"❌ Failed to upsert {name}: {e}")


def main():
    print("Starting Data Collection Batch (Mock DMM API)")
    items = MOCK_DMM_RESPONSE["result"]["items"]
    
    success_count = 0
    
    for item in items:
        item_id = item["id"]
        name = item["name"]
        image_url = item["imageURL"]["large"]
        affiliate_url = item["affiliateURL"]
        
        print(f"\n--- Processing: {name} ({item_id}) ---")
        
        try:
            # 2. JSONから画像URLを取得してダウンロード
            image_np = download_image(image_url)
            
            # 2. 画像から顔特徴量(ベクトル化)を抽出
            vector = extract_face_vector(image_np)
            print(f"Extracted {len(vector)}-dimensional vector for {name}")
            
            # 3. SupabaseへUpsert保存
            upsert_to_supabase(item_id, name, vector, image_url, affiliate_url)
            
            success_count += 1
            
        except Exception as e:
            print(f"🚨 Error processing '{name}': {str(e)}")
            
    print(f"\nBatch completed. Successfully processed {success_count} out of {len(items)} items.")


if __name__ == "__main__":
    main()
