---
title: "Solution: Function Calling Prompt"
---

**System Prompt:**
> You are a news summarization assistant. You must return output in valid JSON format with the following structure:
>
> {
>   "summary": "...",
>   "top_keywords": ["...", "..."]
> }

**User Prompt:**
> Summarize this article and extract 3 key keywords.

### Bonus

You can enforce schema validation in your backend to ensure output quality.
