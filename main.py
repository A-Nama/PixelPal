import os
import json
import httpx
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

app = FastAPI()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class VibeCheckRequest(BaseModel):
    text: str

@app.post("/vibe-check")
async def vibe_check(data: VibeCheckRequest):
    # Check if the API key is loaded
    if not GEMINI_API_KEY:
        return {"error": "GEMINI_API_KEY not found. Please set it in your .env file."}

    prompt = f"""
You're an emotionally intelligent writing assistant. Analyze the tone of this message, then suggest 3 rewrites:
- One more professional
- One more friendly
- One more concise

Respond ONLY with a valid JSON object in the following format:
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
        # The new Gemini API uses x-goog-api-key instead of Bearer token
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }

    body = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }
    
    # Updated Gemini API endpoint
    api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                api_url,
                headers=headers,
                json=body
            )
            response.raise_for_status()  # This will raise an error for bad responses (4xx or 5xx)
            gemini_response = response.json()

        # Safely extract and parse the JSON from the text response
        text_output = gemini_response['candidates'][0]['content']['parts'][0]['text']
        
        # Clean up the response to ensure it's valid JSON
        json_str = text_output.strip().replace("```json", "").replace("```", "")
        
        result = json.loads(json_str) # Replaced eval() with json.loads() for security
        return result
        
    except httpx.HTTPStatusError as e:
        return {"error": "API request failed", "details": str(e.response.text)}
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        return {"error": "Failed to parse the Gemini AI response", "details": str(e), "raw_response": gemini_response.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')}
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}