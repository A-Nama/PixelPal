import os
import json
import httpx
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from a .env file for local development
load_dotenv()

app = FastAPI()

# --- Add CORS Middleware ---
# This allows your Chrome extension (or any web frontend) to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, you can restrict this to your extension's ID or domain
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class VibeCheckRequest(BaseModel):
    text: str

# --- Endpoint for the initial analysis ONLY ---
@app.post("/vibe-analysis")
async def vibe_analysis(data: VibeCheckRequest):
    if not GEMINI_API_KEY:
        return {"error": "GEMINI_API_KEY not found. Please set it in your environment."}

    prompt = f"""
You are PixelPal, an emotionally intelligent, super-savvy Gen Z best friend. 
Your user needs you to analyze the vibe of a text they received or are about to send.
Give it to them straight, like you're spilling the tea.

1.  **Vibe:** A short, punchy summary (e.g., "lowkey shady", "super sweet", "giving mixed signals").
2.  **Analysis:** Explain the subtext. What might they *really* mean? Are there any red flags?

Here's the text: "{data.text}"
"""

    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }

    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "response_mime_type": "application/json",
            "response_schema": {
                "type": "OBJECT",
                "properties": {
                    "vibe": {"type": "STRING"},
                    "analysis": {"type": "STRING"}
                }
            }
        }
    }
    
    api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(api_url, headers=headers, json=body)
            response.raise_for_status()
            gemini_response = response.json()

        text_output = gemini_response['candidates'][0]['content']['parts'][0]['text']
        result = json.loads(text_output)
        return result
        
    except httpx.HTTPStatusError as e:
        return {"error": "API request failed", "details": str(e.response.text)}
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        return {"error": "Failed to parse the Gemini AI response", "details": str(e)}
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}


# --- Endpoint for getting the rewrites ONLY ---
@app.post("/vibe-rewrite")
async def vibe_rewrite(data: VibeCheckRequest):
    if not GEMINI_API_KEY:
        return {"error": "GEMINI_API_KEY not found. Please set it in your environment."}

    prompt = f"""
You are PixelPal, an emotionally intelligent writing assistant.
A user wants rewrites for the following text. Provide 3 options:
- One more professional
- One more friendly
- One more concise

Here's the text: "{data.text}"
"""

    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }

    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "response_mime_type": "application/json",
            "response_schema": {
                "type": "OBJECT",
                "properties": {
                    "rewrites": {
                        "type": "OBJECT",
                        "properties": {
                            "professional": {"type": "STRING"},
                            "friendly": {"type": "STRING"},
                            "concise": {"type": "STRING"}
                        }
                    }
                }
            }
        }
    }
    
    api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(api_url, headers=headers, json=body)
            response.raise_for_status()
            gemini_response = response.json()

        text_output = gemini_response['candidates'][0]['content']['parts'][0]['text']
        result = json.loads(text_output)
        return result
        
    except httpx.HTTPStatusError as e:
        return {"error": "API request failed", "details": str(e.response.text)}
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        return {"error": "Failed to parse the Gemini AI response", "details": str(e)}
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}

# --- This block allows you to run the app locally for testing ---
# It's a standard practice for Python web applications.
if __name__ == "__main__":
    # Use the PORT environment variable if it's available, otherwise default to 8000
    port = int(os.environ.get("PORT", 8000))
    # For local testing, we run on 127.0.0.1. Render will use the --host 0.0.0.0 from the start command.
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True)