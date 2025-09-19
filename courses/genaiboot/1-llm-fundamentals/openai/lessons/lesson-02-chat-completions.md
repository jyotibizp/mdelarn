# Lesson 2: Chat Completions Deep Dive 💬

## Learning Objectives
- Master the chat completions API format
- Understand all parameters and their effects
- Implement streaming responses
- Manage conversation context effectively

---

## 1. Message Format Fundamentals

### The Three Roles

```python
from openai import OpenAI
client = OpenAI()

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What's the capital of France?"},
    {"role": "assistant", "content": "The capital of France is Paris."},
    {"role": "user", "content": "Tell me more about it."}
]
```

### Role Explanations

| Role | Purpose | Example Use |
|------|---------|-------------|
| **system** | Sets AI behavior and context | "You are a Python expert" |
| **user** | User's input/questions | "Write a sorting function" |
| **assistant** | AI's responses | "Here's a quicksort implementation..." |

### System Message Best Practices

```python
# Effective system messages
good_system_messages = [
    "You are a helpful coding assistant. Always provide commented code.",
    "You are a medical information assistant. Always remind users to consult professionals.",
    "You are a creative writing coach. Be encouraging and provide specific feedback."
]

# Test different system messages
def test_system_message(system_msg, user_query):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_query}
        ]
    )
    return response.choices[0].message.content

# Example
query = "How do I improve my writing?"
for sys_msg in good_system_messages[:1]:
    print(f"System: {sys_msg[:50]}...")
    print(f"Response: {test_system_message(sys_msg, query)[:100]}...\n")
```

---

## 2. Key Parameters Explained

### Temperature: Creativity Control

```python
def demonstrate_temperature(prompt, temperatures=[0, 0.5, 1.0, 1.5]):
    """Show how temperature affects output randomness"""
    for temp in temperatures:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=temp,
            max_tokens=50
        )
        print(f"Temperature {temp}: {response.choices[0].message.content}\n")

# Test it
demonstrate_temperature("Write a tagline for a coffee shop")
```

### Max Tokens: Length Control

```python
def demonstrate_max_tokens(prompt, token_limits=[10, 50, 150]):
    """Show how max_tokens limits response length"""
    for limit in token_limits:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=limit
        )
        content = response.choices[0].message.content
        finish_reason = response.choices[0].finish_reason
        print(f"Max tokens: {limit}")
        print(f"Response: {content}")
        print(f"Finish reason: {finish_reason}\n")

demonstrate_max_tokens("Explain machine learning")
```

### Top-p: Nucleus Sampling

```python
def demonstrate_top_p(prompt, top_p_values=[0.1, 0.5, 0.9, 1.0]):
    """Show how top_p affects word choice diversity"""
    for top_p in top_p_values:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            top_p=top_p,
            temperature=0.8,  # Keep temperature constant
            max_tokens=30
        )
        print(f"Top-p {top_p}: {response.choices[0].message.content}\n")

demonstrate_top_p("The future of technology is")
```

### Complete Parameter Reference

```python
def advanced_completion(prompt):
    """Demonstrate all available parameters"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],

        # Generation parameters
        temperature=0.7,          # 0-2, creativity level
        max_tokens=150,          # Maximum response length
        top_p=0.9,              # Nucleus sampling threshold

        # Control parameters
        n=2,                    # Number of completions to generate
        stop=["\n\n", "END"],   # Stop sequences
        presence_penalty=0.5,   # Reduce repetition (-2 to 2)
        frequency_penalty=0.3,  # Penalize frequent tokens (-2 to 2)

        # Metadata
        user="user123",         # For tracking
        seed=42,               # For reproducibility (Beta)

        # Response format
        response_format={"type": "json_object"},  # Force JSON output
    )

    return response

# Note: Some parameters may not work together (e.g., streaming with n>1)
```

---

## 3. Streaming Responses

### Basic Streaming

```python
def stream_response(prompt):
    """Stream response token by token"""
    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )

    collected_content = []
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            content = chunk.choices[0].delta.content
            print(content, end="", flush=True)
            collected_content.append(content)

    return "".join(collected_content)

# Test streaming
result = stream_response("Write a haiku about programming")
```

### Advanced Streaming with Progress

