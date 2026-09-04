import { AutoModel, AutoProcessor, type ProgressInfo, RawImage } from '@huggingface/transformers';

export { applyMaskToImageData, getModelAndProcessor, removeBackground };
export type { ModelLoadProgress };

// briaai/RMBG-1.4's config.json declares a non-standard `model_type`, which the
// higher-level `pipeline('background-removal', ...)` helper rejects outright.
// Loading the model/processor directly (as done here) bypasses that check.
const modelId = 'briaai/RMBG-1.4';

interface ModelLoadProgress { progress: number }
type ModelAndProcessor = [Awaited<ReturnType<typeof AutoModel.from_pretrained>>, Awaited<ReturnType<typeof AutoProcessor.from_pretrained>>];

let modelAndProcessorPromise: Promise<ModelAndProcessor> | undefined;

function getModelAndProcessor({ onProgress }: { onProgress?: (progress: ModelLoadProgress) => void } = {}) {
  if (!modelAndProcessorPromise) {
    const device = typeof navigator !== 'undefined' && 'gpu' in navigator ? 'webgpu' : 'wasm';

    const progress_callback = (info: ProgressInfo) => {
      if (info.status === 'progress_total') {
        onProgress?.({ progress: info.progress });
      }
    };

    modelAndProcessorPromise = Promise.all([
      AutoModel.from_pretrained(modelId, { device, progress_callback }),
      AutoProcessor.from_pretrained(modelId, { progress_callback }),
    ]).catch((error) => {
      modelAndProcessorPromise = undefined;
      throw error;
    });
  }

  return modelAndProcessorPromise;
}

function applyMaskToImageData({ imageData, maskData }: { imageData: Uint8ClampedArray; maskData: Uint8Array | Uint8ClampedArray }) {
  for (let i = 0; i < maskData.length; i++) {
    imageData[(4 * i) + 3] = maskData[i];
  }
}

async function removeBackground({ file, onProgress }: { file: Blob; onProgress?: (progress: ModelLoadProgress) => void }): Promise<Blob> {
  const [model, processor] = await getModelAndProcessor({ onProgress });

  const image = await RawImage.fromBlob(file);
  const { pixel_values } = await processor(image);
  const { output } = await model({ input: pixel_values });

  const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);

  const canvas = image.toCanvas();
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not get canvas context');
  }

  const pixelData = context.getImageData(0, 0, canvas.width, canvas.height);
  applyMaskToImageData({ imageData: pixelData.data, maskData: mask.data });
  context.putImageData(pixelData, 0, 0);

  return canvas.convertToBlob({ type: 'image/png' });
}
