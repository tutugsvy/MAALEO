#!/usr/bin/env python3
"""Generate original background art for MINEBROKER — dark industrial mining shaft."""
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import math, random, os

random.seed(42)
W, H = 1920, 1080
OUT = "/root/minebroker/assets"
os.makedirs(OUT, exist_ok=True)

def noise_layer(w, h, intensity=28):
    """Subtle film-grain noise."""
    img = Image.new("L", (w, h))
    px = img.load()
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            v = random.randint(0, intensity)
            px[x, y] = v
            px[x+1, y] = v
            px[x, y+1] = v
            px[x+1, y+1] = v
    return img

# ── Base: dark gradient (deep blue-black top → warm amber bottom) ──────────
base = Image.new("RGB", (W, H))
d = ImageDraw.Draw(base)
for y in range(H):
    t = y / H
    # top: #07090f  bottom: #1a1208 with amber hint
    r = int(7 + 14 * t)
    g = int(9 + 8 * t)
    b = int(15 + 2 * t)
    d.line([(0, y), (W, y)], fill=(r, g, b))

# ── Rock strata bands ──────────────────────────────────────────────────────
d = ImageDraw.Draw(base)
for i in range(14):
    y = random.randint(80, H - 60)
    amp = random.randint(30, 90)
    color = random.choice([(12, 14, 20), (16, 14, 12), (10, 12, 18), (18, 16, 12)])
    pts = [(0, y)]
    for x in range(0, W + 40, 40):
        pts.append((x, y + int(amp * math.sin(x / 180 + i * 1.7))))
    pts.append((W, y + amp))
    d.line(pts, fill=color, width=random.randint(6, 18))

# ── Ore veins (glowing gold cracks) ───────────────────────────────────────
for vein in range(22):
    x = random.randint(0, W)
    y = random.randint(0, H)
    length = random.randint(120, 420)
    angle = random.uniform(0, math.pi * 2)
    width = random.randint(2, 6)
    glow = random.choice([(255, 176, 32), (255, 200, 80), (230, 150, 40), (255, 210, 120)])
    pts = [(x, y)]
    cx, cy = x, y
    for _ in range(int(length / 8)):
        angle += random.uniform(-0.35, 0.35)
        cx += math.cos(angle) * 8
        cy += math.sin(angle) * 8
        pts.append((cx, cy))
    d.line(pts, fill=glow, width=width)
    # halo
    for off, wd in [(6, 9), (12, 5), (18, 3)]:
        halo = [(px + off * random.uniform(-1, 1), py + off * random.uniform(-1, 1)) for px, py in pts]
        d.line(halo, fill=tuple(int(c * 0.25) for c in glow), width=wd)

# ── Structural beams (industrial) ─────────────────────────────────────────
beam_color = (28, 32, 40)
for i in range(6):
    bx = random.randint(100, W - 100)
    d.rectangle([bx - 6, 0, bx + 6, H], fill=beam_color)
    d.rectangle([bx - 14, 0, bx - 8, H], fill=(18, 20, 26))
    # rivets
    for ry in range(40, H, 70):
        d.ellipse([bx - 4, ry - 4, bx + 4, ry + 4], fill=(60, 66, 78))

# ── Silhouette machinery (bottom) ─────────────────────────────────────────
for _ in range(9):
    mx = random.randint(0, W)
    mw = random.randint(120, 260)
    mh = random.randint(70, 170)
    my = H - random.randint(20, 80)
    col = random.choice([(8, 9, 12), (10, 10, 12), (7, 8, 11)])
    d.rectangle([mx, my - mh, mx + mw, my], fill=col)
    # gantry / pipes
    d.rectangle([mx + 20, my - mh - 12, mx + 26, my], fill=(14, 15, 18))
    d.rectangle([mx + mw - 30, my - mh - 12, mx + mw - 24, my], fill=(14, 15, 18))
    # windows with dim amber light
    for wy in range(my - mh + 10, my - 20, 26):
        for wx in range(mx + 14, mx + mw - 20, 34):
            if random.random() < 0.45:
                d.rectangle([wx, wy, wx + 10, wy + 8], fill=(255, 150, 40))
                d.rectangle([wx, wy, wx + 10, wy + 8], outline=(255, 190, 90))

# ── Overhead hanging lights with glow ─────────────────────────────────────
light_positions = [(180, 140), (620, 100), (1050, 150), (1480, 110), (1780, 160)]
for lx, ly in light_positions:
    d.ellipse([lx - 26, ly - 26, lx + 26, ly + 26], fill=(255, 190, 80))
    d.ellipse([lx - 14, ly - 14, lx + 14, ly + 14], fill=(255, 230, 160))
    d.ellipse([lx - 6, ly - 6, lx + 6, ly + 6], fill=(255, 250, 220))
    # glow rays
    for i in range(8):
        ang = math.pi + (i / 7) * math.pi
        gx = lx + math.cos(ang) * 90
        gy = ly + math.sin(ang) * 90
        d.line([(lx, ly), (gx, gy)], fill=(255, 170, 60, 40), width=22)

# ── Soft blur for depth, then re-composite ────────────────────────────────
base = base.filter(ImageFilter.GaussianBlur(1.2))

# ── Vignette ──────────────────────────────────────────────────────────────
vig = Image.new("L", (W, H), 0)
dv = ImageDraw.Draw(vig)
dv.ellipse([-W * 0.35, -H * 0.35, W * 1.35, H * 1.35], fill=255)
vig = vig.filter(ImageFilter.GaussianBlur(160))
base = Image.composite(base, ImageEnhance.Brightness(base).enhance(0.55), vig)

# ── Noise on top ──────────────────────────────────────────────────────────
noise = noise_layer(W, H, 22).convert("RGB")
base = Image.blend(base, noise, 0.12)

base = base.convert("RGB")
base.save(f"{OUT}/bg-shaft.jpg", quality=88)
print("bg-shaft.jpg", base.size)

# ── Secondary: dark panel texture (UI backdrop) ───────────────────────────
W2, H2 = 800, 600
panel = Image.new("RGB", (W2, H2), (9, 10, 13))
dp = ImageDraw.Draw(panel)
# grid lines
for x in range(0, W2, 40):
    dp.line([(x, 0), (x, H2)], fill=(14, 16, 20), width=1)
for y in range(0, H2, 40):
    dp.line([(0, y), (W2, y)], fill=(14, 16, 20), width=1)
# corner bolts
for bx, by in [(14, 14), (W2 - 14, 14), (14, H2 - 14), (W2 - 14, H2 - 14)]:
    dp.ellipse([bx - 6, by - 6, bx + 6, by + 6], fill=(30, 34, 42))
    dp.ellipse([bx - 2, by - 2, bx + 2, by + 2], fill=(12, 13, 16))
# faint amber glow bottom
for y in range(H2 - 1, H2 - 140, -1):
    t = (H2 - y) / 140
    dp.line([(0, y), (W2, y)], fill=(int(40 * t), int(28 * t), int(10 * t)))
noise2 = noise_layer(W2, H2, 16).convert("RGB")
panel = Image.blend(panel, noise2, 0.15)
panel.save(f"{OUT}/bg-panel.jpg", quality=85)
print("bg-panel.jpg", panel.size)
