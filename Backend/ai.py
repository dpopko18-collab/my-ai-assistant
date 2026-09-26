import os
from openai import AsyncOpenAI
from memory import get_memory, save_message

client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

SYSTEM_PROMPT = """
You are a highly capable personal AI assistant.

Your job is to:
- Understand what the user actually wants.
- Give direct and useful answers.
- Ask questions only when necessary.
- Remember relevant conversation context.
- Explain complicated subjects clearly.
- Help the user plan, learn, code, research, and solve problems.
- Never pretend you completed an action that you did not complete.
- Be honest about uncertainty.
- Adapt your response to the user's level of knowledge.
"""

async def ask_ai(message, conversation_id):

    history = get_memory(conversation_id)

    input_messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    input_messages.extend(history)

    input_messages.append({
        "role": "user",
        "content": message
    })

    response = await client.responses.create(
        model="gpt-5.6",
        input=input_messages
    )

    answer = response.output_text

    save_message(
        conversation_id,
        "user",
        message
    )

    save_message(
        conversation_id,
        "assistant",
        answer
    )

    return answer
