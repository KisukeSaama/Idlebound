"""Generates the web (WebP) versions of the original assets.

Usage: python assets-src/optimize.py
Originals stay in assets-src/original; the game serves apps/web/public/assets.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "original"
OUT = ROOT.parent / "apps" / "web" / "public" / "assets"

# (folder, max size of the longest side, quality)
RULES = {
    "enemies": (640, 86),
    "icons": (192, 90),
    "zones": (1920, 80),
    "brand": (900, 92),
}

def trim(image: Image.Image) -> Image.Image:
    if image.mode != "RGBA":
        return image
    bbox = image.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    return image.crop(bbox) if bbox else image

for folder, (size, quality) in RULES.items():
    for source in sorted((SRC / folder).glob("*.png")):
        image = Image.open(source)
        image = trim(image.convert("RGBA")) if image.mode == "RGBA" else image.convert("RGB")
        image.thumbnail((size, size), Image.LANCZOS)
        target = OUT / folder / (source.stem.replace("-transparent", "") + ".webp")
        target.parent.mkdir(parents=True, exist_ok=True)
        image.save(target, "WEBP", quality=quality, method=6)
        print(f"{target.relative_to(OUT)}  {image.size}  {target.stat().st_size // 1024} KB")

icon = Image.open(ROOT / "favicon.png").convert("RGBA")
for s in (32, 180, 512):
    copy = icon.copy(); copy.thumbnail((s, s), Image.LANCZOS)
    copy.save(OUT.parent / ("favicon.png" if s == 32 else f"icon-{s}.png"))

# Share image (OpenGraph): ruins backdrop + logo + three signature monsters.
og = Image.open(SRC / "zones" / "fallen-king-ruins.png").convert("RGB").resize((1200, 675), Image.LANCZOS).crop((0, 20, 1200, 650)).convert("RGBA")
shade = Image.new("RGBA", og.size, (11, 10, 20, 0))
for y in range(og.height):
    alpha = int(90 + 120 * (y / og.height))
    for_row = Image.new("RGBA", (og.width, 1), (11, 10, 20, alpha))
    shade.paste(for_row, (0, y))
og = Image.alpha_composite(og, shade)
def sprite(name, height):
    img = trim(Image.open(SRC / "enemies" / f"{name}.png").convert("RGBA"))
    img.thumbnail((height * 2, height), Image.LANCZOS)
    return img
king = sprite("ruined-king", 470)
og.alpha_composite(king, (1200 - king.width - 40, 630 - king.height - 10))
wolf = sprite("shade-wolf", 190)
og.alpha_composite(wolf, (560, 630 - wolf.height - 20))
logo = trim(Image.open(SRC / "brand" / "idlebound-logo.png").convert("RGBA"))
logo.thumbnail((620, 260), Image.LANCZOS)
og.alpha_composite(logo, (50, 110))
og.convert("RGB").save(OUT.parent / "og.jpg", quality=86, optimize=True, progressive=True)
print("og.jpg generated")
