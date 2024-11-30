import { type Config, type PluginConfig, optimize } from 'svgo';

function svgo(config: Config) {
  return (data: string) => {
    const { plugins = [], ...rest } = config || {};
    return optimize(data, {
      ...rest,
      plugins: [
        ...(plugins.length > 0 ? plugins : ['preset-default']),
        'removeXMLNS',
      ] as PluginConfig[],
    }).data.replace(/^<svg/g, '<svg xmlns="http://www.w3.org/2000/svg"');
  };
}

export function encodeStr(svgStr: string) {
  const encoded = encodeURIComponent(svgStr)
    .replace(/%20/g, ' ')
    .replace(/%3D/g, '=')
    .replace(/%3B/g, ';')
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/')
    .replace(/%2C/g, ',')
    .replace(/%22/g, '\'');

  return `data:image/svg+xml,${encoded}`;
}

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

function svgToDataUrl(svg: string) {
  return encodeStr(svgo({})(svg));
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
