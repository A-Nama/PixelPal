# 🎀 PixelPal — Your Pixel-Perfect Accountability Companion

PixelPal is a Chrome extension + AI-powered backend that helps you stay intentional, focused, and emotionally aware online. Featuring a cute pixel avatar, it blends productivity with personality to gently guide you back on track when you're distracted or need a little vibe check.

---

## ✨ Features

- 🧠 Vibe Check: Select any text and get its tone analyzed + rewritten suggestions (professional, friendly, concise).
- 👀 Distraction Detection: Detects when you're on time-wasting sites and nudges you.
- 📅 Daily Check-ins: Quick morning/night prompts to reflect and stay aligned with your goals.
- 🪄 Context Menu AI: Right-click on text to get helpful emotional insight or edits.
- 📊 Backend with Gemini API: FastAPI server handles tone analysis and rewrites using Google's Gemini models.
- 🧩 Extremely Cute UI: A pixel avatar you'll actually want to listen to.

---

## 🧪 How to Run the Project

### ⚙️ Backend Setup

1. Clone the repository and navigate to the backend folder.
2. Install the dependencies using `pip install -r requirements.txt`.
3. Create a `.env` file in the root of the backend and add this line:  
   `GEMINI_API_KEY=your_key_here`
4. Start the FastAPI server using:  
   `uvicorn main:app --reload`
5. The backend will be available at `http://localhost:8000/vibe-check`.

---

### 💻 Frontend (Chrome Extension)

1. Navigate to the `extension` folder inside the project.
2. Open Chrome and go to `chrome://extensions`.
3. Enable Developer Mode using the toggle on the top right.
4. Click "Load unpacked" and select the `extension` folder.
5. Make sure the backend server is running to enable vibe check and other AI features.

---

## 📸 Screenshots

![UI](assets/pixel-ui.png) 
![Vibe Check](assets/vibe-result.png) 

---

## 🎥 Demo Video

[![Watch the demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

---

## 💖 With love,  
**Team barbie.dev**