```python
import sys
import time

class StreamingChatbot:
    def __init__(self, model="gpt-3.5-turbo"):
        self.client = OpenAI()
        self.model = model

    def stream_with_stats(self, prompt):
        """Stream with token counting and timing"""
        start_time = time.time()
        token_count = 0

        stream = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            stream=True
        )

        print("Response: ", end="")
        full_response = []

        for chunk in stream:
            if chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                print(content, end="", flush=True)
                full_response.append(content)
                token_count += 1

        elapsed = time.time() - start_time
        print(f"\n\nStats:")
        print(f"- Tokens: ~{token_count}")
        print(f"- Time: {elapsed:.2f}s")
        print(f"- Speed: ~{token_count/elapsed:.1f} tokens/sec")

        return "".join(full_response)

# Usage
bot = StreamingChatbot()
bot.stream_with_stats("Explain recursion with an example")
```

---

## 4. Context Management

### Conversation History Management

```python
class ConversationManager:
    def __init__(self, model="gpt-3.5-turbo", max_history=10):
        self.client = OpenAI()
        self.model = model
        self.messages = []
        self.max_history = max_history

    def add_system_message(self, content):
        """Set or update system message"""
        if self.messages and self.messages[0]["role"] == "system":
            self.messages[0]["content"] = content
        else:
            self.messages.insert(0, {"role": "system", "content": content})

    def add_user_message(self, content):
        """Add user message to history"""
        self.messages.append({"role": "user", "content": content})
        self._trim_history()

    def add_assistant_message(self, content):
        """Add assistant message to history"""
        self.messages.append({"role": "assistant", "content": content})
        self._trim_history()

    def _trim_history(self):
        """Keep conversation within token/message limits"""
        # Keep system message + last max_history messages
        if len(self.messages) > self.max_history + 1:
            system = [m for m in self.messages if m["role"] == "system"]
            recent = self.messages[-(self.max_history):]
            self.messages = system + recent

    def get_response(self, user_input):
        """Get response maintaining context"""
        self.add_user_message(user_input)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=self.messages
        )

        assistant_response = response.choices[0].message.content
        self.add_assistant_message(assistant_response)

        return assistant_response

    def reset(self):
        """Clear conversation history"""
        self.messages = []

    def get_token_count(self):
        """Estimate token count of current context"""
        import tiktoken
        encoding = tiktoken.encoding_for_model(self.model)
        text = " ".join([m["content"] for m in self.messages])
        return len(encoding.encode(text))

# Usage example
convo = ConversationManager()
convo.add_system_message("You are a helpful Python tutor.")

# Multi-turn conversation
responses = []
questions = [
    "What are Python decorators?",
    "Can you show me a simple example?",
    "How do they differ from regular functions?"
]

for q in questions:
    print(f"User: {q}")
    response = convo.get_response(q)
    print(f"Assistant: {response[:100]}...\n")
    print(f"Context tokens: ~{convo.get_token_count()}\n")
```

### Context Window Optimization

```python
class SmartContextManager:
    """Intelligent context management with summarization"""

    def __init__(self, max_tokens=4000):
        self.client = OpenAI()
        self.max_tokens = max_tokens
        self.messages = []
        self.summary = None

    def should_summarize(self):
        """Check if context needs summarization"""
        import tiktoken
        encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
        current_tokens = sum(
            len(encoding.encode(m["content"]))
            for m in self.messages
        )
        return current_tokens > self.max_tokens * 0.7

    def summarize_context(self):
        """Create summary of conversation so far"""
        if len(self.messages) < 4:
            return

        # Get summary of earlier messages
        history = "\n".join([
            f"{m['role']}: {m['content'][:100]}..."
            for m in self.messages[:-2]
        ])

        summary_prompt = f"Summarize this conversation concisely:\n{history}"

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": summary_prompt}],
            max_tokens=200
        )

        self.summary = response.choices[0].message.content

        # Keep only recent messages
        self.messages = self.messages[-2:]

        # Add summary as context
        if self.summary:
            self.messages.insert(0, {
                "role": "system",
                "content": f"Previous conversation summary: {self.summary}"
            })

# Example usage
smart_manager = SmartContextManager()
```

---

## 5. Advanced Patterns

### Response Formatting

