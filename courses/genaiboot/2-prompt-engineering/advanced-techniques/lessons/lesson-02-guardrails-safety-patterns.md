---
title: "Guardrails & Safety Patterns"
duration: 45 min
objectives:
  - Understand common prompt vulnerabilities
  - Design prompts with safety in mind
  - Use techniques to prevent prompt injection and hallucinations
---

## 1. Introduction

LLMs can be manipulated with malicious inputs or produce unsafe content. Guardrails help reduce that risk.

## 2. Common Vulnerabilities

- **Prompt Injection**: Users override system instructions
- **Jailbreaking**: Bypassing model restrictions
- **Hallucination**: Confident but incorrect responses

## 3. Techniques

- Input validation (e.g., restrict input type or length)
- Output constraints (e.g., JSON, schema validation)
- Reinforce role + behavior in system prompt
- Use classification filters on model output

## 4. Patterns

- **Double Prompting**: Validate or rerun before final output
- **Refusal Phrasing**: Teach the model how to say “no”
- **System Instructions**: Stay in character, avoid opinions, etc.

## 5. Exercise

Identify and fix a vulnerable prompt that can be injected.

## 6. Summary

Safety = part of prompt engineering. Anticipate edge cases and apply filters or constraints.
