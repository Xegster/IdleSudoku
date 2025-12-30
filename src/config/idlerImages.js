// Image imports for idlers
// Add image imports here as you add them to the assets/idlers folder

// Image mapping: idler image filename -> imported image source
export const idlerImageMap = {
  // Placeholder mappings - add actual images as they are added to assets/idlers
  'elementary_school.png': null,
  'seniors_home.png': null,
  'engineers.png': null,
  'mathematicians.png': null,
  'software_engineers.png': null,
};

// Helper function to get image source for an idler
export function getIdlerImageSource(imageFilename) {
  if (!imageFilename) return null;

  // Only return statically mapped assets; dynamic require is not supported
  if (Object.prototype.hasOwnProperty.call(idlerImageMap, imageFilename)) {
    return idlerImageMap[imageFilename];
  }

  console.warn(`Image not found: ${imageFilename}`);
  return null;
}
