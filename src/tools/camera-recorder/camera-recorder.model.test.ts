import { describe, expect, it, vi } from 'vitest';
import { MAX_CAMERA_RECORDING_BYTES, MAX_CAMERA_SCREENSHOT_BYTES } from './camera-recorder.limits';
import { createCameraMediaCollection } from './camera-recorder.model';

function createObjectUrlApi() {
  let nextUrl = 0;

  return {
    createObjectURL: vi.fn(() => `blob:camera-${nextUrl++}`),
    revokeObjectURL: vi.fn(),
  };
}

describe('camera media collection', () => {
  it('uses stable ids and independently limits screenshots and videos', () => {
    const objectUrlApi = createObjectUrlApi();
    let nextId = 0;
    const collection = createCameraMediaCollection({
      imageLimit: 2,
      videoLimit: 2,
      objectUrlApi,
      createId: () => `capture-${nextId++}`,
      now: () => new Date(1_700_000_000_000),
    });

    collection.addImage(new Blob(['first image']));
    collection.addVideo(new Blob(['first video']));
    collection.addImage(new Blob(['second image']));
    collection.addVideo(new Blob(['second video']));
    collection.addImage(new Blob(['third image']));
    collection.addVideo(new Blob(['third video']));

    expect(collection.medias.value).toHaveLength(4);
    expect(collection.medias.value.map(media => media.id)).toEqual([
      'capture-5',
      'capture-4',
      'capture-3',
      'capture-2',
    ]);
    expect(collection.medias.value.filter(media => media.type === 'image')).toHaveLength(2);
    expect(collection.medias.value.filter(media => media.type === 'video')).toHaveLength(2);
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledTimes(2);
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledWith('blob:camera-0');
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledWith('blob:camera-1');
  });

  it('revokes a video URL when that capture is removed', () => {
    const objectUrlApi = createObjectUrlApi();
    const collection = createCameraMediaCollection({ objectUrlApi });
    const video = collection.addVideo(new Blob(['video']));
    const image = collection.addImage(new Blob(['image']));

    expect(video).toBeDefined();
    expect(image).toBeDefined();
    expect(collection.remove(video!.id)).toBe(true);
    expect(collection.remove(video!.id)).toBe(false);
    expect(collection.remove(image!.id)).toBe(true);
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledTimes(2);
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledWith(video!.value);
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledWith(image!.value);
  });

  it('releases all retained videos exactly once on dispose and rejects late captures', () => {
    const objectUrlApi = createObjectUrlApi();
    const collection = createCameraMediaCollection({ objectUrlApi });

    collection.addVideo(new Blob(['first']));
    collection.addImage(new Blob(['image']));
    collection.addVideo(new Blob(['second']));

    collection.dispose();
    collection.dispose();

    expect(collection.medias.value).toEqual([]);
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledTimes(3);
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledWith('blob:camera-0');
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledWith('blob:camera-1');
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledWith('blob:camera-2');

    expect(collection.addVideo(new Blob(['late']))).toBeUndefined();
    expect(collection.addImage(new Blob(['late image']))).toBeUndefined();
    expect(objectUrlApi.createObjectURL).toHaveBeenCalledTimes(3);
  });

  it('rejects invalid retention limits', () => {
    expect(() => createCameraMediaCollection({ imageLimit: 0 })).toThrow(RangeError);
    expect(() => createCameraMediaCollection({ videoLimit: 1.5 })).toThrow(RangeError);
    expect(() => createCameraMediaCollection({ imageByteLimit: 0 })).toThrow(RangeError);
    expect(() => createCameraMediaCollection({ videoByteLimit: Number.NaN })).toThrow(RangeError);
    expect(() => createCameraMediaCollection({ totalByteLimit: -1 })).toThrow(RangeError);
  });

  it('releases a newly allocated URL when adding the capture fails', () => {
    const objectUrlApi = createObjectUrlApi();
    const collection = createCameraMediaCollection({
      objectUrlApi,
      createId: () => {
        throw new Error('id generation failed');
      },
    });

    expect(() => collection.addVideo(new Blob(['video']))).toThrow('id generation failed');
    expect(collection.medias.value).toEqual([]);
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledOnce();
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledWith('blob:camera-0');
  });

  it('rejects oversized captures before allocating object URLs or evicting retained media', () => {
    const objectUrlApi = createObjectUrlApi();
    const collection = createCameraMediaCollection({ objectUrlApi });
    const retained = collection.addImage(new Blob(['retained']));
    const oversizedImage = new Blob(['image']);
    const oversizedVideo = new Blob(['video']);
    Object.defineProperty(oversizedImage, 'size', { value: MAX_CAMERA_SCREENSHOT_BYTES + 1 });
    Object.defineProperty(oversizedVideo, 'size', { value: MAX_CAMERA_RECORDING_BYTES + 1 });

    expect(collection.addImage(oversizedImage)).toBeUndefined();
    expect(collection.addVideo(oversizedVideo)).toBeUndefined();
    expect(collection.medias.value).toEqual([retained]);
    expect(collection.retainedBytes.value).toBe(8);
    expect(objectUrlApi.createObjectURL).toHaveBeenCalledOnce();
    expect(objectUrlApi.revokeObjectURL).not.toHaveBeenCalled();
  });

  it('evicts the oldest object URLs until aggregate retained bytes are within the total limit', () => {
    const objectUrlApi = createObjectUrlApi();
    const collection = createCameraMediaCollection({
      imageByteLimit: 10,
      videoByteLimit: 10,
      totalByteLimit: 10,
      objectUrlApi,
    });

    collection.addVideo(new Blob(['1111']));
    collection.addImage(new Blob(['2222']));
    collection.addVideo(new Blob(['3333']));

    expect(collection.medias.value.map(media => media.value)).toEqual([
      'blob:camera-2',
      'blob:camera-1',
    ]);
    expect(collection.retainedBytes.value).toBe(8);
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledOnce();
    expect(objectUrlApi.revokeObjectURL).toHaveBeenCalledWith('blob:camera-0');
  });

  it('rejects a capture larger than the total bound without disturbing existing URLs', () => {
    const objectUrlApi = createObjectUrlApi();
    const collection = createCameraMediaCollection({
      imageByteLimit: 20,
      videoByteLimit: 20,
      totalByteLimit: 10,
      objectUrlApi,
    });
    const retained = collection.addImage(new Blob(['1234']));

    expect(collection.addVideo(new Blob(['12345678901']))).toBeUndefined();
    expect(collection.medias.value).toEqual([retained]);
    expect(collection.retainedBytes.value).toBe(4);
    expect(objectUrlApi.createObjectURL).toHaveBeenCalledOnce();
    expect(objectUrlApi.revokeObjectURL).not.toHaveBeenCalled();
  });
});
