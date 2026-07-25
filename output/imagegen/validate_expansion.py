import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "public" / "assets"
PREVIEWS = ROOT / "output" / "imagegen" / "previews-expansion"
PREVIEWS.mkdir(parents=True, exist_ok=True)

ROOMS = ["bedroom", "kitchen", "bathroom", "attic", "child-room", "garden"]
TOOLS = ["tool-spray.png", "tool-brush.png", "tool-rake.png", "tool-sponge.png"]
DIRT = [
    f"{kind}/{kind}-{index:02}.png"
    for kind in ("grease", "mold", "leaves", "weeds")
    for index in range(1, 4)
]
CLUTTER = [
    "trash-dishes-01.png", "trash-bag-01.png", "trash-bottle-01.png",
    "trash-towel-01.png", "trash-box-02.png", "trash-newspaper-01.png",
    "toy-blocks-01.png", "toy-ball-01.png", "toy-bear-01.png",
    "trash-branch-01.png", "trash-pot-01.png",
]
MEMORIES = [
    "music-box.png", "recipe-note.png", "rubber-duck.png",
    "old-letters.png", "crayon-diary.png", "time-capsule.png",
]


def font(size):
    try:
        return ImageFont.truetype("arial.ttf", size)
    except OSError:
        return ImageFont.load_default()


