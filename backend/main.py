from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq # Az új könyvtár

import os
from dotenv import load_dotenv
from groq import Groq
# Itt valószínűleg vannak más importjaid is, pl.:
# from fastapi import FastAPI 

# 1. Ez a sor tölti be a .env fájlt
load_dotenv()

# 2. Itt olvassuk be a kulcsot a változóba
# A gsk_... kezdetű szöveget TELJESEN töröld ki innen!
api_key = os.getenv("GROQ_API_KEY")

# 3. A kliens inicializálása a változóval
client = Groq(
    api_key=api_key,
)

# --- INNENTŐL FOLYTATÓDIK A TE EREDETI KÓDOD ---
# Például:
# app = FastAPI()
#
# @app.post("/chat")
# ... stb.

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GROQ BEÁLLÍTÁS ---
client = Groq(
    api_key = os.getenv("GROQ_API_KEY"),
)

class StudyRequest(BaseModel):
    text: str

@app.post("/analyze")
async def analyze_text(request: StudyRequest):
    try:
        # A Llama 3 modellt használjuk, ami ingyenes és nagyon gyors
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", # Ez a legokosabb ingyenes modell náluk
            messages=[
                {
                    "role": "system",
                    "content": "Te egy profi tanulási segéd vagy. Foglald össze a szöveget pontokba szedve, majd készíts 3 kvízkérdést."
                },
                {
                    "role": "user",
                    "content": request.text
                }
            ],
        )
        return {"analysis": completion.choices[0].message.content}
    except Exception as e:
        return {"analysis": f"Hiba: {str(e)}"}

# Indítás: uvicorn main:app --reload --port 8001