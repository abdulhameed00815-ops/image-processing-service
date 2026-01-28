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
@fastapi.get("/crop/{image_path}/{crop_amount}")
async def crop_image(image_path: str, crop_amount):
    im = Image.open(image_path)
    box = (crop_amount[0], crop_amount[1], crop_amount[2], crop_amount[3])
    cropped_image = im.paste(region, box)
    cropped_image.save("cropped-image.jpg")
