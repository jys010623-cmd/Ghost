# Room and sprite expansion

## Room pairs

The six new room pairs live in `public/assets/rooms/`:

- `bedroom-{dirty,clean}.webp`
- `kitchen-{dirty,clean}.webp`
- `bathroom-{dirty,clean}.webp`
- `attic-{dirty,clean}.webp`
- `child-room-{dirty,clean}.webp`
- `garden-{dirty,clean}.webp`

Every file is 2048×1152 WebP. For a transition, stack the matching dirty and
clean files at identical coordinates and animate only the clean layer's opacity.
The dirty image was produced by editing its clean master without intentionally
moving architecture or large furniture.

## New interaction sprites

- Tools: `public/assets/tools/tool-{spray,brush,rake,sponge}.png`
- Surface dirt: three variants each under
  `public/assets/cleanables/{grease,mold,leaves,weeds}/`
- Room clutter and toys: `public/assets/cleanables/trash/`
- Memory items: `public/assets/memories/`

Tools, surface dirt, and clutter are 512×512 RGBA PNG. Memories are 1024×1024
RGBA PNG. All have transparent corners and padded silhouettes.

Suggested tool mapping:

- spray → grease and mirrors
- brush → mold and mineral buildup
- rake → leaves
- sponge → dishes, grease, and bathroom residue

The complete runtime paths are registered in
`public/assets/asset-manifest.json`.

