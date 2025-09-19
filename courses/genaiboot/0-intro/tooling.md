# 🚀 Bootcamp Tools Guide

Your quick reference for daily work during the bootcamp.

---

## 🔁 Daily Workflow

### Start Work

```bash
source .venv/bin/activate
git pull
```

### Submit Work

```bash
git add submissions/your-name/
git commit -m "Complete exercise 1"
git push
```

---

## 💻 VS Code Extensions

Install (if not already):

* Python
* Thunder Client (API testing)
* GitLens (Git history)

---

## 🔌 API Testing (OpenAI Example)

In **Thunder Client**:

* Method: `POST`
* URL: `https://api.openai.com/v1/chat/completions`
* Header:

  ```
  Authorization: Bearer YOUR_API_KEY
  ```
* Body:

```json
{
  "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Hello!"}],
  "max_tokens": 50
}
```

---

## 📁 Folder Structure

Keep your code organized:

```
submissions/your-name/
├── module-1/
├── module-2/
└── final-project/
```

---

## 🧯 Troubleshooting Tips

* Virtual env not active? → `source .venv/bin/activate`
* Missing packages? → `pip install -r requirements.txt`
* API issues? → Check `.env`, no typos or spaces
* Errors? → Google exact message

---

## 🆘 Need Help?

Post your question in `submissions/your-name/`, with the full error.
Keep learning, not struggling! 🚀

---
