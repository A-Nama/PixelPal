from fastapi import FastAPI, Request
from pydantic import BaseModel
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class VibeCheckRequest(BaseModel):
    text: str

@app.post("/vibe-check")
async def vibe_check(data: VibeCheckRequest):
    prompt = f"""
You're an emotionally intelligent writing assistant. Analyze the tone of this message, then suggest 3 rewrites:
- One more professional
- One more friendly
- One more concise

Respond in JSON format:
{{
  "tone": "<tone description>",
  "rewrites": {{
    "professional": "...",
    "friendly": "...",
    "concise": "..."
  }}
}}

Text: "{data.text}"
"""

    headers = {
        "Authorization": f"Bearer {GEMINI_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            headers=headers,
            json=body
        )
        gemini_response = response.json()

    try:
        # Try to extract JSON from the text response
        text_output = gemini_response['candidates'][0]['content']['parts'][0]['text']
        json_start = text_output.find('{')
        json_str = text_output[json_start:]
        result = eval(json_str)  # safest if you validate, but this is a shortcut
        return result
    except Exception as e:
        return {"error": "Failed to parse Gemini response", "details": str(e)}
