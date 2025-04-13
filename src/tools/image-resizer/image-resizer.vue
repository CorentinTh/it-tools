<script setup lang="ts">
import { ref, watch } from 'vue';

// State variables
const imageFile = ref<File | null>(null);
const imageUrl = ref<string | null>(null);
const originalImageUrl = ref<string | null>(null); // To store original image data
const imageWidth = ref(500); // Default width
const imageHeight = ref(350); // Default height
const originalImageWidth = ref<number | null>(null); // Store original image width
const originalImageHeight = ref<number | null>(null); // Store original image height
const resizedImageUrl = ref<string | null>(null);

// Watch width to trigger resizing
watch(imageWidth, () => {
  resizeImage();
});

// Watch height to trigger resizing
watch(imageHeight, () => {
  resizeImage();
});

// Handle file upload
async function handleFileUpload(uploadedFile: File) {
  if (!uploadedFile) {
    return;
  }

  imageFile.value = uploadedFile;

  try {
    // Read the file as a Data URL
    const reader = new FileReader();
    const fileDataUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(uploadedFile);
    });

    imageUrl.value = fileDataUrl; // Preview image
    originalImageUrl.value = fileDataUrl; // Store original image for resizing
    resizedImageUrl.value = null; // Clear previous resized image

    // Create an image to get original dimensions
    const img = new Image();
    img.src = fileDataUrl;

    await new Promise<void>((resolve) => {
      img.onload = () => {
        // Set original image dimensions
        originalImageWidth.value = img.naturalWidth;
        originalImageHeight.value = img.naturalHeight;

        // Automatically resize if width and height are set
        if (imageWidth.value > 0 && imageHeight.value > 0) {
          resizeImage();
        }

        resolve();
      };
    });
  }
  catch (error) {
    console.error('Error reading file:', error);
  }
}

// Function to resize the image
async function resizeImage() {
  if (!originalImageUrl.value) {
    return; // Ensure there's an original image to work with
  }

  const img = new Image();
  img.src = originalImageUrl.value; // Use the original image for resizing

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = imageWidth.value;
    canvas.height = imageHeight.value;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0, imageWidth.value, imageHeight.value);
    resizedImageUrl.value = canvas.toDataURL('image/png');
  };
}

// Function to download resized image
function downloadImage(format: string) {
  if (!resizedImageUrl.value || !imageFile.value) {
    return;
  }

  const originalFilename = imageFile.value.name.replace(/\.[^/.]+$/, ''); // Remove file extension
  const newFilename = `${originalFilename}-${imageWidth.value}x${imageHeight.value}.${format}`;
  const link = document.createElement('a');
  link.href = resizedImageUrl.value;
  link.download = newFilename;
  link.click();
}
</script>

<template>
  <n-card>
    <div>
      <!-- File input -->
      <c-file-upload mb-2 accept=".jpg,.jpeg,.png,.bmp,.ico,.svg" title="Drag and drop a .jpg, .jpeg, .png, .bmp, .ico, .svg file here" @file-upload="handleFileUpload" />

      <!-- Original image dimensions -->
      <div v-if="originalImageWidth && originalImageHeight">
        <p>Original Image Dimensions: {{ originalImageWidth }}x{{ originalImageHeight }}px</p>
      </div>

      <!-- Width and height inputs -->
      <div class="input-group">
        <label for="widthInput">Width (px):</label>
        <n-input-number id="widthInput" v-model:value="imageWidth" placeholder="Width (px)" mb-3 />
      </div>

      <div class="input-group">
        <label for="heightInput">Height (px):</label>
        <n-input-number id="heightInput" v-model:value="imageHeight" placeholder="Height (px)" mb-1 />
      </div>
    </div>

    <!-- Image preview -->
    <div v-if="resizedImageUrl" class="image-container" style="text-align: center; margin-top: 20px;">
      <div class="image-wrapper">
        <img :src="resizedImageUrl" :alt="`Resized Preview (${imageWidth}px x ${imageHeight}px)`" :style="{ width: `${imageWidth}px`, height: `${imageHeight}px` }">
      </div>
      <p>Preview: {{ imageWidth }}x{{ imageHeight }}px</p>

      <!-- Download options -->
      <h3>Download Options:</h3>
      <div class="download-grid">
        <n-button @click.prevent="downloadImage('jpg')">
          Download JPG
        </n-button>
        <n-button @click.prevent="downloadImage('png')">
          Download PNG
        </n-button>
        <n-button @click.prevent="downloadImage('bmp')">
          Download BMP
        </n-button>
        <n-button @click.prevent="downloadImage('svg')">
          Download SVG
        </n-button>
        <n-button @click.prevent="downloadImage('ico')">
          Download ICO
        </n-button>
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
}

.input-group label {
  margin-right: 10px;
  width: 100px;
}

.image-container {
  max-width: 100%;
  overflow: auto;
}

.image-wrapper {
  max-width: 100%;
  max-height: 500px;
  overflow: auto;
}

.download-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
