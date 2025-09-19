# Lesson 5: Advanced OpenAI Features 🚀

## Learning Objectives
- Work with GPT-4 Vision for image analysis
- Generate images with DALL-E 3
- Transcribe audio with Whisper
- Use the Assistants API
- Implement fine-tuning
- Build multi-modal applications

---

## 1. GPT-4 Vision (GPT-4V)

### Image Analysis Basics

```python
from openai import OpenAI
import base64
import requests
from PIL import Image
import io

client = OpenAI()

def encode_image(image_path):
    """Encode image to base64"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def analyze_image(image_path, prompt="What's in this image?"):
    """Analyze image with GPT-4V"""
    base64_image = encode_image(image_path)

    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        max_tokens=300
    )

    return response.choices[0].message.content

# Example usage
# result = analyze_image("example.jpg", "Describe this image in detail")
# print(result)
```

### Advanced Image Analysis

```python
class VisionAnalyzer:
    """Advanced image analysis with GPT-4V"""

    def __init__(self):
        self.client = OpenAI()

    def analyze_multiple_images(self, image_paths, prompt):
        """Analyze multiple images at once"""
        content = [{"type": "text", "text": prompt}]

        for path in image_paths:
            base64_image = encode_image(path)
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image}"
                }
            })

        response = self.client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[{"role": "user", "content": content}],
            max_tokens=500
        )

        return response.choices[0].message.content

    def analyze_image_from_url(self, image_url, prompt):
        """Analyze image from URL"""
        response = self.client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": image_url}
                        }
                    ]
                }
            ],
            max_tokens=300
        )

        return response.choices[0].message.content

    def extract_text_from_image(self, image_path):
        """OCR functionality with GPT-4V"""
        base64_image = encode_image(image_path)

        response = self.client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Extract all text from this image. Format it nicely."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )

        return response.choices[0].message.content

    def analyze_chart(self, image_path):
        """Analyze charts and graphs"""
        base64_image = encode_image(image_path)

        response = self.client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyze this chart. What are the key insights? Describe trends and patterns."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )

        return response.choices[0].message.content

# Example usage
analyzer = VisionAnalyzer()
# result = analyzer.extract_text_from_image("document.png")
```

---

## 2. DALL-E 3 Image Generation

### Basic Image Generation

```python
def generate_image(prompt, size="1024x1024", quality="standard", n=1):
    """Generate image with DALL-E 3"""
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size=size,  # 1024x1024, 1024x1792, 1792x1024
        quality=quality,  # standard or hd
        n=n  # Number of images (1 for DALL-E 3)
    )

    return response.data[0].url

# Example
# image_url = generate_image("A futuristic city with flying cars at sunset, digital art")
# print(f"Generated image: {image_url}")
```

### Advanced Image Generation

```python
import requests
from datetime import datetime

class ImageGenerator:
    """Advanced DALL-E 3 integration"""

    def __init__(self):
        self.client = OpenAI()

    def generate_with_style(self, subject, style, additional_details=""):
        """Generate image with specific style"""
        prompt = f"{subject} in {style} style"
        if additional_details:
            prompt += f", {additional_details}"

        response = self.client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="hd"
        )

        return {
            "url": response.data[0].url,
            "revised_prompt": response.data[0].revised_prompt
        }

    def generate_variations(self, prompt, styles):
        """Generate same subject in different styles"""
        results = []

        for style in styles:
            styled_prompt = f"{prompt}, {style} style"
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=styled_prompt,
                size="1024x1024"
            )

            results.append({
                "style": style,
                "url": response.data[0].url,
                "revised_prompt": response.data[0].revised_prompt
            })

        return results

    def save_generated_image(self, prompt, save_path="generated_images"):
        """Generate and save image locally"""
        import os

        os.makedirs(save_path, exist_ok=True)

        response = self.client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="hd"
        )

        image_url = response.data[0].url

        # Download image
        image_response = requests.get(image_url)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{save_path}/dalle3_{timestamp}.png"

        with open(filename, "wb") as f:
            f.write(image_response.content)

        return {
            "filename": filename,
            "url": image_url,
            "prompt": prompt,
            "revised_prompt": response.data[0].revised_prompt
        }

    def edit_image_with_mask(self, image_path, mask_path, prompt):
        """Edit existing image with DALL-E 2 (Note: DALL-E 3 doesn't support edits yet)"""
        response = self.client.images.edit(
            model="dall-e-2",
            image=open(image_path, "rb"),
            mask=open(mask_path, "rb"),
            prompt=prompt,
            n=1,
            size="1024x1024"
        )

        return response.data[0].url

# Example usage
generator = ImageGenerator()

# Generate with style
# result = generator.generate_with_style(
#     subject="A robot",
#     style="cyberpunk",
#     additional_details="neon lights, rain, detailed"
# )

# Generate variations
# styles = ["photorealistic", "watercolor", "oil painting", "anime"]
# variations = generator.generate_variations("A mountain landscape", styles)
```

