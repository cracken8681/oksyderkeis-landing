#!/usr/bin/env python3
"""Generate OG image for Oksyderkeis landing — 1200x630, dark navy/gold."""

from PIL import Image, ImageDraw, ImageFont
import os, math

W, H = 1200, 630
NAVY = (13, 27, 42)       # #0D1B2A
GOLD = (201, 168, 76)     # #C9A84C
WHITE = (255, 255, 255)
DIM = (180, 190, 200)

img = Image.new("RGB", (W, H), NAVY)
draw = ImageDraw.Draw(img)

# --- Background subtle gradient overlay (top darker) ---
for y in range(H):
    alpha = int(30 * (1 - y / H))
    draw.line([(0, y), (W, y)], fill=(0, 0, 0))

# Re-draw base after gradient loop (cleaner approach)
img2 = Image.new("RGB", (W, H), NAVY)
draw2 = ImageDraw.Draw(img2)

# Subtle vignette top
for y in range(150):
    factor = (150 - y) / 150
    r = int(NAVY[0] * (1 - factor * 0.4))
    g = int(NAVY[1] * (1 - factor * 0.4))
    b = int(NAVY[2] * (1 - factor * 0.2))
    draw2.line([(0, y), (W, y)], fill=(r, g, b))

draw = draw2
img = img2

# --- Right side gold geometric lines (chart aesthetic) ---
chart_x = 720
chart_points_top = [
    (chart_x, 420), (780, 360), (840, 390), (900, 310),
    (960, 340), (1020, 260), (1080, 290), (1150, 200)
]
chart_points_fill = chart_points_top + [(1150, 560), (chart_x, 560)]

# Fill under chart (subtle gold tint)
fill_color = (201, 168, 76, 40)
img_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw_ov = ImageDraw.Draw(img_overlay)
draw_ov.polygon(chart_points_fill, fill=(201, 168, 76, 25))
img = img.convert("RGBA")
img = Image.alpha_composite(img, img_overlay)
img = img.convert("RGB")
draw = ImageDraw.Draw(img)

# Chart line
draw.line(chart_points_top, fill=GOLD, width=3)
# Chart dots
for pt in chart_points_top:
    draw.ellipse([pt[0]-5, pt[1]-5, pt[0]+5, pt[1]+5], fill=GOLD)

# Vertical grid lines (subtle)
for x in range(chart_x, W, 60):
    draw.line([(x, 200), (x, 560)], fill=(201, 168, 76, 30), width=1)

# Horizontal grid lines
for y in [300, 360, 420, 480]:
    draw.line([(chart_x, y), (W-20, y)], fill=(255, 255, 255, 15), width=1)

# --- Gold vertical accent bar left of chart area ---
draw.rectangle([710, 140, 714, 580], fill=(201, 168, 76, 80))

# --- Typography ---
def try_font(size, bold=False):
    """Try to load a system font, fall back to default."""
    candidates_bold = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNSDisplay.ttf",
        "/Library/Fonts/Arial Bold.ttf",
        "/System/Library/Fonts/HelveticaNeue.ttc",
    ]
    candidates = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/Library/Fonts/Arial.ttf",
    ]
    paths = candidates_bold if bold else candidates
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

font_brand = try_font(62, bold=True)
font_main = try_font(42)
font_sub = try_font(26)
font_badge = try_font(22)
font_small = try_font(18)

# Left content padding
LX = 60
y = 110

# Brand name
draw.text((LX, y), "Oksyderkeis", font=font_brand, fill=GOLD)
y += 80

# Gold underline
draw.rectangle([LX, y, LX + 300, y + 3], fill=GOLD)
y += 22

# Main headline line 1
draw.text((LX, y), "Οργάνωσε τα οικονομικά σου", font=font_main, fill=WHITE)
y += 54
draw.text((LX, y), "με AI", font=font_main, fill=WHITE)
y += 70

# Sub tagline in gold
draw.text((LX, y), "Χωρίς hype. Χωρίς συμβουλές επενδύσεων.", font=font_sub, fill=GOLD)
y += 50

# Description
draw.text((LX, y), "Εργαλεία, βίντεο και ένα σύστημα που δουλεύει.", font=font_sub, fill=DIM)
y += 70

# Badges row
badge_items = ["YouTube", "Free tools", "Money OS Pro"]
bx = LX
for badge in badge_items:
    bbox = draw.textbbox((0, 0), badge, font=font_badge)
    bw = bbox[2] - bbox[0] + 24
    bh = bbox[3] - bbox[1] + 14
    draw.rounded_rectangle([bx, y, bx+bw, y+bh], radius=6, outline=GOLD, width=1)
    draw.text((bx+12, y+7), badge, font=font_badge, fill=WHITE)
    bx += bw + 16

# Bottom bar
draw.rectangle([0, 580, W, 630], fill=(8, 18, 30))
draw.text((LX, 595), "oksyderkeis.gr  •  @oksyderkeis", font=font_small, fill=(150, 160, 170))
draw.text((W - 190, 595), "AI-powered tools", font=font_small, fill=GOLD)

# Save
out = os.path.join(os.path.dirname(__file__), "../public/og-image.png")
img.save(out, "PNG", optimize=True)
print(f"Saved: {os.path.abspath(out)}")
