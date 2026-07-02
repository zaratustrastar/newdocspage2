# PMFI Docs Redesign

This repository contains the exact content currently rendered on `docs.pmfi.cc`.

## Source of truth

Use these files when preserving the existing documentation:

- `live-content/navigation.json`
- `live-content/sections.json`
- `live-content/html/`
- `live-content/text/`

The HTML and text files were extracted directly from the current production documentation bundle.

## Current navigation

### Overview

- What is PMFI?
- pArbitrage Vault
- Strategy logic
- Accounting & metrics
- User flow
- Liquidity management

### Developers

- Spread Intelligence API
- Virtuals ACP Integration

### Security & Risk

- Risk disclosure
- Risk mitigation
- Contract addresses

### Updates

- Changelog

## Readable source reference

The previous editable React documentation component and stylesheet are preserved under:

- `source-reference/current-docs.tsx`
- `source-reference/current-styles.css`

These are references only. They do not include the two developer tabs that were added directly to production.

The files under `live-content/` are authoritative when the source and production content differ.

## Redesign rule

Preserve all existing tabs, text, tables, code samples, links, contract addresses and section ordering before adding or rewriting content.
