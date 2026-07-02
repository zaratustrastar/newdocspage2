# Claude task

Redesign the PMFI documentation website.

## Required first step

Before changing the design:

1. Read `README.md`.
2. Read `live-content/sections.json`.
3. Read every file under `live-content/html/`.
4. Use `live-content/text/` for searchable plain-text references.
5. Inspect `source-reference/current-docs.tsx` and `current-styles.css`.

## Content preservation

The files under `live-content/` contain the exact current production documentation.

Preserve:

- all 12 existing navigation tabs;
- all visible text;
- headings and subheadings;
- tables;
- code examples;
- formulas;
- links;
- contract addresses;
- warnings and disclaimers.

Do not silently delete, shorten or rewrite existing content.

## New sections to add

After preserving the live content, add:

- OpLend
- Audit
- Tokenomics
- FAQ

Present proposed factual changes separately before applying them.

## Supporting repositories

Design reference:

https://github.com/zaratustrastar/newdappuiux2

OpLend and audit reference:

https://github.com/zaratustrastar/oplend-v22-security-audit

## Deliverable

Create a clean, statically deployable documentation application inside this repository.

Do not modify any production server or contract.
