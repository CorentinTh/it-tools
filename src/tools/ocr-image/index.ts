import { Scan } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'OCRize image and PDF',
  path: '/ocr-image',
  description: 'Perform OCR (Tesseract) on an image or PDF',
  keywords: ['ocr', 'image', 'tesseract', 'pdf'],
  component: () => import('./ocr-image.vue'),
  icon: Scan,
  createdAt: new Date('2024-03-09'),
});