---

## 3. Whisper Audio Transcription

### Basic Audio Transcription

```python
def transcribe_audio(audio_file_path, language=None):
    """Transcribe audio with Whisper"""
    with open(audio_file_path, "rb") as audio_file:
        response = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language=language  # Optional: specify language (e.g., "en")
        )

    return response.text

# Example
# transcription = transcribe_audio("recording.mp3")
# print(transcription)
```

### Advanced Audio Processing

```python
import subprocess
from typing import Optional, Dict

class AudioProcessor:
    """Advanced audio processing with Whisper"""

    def __init__(self):
        self.client = OpenAI()

    def transcribe_with_timestamps(self, audio_path, response_format="verbose_json"):
        """Get transcription with timestamps"""
        with open(audio_path, "rb") as audio_file:
            response = self.client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format=response_format  # verbose_json includes timestamps
            )

        return response

    def translate_audio(self, audio_path):
        """Translate non-English audio to English"""
        with open(audio_path, "rb") as audio_file:
            response = self.client.audio.translations.create(
                model="whisper-1",
                file=audio_file
            )

        return response.text

    def transcribe_with_prompt(self, audio_path, prompt):
        """Use prompt to guide transcription"""
        with open(audio_path, "rb") as audio_file:
            response = self.client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                prompt=prompt  # Helps with proper nouns, technical terms
            )

        return response.text

    def process_long_audio(self, audio_path, chunk_duration=60):
        """Process long audio by splitting into chunks"""
        # Note: This requires ffmpeg installed
        import os
        import tempfile

        transcriptions = []
        temp_dir = tempfile.mkdtemp()

        try:
            # Split audio into chunks using ffmpeg
            cmd = f"ffmpeg -i {audio_path} -f segment -segment_time {chunk_duration} -c copy {temp_dir}/chunk_%03d.mp3"
            subprocess.run(cmd, shell=True, check=True)

            # Process each chunk
            chunks = sorted(os.listdir(temp_dir))
            for chunk in chunks:
                chunk_path = os.path.join(temp_dir, chunk)
                with open(chunk_path, "rb") as audio_file:
                    response = self.client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file
                    )
                    transcriptions.append(response.text)

                # Clean up chunk
                os.remove(chunk_path)

        finally:
            # Clean up temp directory
            os.rmdir(temp_dir)

        return " ".join(transcriptions)

    def create_subtitles(self, video_path, output_format="srt"):
        """Generate subtitles for video"""
        with open(video_path, "rb") as video_file:
            response = self.client.audio.transcriptions.create(
                model="whisper-1",
                file=video_file,
                response_format=output_format  # srt, vtt
            )

        return response

# Example usage
processor = AudioProcessor()

# Transcribe with timestamps
# result = processor.transcribe_with_timestamps("meeting.mp3")

# Translate foreign audio
# translation = processor.translate_audio("spanish_audio.mp3")

# Guide transcription with domain-specific terms
# technical_transcription = processor.transcribe_with_prompt(
#     "conference.mp3",
#     "The speaker discusses OpenAI, GPT-4, and DALL-E"
# )
```

---

## 4. Assistants API

### Creating an Assistant

```python
def create_assistant(name, instructions, model="gpt-3.5-turbo"):
    """Create a persistent assistant"""
    assistant = client.beta.assistants.create(
        name=name,
        instructions=instructions,
        model=model,
        tools=[{"type": "code_interpreter"}, {"type": "retrieval"}]
    )

    return assistant

# Example
# assistant = create_assistant(
#     name="Data Analyst",
#     instructions="You are a data analyst. Help users understand and analyze data."
# )
```

### Complete Assistant Workflow

