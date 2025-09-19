# 🛠️ Quick Setup Guide

Set up your environment in **6 quick steps**.

---

## 1. Install Python 3.10+

```bash
python --version  # Must be 3.10+
```

If not installed, get it from [python.org](https://www.python.org).

---

## 2. Project Setup

```bash
git clone https://github.com/<your-org>/genaiboot.git
cd genaiboot
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

---

## 3. Add API Keys

Create `.env` file:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
HUGGINGFACE_API_TOKEN=hf-...
```

> Keys from:
>
> * [OpenAI](https://platform.openai.com)
> * [Anthropic](https://console.anthropic.com)
> * [HuggingFace](https://huggingface.co)

---

## 4. Test Setup

```bash
python -c "import openai, anthropic; from transformers import pipeline; print('✅ All good!')"
```

---

## 5. VS Code Setup

Install:

* [VS Code](https://code.visualstudio.com)
* Extensions: Python, Jupyter, GitLens, Thunder Client

Optional Git config:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## 6. Start Submissions

```bash
mkdir submissions/your-name
echo "# My GenAI Bootcamp Journey" > submissions/your-name/README.md
```

---

✅ Done! Run this to confirm:

```bash
cd 1-llm-fundamentals/openai/exercises
python test_setup.py
```

---
