# AGENTS.md – AI Coding Agent Guidelines

- **Code Improvement**
  - Always look for ways to improve existing code before adding new functions, components, or files.
  - Remove duplication by refactoring shared logic into reusable utilities or components.
  - Prefer small, composable functions and components over large, monolithic structures.
  - When modifying existing code, preserve behavior while improving clarity, readability, and maintainability.

- **Coding Practices**
  - Follow established conventions for the selected language and stack:
    - JavaScript/TypeScript: idiomatic modern ES syntax, consistent imports/exports, no unused variables.
    - React: functional components, hooks, clear prop typing, avoid unnecessary re-renders.
    - Tailwind: use utility classes consistently; avoid inline styles unless necessary.
  - Keep file structure consistent with the existing project (e.g., `src/components`, `src/hooks`, `scripts/`).
  - Prefer explicit, descriptive names for variables, functions, and components.
  - Avoid premature optimization; keep code simple and readable unless there is a clear performance need.

- **Best Practices (Testing, CI/CD, Documentation)**
  - Write tests for core logic and critical flows (e.g., manifest generation, validation scripts, security rules).
  - Ensure all tests pass before considering the work complete.
  - Always integrate or update GitHub Actions for CI/CD (lint, tests, build, validation) even if the pipeline is simple.
  - Ensure pre-commit hooks (e.g., Husky + lint-staged) run linting, formatting, and validation scripts with no errors.
  - Keep README, `tasks.md`, and other docs in sync with code changes (commands, scripts, configs, folder structure).
  - Add or update comments only where they clarify intent, not to restate obvious code behavior.

- **Security Considerations (Project-Specific)**
  - Treat all game content as untrusted:
    - Games must run in sandboxed iframes; do not weaken sandbox settings.
    - Do NOT introduce APIs that expose secrets or internal data to game code.
  - Enforce platform security rules in validation code:
    - Reject POST requests, WebSockets, EventSource, `sendBeacon`, or similar network features.
    - Allow only whitelisted CDNs for external JS/CSS.
    - Block analytics and trackers inside game HTML/JS.
  - Avoid storing or exposing any secrets (API keys, tokens, `.pem` files) in code, config, or commits.
  - When handling user-provided data or metadata, validate and sanitize inputs before use.
  - Respect privacy constraints: implement only minimal, anonymous, cookie-less analytics as described in `prd.md`.

- **Project Rules & Domain Constraints**
  - AI One-File Arcade is **AI-generated only**: do not add support for non-AI games unless explicitly requested.
  - Preserve and enforce the single-file game structure:
    - Each game folder must include `index.html` and `info.json`, optional `prompt.md`.
    - Ensure `games-manifest` generation and validation are aligned with these rules.
  - Maintain “security-first” architecture:
    - Static hosting, manifest-driven, no backend that stores user data.
    - Games must not be able to affect the main app’s local storage or DOM.
  - Respect branding and design guidelines from `brand_kit.md`:
    - Use the defined color palette, typography (Roboto), and minimalist, playful style.
    - Use Lucide icons consistently where icons are needed.
  - Follow accessibility and performance requirements:
    - Aim for WCAG 2.1 AA on the main UI.
    - Keep bundle sizes small and use lazy loading where appropriate.
    - Ensure responsive layouts match the spacing and grid system from `brand_kit.md`.

- **Workflow & Safety Rules**
  - Before running any Python script, ensure the appropriate virtual environment is activated.
  - **Stop and Ask When Uncertain:** If requirements, file paths, or environments are unclear, stop and ask the user for clarification.
  - **No Speculative File Operations:** Do not create, modify, or delete files or directories based on guesses. Only operate on paths explicitly provided or confirmed.
  - **Fail Fast on Errors:** If a command or script fails or gives unexpected output, stop and report the issue instead of trying alternative approaches without approval.
  - **Validate Before Acting:** Before deployments, file operations, or changes to CI/CD, verify that all required information is present and correct; request clarification if anything is missing or ambiguous.
  - **Explicit Confirmation for High-Risk Actions:** For deployment commands, database operations, or production-like changes, describe the plan and wait for explicit user confirmation before proceeding.
  - **Limited Autonomy Scope:** Only perform actions that directly support the user’s stated request and the documented product goals; do not expand scope or add features without being asked.

- **Documentation & Artifact Updates**
  - After implementing or refactoring features, update:
    - `prd.md` if product behavior or requirements meaningfully change.
    - `tasks.md` if tasks are completed, re-scoped, or new tasks are identified.
    - `brand_kit.md` if visual or branding aspects are updated.
  - Keep code comments, script descriptions, and readme snippets aligned with the current behavior.
  - Clearly note any breaking changes or manual steps required in documentation.

- **Post-Implementation Review**
  - After each implementation, review the code for:
    - Code quality and adherence to standards.
    - Potential bugs, edge cases, and error handling.
    - Performance implications (render cycles, IO, build times).
    - Security implications (untrusted input, sandbox boundaries, secrets).
  - Suggest further refactors or tests where they provide meaningful improvement without over-complicating the codebase.