```python
import time

class AssistantManager:
    """Manage OpenAI Assistants"""

    def __init__(self):
        self.client = OpenAI()

    def create_assistant_with_files(self, name, instructions, file_paths):
        """Create assistant with knowledge files"""
        # Upload files
        file_ids = []
        for path in file_paths:
            with open(path, "rb") as file:
                uploaded_file = self.client.files.create(
                    file=file,
                    purpose="assistants"
                )
                file_ids.append(uploaded_file.id)

        # Create assistant
        assistant = self.client.beta.assistants.create(
            name=name,
            instructions=instructions,
            model="gpt-4-turbo-preview",
            tools=[{"type": "retrieval"}, {"type": "code_interpreter"}],
            file_ids=file_ids
        )

        return assistant

    def create_thread_and_run(self, assistant_id, user_message):
        """Create a thread and run the assistant"""
        # Create thread
        thread = self.client.beta.threads.create()

        # Add message to thread
        message = self.client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_message
        )

        # Run assistant
        run = self.client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant_id
        )

        return thread.id, run.id

    def wait_for_completion(self, thread_id, run_id, timeout=30):
        """Wait for run to complete"""
        start_time = time.time()

        while time.time() - start_time < timeout:
            run = self.client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run_id
            )

            if run.status == "completed":
                return True
            elif run.status == "failed":
                print(f"Run failed: {run.last_error}")
                return False

            time.sleep(1)

        return False

    def get_assistant_response(self, thread_id):
        """Get the assistant's response from thread"""
        messages = self.client.beta.threads.messages.list(
            thread_id=thread_id
        )

        # Get latest assistant message
        for message in messages.data:
            if message.role == "assistant":
                return message.content[0].text.value

        return None

    def complete_interaction(self, assistant_id, user_message):
        """Complete interaction with assistant"""
        thread_id, run_id = self.create_thread_and_run(assistant_id, user_message)

        if self.wait_for_completion(thread_id, run_id):
            return self.get_assistant_response(thread_id)
        else:
            return "Assistant failed to respond"

# Example usage
manager = AssistantManager()

# Create assistant with files
# assistant = manager.create_assistant_with_files(
#     name="Documentation Helper",
#     instructions="Help users understand the documentation",
#     file_paths=["docs.pdf", "api_reference.txt"]
# )

# Interact with assistant
# response = manager.complete_interaction(
#     assistant.id,
#     "What are the main features described in the documentation?"
# )
```

---

## 5. Fine-Tuning

### Preparing Training Data

```python
import json

def prepare_fine_tuning_data(conversations):
    """Prepare data for fine-tuning"""
    training_data = []

    for conversation in conversations:
        formatted = {
            "messages": [
                {"role": "system", "content": conversation["system"]},
                {"role": "user", "content": conversation["user"]},
                {"role": "assistant", "content": conversation["assistant"]}
            ]
        }
        training_data.append(formatted)

    # Save to JSONL file
    with open("training_data.jsonl", "w") as f:
        for item in training_data:
            f.write(json.dumps(item) + "\n")

    return "training_data.jsonl"

# Example data
sample_conversations = [
    {
        "system": "You are a helpful customer service agent",
        "user": "I need help with my order",
        "assistant": "I'd be happy to help you with your order. Could you please provide your order number?"
    },
    {
        "system": "You are a helpful customer service agent",
        "user": "My package hasn't arrived",
        "assistant": "I apologize for the delay. Let me check the tracking information for you."
    }
]

# prepare_fine_tuning_data(sample_conversations)
```

### Fine-Tuning Workflow

```python
class FineTuner:
    """Manage fine-tuning process"""

    def __init__(self):
        self.client = OpenAI()

    def upload_training_file(self, file_path):
        """Upload training data file"""
        with open(file_path, "rb") as file:
            response = self.client.files.create(
                file=file,
                purpose="fine-tune"
            )
        return response.id

    def create_fine_tuning_job(self, training_file_id, model="gpt-3.5-turbo"):
        """Create fine-tuning job"""
        response = self.client.fine_tuning.jobs.create(
            training_file=training_file_id,
            model=model,
            hyperparameters={
                "n_epochs": 3,
                "batch_size": 1,
                "learning_rate_multiplier": 2
            }
        )
        return response

    def monitor_fine_tuning(self, job_id):
        """Monitor fine-tuning progress"""
        while True:
            job = self.client.fine_tuning.jobs.retrieve(job_id)
            print(f"Status: {job.status}")

            if job.status == "succeeded":
                print(f"Fine-tuned model: {job.fine_tuned_model}")
                return job.fine_tuned_model
            elif job.status == "failed":
                print(f"Fine-tuning failed: {job.error}")
                return None

            time.sleep(30)

    def test_fine_tuned_model(self, model_id, test_prompt):
        """Test the fine-tuned model"""
        response = self.client.chat.completions.create(
            model=model_id,
            messages=[{"role": "user", "content": test_prompt}]
        )
        return response.choices[0].message.content

# Example usage
# tuner = FineTuner()
# file_id = tuner.upload_training_file("training_data.jsonl")
# job = tuner.create_fine_tuning_job(file_id)
# model_id = tuner.monitor_fine_tuning(job.id)
# result = tuner.test_fine_tuned_model(model_id, "Test prompt")
```

