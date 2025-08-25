export function invertImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      reject(new Error('Image file size must be less than 10MB'));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the original image
          ctx.drawImage(img, 0, 0);

          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Invert colors (RGB channels only, preserve alpha)
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // Red
            data[i + 1] = 255 - data[i + 1]; // Green
            data[i + 2] = 255 - data[i + 2]; // Blue
            // data[i + 3] is alpha - keep unchanged
          }

          // Put the modified image data back
          ctx.putImageData(imageData, 0, 0);

          // Convert to base64 PNG
          const invertedDataUrl = canvas.toDataURL('image/png');
          resolve(invertedDataUrl);
        }
        catch (err) {
          reject(new Error(`Failed to process image: ${err}`));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

export function invertImageColors(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);

  // Invert RGB values while preserving alpha
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; // Red
    data[i + 1] = 255 - data[i + 1]; // Green
    data[i + 2] = 255 - data[i + 2]; // Blue
    // data[i + 3] is alpha - keep unchanged
  }

  return new ImageData(data, imageData.width, imageData.height);
}
