Diagrams and conversion

Files created:
- `docs/SEQUENCE_DIAGRAM_CHECKIN.svg` — Sequence diagram for check-in flow.
- `docs/ACTIVITY_DIAGRAM_MAINTENANCE.svg` — Activity diagram for equipment maintenance.
- `docs/SEQUENCE_DIAGRAM_CHECKIN.png` — placeholder (text note). Replace by exporting the SVG to PNG.
- `docs/ACTIVITY_DIAGRAM_MAINTENANCE.png` — placeholder (text note). Replace by exporting the SVG to PNG.

How to export SVG -> PNG

If you have ImageMagick installed (Windows):

```powershell
magick convert docs/SEQUENCE_DIAGRAM_CHECKIN.svg docs/SEQUENCE_DIAGRAM_CHECKIN.png
magick convert docs/ACTIVITY_DIAGRAM_MAINTENANCE.svg docs/ACTIVITY_DIAGRAM_MAINTENANCE.png
```

Using Inkscape (CLI):

```powershell
inkscape docs/SEQUENCE_DIAGRAM_CHECKIN.svg --export-type=png --export-filename=docs/SEQUENCE_DIAGRAM_CHECKIN.png
inkscape docs/ACTIVITY_DIAGRAM_MAINTENANCE.svg --export-type=png --export-filename=docs/ACTIVITY_DIAGRAM_MAINTENANCE.png
```

Using rsvg-convert (part of librsvg):

```powershell
rsvg-convert -o docs/SEQUENCE_DIAGRAM_CHECKIN.png docs/SEQUENCE_DIAGRAM_CHECKIN.svg
rsvg-convert -o docs/ACTIVITY_DIAGRAM_MAINTENANCE.png docs/ACTIVITY_DIAGRAM_MAINTENANCE.svg
```

Notes
- I created SVG diagrams with the requested flows. The `.png` files are placeholders containing short text; please run one of the above commands to generate full PNGs if you need raster images for documentation or export.
- If you want, I can convert them for you here, but I need permission to run image tooling or to add an npm dev dependency to render SVG -> PNG automatically. Let me know which approach you prefer.
