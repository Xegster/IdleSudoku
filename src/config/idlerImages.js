// Image imports for idlers
// Add image imports here as you add them to the assets/idlers folder

// Elementary School - animated GIF
const elementarySchoolGif = require('@assets/idlers/elementary_school.gif');
const elementarySchoolWebp = require('@assets/idlers/elementary_school.webp');

// Image mapping: idler image filename -> imported image source
export const idlerImageMap = {
  'elementary_school.gif': elementarySchoolGif,
  'elementary_school.webp': elementarySchoolWebp,
  // Add more mappings as needed
  'elementary_school.png': null, // fallback or placeholder
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

