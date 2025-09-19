# Lesson 1: Getting Started with OpenAI API 🚀

## Learning Objectives
- Set up OpenAI account and API keys
- Install required packages
- Make your first API call
- Understand available models and their use cases

---

## 1. Account Setup

### Creating an OpenAI Account
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API section

### API Key Management

#### Getting Your API Key
```bash
# Navigate to: https://platform.openai.com/settings/organization/api-keys
# Click "Create new secret key"
# Copy and save securely (you won't see it again!)
```

#### Security Best Practices
- **Never commit API keys to Git**
- Use environment variables
- Rotate keys regularly
- Set usage limits

#### Setting Up Environment Variables

**Option 1: .env file**
```bash
# Create .env file in project root
echo "OPENAI_API_KEY=sk-..." > .env

# Add to .gitignore
echo ".env" >> .gitignore
```

**Option 2: System environment**
```bash
# Linux/Mac
export OPENAI_API_KEY="sk-..."

# Windows
set OPENAI_API_KEY=sk-...
```

---

## 2. Installation

### Required Packages
```bash
# Install all the requirements need for the bootcamp
pip install -r requirements.txt # from root of the repo

# OR selectively install only needed for module
# Core package
pip install openai

# Additional useful packages
pip install python-dotenv  # For environment variables
pip install tiktoken       # For token counting
pip install numpy          # For embeddings work
```

### Verify Installation
```python
import openai
print(f"OpenAI version: {openai.__version__}")
```

---

## 3. First API Call

### Basic Setup
```python
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)
```

### Your First Completion
```python
# Simple completion
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Say hello to OpenAI!"}
    ]
)

print(response.choices[0].message.content)
```

### Understanding the Response
```python
# Full response structure
print(f"ID: {response.id}")
print(f"Model: {response.model}")
print(f"Created: {response.created}")
print(f"Usage: {response.usage}")
print(f"Content: {response.choices[0].message.content}")
print(f"Finish reason: {response.choices[0].finish_reason}")
```

---

## 4. Available Models

### GPT Models Comparison

| Model | Use Case | Speed | Cost | Context Window |
|-------|----------|-------|------|----------------|
| gpt-4-turbo | Complex reasoning, analysis | Slower | High | 128K tokens |
| gpt-4 | High-quality outputs | Slow | Highest | 8K tokens |
| gpt-3.5-turbo | General purpose, fast | Fast | Low | 16K tokens |
| gpt-3.5-turbo-16k | Long conversations | Fast | Low | 16K tokens |

### Model Selection Guide
```python
def select_model(task_complexity, budget_sensitive=False):
    """Simple model selection helper"""
    if budget_sensitive or task_complexity == "simple":
        return "gpt-3.5-turbo"
    elif task_complexity == "complex":
        return "gpt-4-turbo"
    else:
        return "gpt-3.5-turbo-16k"

# Example usage
model = select_model("simple", budget_sensitive=True)
print(f"Recommended model: {model}")
```

### Testing Different Models
```python
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
```

---

## 5. Error Handling

### Common Errors and Solutions
```python
from openai import OpenAI, APIError, RateLimitError, APIConnectionError

def safe_api_call(prompt, model="gpt-3.5-turbo", max_retries=3):
    """Robust API call with error handling"""
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}]
            )
            return response

        except RateLimitError as e:
            print(f"Rate limit hit. Waiting...")
            time.sleep(20)

        except APIConnectionError as e:
            print(f"Connection error: {e}")
            time.sleep(5)

        except APIError as e:
            print(f"API error: {e}")
            return None

    return None
```

### Rate Limit Management
```python
import time

class RateLimiter:
    def __init__(self, requests_per_minute=20):
        self.rpm = requests_per_minute
        self.last_request = 0

    def wait_if_needed(self):
        elapsed = time.time() - self.last_request
        min_interval = 60 / self.rpm

        if elapsed < min_interval:
            time.sleep(min_interval - elapsed)

        self.last_request = time.time()

# Usage
limiter = RateLimiter(requests_per_minute=20)

for i in range(5):
    limiter.wait_if_needed()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": f"Test {i}"}]
    )
    print(f"Request {i} completed")
```

