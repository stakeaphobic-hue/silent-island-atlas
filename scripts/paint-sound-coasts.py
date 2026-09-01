#!/usr/bin/env python3
"""Paint geographically shaped CT + Long Island Sound coasts onto island-base.jpg."""

from __future__ import annotations

import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path("/workspace")
BASE = ROOT / "public/atlas/island-base.jpg"
OUT = ROOT / "public/atlas/island.jpg"
W, H = 1792, 1008
rng = random.Random(69)

# Shoreline west → east. CT: land is north (small y). Harbors indent north; points jut south.
CT_SHORE = [
    (0, 96),
    (50, 90),
    (110, 98),
    (170, 86),
    (230, 94),
    (290, 78),  # Southport harbor back
    (325, 104),  # Southport mouth
    (360, 86),  # Fairfield beaches
    (420, 96),
    (490, 90),
    (540, 108),  # Black Rock approach
    (565, 82),  # Black Rock harbor
    (585, 128),  # Seaside Park spit
    (600, 62),  # Bridgeport inner harbor
    (618, 64),
    (642, 132),  # Pleasure Beach
    (700, 102),
    (760, 92),
    (805, 118),
    (832, 152),  # Stratford Point / Lordship
    (858, 128),
    (888, 70),  # Housatonic mouth
    (930, 74),
    (968, 122),  # Milford Point
    (1030, 96),
    (1085, 108),
    (1112, 146),  # New Haven west breakwater
    (1140, 58),  # New Haven inner harbor
    (1172, 58),
    (1210, 138),  # Lighthouse Point
    (1270, 102),
    (1360, 90),
    (1480, 96),
    (1600, 84),
    (1720, 92),
    (1792, 88),
]

# LI: land is south (large y). Bays indent south; necks jut north into the Sound.
LI_SHORE = [
    (0, 908),
    (50, 898),
    (90, 882),  # Glen Cove neck
    (108, 904),
    (135, 926),  # Hempstead Harbor
    (170, 892),
    (200, 938),
    (228, 962),  # Oyster Bay inner
    (255, 960),
    (285, 898),  # Centre Island / bay mouth
    (330, 886),
    (358, 858),  # Lloyd Neck
    (378, 898),  # Huntington
    (415, 852),  # Eatons Neck
    (455, 848),
    (498, 896),  # Northport
    (540, 888),
    (590, 942),  # Smithtown Bay
    (638, 928),  # Stony Brook
    (690, 908),
    (742, 858),  # Old Field Point
    (780, 888),
    (802, 950),  # Port Jefferson inner harbor
    (838, 948),
    (872, 898),
    (920, 908),
    (958, 926),  # Mount Sinai
    (1010, 900),
    (1080, 896),
    (1124, 900),  # Shoreham
    (1220, 908),
    (1360, 894),
    (1520, 902),
    (1660, 890),
    (1792, 896),
]


def densify(pts: list[tuple[int, int]], step: float = 6.0, jitter: float = 2.4) -> list[tuple[float, float]]:
    out: list[tuple[float, float]] = [pts[0]]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        dist = math.hypot(x1 - x0, y1 - y0)
        n = max(1, int(dist / step))
        for i in range(1, n + 1):
            t = i / n
            x = x0 + (x1 - x0) * t
            y = y0 + (y1 - y0) * t
            if i < n:
                y += rng.uniform(-jitter, jitter)
                x += rng.uniform(-jitter * 0.3, jitter * 0.3)
            out.append((x, y))
    return out


def poly_ct(shore: list[tuple[float, float]]) -> list[tuple[float, float]]:
    return [(0, 0), (W, 0), *shore[::-1]] if False else [(0.0, 0.0), (float(W), 0.0), *[(x, y) for x, y in shore[::-1]]]


def poly_from_north_shore(shore: list[tuple[float, float]]) -> list[tuple[float, float]]:
    # land north of shoreline
    return [(0.0, 0.0), (float(W), 0.0), *list(reversed(shore))]


def poly_from_south_shore(shore: list[tuple[float, float]]) -> list[tuple[float, float]]:
    return [(0.0, float(H)), (float(W), float(H)), *list(reversed(shore))]


def svg_land_north(shore: list[tuple[float, float]]) -> str:
    parts = [f"M 0 0 L {W} 0"]
    for x, y in reversed(shore):
        parts.append(f"L {x:.1f} {y:.1f}")
    parts.append("Z")
    return " ".join(parts)


def svg_land_south(shore: list[tuple[float, float]]) -> str:
    parts = [f"M 0 {H} L {W} {H}"]
    for x, y in reversed(shore):
        parts.append(f"L {x:.1f} {y:.1f}")
    parts.append("Z")
    return " ".join(parts)


def fill_poly(mask: Image.Image, poly: list[tuple[float, float]]) -> None:
    d = ImageDraw.Draw(mask)
    d.polygon([(int(round(x)), int(round(y))) for x, y in poly], fill=255)


