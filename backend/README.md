# Betty's Brain Math Chatbot Backend

This backend powers a warm, encouraging math tutor chatbot that helps middle school students solve math problems using GPT.

The chatbot:
- Uses a supportive tutor persona with prompt engineering
- Responds to student questions with hints and nudges (never direct answers)
- Incorporates a database of problems and misconceptions for context-aware guidance

---

### 🧠 Endpoints

- `GET /` — Status message  
- `GET /health` — Health check + number of loaded problems  
- `GET /problems` — Returns all math problems from `math_problems.json`  
- `POST /chat` — Main endpoint to chat with the tutor  

---

### ⚙️ Installation Instructions

1. Install dependencies

```bash
pip install -r requirements.txt
```


2. Create a .env file in the root directory with your OpenAI API key:
```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

2. Start the server
```bash
uvicorn main:app --reload
```