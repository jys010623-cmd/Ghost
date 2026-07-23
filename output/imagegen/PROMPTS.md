# Final image-generation prompt set

All generated bitmap art used the built-in OpenAI image-generation/editing path. Transparent deliverables were generated on a flat `#00ff00` chroma-key background, then converted to RGBA locally.

## Living room master

> Premium hand-painted 2.5D web-game living room, miniature diorama feeling, soft 35-degree quarter view, floor and left/right walls visible, exact 16:9. Modest old wooden room with a curtained rear window, dark-teal sofa, oval coffee table, small cabinet, bookcase, warm lamp and fireplace. Muted lavender, warm ivory, teal and walnut. Quiet and dusty but not scary. Keep a large readable floor area and no major removable gameplay cleanables, characters, UI, text, logo or watermark.

## Clean-state room edit

> Transform only cleanliness, tidiness, lighting and color warmth. Preserve the exact camera, crop, architecture, furniture positions and furniture sizes. Clean the window, remove dust and scuffs, arrange existing books and cushions, polish wood subtly, warm the window/lamp/fireplace light. Add or remove no architecture or furniture.

## Mongsil master

> Use the supplied official Mongsil design sheet as the sole identity reference. One standalone front-view Mongsil: identical lavender star nightcap and cream pom-pom, rounded white/pale-lavender body, small flipper arms, curled right-side tail, dark-purple oval eyes, tiny mouth and pink blush. Centered on a uniform `#00ff00` background with no props, text, UI, sparkles, glow, shadow or watermark.

## Mongsil expression edits

Each expression used the approved Mongsil master as an edit target and repeated these invariants:

> Preserve the hat, pom-pom, body, tail, proportions, canvas scale, center, camera, palette, lighting and rendering. Change only face and the named minimal pose adjustment.

States: sad, surprised, happy, sleep and thankful.

## Cleaning-object sheets

> Premium hand-painted 2.5D cozy old-house game sprites with soft rounded forms and subtle overhead-left lighting. Exact evenly spaced grid on a uniform `#00ff00` background, one complete isolated object per cell, generous padding, no overlap, labels, text, grid lines, borders, logos or watermark.

Separate sheets were made for dust, cobwebs, stains and household trash. `dust-02`, `dust-03`, `cobweb-wide-01`, `cobweb-small-01`, `stain-table-01`, `stain-sofa-01` and `stain-window-01` received targeted regeneration after visual QA.

## Tools, effects and UI ornaments

> Matching premium hand-painted 2.5D storybook game style, isolated objects in an exact grid on uniform `#00ff00`, no panel backgrounds or text.

The tool sheet contained hand, cloth, feather duster and broom. The effects sheet contained two sparkles, a sparkle cluster, clean shine, ghost glow, memory glow and dust particle. The UI sheet contained only small decorative pieces, never complete UI screens.

## Memory item

> A small worn wooden tabletop family-photo frame, anonymous tiny sepia family silhouettes, nostalgic and warm rather than creepy, one centered 3/4-view prop on uniform `#00ff00`.

The restored state was an edit preserving frame angle, crop, frame shape and photo composition while changing only dust, scratches, polish, clarity and warmth.

## Title art

The title background was an edit of the room master:

> Preserve room geometry and furniture; shift to calm blue-lavender twilight with moonlit window and faint warm lamp/fireplace, reduce visual noise, reserve negative space for CSS title/buttons, no UI or text.

The title Mongsil was an identity-preserving edit of the approved master with only a small curious tilt and sleepy smile.
