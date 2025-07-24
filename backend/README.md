# 🧮 Betty's Brain Math Chatbot Backend

This backend powers a warm, encouraging math tutor chatbot designed to help middle school students solve math problems using GPT.

- Uses a supportive tutor persona with prompt engineering
- Responds with hints and scaffolding (never direct answers)
- Integrates problem context, misconceptions, and history

---

## 🚀 Setup

### First Time
```bash
cd backend
cp .env.example .env  
docker-compose up -d --build
```

### Regular Use
```bash
cd backend      
docker-compose up -d      
```

---

## 📁 Project Structure

```
backend/
├── main.py               # FastAPI app and routes
├── prompt_engineering.py # LLM prompt construction
├── utils/
│   ├── chat_completion.py # OpenAI API calls
│   └── memory.py         # Chat history management
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── .env                 # Your API keys (create this)
```