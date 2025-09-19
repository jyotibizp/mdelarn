# Lesson 4: Function Calling and Tools 🛠️

## Learning Objectives
- Understand function calling in OpenAI models
- Define and use custom functions
- Build AI agents with tool use
- Implement multi-step reasoning
- Create production-ready assistants

---

## 1. Introduction to Function Calling

Function calling allows GPT models to generate structured outputs that can trigger specific functions in your code. This enables AI to interact with external systems, APIs, and databases.

### Basic Function Calling

```python
from openai import OpenAI
import json
from typing import List, Dict, Any

client = OpenAI()

def basic_function_calling():
    """Demonstrate basic function calling"""

    # Define function specification
    functions = [
        {
            "name": "get_weather",
            "description": "Get the current weather in a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "Temperature unit"
                    }
                },
                "required": ["location"]
            }
        }
    ]

    # Make API call with functions
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "What's the weather in New York?"}
        ],
        functions=functions,
        function_call="auto"  # Let model decide when to call functions
    )

    # Check if model wants to call a function
    message = response.choices[0].message

    if message.function_call:
        print(f"Function to call: {message.function_call.name}")
        print(f"Arguments: {message.function_call.arguments}")

        # Parse arguments
        args = json.loads(message.function_call.arguments)
        print(f"Parsed args: {args}")

basic_function_calling()
```

### Function Call Response Flow

```python
def complete_function_flow():
    """Complete flow with function execution"""

    # Step 1: Define function
    def get_weather(location: str, unit: str = "celsius") -> Dict:
        """Mock weather function"""
        # In reality, this would call a weather API
        weather_data = {
            "New York": {"temp": 72, "condition": "sunny"},
            "London": {"temp": 15, "condition": "cloudy"},
            "Tokyo": {"temp": 28, "condition": "rainy"}
        }

        data = weather_data.get(location, {"temp": 20, "condition": "unknown"})

        if unit == "fahrenheit" and location != "New York":
            data["temp"] = data["temp"] * 9/5 + 32

        return data

    functions = [
        {
            "name": "get_weather",
            "description": "Get current weather",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["location"]
            }
        }
    ]

    # Step 2: Initial request
    messages = [
        {"role": "user", "content": "What's the weather like in Tokyo and London?"}
    ]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        functions=functions,
        function_call="auto"
    )

    # Step 3: Handle function calls
    assistant_message = response.choices[0].message
    messages.append(assistant_message.dict())

    # Execute functions if called
    if assistant_message.function_call:
        function_name = assistant_message.function_call.name
        arguments = json.loads(assistant_message.function_call.arguments)

        # Execute function
        if function_name == "get_weather":
            result = get_weather(**arguments)

            # Step 4: Send function result back
            messages.append({
                "role": "function",
                "name": function_name,
                "content": json.dumps(result)
            })

            # Step 5: Get final response
            final_response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )

            print("Final response:", final_response.choices[0].message.content)

complete_function_flow()
```

---

## 2. Advanced Function Definitions

### Multiple Functions

