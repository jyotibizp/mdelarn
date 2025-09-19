import openai
from openai import OpenAI
from dotenv import load_dotenv
import os

print(f"OpenAI version: {openai.__version__}")

# Load environment variables
load_dotenv()

# Initialize client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# Simple completion
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Say hello to OpenAI!"}
    ]
)

print(response.choices[0].message.content)

# Full response structure
print(f"ID: {response.id}")
print(f"Model: {response.model}")
print(f"Created: {response.created}")
print(f"Usage: {response.usage}")
print(f"Content: {response.choices[0].message.content}")
print(f"Finish reason: {response.choices[0].finish_reason}")