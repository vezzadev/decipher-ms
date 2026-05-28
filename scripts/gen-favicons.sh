#!/usr/bin/env bash
# Rasterizes public/favicon.svg into the favicon/app-icon set.
#
# Requires: rsvg-convert (librsvg2-bin) and ImageMagick (convert).
#   sudo apt-get install -y librsvg2-bin imagemagick
#
# favicon.svg is the source of truth. Its "d" is a baked Playfair Display
# Italic 900 outline (no <text>, no web font) so it renders identically
# everywhere. To re-derive that path from the font, see the note at the
# bottom of this script.
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="public/favicon.svg"
NAVY="#020617"

render() { rsvg-convert -w "$1" -h "$1" "$SRC" -o "$2"; }

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Multi-resolution .ico (legacy browsers, Windows, older Safari)
render 16 "$tmp/16.png"
render 32 "$tmp/32.png"
render 48 "$tmp/48.png"
convert "$tmp/16.png" "$tmp/32.png" "$tmp/48.png" public/favicon.ico

# Opaque PNGs (full-bleed). Flatten onto navy to drop the alpha channel.
render 180 "$tmp/180.png"
convert "$tmp/180.png" -background "$NAVY" -flatten public/apple-touch-icon.png
render 192 "$tmp/192.png"
convert "$tmp/192.png" -background "$NAVY" -flatten public/icon-192.png
render 512 "$tmp/512.png"
convert "$tmp/512.png" -background "$NAVY" -flatten public/icon-512.png

# Maskable icon: same art with extra safe-zone padding on a navy field.
render 360 "$tmp/mask-art.png"
convert -size 512x512 "xc:$NAVY" "$tmp/mask-art.png" -gravity center -composite \
  public/icon-maskable-512.png

echo "wrote: favicon.ico apple-touch-icon.png icon-192.png icon-512.png icon-maskable-512.png"

# To regenerate the outline in favicon.svg from the variable font:
#   pip install fonttools brotli
#   curl -L -o pf.ttf \
#     'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-Italic%5Bwght%5D.ttf'
#   instance at wght=900, draw glyph "d" with fontTools SVGPathPen,
#   flip y (font units are y-up) and scale into the 100x100 viewBox.
