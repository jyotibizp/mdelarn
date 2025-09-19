import time
import os
from openai import OpenAI
from dotenv import load_dotenv

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
limiter = RateLimiter(requests_per_minute=1)

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

for i in range(5):
    limiter.wait_if_needed()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": f"Test {i}"}]
    )
    print(f"Request {i} completed")