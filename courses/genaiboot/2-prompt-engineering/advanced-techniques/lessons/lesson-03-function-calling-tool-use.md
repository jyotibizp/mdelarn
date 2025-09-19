---
title: "Function Calling & Tool Use"
duration: 45 min
objectives:
  - Use function calling with OpenAI or Claude APIs
  - Generate structured outputs (e.g. JSON)
  - Route queries to tools (e.g., calculator, search)
---

## 1. Introduction

Function calling allows the LLM to trigger real-world tools based on natural language queries.

## 2. Use Cases

- Weather bot → call a weather API
- Calculator → return math results
- Structured output → respond with validated JSON

## 3. Anatomy of Function Call (OpenAI)

- Define function schema (name, args, description)
- Model chooses when to call
- Backend invokes tool and returns result

## 4. Structured Prompting

- Ask LLM to return data in specific JSON format
- Use `format-instructions` like:
> Return the answer in this JSON: { "summary": "...", "keywords": ["..."] }

## 5. Exercise

Convert a prompt into one that supports function-calling with JSON output.

## 6. Summary

Function calling = LLM + tools. Structured output = reliable integration.
