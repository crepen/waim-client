# Local Prompt Memory Workflow

- If the localPromptMemory MCP server is available, use search_memories before answering when prior user preferences, project rules, or earlier requests may matter.
- After each substantive user prompt, call remember_interaction to store the user's prompt and a concise summary of the answer.
- Use workspace value waim-client for prompts originating in this root.
- Prefer scope values that reflect the area of work, such as frontend, backend, build, deploy, or conversation.
- Do not store secrets, passwords, tokens, private keys, connection strings, or raw personal data. Redact or skip them.
- If the user explicitly asks not to retain something, do not store it.

# UI Accessibility Rule

- For user-facing UI text, keep minimum readable font size at 14px across all pages/components.