---

## 6. Token Management

### Understanding Tokens
```python
import tiktoken

def count_tokens(text, model="gpt-3.5-turbo"):
    """Count tokens for a given text"""
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

# Examples
texts = [
    "Hello world",
    "The quick brown fox jumps over the lazy dog",
    "人工智能" # Non-English text
]

for text in texts:
    tokens = count_tokens(text)
    print(f"'{text}': {tokens} tokens")
```

### Cost Estimation
```python
def estimate_cost(input_tokens, output_tokens, model="gpt-3.5-turbo"):
    """Estimate API call cost"""
    pricing = {
        "gpt-3.5-turbo": {"input": 0.001, "output": 0.002},
        "gpt-4-turbo": {"input": 0.03, "output": 0.06}
    }

    model_pricing = pricing.get(model, pricing["gpt-3.5-turbo"])

    input_cost = (input_tokens / 1000) * model_pricing["input"]
    output_cost = (output_tokens / 1000) * model_pricing["output"]

    return {
        "input_cost": input_cost,
        "output_cost": output_cost,
        "total_cost": input_cost + output_cost
    }

# Example
cost = estimate_cost(100, 200, "gpt-3.5-turbo")
print(f"Estimated cost: ${cost['total_cost']:.4f}")
```

---

## 🧪 Practice Exercises

### Exercise 1: API Key Validator
Create a function that safely validates an API key:

```python
def validate_api_key(api_key=None):
    """
    Validate OpenAI API key
    Returns: (bool, message)
    """
    # Your code here
    pass
```

### Exercise 2: Model Benchmark
Compare response quality and speed across models:

```python
def benchmark_models(prompt, models=["gpt-3.5-turbo", "gpt-4-turbo"]):
    """
    Benchmark different models
    Returns: dict with model performance metrics
    """
    # Your code here
    pass
```

### Exercise 3: Conversation Manager
Build a simple class to manage conversation history:

```python
class ConversationManager:
    def __init__(self, model="gpt-3.5-turbo"):
        self.model = model
        self.history = []

    def add_message(self, role, content):
        # Your code here
        pass

    def get_response(self, user_input):
        # Your code here
        pass
```

---

## 📝 Assignment

Build a **"Getting to Know OpenAI" CLI tool** that:
1. Tests API connection
2. Lists available models
3. Compares response times
4. Estimates costs for different inputs
5. Saves results to a report

**Starter Code:**
```python
import argparse
from openai import OpenAI
import json
import time

def main():
    parser = argparse.ArgumentParser(description="OpenAI API Explorer")
    parser.add_argument("--test", action="store_true", help="Test connection")
    parser.add_argument("--models", action="store_true", help="List models")
    parser.add_argument("--benchmark", type=str, help="Benchmark with prompt")

    args = parser.parse_args()

    # Your implementation here

if __name__ == "__main__":
    main()
```

---

## 🔍 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid API key" | Check environment variable, ensure key starts with "sk-" |
| "Rate limit exceeded" | Implement exponential backoff, upgrade plan |
| "Model not found" | Check model name spelling, ensure access |
| "Connection timeout" | Check internet, try different region |
| "Insufficient quota" | Add payment method, check usage limits |

---

## 📚 Additional Resources

- [OpenAI Quickstart](https://platform.openai.com/docs/quickstart)
- [API Keys Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)
- [Rate Limits Guide](https://platform.openai.com/docs/guides/rate-limits)
- [Token Usage](https://platform.openai.com/docs/guides/tokens)

---

## ✅ Checklist

Before moving to Lesson 2, ensure you can:
- [ ] Create and manage API keys securely
- [ ] Make successful API calls
- [ ] Handle common errors
- [ ] Count tokens and estimate costs
- [ ] Choose appropriate models for tasks

---

**Next**: [Lesson 2: Chat Completions Deep Dive](./lesson-02-chat-completions.md) →