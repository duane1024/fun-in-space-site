---
title: AI-Native Investment Research Platform
summary: "Built for an investment team and in production after four months (Jun–Sep 2026): live market data and consensus estimates on thousands of companies, a searchable, cited corpus of 200,000+ documents, a live valuation engine in Rust, and research agents that answer in the web app, in Slack, and inside Claude."
status: "Client work · In production"
featured: true
order: 2
links: []
tech:
  - Python / FastAPI
  - TypeScript / React
  - Rust / IronCalc
  - PostgreSQL + pgvector
  - LLM agents / MCP
  - AWS
---

A research platform for an investment team, built by Duane through Zarkov Technologies. It replaces a patchwork of spreadsheets and vendor terminals with one governed data model, one research corpus, and one valuation engine behind a single typed API. It went from an empty repository to live data in under a month and has run in production on AWS since August.

- **Coverage:** thousands of public companies plus a bounded tier of private ones, with a comps grid, automated screens, and a configurable composite score.
- **Research corpus:** 200,000+ filings, transcripts, expert calls, and internal documents, with hybrid keyword and semantic search and answers that cite their sources.
- **Valuation engine:** a Rust service on IronCalc (the spreadsheet engine behind l123) that builds a live, formula-driven Excel model for any company and hosts the analysts' own workbooks, versioned and mapped, with the team's own estimates shown next to consensus.
- **Agents where the team works:** a research agent that quotes sources verbatim with attribution, earnings summaries delivered to Slack as companies report, and 80+ tools exposed to Claude over MCP.
- **Provenance on everything:** every number and document records its source, fetch time, and author. AI outputs also record the model, prompt version, and traced call behind them.
