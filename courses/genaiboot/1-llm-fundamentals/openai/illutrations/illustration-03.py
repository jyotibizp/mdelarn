import openai
from openai import OpenAI, APIError, RateLimitError, APIConnectionError
from dotenv import load_dotenv
import os
import time

print(f"OpenAI version: {openai.__version__}")

# Load environment variables
load_dotenv()

# Initialize client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

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

response = safe_api_call("2 most preffered colours for casual office shirt")

if response:
    print(response.choices[0].message.content)
else:
    print("API call failed!")