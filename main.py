import requests
import io
from fastapi import FastAPI, UploadFile, File, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, FileResponse
from PIL import Image, ImageOps
import os
import httpx

fastapi = FastAPI()

origins = [
        "http://localhost:5500"
]

fastapi.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)


@fastapi.get("/uploadimage/{image_path:path}")
def upload_image(image_path: str):
    if os.path.exists(image_path):
        return FileResponse(image_path, media_type="image/jpeg")
    else:
        return {"message": "file not found bitch!"}


@fastapi.get("/operateimage/{operation}/{image_path:path}")
async def operate_image(image_path: str, operation: str, request: Request):
    async with httpx.AsyncClient() as client:
        resp = await client.request(
            method=request.method,
            url=f"http://127.0.0.1:8000/{operation}/{image_path}",
            headers=request.headers.raw,
            content=await request.body()
        )
        return resp.blob()




@fastapi.post("/crop/{crop_amount1}/{crop_amount2}/{crop_amount3}/{crop_amount4}")
async def crop_image(request: Request, crop_amount1: int, crop_amount2: int, crop_amount3: int, crop_amount4: int, image: UploadFile = File(...)):
    original_bytes = await image.read()
    im = Image.open(image.file)
    try:
        cropped_image = ImageOps.crop(im, border=(crop_amount1, crop_amount2, crop_amount3, crop_amount4))
    except ValueError:
        return Response(content=original_bytes, media_type=image.content_type, headers={"detail": "too much crop"})
    #we use the code below to temporarily store the file in the ram (so that we can return it thro http) instead of storing it on the disc.
    buf = io.BytesIO()
    cropped_image.save(buf, format="JPEG")
    buf.seek(0)
    return Response(content=buf.read(), media_type="image/jpeg")


@fastapi.post("/rotate")
async def rotate_image(image: UploadFile = File(...)):
    im = Image.open(image.file)
    #the expand="True" thing is for rotating images with height != width.
    rotated_image = im.rotate(angle=90, expand=True)
    buf =io.BytesIO()
    rotated_image.save(buf, format="JPEG")
    buf.seek(0)
    return Response(content=buf.read(), media_type="image/jpeg")
