const MEBIBYTE = 1024 * 1024;

/** Ask MediaRecorder for bounded, incremental data instead of one unbounded Blob. */
export const CAMERA_RECORDING_CHUNK_INTERVAL_MS = 1_000;

/** Keep a single recording short enough for predictable in-browser processing. */
export const MAX_CAMERA_RECORDING_DURATION_MS = 5 * 60 * 1_000;

/** A recording that crosses this limit is discarded instead of being retained. */
export const MAX_CAMERA_RECORDING_BYTES = 64 * MEBIBYTE;

/** Guard unusually large canvas captures before allocating an object URL. */
export const MAX_CAMERA_SCREENSHOT_BYTES = 16 * MEBIBYTE;

/** Bound the RGBA canvas allocation before assigning width/height (64 MiB raw). */
export const MAX_CAMERA_SCREENSHOT_PIXELS = 16 * MEBIBYTE;
export const MAX_CAMERA_SCREENSHOT_RAW_BYTES = MAX_CAMERA_SCREENSHOT_PIXELS * 4;

/** Bound the aggregate Blob data retained by this tab. */
export const MAX_RETAINED_CAMERA_MEDIA_BYTES = 128 * MEBIBYTE;
