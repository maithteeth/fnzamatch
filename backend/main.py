import os
# Limit threads to reduce memory usage on Render free tier
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import io
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import insightface
from insightface.app import FaceAnalysis

app = FastAPI(title="Face Analyzer API", version="1.0.0")

# CORSの設定（フロントエンドからのリクエストを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では特定のオリジンに絞ることを推奨
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# InsightFaceモデルの初期化 (起動時に一度だけロード)
# name='buffalo_s' は無料枠の512MB RAM制限を回避するための軽量モデルです
face_app = FaceAnalysis(name='buffalo_s', providers=['CPUExecutionProvider'])
face_app.prepare(ctx_id=0, det_size=(640, 640))

@app.post("/extract_vector")
async def extract_vector(image: UploadFile = File(...)):
    """
    アップロードされた画像から顔を検出し、512次元の特徴量ベクトルを返すAPI。
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        # 画像データをメモリ上で読み込む
        contents = await image.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file or format.")

        # InsightFaceで顔検出・特徴量抽出
        faces = face_app.get(img)

        # エラーハンドリング: 顔が検出されない場合
        if len(faces) == 0:
            raise HTTPException(status_code=400, detail="No faces detected in the image.")
        
        # エラーハンドリング: 複数人の顔が検出された場合（最も大きく明瞭な顔を選択する等も可能ですが、ここではシンプルに最大のbboxを基準にするか、エラーにします）
        # モックとして複数検出時はエラーを返す（厳密な1対1判定用）
        if len(faces) > 1:
            # 代替案: bbox（バウンディングボックス）の面積が一番大きい顔を選ぶ
            faces = sorted(faces, key=lambda f: (f.bbox[2]-f.bbox[0]) * (f.bbox[3]-f.bbox[1]), reverse=True)
            # ここでは一番大きい顔一つだけを使うことにします
            face = faces[0]
            warning_msg = "Multiple faces detected. Analyzing the largest face only."
        else:
            face = faces[0]
            warning_msg = None

        # 512次元ベクトル (numpy配列をPythonリストに変換)
        embedding = face.embedding.tolist()

        result = {
            "success": True,
            "vector": embedding,  # 要素数512のfloatリスト
            "dimensions": len(embedding)
        }
        if warning_msg:
            result["warning"] = warning_msg

        return result

    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during image processing.")

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Face Analyzer API is running."}

if __name__ == "__main__":
    import uvicorn
    # 開発環境用の起動スクリプト (実際のCloud Run等ではCMDとして指定)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
