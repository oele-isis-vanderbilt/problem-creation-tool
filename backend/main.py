from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from prompt_engineering import build_conversation_messages
from utils.chat_completion import call_chat_completion
from utils.memory import get_chat_history, update_chat_history

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return {"message": "Math Chatbot API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/chat")
async def chat(request: Request):
    try:
        body = await request.json()
        prompt_data = body.get("prompt", {})
        session_id = body.get("sessionId", "default")

        user_question = prompt_data.get("userQuestion", "")
        problem_context_raw = prompt_data.get("problemContext", {})
        problem_id = problem_context_raw.get("problemId")

        if not user_question.strip():
            return JSONResponse(status_code=400, content={"error": "Question cannot be empty"})

        problem_context = {
            "problemId": problem_id,
            "problemText": problem_context_raw.get("problemText", ""),
            "problemType": problem_context_raw.get("problemType", ""),
            "difficulty": problem_context_raw.get("difficulty", ""),
            "misconceptions": problem_context_raw.get("misconceptions", []),
            "tags": problem_context_raw.get("tags", [])
        }
        print("problemText:", problem_context.get("problemText"))

        history = get_chat_history(session_id, problem_id)
        trimmed_history = history[-6:]

        messages = build_conversation_messages(user_question, problem_context, trimmed_history)
        print("Final prompt messages:", messages)
        reply = call_chat_completion(messages)

        updated_history = history + [
            {"type": "user", "message": user_question},
            {"type": "assistant", "message": reply or "⚠️ The tutor didn't respond. Please try again."}
        ]

        update_chat_history(session_id, problem_id, updated_history)

        return JSONResponse(content={"response": reply})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})