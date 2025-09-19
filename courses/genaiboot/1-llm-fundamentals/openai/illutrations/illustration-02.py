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

def select_model(task_complexity, budget_sensitive=False):
    """Simple model selection helper"""
    if budget_sensitive or task_complexity == "simple":
        return "gpt-3.5-turbo"
    elif task_complexity == "complex":
        return "gpt-4-turbo"
    else:
        return "gpt-3.5-turbo-16k"

# Example usage
simple_model = select_model("simple", budget_sensitive=True)
print(f"Recommended model: {simple_model}")

# Simple completion
response = client.chat.completions.create(
    model=simple_model,
    messages=[
        {"role": "user", "content": "How many grams of protein in one chicken egg"}
    ]
)

print(response.choices[0].message.content)

models = ["gpt-3.5-turbo", "gpt-4-turbo"]
prompt = "Explain quantum computing in one sentence"

for model in models:
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=50
    )
    print(f"\n{model}:")
    print(response.choices[0].message.content)
    print(f"Tokens used: {response.usage.total_tokens}")