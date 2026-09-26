import json
import os

FILE = "memory.json"

def load_memory():

    if not os.path.exists(FILE):
        return {}

    with open(FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_all(data):

    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(
            data,
            f,
            indent=2,
            ensure_ascii=False
        )

def get_memory(conversation_id):

    data = load_memory()

    return data.get(
        conversation_id,
        []
    )[-30:]

def save_message(
    conversation_id,
    role,
    content
):

    data = load_memory()

    if conversation_id not in data:
        data[conversation_id] = []

    data[conversation_id].append({
        "role": role,
        "content": content
    })

    save_all(data)
