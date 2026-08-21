# NFC Profile Card — Design Exploration

## Three stylistic approaches

| Theme Name | Very Brief Intro | Probability |
|---|---|---:|
| Quiet Authority | Editorial luxury with warm paper, ink-dark typography, and an architectural portrait frame. It makes a personal profile feel considered rather than decorative. | 0.07 |
| Signal Atlas | A clean, information-led identity system inspired by wayfinding and NFC signal geometry. Layered cards and precise lines make the contact path feel immediate. | 0.04 |
| Studio Ledger | A tactile creative-studio aesthetic with an off-white field, cobalt signature color, and carefully indexed details. It balances approachability with premium craft. | 0.09 |

## Chosen approach: Signal Atlas

### Design Movement
**Contemporary Swiss editorial design** reinterpreted for a personal digital profile: intentional asymmetry, typographic hierarchy, and functional visual signals.

### Core Principles
1. **Identity before decoration:** the name, role, and contact paths remain the clear primary actions.
2. **Quiet precision:** one strong signature blue, strict spacing, calibrated line-work, and purposeful contrasts replace ornamental effects.
3. **One-hand flow:** a contact should be reachable and legible immediately after tapping an NFC card on a phone.
4. **Trust through structure:** every area has a clear label, hierarchy, and useful action.

### Color Philosophy
The base is a gentle warm-white, chosen to feel personal and tactile rather than like a generic app canvas. Near-black ink creates high-legibility editorial contrast. **Signal cobalt** is reserved for decisive actions, identity accents, and the NFC motif, making it feel owned instead of incidental. Soft mineral grey separates information without cluttering the profile.

### Layout Paradigm
The public page is a **vertical identity rail** rather than a centered card: a small status line anchors the page, an offset portrait mark establishes identity, and social/contact actions appear as numbered, edge-aligned routes. The admin view uses a split control-and-preview workstation, so changes feel directly connected to the live card.

### Signature Elements
1. A three-arc **NFC signal mark** with a solid core dot.
2. Fine indexed rules and number labels, used to guide the eye through profile actions.
3. A cobalt **action spine** that visually joins the main profile details with the contact routes.

### Interaction Philosophy
Interactions are direct and finite. Contact routes have a satisfying press response; link hover states expose an arrow motion rather than ornamental scaling. The admin editor keeps a persistent draft status and real-time card preview so the user always understands the consequence of a change.

### Animation
On first load, the identity header resolves first, followed by action routes in 55 ms increments. NFC arcs breathe once at a low amplitude, then settle. Buttons use a 120–160 ms press response and a 180 ms arrow slide. All non-essential animation is disabled under reduced-motion preferences.

### Typography System
**Manrope** provides an expressive but controlled headline and UI system; **DM Mono** is used only for labels, route numbers, handles, and admin metadata. Names use a high-weight Manrope display treatment, roles use tracked uppercase Manrope, while body copy retains generous line-height. No Inter.

### Brand Essence
**A tap-ready personal identity page for independent creators who want their most important connections to feel instantly credible.**

Personality: **precise, warm, self-assured**.

### Brand Voice
Headlines are concise and declarative; CTAs describe the outcome, never the mechanism. Microcopy is calm, specific, and human.

> “One tap. The right next step.”

> “Save the details that matter.”

### Wordmark & Logo
The wordmark pairs a clean Manrope name treatment with a custom geometric **signal dot and three-arc mark**. The logo is always graphic-first; it remains recognizable without a name.

### Signature Brand Color
**Signal Cobalt — #2457F5**

## Style Decisions

- Route visuals use a **Swiss wayfinding language**: numbered paths, fine rules, directional arrows, restrained mono-line glyphs, and a single continuous cobalt trace rather than app-like social badges.
- The admin workspace follows the public card’s warm-paper, ink, DM Mono indexing, and reserved cobalt system; connection and save states are treated as editorial status lines rather than generic SaaS pills.
- Default profile copy must be specific and outcome-led. It should name the person’s practical contribution, never rely on broad technology buzzwords.
