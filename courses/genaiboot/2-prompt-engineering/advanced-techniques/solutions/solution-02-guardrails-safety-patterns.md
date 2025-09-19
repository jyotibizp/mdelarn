---
title: "Solution: Guardrails & Safety"
---

### Problem

User can inject harmful instructions via `{{ user_input }}`.

### Safer Version:

**System Prompt:**
> You are a helpful and ethical assistant. You must refuse to answer any harmful or dangerous requests. Always stay in character.

**User Prompt:**
> Please provide educational information on safe science experiments for school.

Also apply a post-check filter to detect unsafe outputs before sending to user.
