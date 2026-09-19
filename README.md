# Chart Dashboard

A field-picker panel and multi-chart dashboard built for the "sales lead vs. design-partner customer" field-picker scenario, then extended into a small BI-style tool (multiple charts, drag/resize, IndexedDB persistence).

## Running it

```bash
npm install
npm start      # dev server
npm run build  # production build
```

## The design write-up

### The tension, and how it's resolved

The sales lead's complaint was really about **gating**: needing to type before you can even see a field. The customer's complaint was really about **structure**: 28 flat items with no visual hierarchy reads as noise. Those aren't opposite requirements — you can fix the second without reintroducing the first.

The resolution has three parts:

1. **Grouping instead of hiding.** The 28 fields are organized into 8 semantic groups (Geography, Customer Profile, Product, Sales & Deal, Marketing, Account & Support under Dimensions; Revenue & Volume, Customer & Ops Health under Measures). A labeled group of 2–5 fields is scannable; a flat list of 28 is not. This is what actually solves the customer's "wall" reaction — not hiding content, giving it shape.
2. **Search as an accelerator, never a gate.** The search box filters the real field list live (substring match, case-insensitive, highlighted). An empty box shows everything; typing only ever narrows what's already visible, and clearing it restores all 28 instantly. Nothing is ever reachable *only* through search.
3. **Hover/focus definitions.** Jargon-y fields (MRR, NPS Score, Days to Close, Signup Cohort, ...) show a plain-English description on hover or keyboard focus, so an unfamiliar field doesn't force a context-switch away from the panel.

### A trade-off worth flagging honestly

Groups are now collapsed into an accordion (only the first group per section starts open) — added on request, after the above was already working. That reopens a version of the sales lead's original complaint: a field outside the first group is back to being one click away instead of zero. I mitigated the worst of it — search still force-expands any group with a match, so a searched-for field is never buried — but *browsing* (no typing) now costs a click for most fields. That's a real regression against the original brief's "nothing hidden," made deliberately in exchange for a more compact default panel, and it's the first thing I'd revisit if the live-demo use case is still the priority.


### One thing to test

Hand it to someone who wasn't in this conversation and ask them to find and chart **Days to Close** without touching the search box. If they hesitate hunting through collapsed groups, or reach for search out of frustration rather than habit, the accordion trade-off above has gone too far for a live-demo context and the default-open behavior needs revisiting (e.g., open every group by default and let the accordion only be a manual "tidy up" affordance, rather than a default-collapsed state).
# chart-builder
