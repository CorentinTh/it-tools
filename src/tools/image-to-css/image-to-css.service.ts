import { stringToUrl } from 'svg-to-url';

export type CSSType = 'Background' | 'Border' | 'ListItemBullet' | 'Url';

async function fileToDataUrl(file: File) {
  if (file.type === 'image/svg+xml') {
    const svgContent = (await (new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result?.toString() ?? '');
      reader.onerror = error => reject(error);
    })));
    return svgToDataUrl(svgContent);
  }

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
  if (image === '' || !image) {
    return '';
  }
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
