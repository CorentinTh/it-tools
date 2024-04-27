import { extension } from 'mime-types';
import _ from 'lodash';

const commonMimeTypesSignatures = {
  "JVBERi0": "application/pdf",
  "R0lGODdh": "image/gif",
  "R0lGODlh": "image/gif",
  "iVBORw0KGgo": "image/png",
  "/9j/": "image/jpg"
};
function getMimeTypeFromBase64({ base64String }) {
  const [, mimeTypeFromBase64] = base64String.match(/data:(.*?);base64/i) ?? [];
  if (mimeTypeFromBase64) {
    return { mimeType: mimeTypeFromBase64 };
  }
  const inferredMimeType = _.find(commonMimeTypesSignatures, (_mimeType, signature) => base64String.startsWith(signature));
  if (inferredMimeType) {
    return { mimeType: inferredMimeType };
  }
  return { mimeType: void 0 };
}
function getFileExtensionFromMimeType({
  mimeType,
  defaultExtension = "txt"
}) {
  if (mimeType) {
    return extension(mimeType) ?? defaultExtension;
  }
  return defaultExtension;
}
function useDownloadFileFromBase64({ source, filename }) {
  return {
    download() {
      if (source.value === "") {
        throw new Error("Base64 string is empty");
      }
      const { mimeType } = getMimeTypeFromBase64({ base64String: source.value });
      const base64String = mimeType ? source.value : `data:text/plain;base64,${source.value}`;
      const cleanFileName = filename ?? `file.${getFileExtensionFromMimeType({ mimeType })}`;
      const a = document.createElement("a");
      a.href = base64String;
      a.download = cleanFileName;
      a.click();
    }
  };
}

export { useDownloadFileFromBase64 as u };
