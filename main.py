import requests
from io import BytesIO
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import Image
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


@fastapi.get("/operateimage/{operation}/{image_path}")
async def operate_image(image_path: str, operation: str, request: Request):
    async with httpx.AsyncClient() as client:
        resp = await client.request(
            method=request.method,
            url=f"http://127.0.0.1:8000/{operation}/{image_path}",
            headers=request.headers.raw,
            content=await request.body()
        )
        return resp.blob()





#this is just a dummy endpoint, i still need to figure out how to make a copy of the original image after cropping it, also need to rename it, but the main logic is ok.
@fastapi.get("/crop/{image_url}/{crop_amount1}/{crop_amount2}/{crop_amount3}/{crop_amount4}")
async def crop_image(image_url: str, crop_amount1: int, crop_amount2: int, crop_amount3: int, crop_amount4: int):
    response = requests.get(image_url)
    if response.status_code == 200:
        image_data = BytesIO(response.content)
        im = Image.open(image_data)
        box = (crop_amount1, crop_amount2, crop_amount3, crop_amount4)
        cropped_image = im.paste(region, box)
        return FileResponse(cropped_image, media_type="image/jpeg")


@fastapi.get("/rotate/{image_url}")
async def rotate_image(image_url: str):
    response = requests.get(image_url)
    if response.status_code == 200:
        image_data = BytesIO(response.content)
        im = Image.open(image_data)
        rotated_image = im.rotate(angle=90)
        return FileResponse(rotated_image, media_type="image/jpeg")
