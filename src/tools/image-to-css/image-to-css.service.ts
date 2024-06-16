import { stringToUrl } from 'svg-to-url';

export type CSSType = 'Background' | 'Border' | 'ListItemBullet' | 'Url';

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() ?? '');
    reader.onerror = error => reject(error);
  });
}

function svgToDataUrl(image: string) {
  const getUrlFromSvgString = stringToUrl({});
  return getUrlFromSvgString(image);
}

export async function imageToCSS(
  image: File | string,
  type: CSSType,
) {
  const dataURI = image instanceof File ? await fileToDataUrl(image) : svgToDataUrl(image);
  switch (type) {
    case 'Background':
      return `background-image: url(${dataURI});`;
    case 'Border':
      return `border-image-source: url(${dataURI});`;
    case 'ListItemBullet':
      return `li{\n  list-style-image: ${dataURI};\n}\nli::marker{\n  font-size: 1.5em;\n}'}`;
    default:
      return `url(${dataURI})`;
  }
}
