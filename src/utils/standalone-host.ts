export interface StandaloneExportMessage {
  code: 'EXPORT'
  data: {
    data: Uint8Array
    mime: string
    name: string
  }
}

export interface StandaloneOpenUrlMessage {
  code: 'OPEN_URL'
  data: { url: string }
}

function hasStandaloneHost() {
  return import.meta.env.STANDALONE
    && typeof window !== 'undefined'
    && window.parent !== window;
}

function postToStandaloneHost(message: StandaloneExportMessage | StandaloneOpenUrlMessage) {
  if (!hasStandaloneHost()) {
    return false;
  }
  window.parent.postMessage(message, '*');
  return true;
}

export function exportBytesToStandaloneHost({
  bytes,
  mime,
  name,
}: {
  bytes: Uint8Array
  mime: string
  name: string
}) {
  return postToStandaloneHost({
    code: 'EXPORT',
    data: { data: bytes, mime, name },
  });
}

export async function downloadBlobFile(blob: Blob, name: string) {
  if (exportBytesToStandaloneHost({
    bytes: new Uint8Array(await blob.arrayBuffer()),
    mime: blob.type || 'application/octet-stream',
    name,
  })) {
    return;
  }

  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
  }
  finally {
    URL.revokeObjectURL(url);
  }
}

export function installStandaloneHostBridge() {
  if (!hasStandaloneHost()) {
    return () => undefined;
  }

  const handleClick = (event: MouseEvent) => {
    const target = event.target;
    const anchor = target instanceof Element ? target.closest<HTMLAnchorElement>('a[href]') : null;
    const href = anchor?.getAttribute('href')?.trim();
    if (!anchor || !href || href.startsWith('#')) {
      return;
    }

    let url: URL;
    try {
      url = new URL(anchor.href, window.location.href);
    }
    catch {
      return;
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return;
    }

    event.preventDefault();
    postToStandaloneHost({ code: 'OPEN_URL', data: { url: url.href } });
  };

  document.addEventListener('click', handleClick, true);
  return () => document.removeEventListener('click', handleClick, true);
}