```python
class AdvancedFunctionCaller:
    """Handler for multiple functions"""

    def __init__(self):
        self.client = OpenAI()
        self.functions = self._define_functions()

    def _define_functions(self):
        """Define available functions"""
        return [
            {
                "name": "calculate",
                "description": "Perform mathematical calculations",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "expression": {
                            "type": "string",
                            "description": "Mathematical expression to evaluate"
                        }
                    },
                    "required": ["expression"]
                }
            },
            {
                "name": "search_web",
                "description": "Search the web for information",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "Search query"
                        },
                        "num_results": {
                            "type": "integer",
                            "description": "Number of results to return",
                            "default": 5
                        }
                    },
                    "required": ["query"]
                }
            },
            {
                "name": "send_email",
                "description": "Send an email",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "to": {
                            "type": "string",
                            "description": "Recipient email address"
                        },
                        "subject": {
                            "type": "string",
                            "description": "Email subject"
                        },
                        "body": {
                            "type": "string",
                            "description": "Email body"
                        }
                    },
                    "required": ["to", "subject", "body"]
                }
            }
        ]

    def calculate(self, expression: str) -> float:
        """Safe math evaluation"""
        try:
            # In production, use a safe math parser
            result = eval(expression, {"__builtins__": {}}, {})
            return result
        except:
            return "Error evaluating expression"

    def search_web(self, query: str, num_results: int = 5) -> List[Dict]:
        """Mock web search"""
        # In reality, would use a search API
        return [
            {"title": f"Result {i+1} for {query}", "url": f"http://example.com/{i}"}
            for i in range(num_results)
        ]

    def send_email(self, to: str, subject: str, body: str) -> Dict:
        """Mock email sending"""
        # In reality, would use email service
        print(f"[Mock] Sending email to {to}")
        print(f"Subject: {subject}")
        print(f"Body: {body[:100]}...")
        return {"status": "sent", "message_id": "mock_123"}

    def execute_function(self, function_name: str, arguments: Dict) -> Any:
        """Execute a function by name"""
        function_map = {
            "calculate": self.calculate,
            "search_web": self.search_web,
            "send_email": self.send_email
        }

        if function_name in function_map:
            return function_map[function_name](**arguments)
        else:
            return {"error": f"Unknown function: {function_name}"}

    def process_request(self, user_input: str):
        """Process user request with function calling"""
        messages = [
            {"role": "system", "content": "You are a helpful assistant with access to tools."},
            {"role": "user", "content": user_input}
        ]

        # Initial API call
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            functions=self.functions,
            function_call="auto"
        )

        assistant_message = response.choices[0].message
        messages.append(assistant_message.dict())

        # Handle function calls
        while assistant_message.function_call:
            function_name = assistant_message.function_call.name
            arguments = json.loads(assistant_message.function_call.arguments)

            print(f"\nCalling function: {function_name}")
            print(f"Arguments: {arguments}")

            # Execute function
            result = self.execute_function(function_name, arguments)

            # Add function result to conversation
            messages.append({
                "role": "function",
                "name": function_name,
                "content": json.dumps(result)
            })

            # Get next response
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                functions=self.functions,
                function_call="auto"
            )

            assistant_message = response.choices[0].message
            messages.append(assistant_message.dict())

        return assistant_message.content

# Example usage
caller = AdvancedFunctionCaller()
result = caller.process_request(
    "Calculate 25 * 4, then search for 'Python tutorials' and send an email to test@example.com with the results"
)
print(f"\nFinal response: {result}")
```

---

## 3. Building AI Agents

### Simple Agent with Memory

```python
from datetime import datetime
from typing import Optional

class AIAgent:
    """AI Agent with memory and tool use"""

    def __init__(self, name: str = "Assistant"):
        self.client = OpenAI()
        self.name = name
        self.memory = []
        self.context = []
        self.tools = self._initialize_tools()

    def _initialize_tools(self):
        """Initialize available tools"""
        return [
            {
                "name": "remember",
                "description": "Store information in memory",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "key": {"type": "string", "description": "Memory key"},
                        "value": {"type": "string", "description": "Information to remember"}
                    },
                    "required": ["key", "value"]
                }
            },
            {
                "name": "recall",
                "description": "Retrieve information from memory",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "key": {"type": "string", "description": "Memory key to recall"}
                    },
                    "required": ["key"]
                }
            },
            {
                "name": "list_memories",
                "description": "List all stored memories",
                "parameters": {"type": "object", "properties": {}}
            }
        ]

    def remember(self, key: str, value: str) -> Dict:
        """Store in memory"""
        self.memory.append({
            "key": key,
            "value": value,
            "timestamp": datetime.now().isoformat()
        })
        return {"status": "remembered", "key": key}

    def recall(self, key: str) -> Dict:
        """Retrieve from memory"""
        for item in reversed(self.memory):
            if item["key"] == key:
                return {"found": True, "value": item["value"], "timestamp": item["timestamp"]}
        return {"found": False, "message": f"No memory found for key: {key}"}

    def list_memories(self) -> Dict:
        """List all memories"""
        return {
            "memories": [{"key": m["key"], "timestamp": m["timestamp"]} for m in self.memory],
            "total": len(self.memory)
        }

    def chat(self, user_input: str) -> str:
        """Chat with the agent"""
        # Add to context
        self.context.append({"role": "user", "content": user_input})

        # Prepare messages with system prompt
        messages = [
            {
                "role": "system",
                "content": f"You are {self.name}, an AI assistant with memory capabilities. "
                          f"You can remember information and recall it later."
            }
        ] + self.context

        # Get response
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            functions=self.tools,
            function_call="auto"
        )

        assistant_message = response.choices[0].message

        # Handle function calls
        while assistant_message.function_call:
            func_name = assistant_message.function_call.name
            func_args = json.loads(assistant_message.function_call.arguments)

            # Execute function
            if func_name == "remember":
                result = self.remember(**func_args)
            elif func_name == "recall":
                result = self.recall(**func_args)
            elif func_name == "list_memories":
                result = self.list_memories()
            else:
                result = {"error": "Unknown function"}

            # Add to context
            self.context.append(assistant_message.dict())
            self.context.append({
                "role": "function",
                "name": func_name,
                "content": json.dumps(result)
            })

            # Get next response
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages + self.context[-2:],
                functions=self.tools,
                function_call="auto"
            )

            assistant_message = response.choices[0].message

        # Add final response to context
        self.context.append(assistant_message.dict())

        # Trim context if too long
        if len(self.context) > 20:
            self.context = self.context[-20:]

        return assistant_message.content

# Example usage
agent = AIAgent(name="MemoryBot")

# Interact with the agent
print(agent.chat("Remember that my favorite color is blue"))
print(agent.chat("Remember that I like Python programming"))
print(agent.chat("What is my favorite color?"))
print(agent.chat("List all the things you remember about me"))
```

