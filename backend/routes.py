from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import json

import config

from google import genai

router = APIRouter()
client = genai.Client(api_key=config.GOOGLE_API_KEY)


@router.post("/api/extract")
async def extract_entities(request: Request):
    data = await request.json()
    text = data.get("text", "")
    schema = data.get("schema", {})
    # No need to parse schema, it's already a dict
    try:
        response = client.models.generate_content(
            model=config.GOOGLE_GENAI_MODEL,
            contents=text,
            config={
                'response_mime_type': 'application/json',
                'response_schema': schema,
            },
        )
        return JSONResponse(content={"result": response.text})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