def contain(im, size, background=(38, 30, 47, 255), margin=14):
    canvas = Image.new("RGBA", size, background)
    working = im.convert("RGBA")
    working.thumbnail((size[0] - margin * 2, size[1] - margin * 2), Image.Resampling.LANCZOS)
    canvas.alpha_composite(working, ((size[0] - working.width) // 2, (size[1] - working.height) // 2))
    return canvas


def alpha_result(path, expected):
    with Image.open(path) as im:
        alpha = im.convert("RGBA").getchannel("A")
        corners = [alpha.getpixel(p) for p in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]]
        return {
            "path": str(path.relative_to(ROOT)).replace("\\", "/"),
            "size": list(im.size),
            "mode": im.mode,
            "expectedSize": list(expected),
            "sizeOk": im.size == expected,
            "transparentCorners": corners,
            "alphaBbox": list(alpha.getbbox() or ()),
            "ok": im.size == expected and max(corners) == 0 and alpha.getbbox() is not None,
        }


def room_result(name):
    paths = [ASSETS / "rooms" / f"{name}-{state}.webp" for state in ("dirty", "clean")]
    images = [Image.open(path).convert("RGB") for path in paths]
    gray = [
        np.asarray(im.resize((512, 288), Image.Resampling.LANCZOS).convert("L").filter(ImageFilter.FIND_EDGES), dtype=np.float32).ravel()
        for im in images
    ]
    corr = float(np.corrcoef(gray[0], gray[1])[0, 1])
    return {
        "room": name,
        "files": [str(path.relative_to(ROOT)).replace("\\", "/") for path in paths],
        "sizes": [list(im.size) for im in images],
        "formats": [Image.open(path).format for path in paths],
        "edgeCorrelation": round(corr, 4),
        "ok": all(im.size == (2048, 1152) for im in images) and corr >= 0.72,
    }


def room_preview():
    card_w, card_h = 980, 330
    sheet = Image.new("RGB", (card_w * 2, card_h * 3), (22, 17, 29))
    draw = ImageDraw.Draw(sheet)
    for i, name in enumerate(ROOMS):
        x, y = (i % 2) * card_w, (i // 2) * card_h
        draw.text((x + 20, y + 12), name, fill=(245, 235, 225), font=font(24))
        for j, state in enumerate(("dirty", "clean")):
            im = Image.open(ASSETS / "rooms" / f"{name}-{state}.webp").convert("RGB")
            im.thumbnail((450, 260), Image.Resampling.LANCZOS)
            px = x + 20 + j * 475
            sheet.paste(im, (px, y + 48))
            draw.text((px, y + 308), state, fill=(185, 170, 202), font=font(16))
    sheet.save(PREVIEWS / "01-room-pairs.jpg", quality=92)


def sprite_sheet(paths, title, output, cell=250, columns=4):
    rows = (len(paths) + columns - 1) // columns
    sheet = Image.new("RGBA", (columns * cell, 58 + rows * cell), (22, 17, 29, 255))
    draw = ImageDraw.Draw(sheet)
    draw.text((18, 14), title, fill=(245, 235, 225), font=font(26))
    for i, path in enumerate(paths):
        im = Image.open(path).convert("RGBA")
        tile = contain(im, (cell, cell - 28))
        x, y = (i % columns) * cell, 58 + (i // columns) * cell
        sheet.alpha_composite(tile, (x, y))
        label = path.stem
        draw.text((x + 10, y + cell - 25), label, fill=(195, 181, 211), font=font(14))
    sheet.convert("RGB").save(PREVIEWS / output, quality=92)


def main():
    room_checks = [room_result(name) for name in ROOMS]
    sprite_specs = (
        [(ASSETS / "tools" / name, (512, 512)) for name in TOOLS]
        + [(ASSETS / "cleanables" / path, (512, 512)) for path in DIRT]
        + [(ASSETS / "cleanables" / "trash" / name, (512, 512)) for name in CLUTTER]
        + [(ASSETS / "memories" / name, (1024, 1024)) for name in MEMORIES]
    )
    sprite_checks = [alpha_result(path, expected) for path, expected in sprite_specs]
    manifest_path = ASSETS / "asset-manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    def paths_in(value):
        if isinstance(value, dict):
            for nested in value.values():
                yield from paths_in(nested)
        elif isinstance(value, list):
            for nested in value:
                yield from paths_in(nested)
        elif isinstance(value, str) and value.startswith("/assets/"):
            yield value

    missing_manifest_paths = [
        value for value in paths_in(manifest)
        if not (ROOT / "public" / value.lstrip("/")).exists()
    ]
    report = {
        "newProductionAssetCount": 45,
        "rooms": room_checks,
        "sprites": sprite_checks,
        "manifestMissingPaths": missing_manifest_paths,
        "allOk": all(item["ok"] for item in room_checks)
        and all(item["ok"] for item in sprite_checks)
        and not missing_manifest_paths,
    }
    (ROOT / "output" / "imagegen" / "expansion-validation.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    lines = [
        "# Expansion validation",
        "",
        f"- Overall: {'PASS' if report['allOk'] else 'FAIL'}",
        "- New production assets: 45 (12 room images + 33 sprites)",
        f"- Manifest missing paths: {len(missing_manifest_paths)}",
        "",
        "## Room pair structure",
        "",
        "| Pair | Size | Edge correlation | Result |",
        "|---|---:|---:|---|",
    ]
    for item in room_checks:
        lines.append(
            f"| {item['room']} | {item['sizes'][0][0]}×{item['sizes'][0][1]} | "
            f"{item['edgeCorrelation']:.4f} | {'PASS' if item['ok'] else 'REVIEW'} |"
        )
    lines += [
        "",
        "All sprites were checked for exact dimensions, a non-empty alpha bounding",
        "box, and fully transparent canvas corners.",
    ]
    (ROOT / "output" / "imagegen" / "EXPANSION_VALIDATION.md").write_text(
        "\n".join(lines) + "\n", encoding="utf-8"
    )

    room_preview()
    sprite_sheet(
        [ASSETS / "tools" / name for name in TOOLS]
        + [ASSETS / "cleanables" / path for path in DIRT],
        "New tools and surface dirt", "02-tools-and-dirt.jpg",
    )
    sprite_sheet(
        [ASSETS / "cleanables" / "trash" / name for name in CLUTTER]
        + [ASSETS / "memories" / name for name in MEMORIES],
        "Room clutter and memory items", "03-clutter-and-memories.jpg",
    )
    print(json.dumps({"allOk": report["allOk"], "roomCorrelations": {r["room"]: r["edgeCorrelation"] for r in room_checks}, "spriteCount": len(sprite_checks), "missingManifestPaths": missing_manifest_paths}))


if __name__ == "__main__":
    main()
