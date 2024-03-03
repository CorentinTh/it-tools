export function decodeSafeLinksURL(safeLinksUrl: string) {
  // Decode the ATP SafeLinks URL
  let originalURL;

  try {
    // Decode the URL
    originalURL = decodeURIComponent(safeLinksUrl);

    // Check if it matches the SafeLinks pattern
    if (originalURL.match(/\.safelinks\.protection\.outlook\.com\/\?url=.+&data=/)) {
      // Extract the original URL
      originalURL = originalURL.split('?url=')[1].split('&data=')[0];
    }
    else if (originalURL.match(/\.safelinks\.protection\.outlook\.com\/\?url=.+&amp;data=/)) {
      // Handle the case where "&" is encoded as "&amp;"
      originalURL = originalURL.split('?url=')[1].split('&amp;data=')[0];
    }
    else {
      throw new Error('Invalid SafeLinks URL provided');
    }
  }
  catch (error: any) {
    // Handle errors
    throw new Error(`Failed to decode SafeLinks URL: ${error}`);
  }

  return originalURL;
}
