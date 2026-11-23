#!/usr/bin/env bash
# Rebuilds public/fonts/archivo-var-subset.woff2 from @fontsource-variable/archivo:
# keeps only the axis ranges the site uses (wght 400–800, wdth 100–125) and Latin glyphs.
# Requires fonttools:  pip install fonttools brotli
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2
TMP=$(mktemp -d)
fonttools varLib.instancer "$SRC" wght=400:800 wdth=100:125 -o "$TMP/inst.ttf"
pyftsubset "$TMP/inst.ttf" \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0152-0153,U+2013-2014,U+2018-201E,U+2022,U+2026,U+20AC,U+2192,U+00B7" \
  --layout-features="kern,liga,calt,ccmp,locl,mark,mkmk" --flavor=woff2 \
  --output-file=public/fonts/archivo-var-subset.woff2
ls -la public/fonts/archivo-var-subset.woff2
