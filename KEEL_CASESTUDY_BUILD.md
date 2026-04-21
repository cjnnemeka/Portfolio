# Build: Keel Case Study Page (v2 — Senior Architecture)

You are adding a fourth case study to an existing, deployed portfolio at `C:\Users\Michael\Desktop\portfolio`. The site is live at michaelihenacho.vercel.app. Three case studies already ship (NoelX, Clovr, Nexora). Keel is the fourth.

**This build is architecturally different from the other three case studies.** Keel is a thesis case study, not a process case study. The page must serve three reader speeds simultaneously — the 10-second recruiter, the 2-minute hiring manager, and the 10-minute panel interviewer. The architectural moves below are how it does that.

Follow these instructions exactly. Do not invent features, routes, or components that aren't specified. Do not refactor existing case studies. Do not touch Header, Footer, or ScreenCarousel components.

---

## Decisions already made — do not relitigate

- **Accent color:** Teal `#0D9488`. Used for the "CASE STUDY" label, scroll progress bar, vertical accent lines, hover states, metric numbers, Design Question emphasis, POV pull-quote, and sticky thesis bar. Nowhere else.
- **Page theme:** Dark.
- **Homepage placement:** Four-card grid. Order: **Keel → NoelX → Clovr → Nexora**.
- **Next Project cycling:** Keel → NoelX → Clovr → Nexora → Keel.
- **Page structure:** Problem → Design Question → Key Decisions (3) → What Didn't Ship → The Artifact → Point of View → Reflection.
- **Decision count:** Three, not four. Retrieval-vs-fine-tuning is cut; its substance is preserved in "What Didn't Ship."

---

## Task 1 — Update project data

Update `src/data/projects.ts`. Add Keel as the **first** entry, reorder so remaining entries follow.

```typescript
{
  slug: 'keel',
  title: 'Keel',
  subtitle: 'Governance for AI-Authored Design Systems',
  description: 'A governance layer that sits between a design system and the AI tools consuming it — auditing what AI ships rather than generating more.',
  role: 'Product Designer & Builder',
  year: '2026',
  tags: ['Product Design', 'AI-Native', 'Design Systems', 'Developer Tools'],
  color: '#0D9488',
}
```

Final order: Keel, NoelX, Clovr, Nexora.

---

## Task 2 — Update homepage

In `src/app/page.tsx`, render four project cards from the updated projects array. Layout: 2×2 grid on desktop (Keel top-left, NoelX top-right, Clovr bottom-left, Nexora bottom-right). Single column stacked on mobile. Keep the existing card component, hover interactions, and animation patterns exactly as they are. Do not restyle cards.

If the existing homepage uses a specific aesthetic choice (asymmetric layout, hero-featured card), preserve the aesthetic DNA and adapt to fit four cards. If in doubt, the 2×2 grid wins.

Confirm project cards still link correctly.

---

## Task 3 — Build the Keel case study page

Create `src/app/work/keel/page.tsx`. Use `'use client'` directive. Follow the same file patterns as other case studies (inline styles, duplicated animation utilities). Same imports:

- `Header` from `@/components/Header`
- `Footer` from `@/components/Footer`
- `ScreenCarousel` from `@/components/ScreenCarousel`

Copy these utilities into the file from an existing case study page:
- `StaggerContainer` and `staggerChild` variants
- `ParallaxImage` component
- `ScrollProgress` bar component (accent: teal `#0D9488`)
- `AnimatedMetric` component
- Hover lift styles
- Image lightbox component

Plus three NEW components specified in this build (see Task 4, 5, 6 below).

### Images at `public/images/Keel/`

Use these filenames. Do not rename or reprocess.

- `drift-dashboard-dark.png` — hero + demo loop step 1
- `drift-detail-dark.png` — demo loop step 3 + Decision 2 card
- `improver-proposal-dark.png` — demo loop steps 5–6 + Decision 1 card + artifact carousel
- `parity-pass-dark.png` — artifact carousel
- `parity-failing-2-light.png` — Decision 3 card (light version is fine, contrasts against dark page)
- `parity-failing-5-dark.png` — artifact carousel
- `policy-dark.png` — artifact carousel
- `timeline-dark.png` — demo loop final step + artifact carousel

### Page skeleton

