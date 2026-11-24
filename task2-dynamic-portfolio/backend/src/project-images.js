const maxImageBytes = 2 * 1024 * 1024;
const imageDataPattern = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/;
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const jpegSignature = Buffer.from([255, 216, 255]);

function decodeProjectImage(value) {
  if (typeof value !== 'string' || value.length > 4 * Math.ceil(maxImageBytes / 3) + 24) return null;
  const match = imageDataPattern.exec(value);
  if (!match) return null;

  const [, type, encoded] = match;
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length > maxImageBytes || bytes.toString('base64') !== encoded) return null;

  const signatureMatches = {
    'image/png': bytes.subarray(0, 8).equals(pngSignature),
    'image/jpeg': bytes.subarray(0, 3).equals(jpegSignature),
    'image/webp': bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP',
  };
  return signatureMatches[type] ? { type, bytes } : null;
}

function publicProject({ imageData, imagePath, ...project }) {
  const imageUrl = imageData ? `/api/projects/${encodeURIComponent(project.id)}/image` : imagePath || '';
  return { ...project, imageUrl };
}

function projectInput({ imageUrl, imagePath, ...fields }) {
  return fields;
}

module.exports = { maxImageBytes, decodeProjectImage, publicProject, projectInput };
