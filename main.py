from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import FileResponse
from PIL import Image
import os
import httpx

fastapi = FastAPI()

@fastapi.get("/uploadimage/{filename}")
def upload_image(filename: str):
    if os.path.exists(filename):
        return FileResponse(filename, media_type="image/jpeg")
    else:
        return {"message": "file not found bitch!"}


@fastapi.get("/operateimage/{filename}/{operation}")
async def operate_image(filename: str, operation: str, request: Request):
    async with httpx.AsyncClient() as client:
        resp = await client.request(
            method=request.method,
            url=f"http://127.0.0.1:8000/{operation}/{filename}",
            headers=request.headers.raw,
            content=await request.body()
        )
        return resp.blob()
