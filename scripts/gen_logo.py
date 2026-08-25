#!/usr/bin/env python3
"""Generate MINEBROKER logo (SVG) — pickaxe + candlestick mark, industrial amber."""
import os
OUT = "/root/minebroker/assets"
os.makedirs(OUT, exist_ok=True)

# Logo concept: crossed pickaxe + stock candlestick in a hexagon
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffd257"/>
      <stop offset="0.5" stop-color="#ff9d2e"/>
      <stop offset="1" stop-color="#e06a00"/>
    </linearGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8b95a5"/>
      <stop offset="1" stop-color="#3a4250"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.65">
      <stop offset="0" stop-color="#1b2029"/>
      <stop offset="1" stop-color="#0a0c10"/>
    </radialGradient>
  </defs>
  <!-- plate -->
  <rect x="8" y="8" width="184" height="184" rx="34" fill="url(#glow)" stroke="#2a2f38" stroke-width="4"/>
  <!-- hex border -->
  <polygon points="100,22 168,61 168,139 100,178 32,139 32,61" fill="none" stroke="url(#gold)" stroke-width="5" stroke-linejoin="round"/>
  <!-- pickaxe head (gold) -->
  <path d="M58,118 L42,134 L50,142 L66,126 Z" fill="url(#gold)"/>
  <path d="M52,124 L36,140 L44,148 L60,132 Z" fill="#8a4a00"/>
  <!-- handle (steel, diagonal) -->
  <line x1="70" y1="130" x2="130" y2="70" stroke="url(#steel)" stroke-width="9" stroke-linecap="round"/>
  <!-- candlestick (gold) -->
  <rect x="118" y="76" width="16" height="38" rx="3" fill="url(#gold)"/>
  <line x1="126" y1="62" x2="126" y2="128" stroke="url(#gold)" stroke-width="4"/>
  <!-- sparkle -->
  <circle cx="150" cy="52" r="4" fill="#fff3c4"/>
  <circle cx="48" cy="70" r="2.5" fill="#ffd257" opacity="0.8"/>
</svg>'''

with open(f"{OUT}/logo.svg", "w") as f:
    f.write(svg)
print("logo.svg written")

# favicon PNG from a quick PIL render of the same concept (simple)
from PIL import Image, ImageDraw
img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
# plate
d.rounded_rectangle([8, 8, 248, 248], radius=48, fill=(13, 15, 20, 255), outline=(42, 47, 56, 255), width=5)
# hexagon
import math
cx, cy, r = 128, 128, 92
pts = [(cx + r * math.cos(math.pi/6 + i * math.pi/3), cy + r * math.sin(math.pi/6 + i * math.pi/3)) for i in range(6)]
d.polygon(pts, outline=(255, 180, 60, 255), width=7)
# pickaxe
d.polygon([(70, 148), (52, 166), (60, 174), (78, 156)], fill=(255, 170, 40, 255))
d.line([(88, 158), (152, 92)], fill=(120, 130, 145, 255), width=12)
# candlestick
d.rounded_rectangle([140, 96, 160, 142], radius=4, fill=(255, 170, 40, 255))
d.line([(150, 78), (150, 162)], fill=(255, 170, 40, 255), width=6)
img.save(f"{OUT}/favicon.png")
print("favicon.png written")
