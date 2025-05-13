from fastapi import APIRouter, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse
import json

import config

from google import genai

router = APIRouter()
client = genai.Client(api_key=config.GOOGLE_API_KEY)


@router.post("/api/extract")
async def extract_entities(file: UploadFile = File(...), schema: str = Form(...)):
    try:
        # Save uploaded file to a temp location
        contents = await file.read()
        with open(file.filename, "wb") as f:
            f.write(contents)
        # Upload file to Google GenAI
        myfile = client.files.upload(file=file.filename)
        # Parse schema
        schema_dict = json.loads(schema)
        # Use the uploaded file in the model call
        response = client.models.generate_content(
            model=config.GOOGLE_GENAI_MODEL,
            contents=["Extract entities from this file", myfile],
            config={
                'response_mime_type': 'application/json',
                'response_schema': schema_dict,
            },
        )
        return JSONResponse(content={"result": response.text})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


