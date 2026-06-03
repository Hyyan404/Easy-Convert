export const exportImage = (imageSrc, activeFilterStyle, adjustments, format = 'image/png') => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Apply filters to context
      const { brightness, contrast, saturation, exposure, warmth, blur } = adjustments;

      // Map manual adjustments to CSS filter string
      const adjustmentFilter = `
        brightness(${100 + brightness + exposure}%)
        contrast(${100 + contrast + (sharpness / 4)}%)
        saturate(${100 + saturation}%)
        sepia(${warmth > 0 ? warmth / 2 : 0}%)
        hue-rotate(${warmth < 0 ? warmth / 2 : 0}deg)
        blur(${blur}px)
      `;

      // Combine active filter with adjustments
      ctx.filter = `${activeFilterStyle} ${adjustmentFilter}`;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Export
      const dataUrl = canvas.toDataURL(format, 1.0);
      resolve(dataUrl);
    };
    img.src = imageSrc;
  });
};

export const downloadDataUrl = (dataUrl, fileName) => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
};
