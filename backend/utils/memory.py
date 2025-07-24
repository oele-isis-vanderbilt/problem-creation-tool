PERSISTENT_MEMORY = {}

def get_chat_history(session_id, problem_id):
    return PERSISTENT_MEMORY.get(session_id, {}).get(problem_id, [])

def update_chat_history(session_id, problem_id, history):
    if session_id not in PERSISTENT_MEMORY:
        PERSISTENT_MEMORY[session_id] = {}
    PERSISTENT_MEMORY[session_id][problem_id] = history
