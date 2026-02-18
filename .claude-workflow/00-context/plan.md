    ---
     Phase 1: Discovery & Research

     1.1 Trend Research

     Agent: trend-researcher
     Input: Initial idea/PRD
     Output: /.claude-workflow/01-research/trends.md
     > Use trend-researcher to analyze market opportunity and validate idea

     1.2 User Research Synthesis

     Agent: feedback-synthesizer
     Input: trends.md + any existing user feedback
     Output: /.claude-workflow/01-research/user-insights.md
     > Use feedback-synthesizer to identify user pain points and needs from
     trend-researcher findings

     ---
     Phase 2: Planning & Scoping

     2.1 Feature Prioritization

     Agent: sprint-prioritizer
     Input: user-insights.md + trends.md
     Output: /.claude-workflow/02-planning/mvp-scope.md
     > Use sprint-prioritizer to define MVP scope and feature priorities from research
      insights

     2.2 Architecture Planning

     Agent: Plan
     Input: mvp-scope.md
     Output: /.claude-workflow/02-planning/architecture.md
     > Use Plan agent to design technical architecture based on MVP scope

     ---
     Phase 3: UI/UX Design

     3.1 Rapid Prototype

     Agent: rapid-prototyper
     Input: mvp-scope.md + architecture.md
     Output: Scaffolded Next.js project +
     /.claude-workflow/03-design/prototype-notes.md
     > Use rapid-prototyper to scaffold Next.js app structure and create initial
     component hierarchy

     3.2 UI Polish & Delight

     Agent: whimsy-injector
     Input: Scaffolded components
     Output: Enhanced UI with micro-interactions
     > Use whimsy-injector to add delightful touches to UI components created by
     rapid-prototyper

     ---
     Phase 4: Frontend Development

     4.1 Component Implementation

     Agent: frontend-developer
     Input: prototype + architecture.md
     Output: Production-ready React components
     > Use frontend-developer to implement production components based on
     rapid-prototyper scaffold

     4.2 Frontend Testing

     Agent: test-writer-fixer
     Input: Implemented components
     Output: Test files + passing tests
     > Use test-writer-fixer to write and verify tests for frontend-developer
     components

     ---
     Phase 5: Backend Development

     5.1 API & Database

     Agent: backend-architect
     Input: architecture.md + frontend components (to understand data needs)
     Output: API routes, database schema, services
     > Use backend-architect to build APIs and database layer matching
     frontend-developer data requirements

     5.2 AI Features (if needed)

     Agent: ai-engineer
     Input: mvp-scope.md (AI feature requirements)
     Output: AI integrations
     > Use ai-engineer to implement AI features defined in sprint-prioritizer MVP
     scope

     5.3 Backend Testing

     Agent: test-writer-fixer
     Input: Backend code
     Output: API tests + integration tests
     > Use test-writer-fixer to write tests for backend-architect APIs

     ---
     Phase 6: Integration & Launch

     6.1 DevOps Setup

     Agent: devops-automator
     Input: Complete app
     Output: CI/CD, deployment config
     > Use devops-automator to configure deployment pipeline for the Next.js app

     6.2 Experiment Setup

     Agent: experiment-tracker
     Input: Key features to test
     Output: Feature flags, A/B test configs
     > Use experiment-tracker to set up feature flags for features identified by
     sprint-prioritizer

     6.3 Launch Coordination

     Agent: project-shipper
     Input: Complete, tested app
     Output: Launch checklist, go-to-market
     > Use project-shipper to coordinate launch after devops-automator completes
     deployment setup

     ---
     Context Storage Structure

     project-root/
     └── .claude-workflow/
         ├── 00-context/
         │   └── master-context.md      # Rolling context shared across all agents
         │
         ├── 01-research/
         │   ├── trends.md              # trend-researcher output
         │   └── user-insights.md       # feedback-synthesizer output
         │
         ├── 02-planning/
         │   ├── mvp-scope.md           # sprint-prioritizer output
         │   └── architecture.md        # Plan agent output
         │
         ├── 03-design/
         │   ├── prototype-notes.md     # rapid-prototyper decisions
         │   └── ui-enhancements.md     # whimsy-injector additions
         │
         ├── 04-frontend/
         │   ├── component-map.md       # frontend-developer component docs
         │   └── test-coverage.md       # test-writer-fixer report
         │
         ├── 05-backend/
         │   ├── api-spec.md            # backend-architect API docs
         │   ├── db-schema.md           # database design
         │   └── ai-features.md         # ai-engineer implementation notes
         │
         └── 06-launch/
             ├── deployment.md          # devops-automator config docs
             ├── experiments.md         # experiment-tracker setup
             └── launch-plan.md         # project-shipper checklist




     Startup

     > Use studio-coach to set project expectations and rally agents

     Phase 1: Research

     > Use trend-researcher to analyze market opportunity
     > Use studio-producer to handoff to feedback-synthesizer
     > Use feedback-synthesizer to identify user pain points from trends

     Phase 2: Planning

     > Use studio-producer to handoff research to sprint-prioritizer
     > Use sprint-prioritizer to define MVP scope
     > Use Plan agent to design architecture

     Phase 3: Design

     > Use rapid-prototyper to scaffold Next.js app
     > Use whimsy-injector to add UI delight

     Phase 4: Frontend

     > Use frontend-developer to implement production components
     > Use test-writer-fixer to write component tests
     > If stuck: Use studio-coach to refocus

     Phase 5: Backend

     > Use backend-architect to build APIs and database
     > Use ai-engineer for AI features (if needed)
     > Use test-writer-fixer to write API tests

     Phase 6: Launch

     > Use devops-automator to set up CI/CD
     > Use experiment-tracker to configure feature flags
     > Use project-shipper to coordinate launch
     > Use tiktok-strategist for marketing (optional)