### Task-Oriented Agent

```python
import asyncio
from enum import Enum

class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class TaskAgent:
    """Agent that manages and executes tasks"""

    def __init__(self):
        self.client = OpenAI()
        self.tasks = []
        self.tools = self._define_tools()

    def _define_tools(self):
        return [
            {
                "name": "create_task",
                "description": "Create a new task",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "priority": {"type": "string", "enum": ["low", "medium", "high"]}
                    },
                    "required": ["title", "description"]
                }
            },
            {
                "name": "update_task",
                "description": "Update task status",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer"},
                        "status": {"type": "string", "enum": ["pending", "in_progress", "completed"]}
                    },
                    "required": ["task_id", "status"]
                }
            },
            {
                "name": "list_tasks",
                "description": "List all tasks",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "status_filter": {"type": "string", "enum": ["all", "pending", "in_progress", "completed"]}
                    }
                }
            },
            {
                "name": "execute_task",
                "description": "Execute a specific task",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer"}
                    },
                    "required": ["task_id"]
                }
            }
        ]

    def create_task(self, title: str, description: str, priority: str = "medium") -> Dict:
        """Create a new task"""
        task = {
            "id": len(self.tasks),
            "title": title,
            "description": description,
            "priority": priority,
            "status": TaskStatus.PENDING.value,
            "created_at": datetime.now().isoformat()
        }
        self.tasks.append(task)
        return {"success": True, "task_id": task["id"]}

    def update_task(self, task_id: int, status: str) -> Dict:
        """Update task status"""
        if task_id < len(self.tasks):
            self.tasks[task_id]["status"] = status
            return {"success": True, "task_id": task_id, "new_status": status}
        return {"success": False, "error": "Task not found"}

    def list_tasks(self, status_filter: str = "all") -> Dict:
        """List tasks with optional filter"""
        if status_filter == "all":
            filtered_tasks = self.tasks
        else:
            filtered_tasks = [t for t in self.tasks if t["status"] == status_filter]

        return {
            "tasks": filtered_tasks,
            "total": len(filtered_tasks)
        }

    def execute_task(self, task_id: int) -> Dict:
        """Execute a specific task"""
        if task_id >= len(self.tasks):
            return {"success": False, "error": "Task not found"}

        task = self.tasks[task_id]

        # Update status
        task["status"] = TaskStatus.IN_PROGRESS.value

        # Simulate task execution
        print(f"Executing task: {task['title']}")

        # In a real system, this would perform actual task logic
        task["status"] = TaskStatus.COMPLETED.value
        task["completed_at"] = datetime.now().isoformat()

        return {
            "success": True,
            "task_id": task_id,
            "result": f"Task '{task['title']}' completed successfully"
        }

    def process_request(self, request: str) -> str:
        """Process user request with task management"""
        messages = [
            {
                "role": "system",
                "content": "You are a task management assistant. Help users create, track, and execute tasks."
            },
            {"role": "user", "content": request}
        ]

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            functions=self.tools,
            function_call="auto"
        )

        # Handle function calls (similar to previous examples)
        # ... (implementation similar to above)

        return response.choices[0].message.content

# Example usage
task_agent = TaskAgent()
task_agent.create_task("Write documentation", "Create API documentation", "high")
task_agent.create_task("Fix bugs", "Fix reported bugs in issue tracker", "medium")
print(task_agent.list_tasks())
```

