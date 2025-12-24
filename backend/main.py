import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

# 1. Környezeti változók betöltése (.env fájlból helyben, vagy Render beállításaiból élesben)
load_dotenv()

# 2. API kliens inicializálása
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

app = FastAPI()

# 3. CORS beállítása (hogy a GitHub Pages-en lévő frontend elérhesse a backendet)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudyRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "A backend fut!"}

@app.post("/analyze")
async def analyze_text(request: StudyRequest):
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "Te egy profi tanulási segéd vagy. Foglald össze a szöveget pontokba szedve, majd készíts 3 kvízkérdést magyar nyelven."
                },
                {
                    "role": "user",
                    "content": request.text
                }
            ],
        )
        return {"analysis": completion.choices[0].message.content}
    except Exception as e:
        return {"analysis": f"Hiba történt: {str(e)}"}

# 4. Render specifikus indítás
if __name__ == "__main__":
    import uvicorn
    # A Render a PORT környezeti változón keresztül mondja meg, hol figyeljen a szerver
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)