```
Header (existing, fixed)
ScrollProgress bar (teal)
StickyThesisBar (new — see Task 4)
FixedSectionIndex (new — see Task 5)
  ↓
Hero
Section 01 — The Problem
Section 02 — The Design Question (focal moment)
Section 03 — Key Decisions (3 cards, progressive disclosure)
Section 04 — What Didn't Ship (structural section — the scope-discipline moment)
Section 05 — The Artifact (scroll-scrubbed demo loop + carousel)
Section 06 — Point of View (largest visual moment on the page)
Section 07 — Reflection
Next Project block → NoelX
Footer
```

---

## Task 4 — Sticky Thesis Bar (NEW component)

A thin horizontal strip fixed to the top of the viewport, below the header, that appears when the reader scrolls past the Design Question section and stays visible through the rest of the page.

**Purpose:** The reader is never more than a glance away from the thesis.

### Behavior

- Hidden by default (opacity 0, translateY -10px, pointer-events none).
- Activates when the bottom of Section 02 (Design Question) scrolls above the viewport top.
- Deactivates when the reader scrolls back above Section 02 OR dismisses it with the × button.
- Transition: opacity + translateY, 300ms ease-out.
- Once dismissed in a session, stays dismissed (use React state, not localStorage — a new visit re-enables it).

### Styling

- Position: `fixed`, `top: [exact Header height + 0px]`, left 0, right 0, z-index one below the Header.
- Height: 44px on desktop, 52px on mobile (two-line wrap ok on mobile).
- Background: `rgba(13, 148, 136, 0.08)` (teal at 8%) with `backdrop-filter: blur(16px)` and a 1px bottom border at `rgba(13, 148, 136, 0.2)`.
- Text: body font, 13px desktop / 12px mobile, font-weight 500, `--text-primary`.
- Left-border accent: 3px solid teal `#0D9488` on the leftmost edge of the text (not the bar itself).
- Dismiss button: × icon, 16px, muted color, right side, 16px from edge. Hover: text-primary color.
- Max-width content inside matches the page's content grid width, centered.

### Content

Use the condensed POV:

> **Keel exists because when AI ships design system output, the quality-ownership question has no answer. Keel makes the answer possible.**

### Implementation note

Use `IntersectionObserver` on the Design Question section to toggle visibility. Not scroll position math — observer is more reliable across resize and content shifts.

```tsx
const [thesisBarVisible, setThesisBarVisible] = useState(false);
const [dismissed, setDismissed] = useState(false);
const designQuestionRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!designQuestionRef.current) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      setThesisBarVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    },
    { threshold: 0 }
  );
  observer.observe(designQuestionRef.current);
  return () => observer.disconnect();
}, []);
```

Respect `prefers-reduced-motion` — skip the translateY animation if set, keep only opacity.

---

## Task 5 — Fixed Section Index (NEW component)

A vertical column of seven small dots, fixed to the left margin on desktop (lg breakpoint and up). Clicking scrolls to the section. Active section highlights in teal. Hover reveals section label.

**Purpose:** On arrival, the reader sees seven dots and knows the argument has seven moves. During reading, gives control (scanner can jump, deep reader can orient).

### Behavior

