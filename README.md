# 🎀 PixelPal — Your Pixel-Perfect Accountability Companion

PixelPal is a Chrome extension + AI-powered backend that helps you stay intentional, focused, and emotionally aware online. Featuring a cute pixel avatar, it blends productivity with personality to gently guide you back on track when you're distracted or need a little vibe check.

---

## ✨ Features

- Vibe Check: Select any text and get its tone analyzed + rewritten suggestions (professional, friendly, concise).
- Distraction Detection: Detects when you're on time-wasting sites and nudges you.
- Daily Check-ins: Quick morning/night prompts to reflect and stay aligned with your goals.
- Context Menu AI: Right-click on text to get helpful emotional insight or edits.
- Backend with Gemini API: FastAPI server handles tone analysis and rewrites using Google's Gemini models.
- Extremely Cute UI: A pixel avatar you'll actually want to listen to.

---

## How to Run the Project

### Backend Setup

1. Clone the repository and navigate to the backend folder.
2. Install the dependencies using `pip install -r requirements.txt`.
3. Create a `.env` file in the root of the backend and add this line:  
   `GEMINI_API_KEY=your_key_here`
4. Start the FastAPI server using:  
   `uvicorn main:app --reload`
5. The backend will be available at `http://localhost:8000/vibe-check`.

---

### Frontend (Chrome Extension)

1. Navigate to the `extension` folder inside the project.
2. Open Chrome and go to `chrome://extensions`.
3. Enable Developer Mode using the toggle on the top right.
4. Click "Load unpacked" and select the `extension` folder.
5. Make sure the backend server is running to enable vibe check and other AI features.

---

## 📸 Screenshots

![PixelPal UI](https://github.com/user-attachments/assets/2c46f10e-9370-459c-b373-a213b88a9cfa)
![Character](https://github.com/user-attachments/assets/023d6308-6c52-4fac-a298-40e0a6048854)
---

## 🎥 Demo Video

[![Watch the demo](https://youtu.be/dIc9DIMrTls)

---

With love, **Team barbie.dev**

// Go to the branches frontend and backend to see respective code
