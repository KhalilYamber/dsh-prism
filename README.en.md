# dsh-prism

[![Release](https://img.shields.io/github/v/release/KhalilYamber/dsh-prism?label=Release&color=2da44e)](https://github.com/KhalilYamber/dsh-prism/releases)
[![License](https://img.shields.io/github/license/KhalilYamber/dsh-prism?label=License)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/KhalilYamber/dsh-prism?label=Last%20commit)](https://github.com/KhalilYamber/dsh-prism/commits/main)

[简体中文](./README.md) | **English**

A three-tier UI plugin for the DeepSeek Harness web interface: toggle between **Native**, **Tidy**, and **Plain** with one click. Tidy keeps the product's own tool-row language, Plain rewrites it as plain speech, and both group tool calls into collapsed summaries. Beginners get plain-speak, power users get the full product — the same interface, read three ways.

The project is under active iteration: tracking DSH interface evolution, expanding tool coverage, and polishing the Plain tier experience. Feedback and trial use are welcome.

## Why this exists

After the DeepSeek Harness release, community criticism converged on one point: **the learning curve**.

- 界面新闻: the "everything is a plugin" design leans heavily on configuration (YAML + plugins + effect components + services). "Powerful for advanced users, but for people who just want a working agent quickly, the barrier to entry is high"
- 极客公园: DSH is "not friendly to non-programmers", more like a framework than a finished product — a developer's preview
- Community developers: "Who would actually use this? Why would I plug and unplug things for no reason?"

DSH's bare-bones design is deliberate. But people who want a quick start and people who want the full feature set should not be forced into the same UI. dsh-prism answers that tension with three tiers:

| Mode | For whom | What the UI looks like |
|---|---|---|
| **Plain** | People who want to get going without learning the jargon | Tool calls are grouped and collapsed: the chain of calls before the final reply folds into a one-line summary; expanded, every row speaks plain language ("Reading a file") with emoji icons |
| **Tidy** | People who want a tidier flow without changing how they read the product | Same grouping and collapsing; expanded, every row uses the **product's own row language**: monochrome icon + category title (`Bash` / `Read` / `Edit` / `Tool call`) + "·" + argument summary, e.g. `Bash · Run syntax check`, `Tool call · get_goal · {}` — rendered with the host's built-in official `ui-primitives` components |
| **Native** | Power users who need complete information | Zero plugin takeover — the product renders exactly as shipped, pixel for pixel |

Native is the default. Switching takes effect immediately; refreshing the page returns to Native. Don't want it? Remove the plugin and the UI is back to factory state with nothing left behind.

## Features

- **Sidebar entry**: a round button at the sidebar foot, above Settings (the official `sidebar.footer.action` slot, sharing the row with WSL / memory entries); it shows the current tier initial (N / T / P) and opens the menu to switch between Native / Tidy / Plain, which also carries a "Hide complex tools" toggle (Plain tier only)
- **Tidy tier = collapsed groups × native rows**:
  - Shares grouping and the collapsed summary line with Plain; only the expanded rows differ: they render through the host's built-in official `@deepseek-ai/dsh-client-ui-primitives` (`DisclosureRow`, `StateDot`, official icon components), with titles and summaries derived by the product's own `toolRowModel` rules — visually the same as a shipped tool row
  - Row anatomy: state marker (running / error / interrupted via `StateDot`) + monochrome icon + category title + "·" + argument summary; generic tools carry the tool name the way the product does (`Tool call · get_goal · {}`)
  - Complex tools are not folded (information parity with Native); redaction and detail rendering keep the same floor
- **Plain mode = collapsed tool groups × delivery documents**:
  - Summary view: every tool call in a user turn, up to the model's final reply, folds into one group; collapsed it shows a single stats line, "N tools · M thoughts" (M counts the model's reasoning blocks from assistant output; when there are no thoughts only the tool count shows), with a group status at the end (✓ done / ● running / ✕ had errors)
  - Detail view: click the stats line to open a documented panel — header ("This call: N tools · M thoughts") + list (one row per tool) + note; in the Plain tier a row is category icon + plain-language action / argument summary + status icon, in the Tidy tier an official icon + category title + argument summary; click a row to open that tool's "delivery document" detail (redacted result rendered as Markdown)
  - Hide complex tools: 21 advanced tools (goals / plans, subagent orchestration, background jobs, plugin system) collapse into plain summary rows by default; click "展开" (expand) to reveal and open the detail; the menu toggle turns the folding off at any time
  - Grouping rule: **all** tool calls within one user turn form one group (a single stats line, never split at a reply); a running turn keeps accumulating new calls; replay after refresh regroups by the same rule; every tool appears exactly once
- **Bilingual UI**: every string follows the DSH interface language (Simplified Chinese / English); switching language in Settings takes effect instantly without a refresh — tool copy, argument summaries, menus, and group status all ship in both languages\n- **Data redaction** (one shared floor for both collapsed tiers):
  - Sensitive argument names such as `token / secret / password / api_key / authorization` are never read — the Tidy tier filters them too; when a payload holds only sensitive keys the summary stays empty instead of falling back to raw JSON
  - Common secret shapes in result text and summaries (`sk-xxx`, `Bearer xxx`, `?token=xxx`, `key=xxx`) are replaced with placeholders
  - The Plain tier additionally reduces paths to the file name (`file_path` and similar render as basename); the Tidy tier shows paths by the product rules, to stay close to the shipped rows
  - The detail panel shows only the redacted result — raw arguments never surface
- **Native tier = product as shipped**: in Native mode the plugin registers no tool-row renderer at all and hands rendering back to the product (including generic cards); the collapsed-group node registers only in Tidy and Plain (shadowing the product's tool-call tree with a lower `priority`), and tier switches register / unregister dynamically and take effect instantly
- **Copy rules**: the 33-tool rule table supplies plain-language copy (e.g. `pwsh` → "running a command on the computer"); tools outside the table get an argument-name-derived summary. In the Plain tier every row inside a group renders by these rules; the Tidy tier uses the product's own category titles and summary rules (`Bash · …`, `Tool call · name · …`) and keeps the plugin filter only on the redaction floor

## Design principles

- **Presentation only**: changes purely the UI rendering; model input and output are untouched — the agent's work is unaffected
- **Zero takeover in Native**: no cards are registered in Native mode; the product UI returns completely; in Plain mode tool calls fold into groups whose rows render by the plain-language rules, but the official tool cards themselves are never modified and remain original in Native mode
- **In-memory mode**: refreshing returns to Native — simple, clean, no configuration pollution
- **Theme-following**: only official `--dsw-alias-*` design variables are used; adapts to both light and dark themes

## Installation

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) is required first (Node.js 22.19+ or 24+).

The plugin is distributed through GitHub; clone this repository and install it by local path:

```sh
npx -y @deepseek-ai/dsh plugin --profile web add <path-to-this-repo>
```

You can also grab the packaged artifact from [Releases](https://github.com/KhalilYamber/dsh-prism/releases). After the Web UI starts, the tier entry appears at the sidebar foot, above Settings.

## Usage

1. After startup, click the tier entry at the sidebar foot, above Settings (it shows the current mode)
2. Choose **Plain**: tool calls in a task fold into groups — a one-line summary when collapsed; click to open the panel with a plain-language row per tool and its delivery-document detail
3. The menu can toggle "Hide complex tools" (Plain mode only)
4. Choose **Native**: the full native interface returns
5. Refresh the page to go back to Native mode

## FAQ

**Why do I return to Native mode after a refresh?**
The mode lives in memory. That is deliberate: Plain mode is a temporary aid — when you no longer need it, a refresh makes it disappear without leaving any state behind.

**Why do some tool cards look unchanged?**
Tools like `read`, `write`, and `web_search` already have polished official native cards; the plugin registers no replacement cards for them (Native mode is completely original). In Plain mode they are folded into the group alongside other tools and shown as unified plain-language rows — the official cards themselves are never altered.

**Does Plain mode affect how the agent works?**
No. The plugin only changes the display; the model receives and produces exactly the same input and output as in Native mode.

**What do tables / code blocks look like in the detail panel?**
Result text is redacted first, then rendered as a Markdown subset: `| a | b |` tables, ``` code blocks, `#` headings, `-` lists, `**bold**`, inline code, and commit-hash highlighting; any parse failure falls back to plain text.

## Roadmap

- Keep tracking DSH official interface evolution and stay compatible with new releases
- Expand the tool rule table so more tools automatically get plain-language copy and documented presentation
- Polish the Plain tier experience: timeline rows, delivery-document rendering, redaction granularity
- Add adaptation notes and FAQ entries based on community feedback

Ideas or tools that don't fit well? Open an issue and discuss.

## Changelog

### v1.4.0 (2026-09-18)

- **Entry moved**: the tier switcher left the floating layer for the sidebar foot — the official `sidebar.footer.action` slot, sharing the row with WSL / memory entries and sitting above Settings. The button shows the current tier initial (N / T / P), 28px wide-sidebar / 36px rail, matching its neighbours
- The whole floating-placement logic went with it (including the phone-specific corner fallback): the entry lives in the sidebar, so wide and narrow layouts both just work, with nothing fighting the controls above the composer
- Regression scripts updated for the new entry selector (26 of them)

### v1.3.4 (2026-09-18)

- Phone (narrow-screen) fit: below 560px the floating entry sits at the bottom-left corner instead of competing with the controls above the composer; its touch height grows 31→39px, and the menu and panels stay inside the viewport. Wide-screen behavior is unchanged

### v1.3.3 (2026-09-17)

- Fix: **collapsing was incomplete**. Tool calls inside one user turn used to be split at the "final reply", so calls sitting between replies (common when the model writes and calls as it goes) each got their own row — reading as "half collapsed, half spilled". A turn's **entire** set of tool calls now folds into a single stats line, with no splitting
- Related calibration: the thought count now covers the whole turn's reasoning (it previously counted only reasoning before the final reply), matching the tool-count scope
- Regressions: grouping 26/26 (new "calls after a reply stay in the same group" case), equivalence clean, red-team unit 29/29, red-team browser 20/20

### v1.3.2 (2026-09-17)

Closing review pass (only changes that affect future work):

- Fix: a group's expanded state was keyed by turn number alone, so two sessions sharing the same turn number bled into each other (a group expanded in session A also opened in session B). It is now keyed by session + turn — isolated across sessions, remembered within one
- Cleanup: `dsh.client.inject` carried a package name the host does not have (`@deepseek-ai/dsh-client-runtime`); it is now empty, and the official `ui-primitives` dependency is declared in `peerDependencies`
- Docs: the wiring note and the redaction section caught up with the three tiers (Plain reduces paths to the file name, Tidy shows them as the product does; both share one sensitive-key filter)

### v1.3.1 (2026-09-17)

- Tier names settled: **Native / Tidy / Plain** (previously Native / Medium / Simple). Each word names one perceptible difference — Native is fidelity, Tidy is arrangement, Plain is language — while "Medium" is a degree word that shares no axis with the other two
- Fix: after picking the Tidy tier the bottom-left floating button still read "Native" (the tier-name dispatch was missing the third tier; a full audit confirmed this was the only such site)
- Security (found by red-teaming): the Tidy tier derives summaries by the product rules, but now keeps the redaction floor — sensitive key names (`token` / `secret` / `password` / `api_key` / `authorization` …) are never read; when a payload holds only sensitive keys it no longer falls back to the raw JSON text (which would expose key names and structure); credentials in URL query strings (`?token=` / `&api_key=` / `&sig=` …) are redacted too
- Dropped the `title` attribute on summaries (the product has none), so hovering a long argument no longer pops the whole JSON
- Tier semantics unchanged: no functional or data changes

### v1.3.0 (2026-09-17)

- New **Medium** tier (the plugin is now Native / Medium / Simple). Medium shares grouping and collapsing with Simple; the difference is in the expanded rows: they render through the host's built-in official `ui-primitives` primitives (`DisclosureRow`, `StateDot`, official icon components) with titles and summaries derived by the product's `toolRowModel` rules, so the row language matches a shipped tool row (`Bash · Run syntax check`, `Tool call · get_goal · {}`)
- The official package is reached through the host's platform-singleton module table (`seed.ts` already registers `@deepseek-ai/dsh-client-ui-primitives`): a plain `require`, **no bundling, no install, no dependencies**. If it is unavailable, the tier degrades to a plain layout instead of breaking
- Expanded-row metrics are copied from the product's `ToolRow.module.css` (title weight, 2px dot separator, summary size and ellipsis) and ride the `--dsw-alias-*` theme tokens, so light and dark themes follow automatically

### v1.2.1 (2026-09-17)

- DSH 0.1.5 compatibility: the Chat view snapshot is now read from the runtime-injected `useChat` (the new release moved it from `SessionSnapshot.chat` to `SessionStandardProps.useChat`); the older path is kept as a fallback, so one build groups correctly on both generations of the product
- New diagnostic switch: run `window.__PRISM_DEBUG__ = true` in the console and reload to print the grouping context of the first group node (turn / node count / tool count / boundary verdict) — no more guessing when the product moves underneath
- Regression scripts updated: a new "new-generation ChatSnapshot" case, 25/25 passing

### v1.2.0 (2026-08-18)

- Bilingual UI: every string follows the DSH interface language (zh/en), switching takes effect instantly; all 33 tool rules, argument summaries, menus, and group status ship in English

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
- `package.json`: `dsh.client.external: ["@deepseek-ai/dsh-client-ui-primitives"]` (a platform singleton in the host module table, so a runtime `require` is all it takes — no install, no bundling); the browser half loads through `exports["./client"]`.
- Assembled into the web profile through a `node_modules/dsh-prism` junction pointing straight at the working tree; after editing `lib/client.js`, a page refresh picks it up (no copy to sync).

## License

MIT