- Visible only on desktop (`lg:` and up, roughly 1024px+). Hidden on mobile — do not build a mobile version, do not build a drawer, just display none below lg.
- Hidden on the hero section (no dots until the reader scrolls past the hero's bottom edge).
- Active dot: determined by which section currently occupies the most viewport real estate. Update via IntersectionObserver with `threshold: [0, 0.25, 0.5, 0.75, 1]` on each section, pick the one with highest intersection ratio.
- Click a dot: smooth scroll to that section's top. Use `scrollIntoView({ behavior: 'smooth', block: 'start' })`.
- Hover a dot: the section label fades in to the right of it (150ms).

### Styling

- Position: `fixed`, `left: 32px`, vertically centered (`top: 50%`, `transform: translateY(-50%)`).
- Width: auto (expands on hover to include label).
- Dots: 8px × 8px circles, 20px vertical gap between.
- Inactive dot: 1px border in `rgba(255, 255, 255, 0.2)`, transparent fill.
- Active dot: filled teal `#0D9488`, no border.
- Hover dot: fill `rgba(13, 148, 136, 0.5)`.
- Label: mono font, 11px, uppercase, letter-spacing 0.1em, `--text-primary`, `margin-left: 16px`, appears on hover only.
- Transition: 200ms ease on all states.
- Respect `prefers-reduced-motion` — disable transitions.

### Section labels

```
1. Problem
2. Question
3. Decisions
4. Cut Scope
5. Artifact
6. POV
7. Reflection
```

Deliberately short. These are signposts, not headlines.

### Implementation note

Each section in the page gets a unique `id` attribute (`section-problem`, `section-question`, `section-decisions`, `section-cut-scope`, `section-artifact`, `section-pov`, `section-reflection`). The index uses these IDs for click navigation and observation targets.

---

## Task 6 — Hero section

**Back link:** "← Back to work" → `/#work`

**Label:** `CASE STUDY` — teal `#0D9488`, mono, uppercase, letter-spacing 0.1em, 11px, font-weight 500.

**Title:** `Keel` — massive display font, line-by-line reveal, 0.08s stagger.

**Subtitle** (body, `--text-secondary`, max-width 640px):

> Generation is getting faster. Review isn't. Keel is a governance layer that sits between a design system and the AI tools consuming it — auditing what AI ships rather than generating more.

**Metadata row — 4 columns:**

| Role | Timeline | Tools | Type |
|---|---|---|---|
| Product Designer & Builder | 2026 | Next.js, TypeScript, Tailwind, Postgres, Anthropic API | AI-Native — Live Demo |

**Live link chip** — mono, 0.75rem, font-weight 500, uppercase, letter-spacing 0.1em, teal `#0D9488`, with arrow → after text. Hover opacity 0.7. `target="_blank"`, `rel="noopener noreferrer"`. Text: `VIEW LIVE DEMO →`. URL: `https://keel-demo-psi.vercel.app`. Wrap in motion.div with fadeIn pattern, delay 0.9.

**Tech stack marquee** (◆-separated):

> Next.js ◆ TypeScript ◆ Tailwind ◆ Postgres ◆ pgvector ◆ Anthropic API ◆ Opus 4.7 ◆ Sonnet 4.6 ◆ Voyage Embeddings ◆ Railway ◆ Vercel

**Hero image:** Full-width `ParallaxImage`, aspect 16:8, `drift-dashboard-dark.png`, alt "Keel dashboard showing drift detection for the Meridian design system".

**Optional subtle detail — the "9" count-up.** On the hero image, if feasible without touching the image file, overlay an absolutely-positioned element that animates a count from 0 to 9 on first viewport entry, aligned roughly where the "9 drift issues" number sits in the screenshot. 900ms duration, ease-out. This is a one-time subtle life signal, not a loop. If exact positioning over the static image is fragile across display sizes, skip this. Don't ship it broken.

---

## Task 7 — Section 01: The Problem

`<section id="section-problem">`

**Number:** "01" mono, muted.
**Title:** "The Problem" — display font, large.
**StaggerContainer on children.**

**Paragraph 1** (body, secondary, max-width 680px):

> AI-generated design system code looks right at a glance and is wrong in ways that take twenty minutes to find. An invented shadow value that reads plausibly but isn't in the foundation. Off-scale spacing — `p-7` when the scale is 4/8/12/16/20/24. A primitive used where a semantic token should be. A token name that sounds correct and doesn't exist.

**Paragraph 2:**

> A design systems lead reviewing fifteen AI-authored pull requests a day cannot catch these at review speed. So they don't. The drift compounds. Every company running an AI-assisted authoring loop in 2026 is hitting this problem. Spotify and GitHub solved it internally, with dedicated teams. Nobody is solving it for the mid-size product company.

**Paragraph 3** (punch line):

> The tooling industry's answer has been to ship generation faster. Keel is the other answer.

---

## Task 8 — Section 02: The Design Question (focal moment)

`<section id="section-question" ref={designQuestionRef}>`

Second-loudest moment on the page. Generous vertical padding (128px top and bottom minimum on desktop, 80px mobile).

**Number:** "02" mono, muted.
**Label:** `THE DESIGN QUESTION` — teal, mono, uppercase, 11px, letter-spacing 0.1em.

**Question** — pull-quote treatment. Display font, 2.75rem desktop / 1.75rem mobile, line-height 1.15, tracking-tight, `--text-primary`, max-width 860px, left-aligned:

> How do design systems stay trustworthy when AI agents are consuming them?

**Supporting line** below, body, secondary, max-width 640px, 24px gap:

> Every design decision in Keel traces back to this. When I couldn't answer it, I cut the feature.

---

## Task 9 — Section 03: Key Decisions (progressive disclosure)

`<section id="section-decisions">`

**Number:** "03" mono, muted.
**Title:** "Key Decisions" — display, large.

**Intro paragraph** (body, secondary, max-width 680px):

> Keel could have shipped three AI modes, written back to Figma, rendered pixel diffs, supported multi-user teams, and integrated with Storybook. It shipped one AI-facing mode and five subsystems. Every cut is documented. Scope discipline is the design.

Then render **three decision cards**, each built as a progressive-disclosure component.

### Progressive disclosure decision card — component spec

Default (collapsed) state shows: CHALLENGE text + image. Expanding reveals: DECISION + RESULT.

**Layout:**
- Two-column split card on desktop (content left, image right). Single column on mobile (image below content).
- Content column: 45% width desktop, full-width mobile.
- Image column: 55% width desktop, full-width mobile.
- Vertical teal accent line (2px) on the left edge of the content column, animating in height from 0 to 100% on scroll-into-view (same pattern as other case studies).

**Collapsed state (default):**
- `CHALLENGE` mono label, teal, 11px, uppercase, letter-spacing 0.1em.
- Challenge body text, body font, 15px, line-height 1.6, `--text-primary`.
- Image on the right, click opens lightbox.
- Bottom of content column: "Expand reasoning" button.

**Expand button:**
- Text: `EXPAND REASONING +` (the + becomes − when expanded).
- Mono font, 11px, uppercase, letter-spacing 0.1em, teal.
- Bottom-aligned in content column, 32px margin-top from challenge text.
- Hover: color shifts to `--text-primary`, teal underline appears below.
- Click: reveals DECISION and RESULT blocks below, using Framer Motion `AnimatePresence` with height auto. 400ms ease-out transition.

**Expanded state (after click):**
- DECISION mono label, teal, 11px — 24px margin-top from challenge.
- Decision body text.
- RESULT mono label, teal, 11px — 24px margin-top from decision.
- Result body text.
- Button text: `COLLAPSE −`.

**Motion:** Use `AnimatePresence` with `initial={{ height: 0, opacity: 0 }}`, `animate={{ height: 'auto', opacity: 1 }}`, `exit={{ height: 0, opacity: 0 }}`. Set `overflow: hidden` on container. Respect `prefers-reduced-motion` — instant show/hide if set.

### Decision 1 — Improver first, not three modes

- **CHALLENGE:** Keel could have shipped three AI-facing modes. Improver (AI fixes existing drift). Assisted (AI helps author new work with real-time parity feedback). 80/20 (AI drafts 80% of a component, human polishes 20%). Shipping all three was feasible. The question wasn't capacity — it was which mode would land the thesis.

- **DECISION:** Ship Improver first. Cut 80/20. Leave Assisted as a UI stub marked "coming soon."

- **RESULT:** Improver is the only mode that contradicts the industry narrative. Every other AI tool optimizes generation. Improver optimizes review. It also has the tightest demo: input is existing drift, output is a one-class token swap. Either it works or it doesn't. Assisted and 80/20 would have required imagining AI's output quality at scale — Improver shows one deterministic swap you can verify in the live product. Scope discipline as product design, not as engineering trade-off.

- **Image:** `improver-proposal-dark.png`

### Decision 2 — Link-to-version over pixel-diff

- **CHALLENGE:** When Keel flags drift, the obvious next move is to render both component versions side-by-side and visually diff them. Designers would love it. It would demo well.

- **DECISION:** Don't build it. Link to the two versions instead.

- **RESULT:** Pixel diffing is a visualization product in itself — rendering both states, computing visual differences, resolving layout ambiguity when the diff spans layout changes. Building a visualization product inside a governance product is scope creep disguised as polish. Link-to-version delivers ninety percent of the insight (here's the change, here's what it replaces, here's why it happened) for ten percent of the engineering. The lesson: scope discipline means noticing when a feature would become its own product.

- **Image:** `drift-detail-dark.png`

### Decision 3 — Whitelist linting over model-based parity

- **CHALLENGE:** Parity checking — the audit that decides whether AI output conforms to the foundation — could have been probabilistic. Ask a model: "does this output look right?" Model-based checking would catch nuance that a whitelist misses.

- **DECISION:** Use a deterministic whitelist. Either the token exists in the foundation, or it doesn't. Either the spacing value is on the scale, or it isn't. No probabilistic judgment anywhere in the parity check.

- **RESULT:** Probabilistic review fails at exactly the wrong moment. When AI-generated code looks plausible and isn't, a model asked "does this look right?" will often answer yes. That's the whole class of bug Keel exists to catch. Whitelists don't have bad days. When the output is a gate on whether AI-authored code ships, reliability beats sophistication — I picked the boring tool because the boring tool doesn't have bad days.

- **Image:** `parity-failing-2-light.png`

---

## Task 10 — Section 04: What Didn't Ship (structural section)

`<section id="section-cut-scope">`

This is the scope-discipline-as-design moment elevated from rhetoric to structure.

**Number:** "04" mono, muted.
**Title:** "What Didn't Ship" — display, large.

**Intro paragraph:**

> Every case study lists what the designer built. The cuts are usually more revealing. Each of these was proposed in-scope, prototyped or fully specced, and cut for a reason worth stating out loud.

### Layout — two-column table

Desktop: two-column table structure. Single column stacked on mobile.

Left column header: `FEATURE` (mono, teal, 11px, uppercase).
Right column header: `WHY IT'S NOT HERE` (mono, teal, 11px, uppercase).

Each row: 1px bottom border `rgba(255, 255, 255, 0.08)`, 32px vertical padding.

Rows, in this order:

| Feature | Why it's not here |
|---|---|
| **Fine-tuning the Improver model on the design system** | Fine-tuned taste is implicit and unauditable. You can't inspect what the model learned. Keel uses retrieval instead — Voyage embeddings, pgvector similarity — so the design system stays the single source of truth. A token change updates immediately. Fine-tuning creates a second source that can drift from the first, which is the exact problem Keel exists to solve. |
| **Figma write-back** | Figma's own MCP handles the write-back direction. Duplicating it would require translating clean JSX to Figma nodes, and that translation is lossy. Keel's principle is clean code as output — writing lossy versions back to Figma undermines it. Deferred, not dropped. |
| **Pixel-diff rendering** | Would become its own product. Rendering both states, computing visual diffs, resolving layout ambiguity — that's a visualization product inside a governance product. Link-to-version delivers 90% of the insight for 10% of the engineering. |
| **Multi-user, teams, RBAC, SSO, billing** | Not in the thesis. The thesis is review gap, not team coordination. v2 territory, and calling it v2 is not an apology. |
| **Storybook MCP integration** | Sharpens nothing the current scope doesn't already prove. The demo loop works without it. Deferred to v2. |
| **Assisted mode (AI authors new components with real-time parity)** | Ships as a stub marked "coming soon." Keeping it out of scope sharpens Improver's argument. Two modes would dilute the "review is the frontier" thesis to "AI does lots of things." |
| **80/20 mode (AI drafts, human polishes)** | Cut entirely, not even stubbed. Same reason as above — plus the mode itself is closest to what every other AI tool already ships. Including it would look like convergence, not a thesis. |

**Closing paragraph** (body, secondary, max-width 680px, 48px margin-top):

> Keel shipped small because shipping small is what let the thesis land. Every deferred feature has a documented reason. Scope discipline is what the product is.

---

## Task 11 — Section 05: The Artifact (scroll-scrubbed demo loop + carousel)

`<section id="section-artifact">`

**Number:** "05" mono, muted.
**Title:** "The Artifact" — display, large.

**Intro paragraph:**

> Five subsystems, one AI-facing mode, one continuous loop from detection to resolution. Live at [keel-demo-psi.vercel.app](https://keel-demo-psi.vercel.app).

### The scroll-scrubbed demo loop — new component

**Purpose:** The entire thesis argued in six steps, compressed into a 20-second scroll. Screenshot on the left sticks to the viewport while the narration on the right scrolls past it. Screenshot changes as each step's text enters the reading zone.

### Behavior spec (desktop, lg+)

The component is a tall container (approximately 600vh on desktop) inside the section. Inside it:

- **Left half (sticky):** A single screenshot container, `position: sticky`, `top: 15vh`, `height: 70vh`. Contains six absolutely-positioned images that cross-fade as scroll progresses.
- **Right half (flowing):** Six step blocks, each at `min-height: 100vh`. Each block contains a large step number (01–06), a short title, and one paragraph.

### Behavior spec (mobile, below lg)

**Abandon the sticky pattern entirely.** Render as a vertical sequence — each step shows its screenshot above its text. No scroll hijacking. No sticky behavior. No scroll-scrubbing. This is non-negotiable. Mobile gets the simple version. This is also what renders when `prefers-reduced-motion: reduce` is set, on any screen size.

### Step content

| # | Title | Image | Body |
|---|---|---|---|
| 01 | Monday morning | `drift-dashboard-dark.png` | Maya opens Keel. Nine drift issues since Monday. Health 62/100. Three red high-severity rows at the top. |
| 02 | Pick the first one | `drift-dashboard-dark.png` | `Textarea.tsx` references an undefined token: `input-border`. It sounds like it should exist. It doesn't. Click through. |
| 03 | See the drift | `drift-detail-dark.png` | Three columns side-by-side — documentation, tokens, component source. Orange `≠` markers between each column mark the disagreement. The component uses a token that sounds right and isn't defined anywhere in the foundation. |
| 04 | Let Improver propose a fix | `drift-detail-dark.png` | Click the button. Opus 4.7 pulls retrieval context from similar components. The parity checker reviews the proposal. The policy engine routes it. All before the UI updates. |
| 05 | The proposal renders | `improver-proposal-dark.png` | Rationale: replace undefined `input-border` with documented `border` token. One-class swap. Parity: pass. Policy: Draft PR. Live preview of the compiled component renders inline. Accept, Reject, or ignore. |
| 06 | Accept | `timeline-dark.png` | Toast. Panel collapses. A new pending row lands at the top of the supervision timeline, timestamped seconds ago. Detection to resolution in six clicks. |

### Implementation — desktop

Use IntersectionObserver on each step block to determine the active step. The sticky image container renders all six images stacked absolutely, with `opacity: activeStep === i ? 1 : 0` and `transition: opacity 300ms ease-out`.

```tsx
const [activeStep, setActiveStep] = useState(0);
const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0.5) {
          const index = stepRefs.current.findIndex(ref => ref === entry.target);
          if (index !== -1) setActiveStep(index);
        }
      });
    },
    { threshold: [0, 0.5, 1], rootMargin: '-20% 0px -20% 0px' }
  );
  stepRefs.current.forEach(ref => ref && observer.observe(ref));
  return () => observer.disconnect();
}, []);
```

### Performance

Use Next.js `<Image>` component for all six images. Set `priority` on images 1 and 2, lazy-load 3–6. Images must be optimized — under 150KB each if possible. All six loaded on mount is fine. Do NOT use CSS background-image.

### Failure mode

If the scroll-scrubbed behavior is janky, jittery, stutters on scroll, or breaks on Chrome/Safari/Firefox desktop, **fall back to the mobile pattern** — vertical numbered narrative with each step rendered as a paragraph with its screenshot beside or above it. A clean simple version beats a broken complex one. Test on Chrome and Safari before declaring done.

### Below the demo loop

**One short paragraph:**

> Detection, proposal, parity, policy, timeline. The entire thesis argued in six clicks. Every screenshot on this page supports this loop.

### Full artifact carousel

Below the demo loop, a `ScreenCarousel` with the complete screen set. Order:

1. `drift-dashboard-dark.png` — Drift dashboard. Meridian at 62/100, nine issues, severity split.
2. `drift-detail-dark.png` — Drift detail. Documentation, tokens, and component source diffed in three columns.
3. `improver-proposal-dark.png` — Improver proposal. Rationale, parity result, policy decision, live preview, Accept/Reject in one panel.
4. `parity-pass-dark.png` — Parity check passing. 23 rules across 6 categories, no violations.
5. `parity-failing-5-dark.png` — Parity check failing. Five violations on an AI-authored PR.
6. `policy-dark.png` — Trust-level policy engine. Seven Suggest Only, three Draft PR, zero Auto-merge — conservative by design.
7. `timeline-dark.png` — Supervision timeline. Every AI action logged, grouped by day, filterable.

Captions in mono, 13px, secondary color.

### Demo disclosure block

Place at the end of Section 05. Small type (13px), muted color, boxed (1px teal border at 40% opacity, 24px padding, rounded corners, max-width 680px):

> Improver proposals in the public deployment serve from pre-recorded fixtures. The full pipeline — parity check, policy engine, supervision timeline, database writes — runs live. The AI generation step is captured rather than live-called to preserve API budget and ensure reliability for visitors.

---

## Task 12 — Section 06: Point of View (largest visual moment)

`<section id="section-pov">`

**This is the single biggest moment on the page. Design it accordingly.**

Vertical padding: 160px top and bottom on desktop, 96px on mobile. No other section has this much breathing room.

**Number:** "06" mono, muted.
**Label:** `POINT OF VIEW` — teal, mono, uppercase, 11px, letter-spacing 0.1em.

**Pull-quote.** Display font, 2.5rem desktop / 1.625rem mobile, line-height 1.2, tracking-tight, `--text-primary`, max-width 860px, left-aligned. No decorative quote marks. No border. The whitespace is the frame.

> AI-generated design system output is unreliable in ways that are invisible at review speed. The tooling industry is shipping generation faster instead of solving review. Review is the frontier. That's the gap Keel sits in.

**Below the quote, 64px gap, two supporting paragraphs** in body font, secondary color, max-width 680px:

> Spotify and GitHub solved this internally with dedicated teams. Keel doesn't claim to invent the category — it claims to make the solution legible for teams without Spotify's headcount. Contribution beats invention.

> Every design decision I made on Keel was a bet on review being more important than generation. The boring tool beats the clever one when the output is a gate on what ships. The whitelist doesn't have bad days.

---

## Task 13 — Section 07: Reflection

`<section id="section-reflection">`

**Number:** "07" mono, muted.
**Title:** "Reflection" — display, medium. (Smaller than section titles above — this section is lower in the weight stack.)

Two short subsections. No decoration — mono label + paragraph each. 64px gap between them.

**THE SANDPACK PIVOT** (mono label, teal, 11px, uppercase, letter-spacing 0.1em):

> The original plan for Improver's live component preview was Sandpack — CodeSandbox's in-browser bundler. Worked locally. In production, Sandpack's bundler endpoint was unreachable from my ISP — confirmed via incognito, confirmed via phone on a different network. ISP-level block, no client-side workaround. I rebuilt the preview pipeline from scratch: server-side Tailwind + PostCSS + Babel compiling TSX to static HTML + CSS, rendered in a plain iframe. 64–83ms warm compile. Zero external runtime dependencies. The lesson: external dependency risk is a design decision, not an engineering decision. Sandpack's one failure mode had no local workaround. The slower-to-build path eliminated an entire class of production fragility.

**WHAT I'D DO DIFFERENTLY** (mono label, teal, 11px, uppercase, letter-spacing 0.1em):

> Meridian — the synthetic design system Keel audits in the demo — has nine planted drift issues. Anchoring the demo to a system I could fully control was the right call for a solo build. But the stronger version would have run against three real public design systems from day one, with Meridian reserved for planted edge cases. Keel already ingests shadcn/ui at 100/100 as a second real-world validation. I'd start with that pattern, not retrofit it.

---

## Task 14 — Next Project block

Standard pattern from existing case studies. Text: `NEXT PROJECT` (mono label, teal, 11px). Large title link to **NoelX**, subtitle "AI-Powered Patient Recovery System." Hover behavior matches existing pages. Route: `/work/noelx`.

---

## Task 15 — Update Next Project cycling on other case studies

Only one change needed:

- `src/app/work/nexora/page.tsx` → Next Project block now links to **Keel** (was NoelX). Subtitle: "Governance for AI-Authored Design Systems."

NoelX → Clovr and Clovr → Nexora remain unchanged.

Final cycle: Keel → NoelX → Clovr → Nexora → Keel.

---

## Task 16 — Update About page

In `src/app/about/page.tsx`, weave in the portfolio arc sentence. Place it at the end of the WHO I AM block, OR as a new standalone short block between existing blocks — whichever reads cleaner with the existing copy. Do not rewrite the existing About copy.

Sentence to add:

> NoelX is the case for "can this person ship a full product end-to-end for a real market?" Keel is the case for "can this person read where the discipline is going and stake out a thesis before the category consolidates?" Two different questions. Both need answers.

---

## Verification checklist

Before declaring done, confirm every item. Do not skip any.

**Build health:**
- [ ] `npm run build` succeeds. Zero TypeScript errors.
- [ ] `npm run dev` — no runtime errors in browser console on the Keel page or homepage.

**Page renders:**
- [ ] Page renders at `localhost:3000/work/keel`.
- [ ] All eight images load (no 404s in network tab).
- [ ] Scroll progress bar is teal `#0D9488`.
- [ ] Back link returns to `/#work` and scrolls to the work section.
- [ ] Live demo link opens `https://keel-demo-psi.vercel.app` in new tab.

**Sticky thesis bar:**
- [ ] Hidden on initial load.
- [ ] Appears after scrolling past the Design Question section.
- [ ] Disappears when scrolled back above Design Question.
- [ ] Dismissible with ×; stays dismissed for the session.
- [ ] Does not overlap the Header.
- [ ] On mobile, wraps to two lines if needed without overflow.

**Fixed section index:**
- [ ] Hidden on mobile (below lg breakpoint).
- [ ] Hidden during hero section (appears after scrolling past hero).
- [ ] Active dot updates correctly as user scrolls through sections.
- [ ] Clicking a dot smooth-scrolls to that section's top.
- [ ] Hover reveals section label.

**Decision cards:**
- [ ] All three cards show CHALLENGE + image by default.
- [ ] "Expand reasoning +" button visible on each card.
- [ ] Clicking expands to reveal DECISION + RESULT smoothly.
- [ ] Button text updates to "Collapse −" when expanded.
- [ ] Lightbox opens on image click.
- [ ] Expanded content animation is smooth (not janky).

**"What Didn't Ship" section:**
- [ ] Seven rows render in table layout on desktop.
- [ ] Stacks cleanly on mobile.
- [ ] Row borders visible but subtle.

**Demo loop:**
- [ ] Desktop (lg+): sticky screenshot on left, scrolling text on right.
- [ ] Screenshot cross-fades between six images as steps activate.
- [ ] Transitions are smooth (test in Chrome + Safari).
- [ ] Mobile: abandons sticky entirely, renders as vertical sequence.
- [ ] `prefers-reduced-motion` disables sticky on all sizes.
- [ ] No scroll stutter, no jitter.

**POV section:**
- [ ] Largest visual moment on the page. More whitespace than any other section.
- [ ] Pull-quote legible and impactful.

**Homepage:**
- [ ] Four project cards in order: Keel, NoelX, Clovr, Nexora.
- [ ] All four cards link to correct routes.
- [ ] Layout reads cleanly on desktop and mobile.

**Next Project cycling:**
- [ ] Keel → NoelX.
- [ ] Nexora → Keel (was NoelX).
- [ ] NoelX → Clovr (unchanged).
- [ ] Clovr → Nexora (unchanged).

**About page:**
- [ ] Arc sentence present and reads cleanly in context.

**Dark theme only:**
- [ ] No light-mode styles introduced anywhere.

**Don't-touch list:**
- [ ] No changes to `Header.tsx`, `Footer.tsx`, `ScreenCarousel.tsx` component files.
- [ ] Other case study pages (NoelX, Clovr) unchanged except the Next Project link on Nexora.

**Mobile pass:**
- [ ] Hero title wraps cleanly at ~375px width.
- [ ] All sections readable without horizontal scroll.
- [ ] Section index hidden on mobile.
- [ ] Demo loop uses vertical pattern on mobile.
- [ ] Decision cards stack to single column.

**Commit:**
- [ ] Commit message: `feat: add Keel case study with senior architecture`.

---

## Tone — non-negotiable

Grounded. Non-optimistic. Underclaim relative to the artifact.

No "great," "excited," "journey," "passion," "innovative," "solution," "seamless," or any word a recruiter sees 200 times a day. The product is live and the screenshots are strong — the copy's job is to frame, not to impress.

Do not call Keel "category-defining." Do not claim it solves problems nobody else could. Spotify and GitHub have solved this internally; Keel's claim is that it makes the solution legible for teams without that headcount. Contribution beats invention.

If in doubt, say less.
