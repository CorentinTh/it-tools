import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { expect, test } from '@playwright/test';

test.describe('Tool - Image color inverter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-color-inverter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Image color inverter - IT Tools');
  });

  test('Displays file upload area', async ({ page }) => {
    // Check if the file upload component is visible
    const uploadArea = page.locator('text=Drag and drop an image here, or click to select');
    await expect(uploadArea).toBeVisible();
  });

  test('Shows error for invalid file type', async ({ page }) => {
    // Create a temporary non-image file
    const testFilePath = path.join(process.cwd(), 'test-file.txt');
    await fs.writeFile(testFilePath, 'This is not an image');

    try {
      // Upload the text file
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(testFilePath);

      // Should show error message
      const errorAlert = page.locator('.n-alert--error');
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText('File must be an image');
    }
    finally {
      // Clean up
      await fs.unlink(testFilePath).catch(() => {});
    }
  });

  test('Processes image upload successfully', async ({ page }) => {
    // Create a simple test image (1x1 pixel PNG in base64)
    const testImageDataUrl
      = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    // Create a blob from the data URL
    const response = await fetch(testImageDataUrl);
    const blob = await response.blob();

    // Create a temporary file
    const buffer = await blob.arrayBuffer();
    const testFilePath = path.join(process.cwd(), 'test-image.png');
    await fs.writeFile(testFilePath, new Uint8Array(buffer));

    try {
      // Upload the image
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(testFilePath);

      // Wait for processing to complete
      await page.waitForSelector('text=Original Image', { timeout: 5000 });
      await page.waitForSelector('text=Inverted Image', { timeout: 5000 });

      // Check that both images are displayed
      const originalImage = page.locator('text=Original Image');
      const invertedImage = page.locator('text=Inverted Image');

      await expect(originalImage).toBeVisible();
      await expect(invertedImage).toBeVisible();

      // Check that download button is available
      const downloadButton = page.locator('text=Download PNG');
      await expect(downloadButton).toBeVisible();

      // Check that copy button is available
      const copyButton = page.locator('text=Copy Base64');
      await expect(copyButton).toBeVisible();
    }
    finally {
      // Clean up
      await fs.unlink(testFilePath).catch(() => {});
    }
  });

  test('Clear button resets the tool', async ({ page }) => {
    // Create a simple test image
    const testImageDataUrl
      = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const response = await fetch(testImageDataUrl);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const testFilePath = path.join(process.cwd(), 'test-image.png');
    await fs.writeFile(testFilePath, new Uint8Array(buffer));

    try {
      // Upload and process image
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(testFilePath);

      await page.waitForSelector('text=Inverted Image', { timeout: 5000 });

      // Click clear button
      const clearButton = page.locator('text=Clear & Upload New');
      await clearButton.click();

      // Check that images are cleared
      const originalImage = page.locator('text=Original Image');
      const invertedImage = page.locator('text=Inverted Image');

      await expect(originalImage).not.toBeVisible();
      await expect(invertedImage).not.toBeVisible();

      // Check that upload area is visible again
      const uploadArea = page.locator('text=Drag and drop an image here, or click to select');
      await expect(uploadArea).toBeVisible();
    }
    finally {
      await fs.unlink(testFilePath).catch(() => {});
    }
  });
});
