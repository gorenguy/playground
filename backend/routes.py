from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import json
import tempfile
import os

import config

from google import genai

router = APIRouter()
client = genai.Client(api_key=config.GOOGLE_API_KEY)


@router.post("/api/extract")
async def extract_entities(file: UploadFile = File(...), schema: str = Form(...)):
    try:
        # Create a temporary file with the correct suffix for mimetype
        suffix = os.path.splitext(file.filename)[1] or None
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        try:
            # Upload file to Google GenAI (no mime_type argument)
            myfile = client.files.upload(file=tmp_path)
        finally:
            os.remove(tmp_path)
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


