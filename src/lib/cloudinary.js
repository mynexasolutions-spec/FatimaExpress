const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function cloudinaryUrl(publicId, { width, height, crop = "fill" } = {}) {
  if (!cloudName || !publicId) return null;
  const transform = [width && `w_${width}`, height && `h_${height}`, `c_${crop}`, "q_auto", "f_auto"]
    .filter(Boolean)
    .join(",");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}
