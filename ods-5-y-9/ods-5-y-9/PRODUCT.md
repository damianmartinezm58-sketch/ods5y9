# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JavaScript with Three.js vendored locally (classic script, no build step). Must open by double-clicking `index.html`, run in Visual Studio Code with Live Server, and publish on GitHub Pages without a server. Content is generated from an Excel workbook by a Python script (`actualizar_datos.py` → `datos.js`).

## Users

Two audiences confirmed ("ambos"):
- A student team presenting the page in class to a teacher and classmates in Guanajuato, Mexico; it must impress and be easy to explain.
- The general public in Mexico (mostly Guanajuato) who open the shared link afterwards, often on a phone.

## Product Purpose

An awareness site about SDG 5 (Gender equality) and SDG 9 (Industry, innovation and infrastructure). It explains why both goals matter, how they connect (infrastructure, technology and industry that include women; equality that makes innovation possible), and moves visitors to act. Success: a visitor understands the link between the two goals, plays at least one mini game, and makes a commitment.

## Positioning

The team's own pairing of SDG 5 + SDG 9, told from Guanajuato: a state whose identity is industry (automotive corridor) where gender equality decides who builds and benefits from that industry.

## Capabilities and Constraints

- Sections required by the content database (labels from the original template): ODS, Projections 2050, Take Action, Legal.
- Mini games, interactive transitions, and 3D models (Three.js) are required.
- Every visible text comes from `base_de_datos.xlsx`; the sheet "Hoja1" keeps the original format: ID, Seccion, Tema, Información, Fuente, Enlace.
- Page and Excel content in English (user decision, replacing the first Spanish version). The step-by-step guide for the team stays in Spanish.

## Brand Commitments

- Team logo (supplied image, `img/logo-equipo.webp`): purple/lavender buildings, magenta rising arrow and gender symbol, navy ring and text, light blue gear. Its palette is binding.
- Tagline from the logo: "Soluciones sostenibles y equitativas", used on the English page as "Sustainable and equitable solutions". The supplied logo misspells "Industri"; the page writes the name correctly.

## Evidence on Hand

- Data from official sources (ONU, ONU Mujeres, UIT, UNESCO, Foro Económico Mundial, INEGI, Banco Mundial, Cámara de Diputados, Congreso de Guanajuato), cited per card with links. No invented statistics; the team must verify and rewrite texts in their own words.
- No photographs supplied. Illustrations and 3D models are authored for the project.

## Product Principles

1. Every number carries its source.
2. Show the connection between equality and infrastructure, not two separate topics.
3. Learning through doing: games teach real facts.
4. Works anywhere: double-click, phone, projector.

## Accessibility & Inclusion

Inclusive language; readable on a classroom projector and on phones; respects reduced motion; 3D is enhancement, the content works without WebGL.
