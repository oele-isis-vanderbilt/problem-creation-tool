from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from problems import load_problems_database
from prompt_engineering import build_conversation_messages
from llm_utils import call_chat_completion

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

problems_db = load_problems_database()

@app.get("/")
async def root():
    return {"message": "Math Chatbot API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "problems_loaded": len(problems_db.get("problems", []))}

@app.get("/problems")
async def get_problems():
    return problems_db

@app.post("/chat")
async def chat(request: Request):
    try:
        body = await request.json()
        prompt_data = body.get("prompt", {})
        user_question = prompt_data.get("userQuestion", "")
        problem_context = prompt_data.get("problemContext", {})
        chat_history = prompt_data.get("chatHistory", [])

        if not user_question.strip():
            return JSONResponse(status_code=400, content={"error": "Question cannot be empty"})

        messages, problem_data = build_conversation_messages(user_question, problem_context, chat_history, problems_db)
        reply = call_chat_completion(messages)

        return JSONResponse(content={
            "response": reply,
            "problem_found": problem_data is not None,
            "problem_id": problem_data.get("id") if problem_data else None
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