```python
def get_structured_response(prompt, format_type="json"):
    """Get response in specific format"""

    format_instructions = {
        "json": "Respond with valid JSON only.",
        "markdown": "Format your response in markdown.",
        "bullet": "Respond with bullet points only.",
        "code": "Respond with code only, no explanations."
    }

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": format_instructions.get(format_type, "")},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3  # Lower temperature for structured output
    )

    return response.choices[0].message.content

# Examples
result = get_structured_response(
    "List 3 Python best practices",
    format_type="json"
)
print(result)
```

### Retry Logic with Exponential Backoff

```python
import time
import random

def robust_completion(messages, max_retries=3):
    """Completion with retry logic and exponential backoff"""

    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            return response

        except Exception as e:
            if attempt == max_retries - 1:
                raise e

            wait_time = (2 ** attempt) + random.uniform(0, 1)
            print(f"Error: {e}. Retrying in {wait_time:.1f}s...")
            time.sleep(wait_time)

    return None
```

---

## 🧪 Practice Exercises

### Exercise 1: Parameter Explorer
Build an interactive tool to test different parameters:

```python
def parameter_playground():
    """
    Create an interactive CLI to test parameters
    Allow user to adjust temperature, max_tokens, etc.
    """
    # Your code here
    pass
```

### Exercise 2: Smart Chatbot
Create a chatbot that maintains context intelligently:

```python
class SmartChatbot:
    """
    Implement:
    - Context management
    - Token counting
    - Auto-summarization
    - Response caching
    """
    # Your code here
    pass
```

### Exercise 3: Streaming UI
Build a streaming response handler with progress bar:

```python
def stream_with_progress(prompt):
    """
    Show streaming response with:
    - Progress indicator
    - Token counter
    - Time elapsed
    """
    # Your code here
    pass
```

---

## 📝 Assignment

Build a **Multi-Mode Chat Application** that includes:

1. **Different conversation modes:**
   - Creative (high temperature)
   - Precise (low temperature)
   - Balanced (medium settings)

2. **Features:**
   - Streaming responses
   - Context management
   - Token counting and limits
   - Export conversation to JSON/Markdown

3. **Bonus:**
   - Add response regeneration
   - Implement conversation branching
   - Add cost tracking

**Starter Template:**
```python
class MultiModeChatApp:
    def __init__(self):
        self.client = OpenAI()
        self.modes = {
            "creative": {"temperature": 1.2, "top_p": 0.95},
            "precise": {"temperature": 0.3, "top_p": 0.5},
            "balanced": {"temperature": 0.7, "top_p": 0.85}
        }
        self.current_mode = "balanced"
        self.conversation = []

    def set_mode(self, mode):
        # Implementation here
        pass

    def chat(self, user_input, stream=False):
        # Implementation here
        pass

    def export_conversation(self, format="json"):
        # Implementation here
        pass

if __name__ == "__main__":
    app = MultiModeChatApp()
    # CLI interface here
```

---

## 🔍 Common Pitfalls

| Issue | Problem | Solution |
|-------|---------|----------|
| Token overflow | Context exceeds model limit | Implement trimming/summarization |
| Inconsistent responses | High temperature | Lower temperature for consistency |
| Cut-off responses | max_tokens too low | Increase or remove limit |
| Slow streaming | Network/buffering | Adjust chunk size, flush output |
| Lost context | Poor history management | Implement proper message tracking |

---

## 📊 Performance Tips

1. **Optimize for Speed:**
   - Use streaming for better UX
   - Cache common responses
   - Use smaller models when possible

2. **Optimize for Quality:**
   - Provide clear system messages
   - Use appropriate temperature
   - Include relevant examples

3. **Optimize for Cost:**
   - Trim unnecessary context
   - Set appropriate max_tokens
   - Use GPT-3.5 for simple tasks

---

## ✅ Checklist

Before moving to Lesson 3, ensure you can:
- [ ] Use all three message roles effectively
- [ ] Control output with parameters
- [ ] Implement streaming responses
- [ ] Manage conversation context
- [ ] Handle errors gracefully
- [ ] Optimize for different use cases

---

**Next**: [Lesson 3: Embeddings and Vector Operations](./lesson-03-embeddings.md) →