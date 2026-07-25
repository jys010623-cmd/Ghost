# Expansion validation

- Overall: PASS
- New production assets: 45 (12 room images + 33 sprites)
- Manifest missing paths: 0

## Room pair structure

| Pair | Size | Edge correlation | Result |
|---|---:|---:|---|
| bedroom | 2048×1152 | 0.8454 | PASS |
| kitchen | 2048×1152 | 0.8269 | PASS |
| bathroom | 2048×1152 | 0.8050 | PASS |
| attic | 2048×1152 | 0.8218 | PASS |
| child-room | 2048×1152 | 0.8664 | PASS |
| garden | 2048×1152 | 0.7984 | PASS |

All sprites were checked for exact dimensions, a non-empty alpha bounding
box, and fully transparent canvas corners.
