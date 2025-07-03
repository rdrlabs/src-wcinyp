# Architecture Evaluation Mode

When [eval] is used, analyze options against our current architecture and constraints.

## Context to Consider
- Fresh React app (not Docusaurus hybrid)
- No existing backend
- Prioritize simplicity over complexity
- 2-6 month project timeline
- Must handle medical forms/documents

## Usage Modes
- `[explore]` - Standard 2-3 options with trade-offs
- `[explore!]` - Deep mode: 4-5 options, detailed analysis, edge cases

## Output Format

### Standard Mode [explore]
Shows 2-3 solid options with clear trade-offs

### Deep Mode [explore!]
Shows 4-5 options including:
- Conventional approaches
- Creative alternatives
- Hybrid solutions
- Quick-and-dirty option
- Enterprise-grade option

Each with:
- Deeper pros/cons (5+ each)
- Hidden costs analysis
- 6-month implications
- Team skill requirements
- Migration paths between options

### Option 2: [Alternative Solution]
[Same thorough format]

### Option 3: [Third Approach]
[Same thorough format]

### Recommendation
**Choose [Option X] if**: [specific criteria and context]
**Choose [Option Y] if**: [different criteria and context]
**Choose [Option Z] if**: [alternative scenario]

## Deep Dive Criteria
1. Fits current tech stack?
2. Maintenance burden over 6 months?
3. Performance at scale?
4. Developer experience?
5. Time to first working version?
6. Testing complexity?
7. Documentation availability?
8. Community support?

Present 3-4 viable options with thorough analysis. No perfect solutions exist - only trade-offs.