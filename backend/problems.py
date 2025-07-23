import json

def load_problems_database(file_path="math_problems.json"):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        print("Warning: math_problems.json not found.")
        return {"problems": []}

def find_problem_by_id(problem_id, problems_db):
    if not problem_id:
        return None
    for problem in problems_db.get("problems", []):
        if problem.get("id") == problem_id:
            return problem
    return None

def get_problem_context_prompt(problem_data):
    if not problem_data:
        return ""
    return f"""
PROBLEM INFORMATION:
- Question: {problem_data.get('question', '')}
- Type: {problem_data.get('type', '')}
- Difficulty: {problem_data.get('difficulty', '')}
- Common Misconceptions: {', '.join(problem_data.get('misconceptions', []))}
- Answer: {problem_data.get('answer', '')}
- Suggested Hints: {'; '.join(problem_data.get('hints', []))}

IMPORTANT: Use this information to provide better hints, but never give the direct answer.
"""
