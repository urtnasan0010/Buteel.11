---
name: Хүртээмж
description: A readable civic support directory
colors:
  paper: "#f8f7f2"
  surface: "#ffffff"
  ink: "#173d3a"
  muted: "#526360"
  accent: "#17665a"
  line: "#d7ded7"
  soft: "#eaf0e8"
  notice: "#f6efdb"
  control-border: "#607a70"
typography:
  body:
    fontFamily: 'Arial, "Noto Sans", sans-serif'
    fontSize: "16px"
    lineHeight: 1.7
rounded:
  control: "8px"
  panel: "12px"
spacing:
  small: "8px"
  medium: "16px"
  large: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
---

# Visual system

## Overview

Operate mode for search and Read mode for guides. A calm civic directory, based on readable lists and explicit information states. No decorative imagery or external font requests.

## Colors

Warm paper, dark teal ink, green-teal controls, and a warm source-information notice (#685124 text). Tokens above match globals.css.

## Typography

Arial with Noto Sans and sans-serif fallback supports Mongolian Cyrillic. Body 16px; fluid headings; line-height 1.7 for prose. System fonts avoid external downloads as requested for slower connections.

## Layout

Spacing uses 8/12/16/20/24/28/32/40/48/64px. Search, category, and district sit above a single service list. Optional cost and accessibility filters use a native disclosure, expanded when active. Mobile controls stack vertically. Breakpoints are 650px and 1000px.

## Elevation & Depth

Flat surfaces with borders or tonal changes; no shadows.

## Shapes

Controls use 6–8px rounding and larger panels use 10–12px.

## Components

Primary navigation uses Find support, Understand, Help and Reach consistently, retaining the fixed language-switch position. Home prioritises search and then three large section links, followed by a plain-link audience chooser. New section content has one heading, a short summary, readable points, related links, visible provenance TODOs and a print button. Screen-only controls and navigation disappear in print while provenance stays visible. No stored audience profile is introduced.

Native labeled controls have at least 44px targets; checkbox labels enlarge their hit area. Standalone source links have a 24px minimum height. Control borders use #607a70. Focus uses a 3px brown ring. No decorative motion. Unknown accessibility is always textual, distinct from absence. Category cards use consistent stroke SVG icons. Detail pages put call, email, and map-search links before the extended information; their accessible names also identify the organisation. Map search is optional; no map is embedded. Report preparation moves focus to the report; clipboard failure selects it for manual copying and announces the recovery instruction in a persistent status region.

## Do's and Don'ts

Do preserve source and direct-confirmation distinctions and textual information states. Do keep the list view useful without a map. Do not treat missing access information as unavailable.
