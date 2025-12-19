# Idler Images

Place idler image files in this directory.

## Current Images

- `elementary_school.gif` - Animated GIF for the Elementary School idler
- `elementary_school.webp` - Still image (WebP format) for the Elementary School idler

## Adding New Images

1. Place the image file in this directory
2. Import it in `src/config/idlerImages.js`
3. Add it to the `idlerImageMap` object
4. Update the corresponding entry in `data/idlers.json` to reference the new image filename

## Supported Formats

- GIF (animated GIFs are supported and will animate automatically)
- PNG
- WebP
- JPG/JPEG

