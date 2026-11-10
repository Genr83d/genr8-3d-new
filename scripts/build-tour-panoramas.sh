#!/usr/bin/env bash
# Convert rendered tour panoramas (PNG) into the WebP files the site ships.
# Usage: scripts/build-tour-panoramas.sh /path/to/rendered-pngs
set -euo pipefail
src="${1:?folder of rendered PNG panoramas}"
out="$(dirname "$0")/../public/factory-tour/panos"
mkdir -p "$out"
for png in "$src"/*.png; do
  id="$(basename "$png" .png)"
  magick "$png" -quality 80 -define webp:method=6 "$out/$id.webp"
  magick "$png" -resize 2560x1280 -quality 72 -define webp:method=6 "$out/$id-sm.webp"
  echo "$id: $(stat -c %s "$out/$id.webp") bytes full, $(stat -c %s "$out/$id-sm.webp") bytes small"
done
