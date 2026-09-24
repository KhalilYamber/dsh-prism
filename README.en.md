# dsh-prism

[![Release](https://img.shields.io/github/v/release/KhalilYamber/dsh-prism?label=Release&color=2da44e)](https://github.com/KhalilYamber/dsh-prism/releases)
[![License](https://img.shields.io/github/license/KhalilYamber/dsh-prism?label=License)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/KhalilYamber/dsh-prism?label=Last%20commit)](https://github.com/KhalilYamber/dsh-prism/commits/main)

[简体中文](./README.md) | **English**

A three-tier UI plugin for the DeepSeek Harness web interface: toggle between **Native**, **Tidy**, and **Plain** with one click. Tidy keeps the product's own tool-row language, Plain rewrites it as plain speech, and both group tool calls into collapsed summaries. Beginners get plain-speak, power users get the full product — the same interface, read three ways.

The project is under active iteration: tracking DSH interface evolution, expanding tool and official-block coverage, and polishing the fold experience and long-session stability. Feedback and trial use are welcome.

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

Native is the default. Switching takes effect immediately, and your choice is remembered: refreshing the page or restarting DSH keeps the tier you picked. Don't want it? Remove the plugin and the UI is back to factory state with nothing left behind.

## Features

- **Sidebar entry**: a round button at the sidebar foot, above Settings (the official `sidebar.footer.action` slot, sharing the row with WSL / memory entries); it shows the current tier initial (N / T / P) and opens the menu to switch between Native / Tidy / Plain, which also carries a "Hide complex tools" toggle (Plain tier only)
- **Tidy tier = collapsed groups × native rows**:
  - Shares grouping and the collapsed summary line with Plain; only the expanded rows differ: they render through the host's built-in official `@deepseek-ai/dsh-client-ui-primitives` (`DisclosureRow`, `StateDot`, official icon components), with titles and summaries derived by the product's own `toolRowModel` rules — visually the same as a shipped tool row
  - Row anatomy: state marker (the official `StateDot`) + monochrome icon + category title + "·" + argument summary; generic tools carry the tool name the way the product does (`Tool call · get_goal · {}`)
  - Two-level state: a tool that truly failed (`isError`) shows red; a command that exited non-zero (a `grep` with no match, a truncated `head` pipe — routine cases) shows amber, captioned "command returned non-zero"
  - Expanded content follows the tool family into official semantic blocks: the command family renders the official `TerminalBlock` (command header + output + copy button), the read family the official `ReadBlock` (with line numbers); everything else keeps the delivery document (`MarkdownText`). When the official primitive is unavailable it falls back in place — nothing is dropped
  - The fold toggle uses the official `FoldToggle`; this host version does not ship it yet, so the plugin's own fallback ("expand ▾ / collapse ▾") is used, and the official one engages automatically once the host upgrades
  - Complex tools are not folded (information parity with Native); redaction and detail rendering keep the same floor
- **Plain mode = collapsed tool groups × delivery documents**:
  - Segmented summary lines: **the tool calls between two pieces of prose fold into one line each**; collapsed it shows "N tools · M thoughts" (M counts that segment's reasoning blocks from assistant output; when there are no thoughts only the tool count shows), with that segment's status at the end (✓ done / ● running / ✕ had errors / ⚠ mixed counts)
  - While a turn runs, the summary line says what is happening: **item N · that tool's plain wording · elapsed time**; once settled it returns to "N tools · M thoughts"
  - The expanded panel is **segmented by step**: **while the turn runs the panel opens by itself and only the current step's thinking is expanded**; when the turn settles it folds back to the single line (a manual click always wins). A segment head tells the truth: **"Thinking done"** when that step reasoned, **"Step done"** when it only called tools; the head controls that segment's thinking text only (collapsed by default)
  - **Tool rows sit on the same level as the segment heads** and stay there (a work log), grouped by a thin rule down the left of each segment; a row opens onto its **native content**: the full arguments (commands are not truncated) plus the full result, both redacted first
  - The answer step is rendered by the plugin itself (the product's renderer for the same key is shadowed, and **returning null means a blank cell** — there is no "hand back" mechanism): one collapsed **"Thinking"** row, then the reply text, so the answer keeps its reason
  - Seats that step aside take no space: folded seats are collapsed with `display` (tool/retry seats, or a settled assistant seat that renders nothing), released per turn on a tier switch or unload — `display` rather than `hidden`, because the product unconditionally strips a same-named `hidden` attribute on its side
  - Hide complex tools: 21 advanced tools (goals / plans, subagent orchestration, background jobs, plugin system) collapse into plain summary rows by default; click "expand" to reveal and open the detail; the menu toggle turns the folding off at any time
  - Grouping rule: a turn is cut into **spans at every assistant step that carries prose** (the tool calls between two pieces of prose form one span each), each span collapsing into its own line right below that prose; inside a span the nodes are still segmented by step. A step that only reasoned is not a boundary (its thinking text stays inside the panel segment); the answer step is always a boundary and nothing after it folds. A running turn keeps accumulating new calls; replay after refresh regroups by the same rule; every tool appears exactly once
- **The clicked block is pinned while a disclosure opens**: opening a panel changes the flow height, and the host's scroll owner (`ui-chat`'s `ChatView.tsx`: a `ResizeObserver` on the flow column that snaps the viewport to the new floor while the reader is pinned to the bottom) would otherwise pull the clicked row out from under the pointer. The plugin records the clicked block's on-screen position at click time and holds it, so the clicked row stays still while its content grows downward. The correction writes only the scroll offset, disarms 320ms after the layout settles (1.2s at the latest), and yields at once to any wheel / touch / scroll-key gesture; mid-transcript reading never moved, and the pin adds nothing there
- **Bilingual UI**: every string follows the DSH interface language (Simplified Chinese / English); switching language in Settings takes effect instantly without a refresh — tool copy, argument summaries, menus, and group status all ship in both languages
- **Data redaction** (one shared floor for both collapsed tiers):
  - Sensitive argument names such as `token / secret / password / api_key / authorization` are never read — the Tidy tier filters them too; when a payload holds only sensitive keys the summary stays empty instead of falling back to raw JSON
  - Common secret shapes in result text and summaries (`sk-xxx`, `Bearer xxx`, `?token=xxx`, `key=xxx`) are replaced with placeholders
  - The Plain tier additionally reduces paths to the file name (`file_path` and similar render as basename); the Tidy tier shows paths by the product rules, to stay close to the shipped rows
  - The detail panel shows only the redacted result — raw arguments never surface
- **Native tier = product as shipped**: in Native mode the plugin registers no tool-row renderer at all and hands rendering back to the product (including generic cards); the collapsed-group nodes register only in Tidy and Plain (taking over `tool-call` / `assistant-step` / `model-retry` with a lower `priority`), and tier switches register / unregister dynamically and take effect instantly
- **Diagnosability**: one-line health check in the tier menu (version + the three registrations + the three spacing counters); the console keeps the last 6 partition runs and the last 5 turn snapshots under `__PRISM_DIAG__`; suspicious shapes are auto-logged (`__PRISM_DIAG_LOG__()` to read, `__PRISM_DIAG_LOG_CLEAR__()` to clear), so a problem that heals itself still leaves its scene behind
- **Copy rules**: the 33-tool rule table supplies plain-language copy (e.g. `pwsh` → "running a command on the computer"); tools outside the table get an argument-name-derived summary. In the Plain tier every row inside a group renders by these rules; the Tidy tier uses the product's own category titles and summary rules (`Bash · …`, `Tool call · name · …`) and keeps the plugin filter only on the redaction floor

## Design principles

- **Presentation only**: changes purely the UI rendering; model input and output are untouched — the agent's work is unaffected
- **Zero takeover in Native**: no cards are registered in Native mode; the product UI returns completely; in Plain mode tool calls fold into groups whose rows render by the plain-language rules, but the official tool cards themselves are never modified and remain original in Native mode
- **Tier memory**: the tier you pick is stored in the browser (`dsh.prism.mode`), so a refresh or a DSH restart keeps it; other UI state (group open/close, menu, hide-complex toggle) stays in memory
- **Theme-following**: only official `--dsw-alias-*` design variables are used; adapts to both light and dark themes
- **Fail loud**: registration and render errors always `console.error('[prism] …')` and land in the diagnostics surface (`window.__PRISM_DIAG__`) — never swallowed
- **Never swallow, never invent**: missing data degrades to a plain rendering instead of a guess or a text-parsed reconstruction; folding never makes content disappear

## Installation

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) is required first (Node.js 22.19+ or 24+).

The plugin is distributed through GitHub; clone this repository and install it by local path:

```sh
npx -y @deepseek-ai/dsh plugin --profile web add <path-to-this-repo>
```

You can also download published artifacts from [Releases](https://github.com/KhalilYamber/dsh-prism/releases). After the Web UI starts, the tier entry appears at the sidebar foot, above Settings.

## Usage

1. After startup, click the tier entry at the sidebar foot, above Settings (it shows the current mode)
2. Choose **Plain**: tool calls in a task fold into groups — a one-line summary when collapsed; click to open the panel with a plain-language row per tool and its delivery-document detail
3. The menu can toggle "Hide complex tools" (Plain mode only)
4. Choose **Native**: the full native interface returns
5. The tier is remembered: a refresh or a DSH restart keeps the current tier; switch back to Native from the menu at any time

## FAQ

**Is my tier remembered? How do I clear it?**
Yes. Your tier is stored in browser local storage (key `dsh.prism.mode`), so a refresh or a DSH restart keeps it. To go back to "Native, no trace", just switch to Native; to remove the memory as well, run `localStorage.removeItem('dsh.prism.mode')` in the browser console and refresh. A different browser (or cleared browser data) starts from the default Native tier.

**Why do some tool cards look unchanged?**
Tools like `read`, `write`, and `web_search` already have polished official native cards; the plugin registers no replacement cards for them (Native mode is completely original). In Plain mode they are folded into the group alongside other tools and shown as unified plain-language rows — the official cards themselves are never altered.

**Why do some status dots show red and others amber?**
Red means the tool really failed; amber means the command exited non-zero (a `grep` with no match or a truncated `head` pipe counts — routine stuff), captioned "command returned non-zero". A run of piped commands no longer paints the whole fold red.

**Does Plain mode affect how the agent works?**
No. The plugin only changes the display; the model receives and produces exactly the same input and output as in Native mode.

**What do tables / code blocks look like in the detail panel?**
Result text is redacted first, then handed to the official `MarkdownText` renderer (tables, code blocks, headings, lists, inline code, and links included); when the official primitives are unavailable it falls back to monospace plain text and never throws.

## Roadmap

- Keep tracking DSH official interface evolution and stay compatible with new releases (once the host ships them, previously missing primitives such as the official `FoldToggle` engage automatically)
- Expand the tool rule table and official-block coverage: the Search / Web / Diff blocks await structured metadata from the product side
- Keep polishing rendering stability in long sessions and the fold experience
- Add adaptation notes and FAQ entries based on community feedback

Ideas or tools that don't fit well? Open an issue and discuss.

## Changelog

### v1.14.1 (2026-09-24)
- **Fixed: the status lights misfiring across the board** (reported the same day: "the red/green/amber lights for tool success and failure — I see red and amber almost all the time now"). Root cause: the v1.14.0 official-vocabulary change added a second `exitCodeOf` in the result section that shadowed the data-layer one; the newcomer returns `undefined` when no exit code is found, while the check reads `code !== null` — `undefined !== null` is always true, so every unmarked text (i.e. every normally successful tool) was judged "exited non-zero": nearly every row showed ✕ and the segment-level success count stayed at 0 (the `✓ n · ! m` counter branch was unreachable — which is also the answer to the previous release's open question about that branch never firing)
- **Row-level grading caught up**: a non-zero exit now shows amber ⚠ ("command returned non-zero") at row level too, matching the segment level; only a real tool failure (`isError`) is red — the v1.14.0 intent ("no more rows of red dots") now holds in both places (plain-language cards and the Tidy tier's official `StateDot` warning state)
- **Anchored to prevent false positives**: exit-code parsing now matches the product's `parseExitStatus` exactly (leading newline + end-of-string anchor) — a `[exit code: N]` string appearing inside a file or a search result no longer counts
- **Verification**: harness **161/161** (default and `--real-primitives`); the new assertions cover row-level three states, the counter branch being reachable, the end anchor, and failures still going red; the **reverse** run against the buggy build turns exactly 3 sentinels red (row-level measured `[0,0,2]` — the two-red-crosses picture reproduced); the other gates pass 16/16, 26/26, 17/17, 13/13, 20/20; live check PASS with 1.14.1 served and zero errors

### v1.14.0 (2026-09-24)
- **The fold cards adopt the official vocabulary** (requested 2026-09-24: "the front end of the fold cards isn't natural enough — can it be polished with the official ui-primitives?"). The investigation found the Tidy tier's *rows* were already the official `DisclosureRow`, while three parts stayed hand-drawn: **the row-end state dot, the fold toggle, and what the expanded row contains**. This release replaces them:
  - State dot → the official `StateDot` (its running state is the same chasing animation as the one in the `TerminalBlock` header, so rows and cards never disagree)
  - Fold toggle → the official `FoldToggle` (`button` + `aria-expanded`; the caption moves from a made-up "expand" to the product's "N more rows")
  - Tool detail → the command family renders through the official `TerminalBlock` (command + output + exit code + one-click copy + its own height fold), the read family through the official `ReadBlock` (a file block with line numbers)
- **Fall back in place when unavailable**: a missing official primitive, or a tool family not yet wired, keeps the original delivery document (`MarkdownText`) — no content is dropped; unwired families must not impersonate an official block
- **No duplication, no loss**: the official block carries its own command header / file name, so `command` / `file_path` are pulled from the outer argument area (on the live app the command used to show up twice); the remaining arguments (`cwd` / `timeout` / `offset` …) stay as before
- **Two-level state** (requested 2026-09-24 after a screenful of red dots): "tool failed" and "command exited non-zero" used to both count as `err`, so a run of `grep` / `head` pipes (non-zero exits) painted every fold row red. Now only `isError` (a real tool failure) is red; a non-zero exit code goes amber (reusing the existing `mixed` state, captioned "command returned non-zero")
- **Why only two families**: the Search / Web / Diff official blocks consume structured metadata the product's tool plugins put into their results (`path` / `offset` / `lines` / `totalLines` and the like); the plugin layer cannot reach it, and parsing the text instead would invent content that looks right and is wrong (red line: never swallow a block, never invent one)
- **Verification**: the harness gained 3 assertions (command family either/or, read family either/or, unwired families do not impersonate), **154/154 green**; a differential run against v1.13.0 turns the result-area assertions red. One device gap fixed: `PRISM_REAL_PRIMITIVES=1` does not survive WSL → Windows node.exe, so a `--real-primitives` flag was added
- **Same-release closing verification**: the two-level state difference is precise: running the pre-grading build turns exactly **1 of 156 assertions red** (its sentinel); the full set is **156/156** (both default and `--real-primitives` modes, measured)

### v1.13.0 (2026-09-24)
- **Automatic incident logging** (reported 2026-09-23: "in long sessions the Tidy tier occasionally shows the native look", and "switching to Native and back to Tidy, plus a refresh, brings it back"). A fault of this kind heals itself, and catching it by hand is unreliable ("there is no broken page left to find"), so a very light pen now hangs on the render path: **only when a suspicious shape appears and its fingerprint changes** does it write one record to local storage (key `dsh.prism.diag.log`, capped at 20, oldest half dropped on overflow)
- **Two suspicious criteria**, both meaning "rows that should have folded did not": `span=false` (the node fell into no span → the tool cell draws a standalone native row, which in the Tidy tier looks exactly like Native) and `claimOK=false` (the claim failed → nobody drew that span's fold line). The product folding its own turn (`foldable`) and nodes outside the window (`inWin=false`) are normal shapes and are **not** recorded — logging them would only drown the signal
- **What is written**: structure only (whether a span formed, whether it was claimed, where, and that turn's DOM counts of tool seats / prism fold lines / collapsed seats); no node keys, no prose; the fingerprint leads with the session, so same-numbered turns from two sessions never swallow each other
- **How to read it**: `__PRISM_DIAG_LOG__()` in the console returns the JSON, `__PRISM_DIAG_LOG_CLEAR__()` clears it; the `dev/prism-claim-dump.js` probe prints it alongside
- **Verification**: the harness gained 6 assertions (one record when no span forms / no repeat write for the same shape / nothing recorded for normal shapes / a changed shape within a turn replaces rather than stacks / corrupted storage is wiped on the spot / logging still works after the wipe), **152/152 green**; the **reverse** run against `--client=dev/client-1.12.0-backup.js` (the build without the logger) turns **5 of them red** without breaking the run — the assertions bite. Live check: delivered version 1.13.0, tier and all three registrations healthy, the read control in place, the storage key **absent** while nothing is wrong; plus an end-to-end pass (inject a sample → read it back → clear)
- **Three issues fixed in the closing review** (all introduced by this release): the fingerprint no longer contains the tool count (it used to write to disk once per arriving tool in a long turn); within one turn and one kind only the newest record is kept (a single turn cannot overflow the 20-slot cap); corrupted or over-quota storage is cleaned once and re-armed (the logger can no longer fail silently forever). One assertion was also fixed: on the old build "comparing empty arrays by length" happened to be equal and then read `undefined`, crashing the whole run — now it turns red as it should, without the crash

### v1.12.0 (2026-09-22)
- **Tier memory**: the chosen tier is stored in browser local storage (`dsh.prism.mode`, the same route the host uses for its own UI preferences such as `dsh.conversation.contentWidth`). The read happens before the store is created, so renderers register from the remembered tier at startup. Unreadable, malformed, or blocked storage counts as "never stored" and falls back to Native; a storage failure logs one `console.warn` and never touches the `errors` counter
- **Only the tier is remembered**: group open/close, menu, and the hide-complex toggle stay in memory
- **Verification**: new device `dev/prism-persist-check.mjs` (real React + real Chrome + real reload) **20/20**; reverse verification: dropping the write → 8 red, reading a constant → 5 red. Regression: harness 145/145, seat contract 16/16, data red team 26/26, browser red team 17/17, pin check 13/13, self-check probe 12/12

### v1.11.0 (2026-09-22)
- **The clicked row stays put when a disclosure opens** (requested on 2026-09-22: "every time I open a fold card the interface flies off, up or down; the card should stay still and the interface should expand downward"). The cause is in the host, with source evidence: `ui-chat`'s `ChatView.tsx` watches the flow column with a `ResizeObserver` and, while the reader is pinned to the bottom (`FOLLOW_THRESHOLD = 24px`), its callback writes `el.scrollTop = el.scrollHeight`. Opening a panel makes the column taller, so the viewport is yanked to the new floor. Measured on the live page: **160px up** on open while pinned, **151px down** on close. The plugin now records the clicked block's on-screen y at click time and holds it while the column resizes, writing back only the scroll offset — no product state touched, no timer added (it disarms 320ms after the layout settles, 1.2s at the latest) and yields at once to wheel / touch / scroll keys / clicks elsewhere
- **Every height-changing disclosure is covered**: group cards, segment thinking heads, answer thinking, tool-row details. The tidy tier's rows are drawn by the official `DisclosureRow`, so they now carry the plugin's own `prism-native-row` class — that is what the pin recognises
- **Mid-transcript reading is untouched**: the host moves nothing there, and the pin adds nothing either (measured Δy = 0)
- **Acceptance**: the new `dev/prism-pin-check.mjs` (real React + real Chrome + a stand-in for the host's follow behaviour) passes **13/13**; reverse verification removes the pin and turns the pinned assertions red (Δy 0 → −151px) while the mid case stays green. Stub 145/145, seat contract 16/16, data red team 26/26, browser red team 17/17; the old 1.9.9 client scores 136/145 on the same stub (the nine reds are the v1.10 partition sentinels)

### v1.10.9 (2026-09-21)
- **Header comment and diagnostics red line (v1.10.9)**: the file header now states what the plugin is; the diagnostics surface (`__PRISM_DIAG__.groups` / `snap`) is marked **local troubleshooting only — never paste it into a public repo**, since it carries session-internal node keys and turn structure. Also, `.gitignore` now excludes `dev/` (about 5MB of local probes, screenshots and historical backups, which may contain real session text)

- **The fold scope moved from "one line per turn" to "one line between two pieces of prose."** While the model writes and works in alternation, a long turn is now cut into spans at every assistant step that carries prose; each span's tool calls collapse into one line directly below that prose. The inside of a segment (panel, per-step segmentation, segment heads, accordion, redaction) is untouched. A turn without a prose boundary (a pure tool run) still folds into a single line, so the behaviour stays continuous
- **How a boundary is decided**: prose (including images and unknown blocks) counts; a step that only reasoned does **not** — its thinking text stays inside the panel segment, so a timeline is not shredded just because every step has thoughts; the answer step is always a boundary and nothing after it folds. This rule lives in one place in the data layer, shared by segmentation and the fold boundary
- **Each line keeps its own books**: the claim ledger and the open/closed state are both keyed by session + turn + span id, so opening one line no longer drags the whole turn with it; a span id is its first step number, stable once formed
- **Half gap (v1.10.2 follow-up)**: the seat that carries a collapsed line and the row right after it both take half the flow gap (8px — the same value the product uses for its own folded process rows), so a card sits tight against its prose; seats this turn owns but renders nothing for (tool / retry) are collapsed outright, since they are zero-height yet each hold a 16px gap — the other half of the "too much space" cause; and releasing now only returns the keys that pass folded itself, so a co-owner's fresh fold no longer pops back
- **Fixed: "after a turn completes it sometimes shows the native look" (v1.10.7)**: the assistant render path called `useMode()` after its "no span → early return" guard, so when that cell changed shape between two renders (which happens exactly as a turn settles) the hook count moved and React threw #310 (Rendered more hooks). It throws outside the plugin catch, the keyed slot abdicates, and the cell falls back to the product row. The tier read now happens before every early return, guarded by a standing browser assertion that switches span⇄no-span and requires no #310
- **Diagnostics at a glance (v1.10.5)**: the tier menu line now shows all three spacing counters — `seats=` (seats collapsed by the fold list), `blank=` (blank seats collapsed outright this turn), `compact=` (rows taking the half gap). Zeros are printed too, since a counter that stays at zero while a card is on screen is exactly the anomaly worth seeing
- **Bounded bookkeeping for long sessions (v1.10.4)**: the manual open/close maps (collapsed lines, segment heads, answer thinking, row details) are keyed by session and therefore cannot be cleared per turn; with no cap they grow for the life of a long session and are never reclaimed when a session closes. Past 600 entries the oldest half is now dropped — only rebuildable UI state, touching neither data nor any rendering contract
- **Tier difference restored (v1.10.3 follow-up)**: rows inside a panel must be "Tidy = the product's own row language (official primitives + category title + summary), Plain = plain speech (emoji + plain wording)". The assistant-side rendering path used to read the tier from `props.mode`, a prop an assistant node never receives — so whenever a prose step claimed the collapsed line (the normal case since the v1.10.0 partition), the Tidy panel fell wholesale into the plain branch, which is exactly the "Tidy looks like Plain" report. The tier now always comes from `useMode()`, and four standing browser-level assertions require the two tiers to differ
- **An assistant step renders its own line**: prose first, the card right below it (two pieces in one render), so a card always sits under the prose it belongs to
- The regression harness grew to **140 assertions** (13 covering the partition and spacing: row count, per-span stats, prose-before-card order, the answer step not claiming, independent open state, cross-session isolation, the no-boundary fallback, tool-only steps not forming a boundary, assistant-path seat collapse, the compact mark, and blank-seat collapse); the previous release scores 132/140 on the same set, and the 8 differences are exactly this feature's sentinels

### v1.9.0 – v1.9.9 (2026-09-19)

Every entry below came from a real failure on a live session:

- **Fixed: the whole answer step was blank in the collapsed tiers.** It used to "hand the answer step back" by returning null, but a keyed slot renders only its winner — a null winner is an empty cell. The plugin now renders the answer step itself (thinking + text + images + a JsonBlock fallback for unknown blocks); no block is dropped
- **Fixed: the summary line went missing for up to 10s after a tier switch.** Unmounting an owner stamped "still active"; now it hands the claim straight back, and a tier switch clears the claim ledger
- **Fixed: the product stripped the plugin's `hidden` attribute** (its own side removes any same-named attribute when its flag turns false). Seat collapsing now uses `display`; releasing is scoped per turn
- **Fixed: the plugin fought the product's own process folding** (default compact view hides member seats once a turn closes, taking the plugin's row with them). It now defers; when you expand the product's process area the plugin renders rows individually so the content is visible
- **Fixed: the step number was read from a field that does not exist** (`location.step.seq`; the real one is `location.step.step`). The fold boundary is now decided by node order instead of step arithmetic
- **Fixed: a retry-only turn lost its retry information**, and **errors used to degrade to blank** (now they degrade to a plain row / plain text and are recorded in the diagnostics)
- **New: the summary line says what is happening while running**; the panel opens by itself during a run and expands only the current step's thinking (a manual click wins)
- **New: tool rows sit on the same level as the segment heads** and stay visible; heads read "Thinking done" or "Step done" by fact
- **New: the expanded detail shows native content** — full arguments (no command truncation) plus the full result, complex arguments rendered by the official `JsonBlock`
- **New: the answer step's thinking is a collapsed one-line row**, so internal reasoning is no longer dumped above the reply
- **Fixed: one crash used to take a whole class of rows with it.** A `try/catch` inside the plugin only catches errors thrown by its own code; when the throw happens in the middle of a product hook call, the hook count no longer matches the previous render, React raises its own error outside the plugin's catch, and the slot **abdicates** the entry — the cell falls back to the product's own renderer, so the summary row and the tool rows vanish together while the menu still reads `tool-call=ok`. Each node now sits inside the plugin's own error boundary: a crash degrades to a single row and never reaches the slot
- **Fixed: the error log kept only the message**, which cannot locate a throw. It now carries the stack (`[prism] 抛出位置：` plus up to 6 frames on the console)
- **The sidebar entry stays a single-character dot** (the user's call, after one attempt at the alternative): wide and rail are both round buttons (28 / 36px), the same size as the other plugins in that slot and on the same centreline. A full-width "row" version following the house style was tried and reverted — on the real machine it pushed the neighbouring buttons past the sidebar edge. The only hardening kept is `flex:none`: the entry neither gets squeezed nor steals width from its neighbours
- The regression harness grew into an acceptance table: **126 assertions**, including tier switching, claim handoff, seat spacing, hook-order stability, the crash boundary, the sidebar entry shape, and the redaction floor

### v1.8.0 (2026-09-19)

- **The collapsed group was rebuilt from first principles**: the data layer (segmentation / counts / answer boundary) is split from the view layer, and segments and tool rows render independently; running, settled, and replayed turns share one rule set
- **The answer boundary now comes from the product's supported channel**: `props.turnProcess.spec.answerStep` (what `ChatNodeSeat` hands every node renderer) first, with `location.turn.data.get('turn-process')` as the fallback — handing the answer step back no longer depends on the plugin parsing it itself
- **Two claim rules tightened**: only a node that is both in the window and inside the fold may claim (before, a node that could not find itself held the render right while rendering nothing, and the whole turn's summary row disappeared); when the owner leaves the window, the next node takes over immediately instead of waiting out the 10-second expiry
- **Retry rows fold in**: `model-retry` is taken over too, so the product's retry row is no longer rendered separately (the same fact used to be drawn twice)
- **Seat spacing**: folded nodes leave empty seats behind. The product spaces `.flowItem`s one by one, while the slot anchor is a permanently present `display:contents` element, so `.flowItem:empty` never matches — every node that steps aside left its own 16px gap. The plugin now borrows the product's `hidden="until-found"` and collapses the seats that genuinely render nothing, releasing them all on a tier switch or unload
- **One row per node**: a `node.key` delivered twice by the window is no longer rendered twice, and a segment that has thinking but no tools is no longer dropped as empty
- **The regression harness became an acceptance table**: 40 assertions, including click-driven group and segment toggling, seat spacing, tier-switch release, and the invisible-claimant case; `node dev/harness.mjs --client=dev/xxx.js` runs the same suite against an older build for a differential (1.7.1 fails 8 of them)

### v1.6.3 (2026-09-18)

- **No more silent failures**: renderer registration and both component bodies used to sit inside bare catches, so a failure produced no signal at all — the user simply saw "the plugin does nothing". Errors now `console.error('[prism] …')` and land in `window.__PRISM_DIAG__` (registered renderers plus the error list), so diagnosis has evidence
- To check: run `window.__PRISM_DIAG__` in the console to see whether registration succeeded and what a render threw

### v1.6.2 (2026-09-18)

- **Empty panels are never rendered**: when the expanded view holds no segment with content, the whole panel returns an empty element instead of rendering a hollow shell; that shell used to keep its padding and leave a blank block in the transcript (the "content collapsed but a placeholder remains" symptom)
- Segments start collapsed; a segment's body (thinking text plus tool rows) appears only while it is open
- The build version is now readable in the browser (tier menu title), so diagnosing which build a page runs needs no guessing

### v1.6.1 (2026-09-18)

- **Segments start collapsed**: opening the turn summary now shows a tidy stack of "Thinking done" rows (as the reference does) instead of a fully expanded list; an expansion is remembered per "session + turn + segment index"
- **In-box blank space removed**: the thinking text used to carry `max-height:260px + overflow:auto`, so a long reasoning left blank space and an inner scrollbar inside its box, reading as "content removed leaving a gap". There is no height cap now; the page scrolls
- **Tool rows became accordions**: a row keeps its one-line height (icon + text + elapsed + status + expand) and opens its detail **inline**, instead of stretching into two blocks
- **The summary row and the panel lost their extra outer margins**: the product already spaces adjacent rows, so a second layer of margins read as an empty gap
- A collapsed segment is strictly one line: the regression measures `segHeads=0 / toolRows=0 / thinkingBlocks=0` when collapsed, and per-node rendering yields exactly one summary row with every other node returning null

### v1.6.0 (2026-09-18)

- **A collapsed segment is now just one "Thinking done" row.** Segments used to lay their tool summaries out inline, so the collapsed state already showed two levels (a title plus a long list of rows). Now a collapsed segment carries only its head (name + status + entry count), with tools and thinking living inside the expansion
- **Thinking text appears only when a segment is expanded, and is explicitly labelled "Thinking".** It is the model's internal reasoning and must not read as a reply to the user; earlier I moved that text into the segment without any such distinction, English original included — my mistake
- **The Assistant node is taken over, so thinking rows stop occupying their own space.** In the collapsed tiers the plugin renders the `assistant-step` node itself: visible text blocks only, reasoning blocks no longer rendered separately (the product hides its thinking row only when four conditions hold at once, which almost never happens in a long turn). Shadow check: the product's renderer for the same key is not called in the collapsed tiers
- Regressions: a collapsed group renders zero segment content; expanded it renders every segment head and entry; the claim mechanism yields exactly one summary row per turn; a no-Assistant window with 6 tools yields 6 segments; exit-code failures are counted

### v1.5.5 (2026-09-18)

- **Thinking rows no longer take up their own space**: in the collapsed tiers the plugin now takes over the `assistant-step` node, renders only the visible reply text, and keeps the thinking text as the expanded content of its "Thinking done" segment. Previously the product hid a thinking row only under four conditions at once (foldable turn + answer step + inline reasoning + process closed), so in long turns the reasoning stayed spread out above the summary row
- **Fix: registration was lost when the tier did not change.** `setMode` used to return early when the tier was already the requested one, while renderer registration is driven by the subscription notification — so once "state says Plain, registration missing" happened, clicking Plain again did nothing and the group vanished. Setting the tier now always notifies
- Expanded segment order: that segment's thinking text first, then its tool details; collapsed, a segment keeps only its "Thinking done" row plus inline entry summaries

### v1.5.4 (2026-09-18)

- The version is now visible in the UI: the tier menu title reads "Interface mode · v1.5.4", so telling which build a page runs no longer needs a guess or the console
- Confirmed on the live app: one summary row per turn in Plain tier, the mixed status (⚠ ✓1 · ✕1) correct, and `exit 5` counted as a failure

### v1.5.3 (2026-09-18)

- **Fix: the summary row could disappear entirely.** The previous version treated "render nothing when I cannot find myself" as the default, so in a long turn no node dared render the row. Render ownership now works by **claiming**: exactly one node per turn renders the summary row, the first renderer claims it and the rest yield; the claim expires ten seconds after its owner unmounts, letting a later node take over. No duplicates, no vanishing row
- Regressions: all 7 nodes of a turn each render once → exactly one summary row; an orphan node renders nothing; a no-Assistant window with 6 tools yields 6 segments
- Note on the reference implementation: this effect follows HanaAgent (openhanako)'s "busy for a while · N tools · M thoughts", but the architectures differ — its fold happens by **reordering the whole message list before render** (one message carries the entire turn's process), while DSH dispatches **per node** through slots, so a plugin never holds a once-per-turn position; the claim mechanism reproduces the same outcome at node granularity

### v1.5.2 (2026-09-18)

- **Fix: a whole turn collapsed into one segment.** Segmentation used to read the step number only from Assistant nodes, yet a long real turn often gets a window that does **not** hand over those nodes — so thirty-odd tool calls and twenty thoughts landed in a single segment, reading as one solid block. Tool and retry nodes now contribute their own step number (`location.step.seq`), so segments still form when no Assistant node is present
- A `[prism-segments]` debug line now prints the window's node kinds, Assistant step numbers, tool step numbers, segment count, and each segment's tool/retry/thought counts, so segmentation can be judged from one line instead of guessed
- Regression case added: no-Assistant window (6 tools → 6 segments)

### v1.5.1 (2026-09-18)

- **Fix: a long turn used to show a column of identical summary rows.** When a turn holds many tool calls (30 – 75 in practice), the product's session window does not hand over every node of that turn, so the plugin's old rule — "find my own key, and render my own group if it is missing" — made every node that could not find itself render a complete group of its own, producing a stack of identical "N tools · M thoughts" rows. Boundaries are now decided by **position inside the window**: only the window's last node renders the group, and a node that cannot find itself renders nothing; tools are deduplicated inside a segment too. Regression cases live in `dev/harness.mjs` (an orphan node renders nothing; a window that delivers one key twice still draws one row)
- Note: this was a pre-existing boundary rule that v1.5.0's segmentation exposed (the old tier hid it by another path, yet long turns repeated there too)

### v1.5.0 (2026-09-18)

- **Failure now follows the exit code**: the product writes a non-zero exit into the shell result's **text** (`[exit code: N]`) and does not set `isError` — so a command like `exit 3` used to show a green check. Row status now reads both `isError` and the exit code in the result text; either one means failure, and the row title carries "exit code N"
- **The expanded panel is now segmented by step**: a user turn still folds into one summary line (same scope as before), but opening it no longer shows a flat tool list — the group is cut by model step, one segment per step, each segment holding only that step's tool calls and retry rows. The segment head keeps the product's own "Thinking done" wording, and every segment opens and closes on its own, open by default and remembered per "session + turn + segment index"
- **Retry rows join the tally**: the product owns its own retry row (node kind `model-retry`); the plugin neither takes it over nor redraws its style, and only folds it into a one-line count so "attempts failed" lands in the same accounting
- **Every row carries elapsed time**: settled rows show the call-to-result delta (e.g. `12.3s`), running rows tick up in seconds; the values come from `callTime` / `time` already on the product's tool block, so the plugin needs no clock of its own
- The segment head invents no wording: the product still renders its own "Thinking done" row, and the plugin neither touches nor redraws it
- The Plain and Tidy tiers keep their difference (one speaks plainer, one keeps the product's row language); both share the same segment structure

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

Registration is dynamic: the `tool-call` renderer for `conversation.chat.node` registers only in the Plain and Tidy tiers (shadowing the product's ToolCallTree with `priority: -1`; a keyed slot throws when the same key registers at the same priority — the lower priority wins), and registers nothing in Native mode, where the product UI renders as shipped. Rows inside the group panel render through the plugin directly (plain-language cards / native rows, with expanded details going to the official semantic blocks or the delivery document), bypassing the `tool.call.toolview` slot (its only consumer is the product's ToolCallTree, which is shadowed in the collapsed tiers).

Partition and segmentation: `computeGroups()` first cuts the turn's nodes into spans at every assistant step carrying prose (one span between two pieces of prose; the answer step is a boundary and nothing after it folds; a tool-only step is not a boundary), then hands each span to `computeSegments()`, which cuts it by `step` (a segment is bounded by its last tool or retry node, so every node renders exactly once). The segment head keeps the product's own "Thinking done" wording, and rows inside reuse `ToolCard` / `NativeToolRow` / `RetryRow`. Each collapsed line's rendering right is claimed per session + turn + span id (`useGroupClaim`), and its open state is keyed the same way. Elapsed time comes from the `callTime` and `time` already on the tool block, and a running row advances through the `useTick()` one-second beat, which only starts while running rows exist.

### Rule table fields

| Field | Meaning |
| --- | --- |
| `tools` | Tool names (array); multiple tools can share one rule |
| `doing` / `done` | Plain-language copy for in-progress / done; generic copy is auto-generated when absent |
| `complex` | Marks a complex tool: folded to one line in Plain mode by default, click to expand |
| `noArgs` | Do not show an argument summary (keep the original behavior) |
| `arg.pick` | Candidate argument keys; the first non-empty string wins, in order |
| `arg.mode` | Presentation mode: `file`=path shows only the basename / `raw`=verbatim / `short`=truncated (with `max`) / `count`=array count (with `unit`) / `wrap`=wrapped in parentheses / `fixed`=fixed copy |
| `arg.prefix` | Summary prefix |
| `arg.fallback` | Copy when the argument is absent; omit to hide the summary |

### Adding a tool

1. Add one line to `TOOL_RULES`. **The tool name alone is enough**: `doing`/`done` get generic plain-language copy automatically, and the argument summary is auto-generated from `ARG_NAME_RULES` by argument name (e.g. `file_path` → "file: xxx", `url` → "link: xxx"); the Plain-mode group panel renders the tool's row by these rules automatically.
2. For more precision, add `doing` / `done` / `arg`; add `complex: true` to fold it by default.
3. The group panel renders every tool in the group (including `read` / `write` etc. that have official native cards) as plain-language rows; in Native mode they remain the product's original cards — no special handling needed.

## Assembly

- `cordis.patch.yml`: bundle patch injection (`insert prism`).
- `package.json`: `dsh.client.external: ["@deepseek-ai/dsh-client-ui-primitives"]` (a platform singleton in the host module table, so a runtime `require` is all it takes — no install, no bundling); the browser half loads through `exports["./client"]`.
- Assembled into the web profile through a `node_modules/dsh-prism` junction pointing straight at the working tree; after editing `lib/client.js`, a page refresh picks it up (no copy to sync).

## License

MIT
