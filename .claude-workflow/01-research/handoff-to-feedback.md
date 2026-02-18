# Handoff: trend-researcher -> feedback-synthesizer

**Date:** 2026-01-15
**Project:** Estate Pulse (builder/developer real estate listings)
**Status:** Trends research complete, need user feedback validation

---

## Context from Trends Research

Key hypotheses to validate with user feedback:

### 1. Pain Points to Confirm
| Hypothesis | Source | Validate With |
|------------|--------|---------------|
| Hidden costs frustrate buyers (35%) | Industry reports | App reviews, Reddit |
| Inaccurate/outdated listings | Common complaint | Platform-specific reviews |
| Poor builder communication | Trend data | User forums, Twitter |
| Pricing opacity for new construction | Competitive gap | 99acres/MagicBricks reviews |
| No construction progress visibility | Identified gap | First-time buyer discussions |

### 2. Feature Validation Needed
- **Price-gating after login**: Do users hate this or accept it?
- **Comparison tools**: How frustrated are users with current 2-3 property limits?
- **Map-first UX**: Are users asking for this? Or satisfied with list-first?
- **WhatsApp notifications**: Desire level in India market?

### 3. Competitive Weaknesses to Probe
From trends research - competitors have these gaps. Validate users actually care:
- Mixed resale + new construction (confusing?)
- No builder credibility signals
- Poor project progress tracking
- Fragmented inquiry systems

---

## Feedback Sources to Analyze

### Priority 1: App Store Reviews (High Signal)
| Platform | iOS App Store | Google Play | Notes |
|----------|---------------|-------------|-------|
| 99acres | Yes | Yes | India market leader |
| MagicBricks | Yes | Yes | Good feature set |
| Housing.com | Yes | Yes | Neighborhood focus |
| NoBroker | Yes | Yes | Disruptor model |
| Zillow | Yes | Yes | US market reference |
| Redfin | Yes | Yes | US agent model |

**What to extract:**
- 1-2 star reviews (pain points)
- Recent reviews (last 6 months)
- New construction specific complaints
- Feature requests

### Priority 2: Reddit Discussions
| Subreddit | Focus |
|-----------|-------|
| r/RealEstate | US home buying general |
| r/FirstTimeHomeBuyer | Beginner pain points |
| r/india | India market discussions |
| r/bangalore, r/pune, r/hyderabad | City-specific India |
| r/realestateinvesting | Investor perspective |

**Search queries:**
- "new construction problems"
- "builder issues"
- "99acres complaints"
- "MagicBricks vs Housing"
- "home buying frustrating"
- "real estate app terrible"

### Priority 3: Twitter/X Discussions
**Search terms:**
- "99acres worst" / "99acres hate"
- "MagicBricks fraud"
- "Housing.com fake listings"
- "new construction nightmare"
- "builder didn't deliver"
- "RERA complaint"

### Priority 4: Forum Discussions
| Source | Why |
|--------|-----|
| Quora (India) | Long-form complaints about platforms |
| TeamBHP forums | Car enthusiast overlap with home buyers |
| ValuePickr | Investor perspectives |
| Blind (for tech workers) | High-income buyer segment |

---

## Specific Questions to Answer

### User Pain Points
1. What do users hate most about 99acres/MagicBricks?
2. What's the #1 complaint about new construction buying?
3. How frustrated are users with lead spam from platforms?
4. Do users trust builder ratings on existing platforms?

### Feature Desires
1. Are users asking for better comparison tools?
2. Do users want WhatsApp over email notifications?
3. Is map-based search a requested feature?
4. Do users want construction progress updates?

### Competitive Intel
1. Which platform has worst user sentiment?
2. What features do users praise on any platform?
3. Are users switching between platforms? Why?
4. What would make users try a new platform?

---

## Output Format Expected

Create `/Users/rohanmalik/Projects/estate-pulse/.claude-workflow/01-research/feedback-synthesis.md` with:

```markdown
# User Feedback Synthesis

## Top 5 Pain Points (ranked by frequency)
1. [Pain point] - Evidence: [quotes, sources]
...

## Feature Requests (user-voiced)
- [Feature] - Source: [where users asked]
...

## Platform-Specific Complaints
### 99acres
- [Complaint pattern]
### MagicBricks
- [Complaint pattern]
...

## Opportunity Signals
- [What users want but don't have]

## Risk Signals
- [What users say they'd reject]

## Quotes Worth Saving
- "[Direct user quote]" - [Source]
```

---

## Dependencies

**Requires before starting:**
- None (web research task)

**Blocks:**
- Design decisions for MVP
- Feature prioritization
- Marketing positioning

---

## Timeline

**Expected duration:** 2-3 hours
**Deadline:** Before design-lead starts wireframes

---

## Unresolved Questions

1. India vs US focus for feedback? (suggest: 70% India, 30% US reference)
2. How recent should reviews be? (suggest: last 12 months max)
3. Include broker complaints or buyer-only? (suggest: buyer-only)