---

## 6. Multi-Modal Applications

### Complete Multi-Modal Assistant

```python
class MultiModalAssistant:
    """Assistant combining vision, audio, and text"""

    def __init__(self):
        self.client = OpenAI()
        self.vision_analyzer = VisionAnalyzer()
        self.audio_processor = AudioProcessor()
        self.image_generator = ImageGenerator()

    def process_image_and_describe(self, image_path):
        """Analyze image and generate audio description"""
        # Analyze image
        description = self.vision_analyzer.analyze_image(
            image_path,
            "Describe this image in detail for someone who can't see it"
        )

        # Generate speech from description
        speech_file_path = "description.mp3"
        response = self.client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            input=description
        )

        response.stream_to_file(speech_file_path)

        return {
            "description": description,
            "audio_file": speech_file_path
        }

    def transcribe_and_visualize(self, audio_path):
        """Transcribe audio and generate visualization"""
        # Transcribe audio
        transcription = self.audio_processor.transcribe_audio(audio_path)

        # Generate image from transcription
        image_prompt = f"Create a visual representation of: {transcription[:200]}"
        image_url = self.image_generator.generate_image(image_prompt)

        return {
            "transcription": transcription,
            "visualization": image_url
        }

    def create_multimedia_response(self, user_input, image_path=None, audio_path=None):
        """Generate comprehensive multimedia response"""
        context = []

        # Process image if provided
        if image_path:
            image_analysis = self.vision_analyzer.analyze_image(image_path)
            context.append(f"Image context: {image_analysis}")

        # Process audio if provided
        if audio_path:
            transcription = self.audio_processor.transcribe_audio(audio_path)
            context.append(f"Audio context: {transcription}")

        # Generate text response
        full_prompt = user_input
        if context:
            full_prompt = f"{user_input}\n\nContext:\n" + "\n".join(context)

        text_response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": full_prompt}]
        ).choices[0].message.content

        # Generate supporting image
        image_prompt = f"Create an illustration for: {text_response[:150]}"
        generated_image = self.image_generator.generate_image(image_prompt)

        # Generate audio narration
        speech_response = self.client.audio.speech.create(
            model="tts-1-hd",
            voice="nova",
            input=text_response
        )

        speech_file = "response_audio.mp3"
        speech_response.stream_to_file(speech_file)

        return {
            "text": text_response,
            "image": generated_image,
            "audio": speech_file
        }

# Example usage
# assistant = MultiModalAssistant()
# result = assistant.create_multimedia_response(
#     "Explain this concept",
#     image_path="diagram.png",
#     audio_path="question.mp3"
# )
```

---

## 🧪 Practice Exercises

### Exercise 1: Document Analyzer
Build a system that analyzes document images:

```python
class DocumentAnalyzer:
    """
    Create a system that:
    - Extracts text from document images
    - Summarizes content
    - Answers questions about the document
    """
    # Your implementation here
    pass
```

### Exercise 2: Podcast Generator
Create an automated podcast generator:

```python
class PodcastGenerator:
    """
    Build a system that:
    - Takes a topic as input
    - Researches the topic
    - Generates a script
    - Creates audio narration
    """
    # Your implementation here
    pass
```

### Exercise 3: Visual Story Creator
Build a visual story generator:

```python
class VisualStoryCreator:
    """
    Create a system that:
    - Takes a story prompt
    - Generates story text
    - Creates illustrations for key scenes
    - Produces audio narration
    """
    # Your implementation here
    pass
```

---

## 📝 Final Project

Build a **Complete AI Content Creation Suite** that includes:

### Core Features:
1. **Multi-modal Input Processing**
   - Accept text, images, and audio
   - Extract and combine information

2. **Content Generation**
   - Blog posts with images
   - Social media content
   - Presentations with visuals
   - Podcasts/videos scripts

