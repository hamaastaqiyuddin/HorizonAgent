# Horizon Handoff Protocol (HHP) Ticket
**Generated on:** 2026-06-16T10:44:42.864Z | **OS:** linux
**Git Branch:** `main` (Commit: `83169e9`)

---

## 📋 Task: HHP Overhaul
> Integrate stateless CLI and MCP server

### Remaining Checklist:
- [ ] Verify MCP server
- [ ] Create walkthrough

---

## 🛠️ Codebase State

### Modified Files:
* `EADME.md`
* `dashboard/app.js`
* `dashboard/index.html`
* `dashboard/style.css`
* `package-lock.json`
* `package.json`
* `src/db/sqlite.ts`
* `src/mcp/server.ts`
* `src/server.ts`
* `src/types/index.ts`
* `.github/`
* `.horizon/`
* `shared-workspace/artikel_1_muharram.json`
* `shared-workspace/test_otonom.txt`
* `src/cli/`
* `src/protocol/`


### Git Diff (Summary):
```diff
diff --git a/README.md b/README.md
index 0cf54bf..6b2afa9 100644
--- a/README.md
+++ b/README.md
@@ -1,98 +1,120 @@
-# Horizon Agent: Collaborative Multi-Agent Bridge
+# Horizon Handoff Protocol (HHP)
 
-Horizon Agent is a local-first Model Context Protocol (MCP) server and orchestrator designed to bridge the gap between **Google AI (Gemini via Antigravity)** and **Anthropic Claude (via Claude Desktop)**. It allows them to communicate directly, share variables and files, delegate tasks, and log token usage to maximize cost savings and performance.
+A stateless, local-first, Git-Ops based handoff protocol and Model Context Protocol (MCP) server designed for seamless, token-efficient task handover and state synchronization between independent AI agents (e.g., Claude Desktop, Cursor, Antigravity, and Terminal Agents).
 
 ---
 
-## Architecture Overview
+## 🌅 Why HHP?
+
+Multi-agent programming is the future, but it has two massive limitations today:
+1. **Walled Gardens:** LLM providers (Anthropic, Google, OpenAI) do not communicate with each other. If you run out of tokens in Claude and want to switch to Gemini, you must explain the task from scratch, copy-paste your code changes, and manually reconstruct your workspace.
+2. **Context Bloat (Token Waste):** Continuous background polling or passing entire raw chat histories consumes tens of thousands of tokens per minute, leading to massive API bills and hit rate-limits.
+
+**HHP solves this.** It acts as a standardized "USB-C" port for AI agent memory. When one agent finishes a session, it packages its progress into a compressed, standardized handoff ticket. The next agent reads this ticket and resumes work instantly in 1 second.
+
+---
+
+## ✨ Features
+
+* **Zero-Daemon / Stateless:** No running database, server ports, or idle processes. It only runs when called, consuming **0 idle CPU** and **0 idle tokens**.
+* **Cognitive Context Compression:** Automatically pulls the active git diff, files modified, and compiler errors. It packages them into a highly compact markdown ticket (`.horizon/handoff.md`), saving up to **90% on input tokens** for the receiving agent.
+* **Git-Ops Safety:** Integrates with your repository structure natively. Handoff states can be tracked, versioned, and branched using standard Git.
+* **IDE & Model Agnostic:** Works as a command-line interface (CLI) for humans and an **MCP Server** for any LLM-enabled tool (such as Claude Desktop, Windsurf, or VS Code plugins).
+
+---
+
+## 🚀 How It Works
 
 ```
-                   +-------------------+
-                   |   Dashboard UI    |
-                   | (localhost:10800) |
-                   +---------+---------+
-                             ^
-                             | (WebSockets)
-                             v
-+-------------+      +-------+-------+      +---------------+
-| Antigravity | <==> | Horizon Server| <==> | Claude Desktop|
-|  (Gemini)   | (MCP) | (Node/SQLite) | (MCP)|   (Claude)    |
-+-------------+      +---------------+      +---------------+
-                             |
-                             +---> Shared Workspace (`/shared-workspace`)
+[Claude Desktop] ──► `hz save` ──► [.horizon/state.json] ──► `hz load` ──► [Antigravity IDE]
+ (Sonnet 3.5)                     (Handoff Ticket & Diff)                (Gemini Pro)
 ```
 
-*   **MCP Tools:** Exposes functions for sending messages, creating tasks, managing shared variables, counting tokens, and routing recommendations.
-*   **Local Web Server:** Express app hosting a dark-themed glassmorphism dashboard (port `10800`).
-*   **Local DB:** SQLite DB (`horizon-agent.db`) tracking active states.
+1. **Save:** Claude finishes writing a module or runs out of tokens. It runs the `save_handoff` tool (or you run `hz save`).
+2. **State:** A `.horizon/state.json` (metadata) and a human-readable `.horizon/handoff.md` are generated locally in your project.
+3. **Load:** You open Antigravity (or another IDE chat panel) and type `resume`. The agent calls `load_handoff` (or you run `hz load`) to inherit the exact sisa-tugas checklist, files modified, and target goals.
 
 ---
 
-## Getting Started
+## 📥 Installation
 
-### 1. Build the Server
-Ensure you have Node.js (v18+) installed. Install dependencies and build the TypeScript files:
+Install the CLI tool globally:
 ```bash
-npm install
-npm run build
+npm install -g .
 ```
+*(Or run directly via `npx` if published to npm).*
 
-### 2. Configure Claude Desktop
-Add Horizon Agent to your local Claude Desktop config. Open the configuration file (usually located at `~/.config/Claude/claude_desktop_config.json` on Linux) and add the following entry under `mcpServers`:
+### 🛠️ Setting up MCP
 
+To let your AI agents call HHP automatically, add the server to your MCP configurations.
+
+#### For Claude Desktop (`claude_desktop_config.json`):
 ```json
 {
   "mcpServers": {
-    "horizon-agent": {
+    "horizon-handoff": {
       "command": "node",
-      "args": [
-
... (truncated for context compression) ...
```




---

## 🧠 Shared Memory Variables
```json
{}
```

---

## 🚀 Transition Metadata
* **Last Active Agent:** `human`
* **Target Handover Agent:** `antigravity`

> [!TIP]
> **Instructions for the receiving Agent:**
> 1. Read the modified files above.
> 2. Fix any compiler/lint errors listed.
> 3. Complete the remaining checklist items.
> 4. Once finished, run the `hz save` tool or call `save_handoff` to yield control back.
