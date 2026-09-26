from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai import ask_ai

app = FastAPI(title="My AI Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    conversation_id: str = "default"

@app.get("/")
def home():
    return {"status": "AI is running"}

@app.post("/chat")
async def chat(request: ChatRequest):
    response = await ask_ai(
        request.message,
        request.conversation_id
    )

    return {
        "success": True,
        "response": response
    }
