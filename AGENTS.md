# AGENTS.md

## Style Guide Adherence

All UI work in this workspace must follow the shared style guide before using external templates or mockups as reference.

### Required brand sources

- [`style-guide.html`](/C:/Users/suhas.bhandari/Downloads/Claude/Experiments/Common%20Design/style-guide.html) is the source of truth for shared-system branding decisions.
- [`shared-top-nav.html`](/C:/Users/suhas.bhandari/Downloads/Claude/Experiments/Common%20Design/shared-top-nav.html) is an implementation surface, not a replacement for the style guide.
- External mockups or template files may inform layout structure, but they must not override brand rules defined in the style guide.

### Fonts

- Deccan Herald:
  Use `Playfair Display` for brand-facing navigation and headline treatments unless the style guide defines a more specific token for the component.
- Deccan Herald body/supporting text:
  Use `Roboto Slab` unless explicitly overridden by the style guide.
- Prajavani:
  Use the Prajavani font set defined in the style guide and local implementations:
  `Prajavani Headline` or `PV Headline` for headline/navigation contexts, and `Prajavani Text` or `PV Text` for body/supporting text.
- Do not introduce generic UI fonts into brand-facing content unless the text is explicitly documentation/chrome for the style guide itself.

### Logos

- Use the approved brand logo asset for each brand whenever a production-facing brand lockup is shown.
- Do not substitute text wordmarks, placeholder logos, or recolored approximations if an approved logo asset is already available.
- If a logo must be embedded inline, preserve the approved shape and only change color when that is explicitly part of the approved brand treatment.

### Colors

- Deccan Herald primary brand color: `#0091AC`
- Prajavani primary brand color: `#B82831`
- Shared ePaper yellow: `#FFC107`
- Any component-level color should derive from brand tokens or semantic tokens mapped to these brand values.
- Do not hardcode template colors for production-facing components when brand tokens exist.

### Implementation rule

- When adapting external layout templates, reuse the structure if useful, but remap typography, logo usage, and color treatment to the shared style guide.
- In shared editorial/card layouts, hero cards must always use larger headline text than non-hero/supporting cards. Use the first-row hero treatment as the reference hierarchy and preserve that contrast across breakpoints.
- In shared editorial/card layouts, the read-time and publish-time metadata row must align to the bottom of the card content area. Within that row, publish time must align to the right edge of the card.
- In mobile shared editorial/card layouts, all headlines must be clamped to 3 lines with ellipsis.
- In shared editorial/card layouts, all card images must maintain a strict `3:2` aspect ratio across breakpoints. Do not stretch, auto-fill, or relax the ratio to match adjacent card heights.
- If a shared editorial/card layout needs extra card height to align with adjacent cards, increase the non-image content area. Keep the image at strict `3:2` and let the text/overlay portion absorb the extra height.
- If there is a conflict between a template and the style guide, the style guide wins.
