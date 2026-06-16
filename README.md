# Horizon Handoff Protocol (HHP)

A stateless, local-first, Git-Ops based handoff protocol and Model Context Protocol (MCP) server designed for seamless, token-efficient task handover and state synchronization between independent AI agents (e.g., Claude Desktop, Cursor, Antigravity, and Terminal Agents).

---

## 🌅 Why HHP?

Multi-agent programming is the future, but it has two massive limitations today:
1. **Walled Gardens:** LLM providers (Anthropic, Google, OpenAI) do not communicate with each other. If you run out of tokens in Claude and want to switch to Gemini, you must explain the task from scratch, copy-paste your code changes, and manually reconstruct your workspace.
2. **Context Bloat (Token Waste):** Continuous background polling or passing entire raw chat histories consumes tens of thousands of tokens per minute, leading to massive API bills and hit rate-limits.

**HHP solves this.** It acts as a standardized "USB-C" port for AI agent memory. When one agent finishes a session, it packages its progress into a compressed, standardized handoff ticket. The next agent reads this ticket and resumes work instantly in 1 second.

---

## ✨ Features

* **Zero-Daemon / Stateless:** No running database, server ports, or idle processes. It only runs when called, consuming **0 idle CPU** and **0 idle tokens**.
* **Cognitive Context Compression:** Automatically pulls the active git diff, files modified, and compiler errors. It packages them into a highly compact markdown ticket (`.horizon/handoff.md`), saving up to **90% on input tokens** for the receiving agent.
* **Git-Ops Safety:** Integrates with your repository structure natively. Handoff states can be tracked, versioned, and branched using standard Git.
* **IDE & Model Agnostic:** Works as a command-line interface (CLI) for humans and an **MCP Server** for any LLM-enabled tool (such as Claude Desktop, Windsurf, or VS Code plugins).

---

## 🚀 How It Works

```
[Claude Desktop] ──► `hz save` ──► [.horizon/state.json] ──► `hz load` ──► [Antigravity IDE]
 (Sonnet 3.5)                     (Handoff Ticket & Diff)                (Gemini Pro)
```

1. **Save:** Claude finishes writing a module or runs out of tokens. It runs the `save_handoff` tool (or you run `hz save`).
2. **State:** A `.horizon/state.json` (metadata) and a human-readable `.horizon/handoff.md` are generated locally in your project.
3. **Load:** You open Antigravity (or another IDE chat panel) and type `resume`. The agent calls `load_handoff` (or you run `hz load`) to inherit the exact sisa-tugas checklist, files modified, and target goals.

---

## 📥 Installation

Install the CLI tool globally:
```bash
npm install -g .
```
*(Or run directly via `npx` if published to npm).*

### 🛠️ Setting up MCP

To let your AI agents call HHP automatically, add the server to your MCP configurations.

#### For Claude Desktop (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "horizon-handoff": {
      "command": "node",
      "args": ["/absolute/path/to/horizon-agent/dist/mcp/server.js"]
    }
  }
}
```

#### For Antigravity (`mcp_config.json`):
```json
{
  "mcpServers": {
    "horizon-handoff": {
      "command": "node",
      "args": ["/absolute/path/to/horizon-agent/dist/mcp/server.js"]
    }
  }
}
```

---

## 💻 CLI Commands

### 1. `hz init`
Initialize the `.horizon/` environment in your current project folder.
```bash
hz init
```

### 2. `hz save`
Capture the current workspace state (git status, diff, modified files) and write a handoff ticket.
```bash
hz save "Impl parsing logic" --remaining "Write test cases, debug router" --agent "antigravity"
```
* **Options:**
  * `-t, --title <title>`: Set/override task title.
  * `-d, --desc <desc>`: Set/override task description.
  * `-r, --remaining <items>`: Comma-separated sisa tugas.
  * `-a, --agent <agent>`: Target assignee (claude / antigravity / human / any).
  * `-e, --errors <log>`: Paste compiler/linter error messages to let the next agent debug.

### 3. `hz status`
Show the current handoff status, assignee, modified files, and sisa-tugas checklist in your terminal.
```bash
hz status
```

### 4. `hz load`
Print the raw JSON state payload (primarily used internally by MCP agents to ingest context).
```bash
hz load
```

---

## 💛 Support & Donations

If this protocol has saved you thousands of tokens and hours of manual handoffs, consider supporting its open-source development!

* **Donate via PayPal:** [Support on PayPal](https://paypal.me/hamaastaqiyuddin)

---

## 📄 License
MIT License. Free to use, modify, and distribute for all developers globally.
