#!/usr/bin/env bash
# Encodes the hero video into lightweight web variants + poster images.
# Source: media-src/video/hero.mp4  →  public/media/video/
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=media-src/video/hero.mp4
OUT=public/media/video
mkdir -p "$OUT"
# Desktop: 1280w
ffmpeg -y -v error -i "$SRC" -an -vf "scale=1280:-2,fps=24" -c:v libx264 -preset slow -crf 27 -profile:v high -pix_fmt yuv420p -movflags +faststart "$OUT/hero-1280.mp4"
ffmpeg -y -v error -i "$SRC" -an -vf "scale=1280:-2,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 46 -row-mt 1 -deadline good -cpu-used 2 "$OUT/hero-1280.webm"
# Mobile: 720w, lighter
ffmpeg -y -v error -i "$SRC" -an -vf "scale=720:-2,fps=24" -c:v libx264 -preset slow -crf 29 -profile:v main -pix_fmt yuv420p -movflags +faststart "$OUT/hero-720.mp4"
ffmpeg -y -v error -i "$SRC" -an -vf "scale=720:-2,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 48 -row-mt 1 -deadline good -cpu-used 2 "$OUT/hero-720.webm"
# Poster (first frame) – used for instant paint and reduced motion
ffmpeg -y -v error -ss 0 -i "$SRC" -frames:v 1 -vf "scale=1280:-2" "$OUT/hero-poster-1280.png"
ffmpeg -y -v error -ss 0 -i "$SRC" -frames:v 1 -vf "scale=720:-2" "$OUT/hero-poster-720.png"
node -e '
const sharp=require("sharp");
(async()=>{for(const w of [720,1280]){
  const p=`public/media/video/hero-poster-${w}`;
  await sharp(p+".png").avif({quality:48}).toFile(p+".avif");
  await sharp(p+".png").webp({quality:70}).toFile(p+".webp");
  await sharp(p+".png").jpeg({quality:72,mozjpeg:true}).toFile(p+".jpg");
  require("fs").unlinkSync(p+".png");
}})();'
ls -la "$OUT"
