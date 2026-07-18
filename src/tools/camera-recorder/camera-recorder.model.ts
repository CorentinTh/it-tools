import { type ComputedRef, computed, ref } from 'vue';
import {
  MAX_CAMERA_RECORDING_BYTES,
  MAX_CAMERA_SCREENSHOT_BYTES,
  MAX_RETAINED_CAMERA_MEDIA_BYTES,
} from './camera-recorder.limits';

export const MAX_RETAINED_SCREENSHOTS = 12;
export const MAX_RETAINED_VIDEOS = 4;

export interface CameraMedia {
  id: string
  type: 'image' | 'video'
  value: string
  sizeBytes: number
  createdAt: Date
}

interface ObjectUrlApi {
  createObjectURL: (blob: Blob) => string
  revokeObjectURL: (url: string) => void
}

interface CameraMediaCollectionOptions {
  imageLimit?: number
  videoLimit?: number
  imageByteLimit?: number
  videoByteLimit?: number
  totalByteLimit?: number
  objectUrlApi?: ObjectUrlApi
  createId?: () => string
  now?: () => Date
}

export interface CameraMediaCollection {
  medias: ComputedRef<readonly CameraMedia[]>
  retainedBytes: ComputedRef<number>
  addImage: (blob: Blob) => CameraMedia | undefined
  addVideo: (blob: Blob) => CameraMedia | undefined
  remove: (id: string) => boolean
  clear: () => void
  dispose: () => void
}

const browserObjectUrlApi: ObjectUrlApi = {
  createObjectURL: blob => URL.createObjectURL(blob),
  revokeObjectURL: url => URL.revokeObjectURL(url),
};

function validateLimit(limit: number, name: string) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError(`${name} must be a positive integer.`);
  }
}

/**
 * Owns every object URL used by Camera Recorder. Keeping URL allocation and
 * release in one place makes removal, eviction and component teardown follow
 * the same lifecycle contract.
 */
export function createCameraMediaCollection({
  imageLimit = MAX_RETAINED_SCREENSHOTS,
  videoLimit = MAX_RETAINED_VIDEOS,
  imageByteLimit = MAX_CAMERA_SCREENSHOT_BYTES,
  videoByteLimit = MAX_CAMERA_RECORDING_BYTES,
  totalByteLimit = MAX_RETAINED_CAMERA_MEDIA_BYTES,
  objectUrlApi = browserObjectUrlApi,
  createId,
  now = () => new Date(),
}: CameraMediaCollectionOptions = {}): CameraMediaCollection {
  validateLimit(imageLimit, 'imageLimit');
  validateLimit(videoLimit, 'videoLimit');
  validateLimit(imageByteLimit, 'imageByteLimit');
  validateLimit(videoByteLimit, 'videoByteLimit');
  validateLimit(totalByteLimit, 'totalByteLimit');

  const values = ref<CameraMedia[]>([]);
  const medias = computed<readonly CameraMedia[]>(() => values.value);
  const retainedBytes = computed(() => values.value.reduce((total, media) => total + media.sizeBytes, 0));
  let disposed = false;
  let nextId = 0;

  const generateId = createId ?? (() => `camera-media-${nextId++}`);

  function release(media: CameraMedia) {
    objectUrlApi.revokeObjectURL(media.value);
  }

  function evictOldest(type: CameraMedia['type'], limit: number) {
    const matchingItems = values.value.filter(media => media.type === type);

    if (matchingItems.length <= limit) {
      return;
    }

    for (let index = values.value.length - 1; index >= 0; index -= 1) {
      const media = values.value[index];

      if (media?.type === type) {
        values.value.splice(index, 1);
        release(media);
        return;
      }
    }
  }

  function evictOldestMedia() {
    const media = values.value.pop();

    if (media) {
      release(media);
    }
  }

  function enforceTotalByteLimit() {
    while (retainedBytes.value > totalByteLimit) {
      evictOldestMedia();
    }
  }

  function add(type: CameraMedia['type'], value: string, sizeBytes: number) {
    if (disposed) {
      return undefined;
    }

    const media: CameraMedia = {
      id: generateId(),
      type,
      value,
      sizeBytes,
      createdAt: now(),
    };

    values.value.unshift(media);
    evictOldest(type, type === 'image' ? imageLimit : videoLimit);
    enforceTotalByteLimit();

    return media;
  }

  function addBlob(type: CameraMedia['type'], blob: Blob) {
    if (disposed) {
      return undefined;
    }

    const itemByteLimit = type === 'image' ? imageByteLimit : videoByteLimit;

    // Reject impossible-to-retain captures before allocating an object URL or
    // evicting any existing media.
    if (blob.size > itemByteLimit || blob.size > totalByteLimit) {
      return undefined;
    }

    const url = objectUrlApi.createObjectURL(blob);
    let retained = false;

    try {
      const media = add(type, url, blob.size);
      retained = media !== undefined;
      return media;
    }
    finally {
      if (!retained) {
        objectUrlApi.revokeObjectURL(url);
      }
    }
  }

  function addImage(blob: Blob) {
    return addBlob('image', blob);
  }

  function addVideo(blob: Blob) {
    return addBlob('video', blob);
  }

  function remove(id: string) {
    const index = values.value.findIndex(media => media.id === id);

    if (index < 0) {
      return false;
    }

    const [removed] = values.value.splice(index, 1);

    if (removed) {
      release(removed);
    }

    return true;
  }

  function clear() {
    const removed = values.value.splice(0);
    removed.forEach(release);
  }

  function dispose() {
    if (disposed) {
      return;
    }

    disposed = true;
    clear();
  }

  return {
    medias,
    retainedBytes,
    addImage,
    addVideo,
    remove,
    clear,
    dispose,
  };
}