3. **Advanced Capabilities**
   - Style transfer for images
   - Voice cloning (with consent)
   - Language translation
   - Content moderation

4. **Production Features**
   - Batch processing
   - Template system
   - Export to multiple formats
   - Version control

### Implementation Template:

```python
import streamlit as st
from dataclasses import dataclass
from typing import List, Dict, Optional
import asyncio

@dataclass
class Content:
    text: str
    images: List[str]
    audio: Optional[str]
    metadata: Dict

class AIContentSuite:
    def __init__(self):
        self.client = OpenAI()
        self.templates = {}
        self.projects = []

    def create_blog_post(self, topic, style="professional", include_images=True):
        """Generate complete blog post"""
        # Implementation
        pass

    def create_social_media_campaign(self, product, platforms=["twitter", "instagram"]):
        """Generate multi-platform content"""
        # Implementation
        pass

    def create_presentation(self, outline, slide_count=10):
        """Generate presentation with visuals"""
        # Implementation
        pass

    async def batch_process(self, tasks):
        """Process multiple content requests"""
        # Implementation
        pass

def main():
    st.title("AI Content Creation Suite")

    # Sidebar
    st.sidebar.header("Project Settings")
    project_type = st.sidebar.selectbox(
        "Content Type",
        ["Blog Post", "Social Media", "Presentation", "Podcast"]
    )

    # Main interface
    if project_type == "Blog Post":
        topic = st.text_input("Blog Topic")
        style = st.selectbox("Writing Style", ["Professional", "Casual", "Technical"])
        include_images = st.checkbox("Generate Images")

        if st.button("Generate"):
            # Generate blog post
            pass

    # Additional interfaces...

if __name__ == "__main__":
    main()
```

---

## 💰 Cost Optimization Tips

### Model Selection Strategy
```python
def select_optimal_model(task_type, budget_priority=False):
    """Select the most appropriate model for task and budget"""
    model_selection = {
        "simple_text": "gpt-3.5-turbo",
        "complex_reasoning": "gpt-4-turbo",
        "vision": "gpt-4-vision-preview",
        "code": "gpt-4-turbo",
        "creative": "gpt-4-turbo",
        "translation": "gpt-3.5-turbo"
    }

    if budget_priority and task_type != "vision":
        return "gpt-3.5-turbo"

    return model_selection.get(task_type, "gpt-3.5-turbo")
```

### Usage Tracking
```python
class UsageTracker:
    """Track API usage and costs"""

    def __init__(self):
        self.usage_log = []

    def log_usage(self, model, tokens_in, tokens_out, cost):
        """Log API usage"""
        self.usage_log.append({
            "timestamp": datetime.now().isoformat(),
            "model": model,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "cost": cost
        })

    def get_daily_cost(self):
        """Calculate daily cost"""
        today = datetime.now().date()
        daily_cost = sum(
            log["cost"] for log in self.usage_log
            if datetime.fromisoformat(log["timestamp"]).date() == today
        )
        return daily_cost

    def generate_report(self):
        """Generate usage report"""
        total_cost = sum(log["cost"] for log in self.usage_log)
        total_tokens = sum(log["tokens_in"] + log["tokens_out"] for log in self.usage_log)

        return {
            "total_cost": total_cost,
            "total_tokens": total_tokens,
            "api_calls": len(self.usage_log)
        }
```

---

## ✅ Module Completion Checklist

You've completed the OpenAI module! Ensure you can:

- [ ] Work with all OpenAI models (GPT-4, GPT-3.5, Vision, DALL-E, Whisper)
- [ ] Implement function calling and build agents
- [ ] Create and manage embeddings for semantic search
- [ ] Handle streaming responses and long-running operations
- [ ] Build multi-modal applications
- [ ] Optimize for cost and performance
- [ ] Handle errors and rate limits gracefully
- [ ] Implement production-ready patterns
- [ ] Fine-tune models for specific use cases
- [ ] Use the Assistants API effectively

---

## 🎓 Certification Project

To complete this module, build a **Production-Ready AI Application** that:

1. Uses at least 3 different OpenAI APIs
2. Implements proper error handling and rate limiting
3. Includes cost tracking and optimization
4. Has a user-friendly interface
5. Demonstrates real-world utility

Submit your project with:
- Source code
- Documentation
- Demo video
- Cost analysis report

---

**Congratulations!** 🎉 You've mastered OpenAI's APIs and are ready to build amazing AI applications!

**Next Module**: [Anthropic Claude](../../anthropic-claude/README.md) →