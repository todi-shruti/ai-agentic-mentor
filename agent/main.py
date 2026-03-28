# from fastapi import FastAPI
# from pydantic import BaseModel
# import os
# from openai import OpenAI
# from dotenv import load_dotenv

# load_dotenv()
# app = FastAPI()

# client = OpenAI(
#     api_key=os.getenv("GROQ_API_KEY"),
#     base_url="https://api.groq.com/openai/v1"
# )


# # client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# memory = []

# class Request(BaseModel):
#     message: str

# def create_plan(user_input):
#     return [
#         f"Understand request: {user_input}",
#         "Break into steps",
#         "Generate code",
#         "Explain clearly"
#     ]

# @app.post("/agent")
# async def agent(req: Request):
#     user_input = req.message.lower()

#     # Simple mock responses
#     if "react" in user_input:
#         reply = "React hooks are functions like useState and useEffect that let you use state and lifecycle features in functional components."
#     elif "javascript" in user_input:
#         reply = "JavaScript is a programming language used to build interactive web applications."
#     else:
#         reply = f"You said: {req.message} (This is a mock AI response)"

#     return {"reply": reply}

# # @app.post("/agent")
# # async def agent(req: Request):
# #     try:
# #         response = client.chat.completions.create(
# #             model="gpt-4o-mini",
# #             messages=[
# #                 {"role": "system", "content": "You are a helpful coding mentor"},
# #                 {"role": "user", "content": req.message}
# #             ]
# #         )

# #         return {"reply": response.choices[0].message.content}

# #     except Exception as e:
# #         return {"reply": f"Error: {str(e)}"}

from fastapi import FastAPI
from pydantic import BaseModel
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Groq Client
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

class Request(BaseModel):
    message: str

@app.get("/")
def home():
    return {"message": "AI Agent is running 🚀"}

@app.post("/agent")
async def agent(req: Request):
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Groq model
            messages=[
                {"role": "system", "content": "You are a helpful coding mentor."},
                {"role": "user", "content": req.message}
            ]
        )

        return {"reply": response.choices[0].message.content}

    except Exception as e:
        return {"reply": f"Error: {str(e)}"}