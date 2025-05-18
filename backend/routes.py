from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import json
import tempfile
import os
from typing import List

import config

from google import genai

router = APIRouter()
client = genai.Client(api_key=config.GOOGLE_API_KEY)


@router.post("/api/extract")
async def extract_entities(files: List[UploadFile] = File(...), schema: str = Form(...)):
    try:
        schema_dict = json.loads(schema)
        results = []
        # Process each uploaded file
        for file in files:
            suffix = os.path.splitext(file.filename)[1] or None
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                content = await file.read()
                tmp.write(content)
                tmp_path = tmp.name
            try:
                myfile = client.files.upload(file=tmp_path)
            finally:
                os.remove(tmp_path)
            # Call model for this file
            response = client.models.generate_content(
                model=config.GOOGLE_GENAI_MODEL,
                contents=["Extract entities from this file", myfile],
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': schema_dict,
                },  # type: ignore
            )
            # Parse response text to JSON
            try:
                parsed = json.loads(response.text)
            except:
                parsed = response.text
            results.append(parsed)
        return JSONResponse(content={"results": results})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

