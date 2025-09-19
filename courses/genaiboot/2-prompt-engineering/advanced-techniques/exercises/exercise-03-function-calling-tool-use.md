---
title: "Exercise: Function Calling & Structured Output"
difficulty: Medium
type: Prompt Structuring
---

## Task

You're building a news summarizer. Modify the following prompt:

> "Summarize this article."

To include:

- Structured JSON response with fields:
  - `"summary"`: string
  - `"top_keywords"`: list of strings

Also include system instruction to always return valid JSON.