def noise_field(w: int, h: int, scale: float, seed: int) -> np.ndarray:
    rs = np.random.RandomState(seed)
    sw, sh = max(4, int(w / scale)), max(4, int(h / scale))
    small = rs.rand(sh, sw).astype(np.float32)
    img = Image.fromarray((small * 255).astype(np.uint8), "L").resize((w, h), Image.Resampling.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


def paint_land(mask: np.ndarray, kind: str) -> np.ndarray:
    """Return RGBA land pixels where mask>0."""
    h, w = mask.shape
    n1 = noise_field(w, h, 48, 11 if kind == "ct" else 23)
    n2 = noise_field(w, h, 14, 41 if kind == "ct" else 59)
    n3 = noise_field(w, h, 6, 73 if kind == "ct" else 91)
    # olive-grey matching Silent Island interior
    r = 42 + 18 * n1 + 10 * n2 - 8 * n3
    g = 44 + 14 * n1 + 8 * n2 - 6 * n3
    b = 38 + 10 * n1 + 6 * n2 - 4 * n3
    # woods
    woods = (n2 > 0.58) & (n3 > 0.4)
    r = np.where(woods, r * 0.72, r)
    g = np.where(woods, g * 0.78, g)
    b = np.where(woods, b * 0.70, b)
    # pale fields
    fields = (n1 > 0.72) & (n2 < 0.4)
    r = np.where(fields, r + 10, r)
    g = np.where(fields, g + 8, g)
    b = np.where(fields, b + 4, b)
    a = np.where(mask > 0.5, 255, 0).astype(np.uint8)
    rgba = np.stack(
        [
            np.clip(r, 0, 255).astype(np.uint8),
            np.clip(g, 0, 255).astype(np.uint8),
            np.clip(b, 0, 255).astype(np.uint8),
            a,
        ],
        axis=-1,
    )
    return rgba


def stroke_shore(canvas: Image.Image, shore: list[tuple[float, float]], wet: tuple[int, int, int, int], foam: tuple[int, int, int, int]) -> None:
    d = ImageDraw.Draw(canvas)
    line = [(int(x), int(y)) for x, y in shore]
    d.line(line, fill=wet, width=5, joint="curve")
    d.line(line, fill=foam, width=2, joint="curve")


def main() -> None:
    base = Image.open(BASE).convert("RGBA")
    assert base.size == (W, H)

    ct_s = densify(CT_SHORE, 7.0, 2.2)
    li_s = densify(LI_SHORE, 7.0, 2.6)

    ct_mask_img = Image.new("L", (W, H), 0)
    li_mask_img = Image.new("L", (W, H), 0)
    fill_poly(ct_mask_img, poly_from_north_shore(ct_s))
    fill_poly(li_mask_img, poly_from_south_shore(li_s))
    ct_mask_img = ct_mask_img.filter(ImageFilter.GaussianBlur(1.2))
    li_mask_img = li_mask_img.filter(ImageFilter.GaussianBlur(1.2))

    ct_mask = np.asarray(ct_mask_img, dtype=np.float32) / 255.0
    li_mask = np.asarray(li_mask_img, dtype=np.float32) / 255.0

    ct_rgba = paint_land(ct_mask, "ct")
    li_rgba = paint_land(li_mask, "li")
    # stamp Silent Island land into the coast fills so the strips match the chart
    src = np.asarray(Image.open(BASE).convert("RGB"))
    tex = src[390:720, 380:980]  # island interior
    th, tw = tex.shape[:2]
    yy, xx = np.ogrid[:H, :W]
    tiled = tex[yy % th, xx % tw]
    for rgba, mask in ((ct_rgba, ct_mask), (li_rgba, li_mask)):
        m = mask[..., None]
        rgba[..., :3] = np.clip(
            rgba[..., :3] * (1 - 0.62 * m) + tiled * (0.62 * m),
            0,
            255,
        ).astype(np.uint8)
    ct_rgba[..., 3] = (ct_mask * 255).astype(np.uint8)
    li_rgba[..., 3] = (li_mask * 255).astype(np.uint8)

    ct_img = Image.fromarray(ct_rgba, "RGBA")
    li_img = Image.fromarray(li_rgba, "RGBA")

    # shallow water wash just off the coast (harbors read as water, not land)
    wash = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    wd = ImageDraw.Draw(wash)
    wd.line([(int(x), int(y)) for x, y in ct_s], fill=(28, 48, 52, 40), width=18)
    wd.line([(int(x), int(y)) for x, y in li_s], fill=(28, 48, 52, 40), width=18)
    wash = wash.filter(ImageFilter.GaussianBlur(6))

    out = Image.alpha_composite(base, wash)
    out = Image.alpha_composite(out, ct_img)
    out = Image.alpha_composite(out, li_img)

    shore_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    stroke_shore(shore_layer, ct_s, (58, 56, 44, 180), (120, 118, 96, 90))
    stroke_shore(shore_layer, li_s, (58, 56, 44, 180), (120, 118, 96, 90))
    shore_layer = shore_layer.filter(ImageFilter.GaussianBlur(0.6))
    out = Image.alpha_composite(out, shore_layer)

    rgb = out.convert("RGB")
    rgb.save(OUT, "JPEG", quality=92, optimize=True)
    print("wrote", OUT, OUT.stat().st_size)

    def compact(pts: list[tuple[int, int]], south: bool) -> str:
        if south:
            parts = [f"M 0 {H} L {W} {H}"]
            for x, y in reversed(pts):
                parts.append(f"L {x} {y}")
        else:
            parts = [f"M 0 0 L {W} 0"]
            for x, y in reversed(pts):
                parts.append(f"L {x} {y}")
        parts.append("Z")
        return " ".join(parts)

    print("---CONNECTICUT_LAND---")
    print(compact(CT_SHORE, False))
    print("---LONG_ISLAND_LAND---")
    print(compact(LI_SHORE, True))


if __name__ == "__main__":
    main()