---

## 4. Parallel Function Execution

### Handling Multiple Function Calls

```python
class ParallelFunctionExecutor:
    """Execute multiple functions in parallel"""

    def __init__(self):
        self.client = OpenAI()

    async def fetch_data(self, source: str) -> Dict:
        """Async function to fetch data"""
        await asyncio.sleep(1)  # Simulate API call
        return {"source": source, "data": f"Data from {source}"}

    async def process_data(self, data: str) -> Dict:
        """Async function to process data"""
        await asyncio.sleep(0.5)  # Simulate processing
        return {"processed": data.upper()}

    def get_parallel_functions(self):
        """Define functions that can be called in parallel"""
        return [
            {
                "name": "fetch_multiple_sources",
                "description": "Fetch data from multiple sources in parallel",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "sources": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "List of data sources"
                        }
                    },
                    "required": ["sources"]
                }
            }
        ]

    async def fetch_multiple_sources(self, sources: List[str]) -> List[Dict]:
        """Fetch from multiple sources in parallel"""
        tasks = [self.fetch_data(source) for source in sources]
        results = await asyncio.gather(*tasks)
        return results

    async def handle_request(self, user_input: str):
        """Handle request with parallel execution"""
        # Get function call from model
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_input}],
            functions=self.get_parallel_functions(),
            function_call="auto"
        )

        if response.choices[0].message.function_call:
            func_name = response.choices[0].message.function_call.name
            func_args = json.loads(response.choices[0].message.function_call.arguments)

            if func_name == "fetch_multiple_sources":
                results = await self.fetch_multiple_sources(**func_args)
                return results

        return response.choices[0].message.content

# Example usage
executor = ParallelFunctionExecutor()

# Run async function
async def main():
    result = await executor.handle_request(
        "Fetch data from database, api, and cache sources"
    )
    print(result)

# asyncio.run(main())
```

---

## 5. Production Patterns

### Robust Function Handler

```python
from typing import Callable, Optional
import logging

class ProductionFunctionHandler:
    """Production-ready function handling"""

    def __init__(self):
        self.client = OpenAI()
        self.functions = {}
        self.logger = logging.getLogger(__name__)

    def register_function(
        self,
        name: str,
        func: Callable,
        description: str,
        parameters: Dict
    ):
        """Register a function for use"""
        self.functions[name] = {
            "callable": func,
            "spec": {
                "name": name,
                "description": description,
                "parameters": parameters
            }
        }

    def validate_arguments(self, func_spec: Dict, arguments: Dict) -> bool:
        """Validate function arguments against spec"""
        required = func_spec["parameters"].get("required", [])

        for req in required:
            if req not in arguments:
                self.logger.error(f"Missing required argument: {req}")
                return False

        # Type validation could be added here
        return True

    def execute_function_safely(
        self,
        func_name: str,
        arguments: Dict,
        timeout: int = 30
    ) -> Dict:
        """Execute function with error handling"""
        try:
            if func_name not in self.functions:
                return {"error": f"Function {func_name} not found"}

            func_info = self.functions[func_name]

            # Validate arguments
            if not self.validate_arguments(func_info["spec"], arguments):
                return {"error": "Invalid arguments"}

            # Execute with timeout
            import signal

            def timeout_handler(signum, frame):
                raise TimeoutError("Function execution timed out")

            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(timeout)

            try:
                result = func_info["callable"](**arguments)
                signal.alarm(0)  # Cancel alarm
                return {"success": True, "result": result}
            except TimeoutError:
                return {"error": "Function execution timed out"}

        except Exception as e:
            self.logger.exception(f"Error executing function {func_name}")
            return {"error": str(e)}

    def process_with_retry(
        self,
        user_input: str,
        max_retries: int = 3,
        backoff_factor: float = 2.0
    ) -> str:
        """Process request with retry logic"""
        for attempt in range(max_retries):
            try:
                # Get function specs for API call
                function_specs = [f["spec"] for f in self.functions.values()]

                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": user_input}],
                    functions=function_specs,
                    function_call="auto"
                )

                message = response.choices[0].message

                if message.function_call:
                    func_name = message.function_call.name
                    arguments = json.loads(message.function_call.arguments)

                    result = self.execute_function_safely(func_name, arguments)

                    # Return formatted result
                    return json.dumps(result, indent=2)

                return message.content

            except Exception as e:
                wait_time = backoff_factor ** attempt
                self.logger.warning(
                    f"Attempt {attempt + 1} failed: {e}. Retrying in {wait_time}s"
                )
                time.sleep(wait_time)

        return "Max retries exceeded"

# Example usage
handler = ProductionFunctionHandler()

# Register functions
def calculate_discount(price: float, percentage: float) -> float:
    """Calculate discounted price"""
    return price * (1 - percentage / 100)

handler.register_function(
    name="calculate_discount",
    func=calculate_discount,
    description="Calculate discounted price",
    parameters={
        "type": "object",
        "properties": {
            "price": {"type": "number", "description": "Original price"},
            "percentage": {"type": "number", "description": "Discount percentage"}
        },
        "required": ["price", "percentage"]
    }
)

# Process request
result = handler.process_with_retry("What's the price after a 20% discount on $100?")
print(result)
```

