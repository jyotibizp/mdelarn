# Generative AI Bootcamp 🚀

Welcome to the **Generative AI Bootcamp**!
This program takes you from **LLM fundamentals** to building **end-to-end AI applications** with RAG, Agents, and Cloud deployment.

---

## 📚 Curriculum

### **0. Introduction**

* Welcome & Expectations
* Environment Setup (Python, Conda, Docker, VSCode)
* Tooling (Git, Jupyter, Postman, API keys)

---

### **1. LLM Fundamentals**

#### Providers

* OpenAI API
* Anthropic Claude
* HuggingFace Transformers
* LLaMA

#### Topics

* Tokenization & Embeddings
* Model Inputs & Outputs
* Temperature, Top-p, Max Tokens
* Rate Limits, Cost Management
* Hands-on Labs: simple Q\&A, summarization, classification

---

### **2. Prompt Engineering**

#### Basics

* Role, Style, Task, Constraints
* Few-shot & Zero-shot prompting
* Chain-of-Thought & Reasoning prompts

#### Advanced

* Prompt optimization & evaluation
* Guardrails & safety patterns
* Function calling / tool use

#### Projects

* Persona chatbot
* Text summarizer with structured output

---

### **3. Retrieval-Augmented Generation (RAG)**

#### Frameworks

* LangChain
* LlamaIndex

#### Vector Databases

* FAISS
* pgvector
* Pinecone

#### Topics

* Chunking strategies
* Embedding models (OpenAI, HuggingFace, LLaMA)
* Hybrid search (semantic + keyword)
* Evaluation of RAG pipelines

#### Projects

* Document Q\&A chatbot
* Knowledge base assistant

---

### **4. Agentic AI**

#### Frameworks

* LangGraph
* CrewAI

#### Topics

* Agents vs Chains
* Memory & persistence
* Multi-agent collaboration
* Task orchestration

#### Projects

* Research assistant with multiple agents
* Workflow automation with tool-using agents

---

### **5. Applications**

#### Streamlit Apps

* Building interactive LLM dashboards
* Deploying lightweight prototypes

#### API Services

* FastAPI / Flask for serving LLM pipelines

#### AWS Cloud

* Amazon Bedrock (multi-model API)
* Amazon SageMaker (custom model training/hosting)

#### Projects

* End-to-end chatbot app (UI + API)
* Deploy RAG/agent service to AWS

---

### **6. Final Project**

* Bring it all together!
* Choose a **real-world problem** and solve it with LLMs, RAG, and/or agents.
* Deliverable: working app + demo + documentation.

---

## 📂 Repo Layout

* `0-intro/` → onboarding, setup, tooling
* `1-llm-fundamentals/` → OpenAI, Anthropic, HuggingFace, LLaMA
* `2-prompt-engineering/` → basics, advanced, projects
* `3-rag-frameworks/` → LangChain, LlamaIndex, vector DBs
* `4-agentic-ai/` → LangGraph, CrewAI, projects
* `5-applications/` → Streamlit, API services, AWS
* `assessments/` → quizzes & module evaluations
* `final-project/` → starter kit & instructions
* `reference-materials/` → cheatsheets & docs
* `submissions/` → mentee work

---

## ✅ Assessments

* **Module Quizzes** (after each unit)
* **Mini-projects** (Prompt Engineering, RAG, Agents)
* **Final Project** (capstone, evaluated on functionality + creativity)

---

## ⚡ Getting Started

1. Clone this repo

   ```bash
   git clone https://github.com/<your-org>/genaiboot.git
   cd genaiboot
   ```
2. Create virtual environment

   ```bash
   conda create -n genaiboot python=3.10 -y
   conda activate genaiboot
   pip install -r requirements.txt
   ```
3. Explore modules in order (`0-intro → 5-applications`)
4. Attempt **assessments** after each module
5. Submit work under `submissions/<your_name>/`

---

✨ By the end, you’ll be able to:

* Build production-ready RAG apps
* Design & evaluate prompts
* Deploy agents for real workflows
* Serve AI apps via APIs or Streamlit
* Scale to AWS Bedrock/SageMaker

---