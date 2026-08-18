# dsh-prism

[![Release](https://img.shields.io/github/v/release/KhalilYamber/dsh-prism?label=Release&color=2da44e)](https://github.com/KhalilYamber/dsh-prism/releases)
[![License](https://img.shields.io/github/license/KhalilYamber/dsh-prism?label=License)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/KhalilYamber/dsh-prism?label=Last%20commit)](https://github.com/KhalilYamber/dsh-prism/commits/main)

[简体中文](./README.md) | **English**

A two-mode UI plugin for the DeepSeek Harness web interface: toggle between **Simple** and **Native** modes with one click. Tool cards are rewritten in plain language to lower the learning curve for newcomers. Beginners get plain-speak, power users get the full product — the same interface, read two ways.

The project is under active iteration: tracking DSH interface evolution, expanding tool coverage, and polishing the Simple mode experience. Feedback and trial use are welcome.

## Why this exists

After the DeepSeek Harness release, community criticism converged on one point: **the learning curve**.

- 界面新闻: the "everything is a plugin" design leans heavily on configuration (YAML + plugins + effect components + services). "Powerful for advanced users, but for people who just want a working agent quickly, the barrier to entry is high"
- 极客公园: DSH is "not friendly to non-programmers", more like a framework than a finished product — a developer's preview
- Community developers: "Who would actually use this? Why would I plug and unplug things for no reason?"

DSH's bare-bones design is deliberate. But people who want a quick start and people who want the full feature set should not be forced into the same UI. dsh-prism answers that tension with two modes:

| Mode | For whom | What the UI looks like |
|---|---|---|
| **Simple** | People who want to get going without learning the jargon | Tool calls are grouped and collapsed: the chain of calls before the final reply folds into a one-line summary; click to open a panel with a plain-language row per tool |
| **Native** | Power users who need complete information | Zero plugin takeover — the product renders exactly as shipped, pixel for pixel |

Native is the default. Switching takes effect immediately; refreshing the page returns to Native. Don't want it? Remove the plugin and the UI is back to factory state with nothing left behind.

## Features

- **Floating entry, bottom-left**: shows the current mode; click to open the menu and switch between Simple / Native; the menu also carries a "Hide complex tools" toggle
- **Simple mode = collapsed tool groups × delivery documents**:
  - Summary view: every tool call in a user turn, up to the model's final reply, folds into one group; collapsed it shows a single stats line, "N tools · M thoughts" (M counts the model's reasoning blocks from assistant output; when there are no thoughts only the tool count shows), with a group status at the end (✓ done / ● running / ✕ had errors)
  - Detail view: click the stats line to open a documented panel — header ("This call: N tools · M thoughts") + list (one row per tool: category icon + plain-language action / argument summary + status icon) + note; each row reuses the plain-card style; click a row to open that tool's "delivery document" detail (redacted result rendered as Markdown)
  - Hide complex tools: 21 advanced tools (goals / plans, subagent orchestration, background jobs, plugin system) collapse into plain summary rows by default; click "展开" (expand) to reveal and open the detail; the menu toggle turns the folding off at any time
  - Grouping rule: all tool calls within one user turn before the final reply (the last assistant message containing text) form one group; a running turn keeps accumulating new calls; replay after refresh regroups by the same rule; every tool appears exactly once
- **Data redaction (Simple mode)**:
  - Paths show only the file name (`file_path` and similar arguments render as basename)
  - Sensitive argument names such as `token / secret / password / api_key / authorization` are never shown
  - Common secret shapes in result text (`sk-xxx`, `Bearer xxx`, `key=xxx`) are replaced with placeholders
  - The detail panel shows only the plain-language summary and redacted result — raw arguments never surface
- **Native mode = product as shipped**: in Native mode the plugin registers no tool cards at all and hands rendering back to the product (including generic cards); the collapsed-group node registers only in Simple mode (shadowing the product's tool-call tree with a lower `priority`), and mode switches register / unregister dynamically and take effect instantly
- **Plain-language coverage**: 33 tools covered by the rule table (e.g. `pwsh` → "running a command on the computer"); 19 tools without native product cards have been taken over by plugin cards since v1.0.0; since v1.1.0 Simple mode folds the whole tool chain into groups, where every tool row (including `read` / `write` / `web_search` that have official native cards) renders by the same plain-language rules — while in Native mode they stay the product's original cards

## Design principles

- **Presentation only**: changes purely the UI rendering; model input and output are untouched — the agent's work is unaffected
- **Zero takeover in Native**: no cards are registered in Native mode; the product UI returns completely; in Simple mode tool calls fold into groups whose rows render by the plain-language rules, but the official tool cards themselves are never modified and remain original in Native mode
- **In-memory mode**: refreshing returns to Native — simple, clean, no configuration pollution
- **Theme-following**: only official `--dsw-alias-*` design variables are used; adapts to both light and dark themes

## Installation

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) is required first (Node.js 22.19+ or 24+).

The plugin is distributed through GitHub; clone this repository and install it by local path:

```sh
npx -y @deepseek-ai/dsh plugin --profile web add <path-to-this-repo>
```

You can also grab the packaged artifact from [Releases](https://github.com/KhalilYamber/dsh-prism/releases). After the Web UI starts, the floating entry appears at the bottom-left.

## Usage

1. After startup, click the floating button at the bottom-left (it shows the current mode)
2. Choose **Simple**: tool calls in a task fold into groups — a one-line summary when collapsed; click to open the panel with a plain-language row per tool and its delivery-document detail
3. The menu can toggle "Hide complex tools" (Simple mode only)
4. Choose **Native**: the full native interface returns
5. Refresh the page to go back to Native mode

## FAQ

**Why do I return to Native mode after a refresh?**
The mode lives in memory. That is deliberate: Simple mode is a temporary aid — when you no longer need it, a refresh makes it disappear without leaving any state behind.

**Why do some tool cards look unchanged?**
Tools like `read`, `write`, and `web_search` already have polished official native cards; the plugin registers no replacement cards for them (Native mode is completely original). In Simple mode they are folded into the group alongside other tools and shown as unified plain-language rows — the official cards themselves are never altered.

**Does Simple mode affect how the agent works?**
No. The plugin only changes the display; the model receives and produces exactly the same input and output as in Native mode.

**What do tables / code blocks look like in the detail panel?**
Result text is redacted first, then rendered as a Markdown subset: `| a | b |` tables, ``` code blocks, `#` headings, `-` lists, `**bold**`, inline code, and commit-hash highlighting; any parse failure falls back to plain text.

## Roadmap

- Keep tracking DSH official interface evolution and stay compatible with new releases
- Expand the tool rule table so more tools automatically get plain-language copy and documented presentation
- Polish the Simple mode experience: timeline rows, delivery-document rendering, redaction granularity
- Add adaptation notes and FAQ entries based on community feedback

Ideas or tools that don't fit well? Open an issue and discuss.

## Changelog

### v1.1.1 (2026-08-18)

- Fix: Simple-mode grouping was completely broken in real browsers (`ToolGroupNode` used the framework hook `useSession` as a bare identifier; every render threw, the slot entry abdicated, and rendering fell back to the product's original — the two modes looked identical); now the hook is taken from the component props, where the runtime injects it
- Group status upgraded to three states + mixed counts: all ok shows ✓, all failed shows ✕, mixed shows a warning symbol plus a "✓ n · ✕ m" count (ok first); while any call in the group is still running, only ● running shows — the ok/fail summary appears once everything settles
- Status counts follow root tool calls, matching the number of rows in the group

### v1.1.0 (2026-08-18)

- Simple mode groups tool calls: the whole chain of calls before the final reply in a user turn folds into one group
  - Summary view: a single stats line "N tools · M thoughts" when collapsed (M counts reasoning blocks from assistant output; only the tool count when there are no thoughts), with a group status at the end
  - Detail view: click the stats line to open a documented panel (header + one row per tool + note); each row reuses the plain-card style; click a row for the redacted delivery-document detail
  - Grouping accumulates while the turn is running and regroups by the same rule on replay; every tool appears exactly once
  - Row derivation extracted into a shared `toolRowMeta` function used by both the timeline cards and the group panel, so copy and status stay identical
- Group open/close state lives in an in-memory store per group (one per turn); refreshing returns to collapsed
- Fix: the Simple-mode tool-call node renderer conflicted with the product's ToolCallTree (a keyed slot throws when the same key registers at the same priority); it now shadows the product render with `priority: -1`; plain cards no longer register to `tool.call.toolview` (unconsumed in Simple mode — the panel renders them directly)

### v1.0.0 (2026-08-18)

- Architecture: rule table + argument-name rules drive everything (plain-language copy for 33 tools, takeover list derived automatically); adding a tool takes one line
- Native mode registers nothing: the product UI returns completely, switching takes effect instantly
- Simple mode: timeline rows (category icon + plain-language action + status icon) + delivery-document detail (Markdown subset rendering: tables / code blocks / headings / commit highlighting)
- New "Hide complex tools" toggle (on by default): 21 advanced tools fold into one line
- Stricter data redaction: sensitive argument names never shown, secret shapes replaced, details redacted before rendering
- Floating entry repositions dynamically, following the sidebar and composer, never covering input

### Early versions

- Initial release: Simple / Native two-mode switch, plain-language copy for 33 tools, takeover of 19 tools without native cards

## Contributing

- Found a tool that doesn't fit? Open an issue with the tool name and a screenshot
- Want to add plain-language copy or a new tool rule? Edit `TOOL_RULES` as described in "Adding a tool" and open a PR
- Code style: keep in line with `lib/client.js` (zero dependencies, `React.createElement`, Chinese comments)

## Architecture (everything lives in `lib/client.js`)

```
TOOL_RULES        rule table: 33 tools → plain-language copy + argument summary declarations
ARG_NAME_RULES    argument-name rules: tools without explicit declarations get auto-generated summaries
SENSITIVE_KEY     sensitive argument names (values never shown under any circumstances)
```

Registration is dynamic: the `tool-call` renderer for `conversation.chat.node` registers only in Simple mode (shadowing the product's ToolCallTree with `priority: -1`; a keyed slot throws when the same key registers at the same priority — the lower priority wins), and registers nothing in Native mode, where the product UI renders as shipped. Rows inside the group panel render the plain cards directly, bypassing the `tool.call.toolview` slot (its only consumer is the product's ToolCallTree, which is shadowed in Simple mode).

### Rule table fields

| Field | Meaning |
| --- | --- |
| `tools` | Tool names (array); multiple tools can share one rule |
| `doing` / `done` | Plain-language copy for in-progress / done; generic copy is auto-generated when absent |
| `complex` | Marks a complex tool: folded to one line in Simple mode by default, click to expand |
| `noArgs` | Do not show an argument summary (keep the original behavior) |
| `arg.pick` | Candidate argument keys; the first non-empty string wins, in order |
| `arg.mode` | Presentation mode: `file`=path shows only the basename / `raw`=verbatim / `short`=truncated (with `max`) / `count`=array count (with `unit`) / `wrap`=wrapped in parentheses / `fixed`=fixed copy |
| `arg.prefix` | Summary prefix |
| `arg.fallback` | Copy when the argument is absent; omit to hide the summary |

### Adding a tool

1. Add one line to `TOOL_RULES`. **The tool name alone is enough**: `doing`/`done` get generic plain-language copy automatically, and the argument summary is auto-generated from `ARG_NAME_RULES` by argument name (e.g. `file_path` → "file: xxx", `url` → "link: xxx"); the Simple-mode group panel renders the tool's row by these rules automatically.
2. For more precision, add `doing` / `done` / `arg`; add `complex: true` to fold it by default.
3. The group panel renders every tool in the group (including `read` / `write` etc. that have official native cards) as plain-language rows; in Native mode they remain the product's original cards — no special handling needed.

## Assembly

- `cordis.patch.yml`: bundle patch injection (`insert prism`).
- `package.json`: `dsh.client.inject: ["@deepseek-ai/dsh-client-runtime"]`; the browser half loads through `exports["./client"]`.
- Assembled into the web profile through a `node_modules/dsh-prism` junction pointing straight at the working tree; after editing `lib/client.js`, a page refresh picks it up (no copy to sync).

## License

MIT