---

## 🧪 Practice Exercises

### Exercise 1: Database Agent
Build an agent that can query a database:

```python
class DatabaseAgent:
    """
    Create an agent that can:
    - Connect to a database
    - Execute SQL queries
    - Explain query results
    """
    # Your implementation here
    pass
```

### Exercise 2: Multi-Step Planner
Create an agent that breaks down complex tasks:

```python
class PlannerAgent:
    """
    Build an agent that:
    - Breaks down complex tasks into steps
    - Executes steps in order
    - Handles dependencies between steps
    """
    # Your implementation here
    pass
```

### Exercise 3: API Integration Agent
Build an agent that integrates with external APIs:

```python
class APIAgent:
    """
    Implement an agent that can:
    - Call REST APIs
    - Handle authentication
    - Process responses
    """
    # Your implementation here
    pass
```

---

## 📝 Assignment

Build a **Personal Assistant Agent** with these capabilities:

1. **Core Features:**
   - Calendar management (add, view, modify events)
   - Todo list management
   - Web search capability
   - Email drafting
   - Weather information

2. **Advanced Features:**
   - Natural language scheduling ("Schedule a meeting with John next Tuesday at 2pm")
   - Contextual awareness (remembers previous interactions)
   - Multi-step task execution
   - Parallel function execution

3. **UI:**
   - CLI interface with rich formatting
   - Conversation history
   - Function execution logs

**Starter Template:**
```python
import click
from rich.console import Console
from rich.table import Table

class PersonalAssistant:
    def __init__(self):
        self.client = OpenAI()
        self.console = Console()
        self.tools = self._initialize_tools()
        self.calendar = []
        self.todos = []

    def _initialize_tools(self):
        # Define all available tools
        pass

    def add_calendar_event(self, title, date, time, duration):
        # Implementation
        pass

    def add_todo(self, task, priority="medium"):
        # Implementation
        pass

    def search_web(self, query):
        # Implementation
        pass

    def get_weather(self, location):
        # Implementation
        pass

    def chat(self, message):
        # Main chat interface
        pass

@click.command()
def main():
    """Personal AI Assistant"""
    assistant = PersonalAssistant()
    assistant.console.print("[bold green]Personal AI Assistant[/bold green]")

    while True:
        user_input = click.prompt("You")
        if user_input.lower() in ["exit", "quit"]:
            break

        response = assistant.chat(user_input)
        assistant.console.print(f"[cyan]Assistant:[/cyan] {response}")

if __name__ == "__main__":
    main()
```

---

## ✅ Checklist

Before moving to Lesson 5, ensure you can:
- [ ] Define and use functions with GPT models
- [ ] Handle function responses properly
- [ ] Build agents with multiple tools
- [ ] Implement error handling and retries
- [ ] Create production-ready function handlers
- [ ] Execute functions safely with validation

---

**Next**: [Lesson 5: Advanced Features](./lesson-05-advanced.md) →