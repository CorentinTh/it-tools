import JSZip from 'jszip';

export async function downloadLinks(links: string): Promise<void> {
  // Split links by newline and filter out empty ones
  const linksArray: string[] = links.split('\n').filter(link => link.trim() !== '');

  // Helper function to handle duplicate filenames
  function getUniqueFileName(existingNames: Set<string>, originalName: string): string {
    let fileName = originalName;
    let fileExtension = '';

    // Split filename and extension (if any)
    const lastDotIndex = originalName.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      fileName = originalName.substring(0, lastDotIndex);
      fileExtension = originalName.substring(lastDotIndex);
    }

    let counter = 1;
    let uniqueName = originalName;

    // Append a counter to the filename if it already exists in the map
    while (existingNames.has(uniqueName)) {
      uniqueName = `${fileName} (${counter})${fileExtension}`;
      counter++;
    }

    existingNames.add(uniqueName);
    return uniqueName;
  }

  if (linksArray.length === 1) {
    // Single link: download directly
    const linkUrl: string = linksArray[0];
    try {
      const response: Response = await fetch(linkUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${linkUrl}`);
      }

      // Get file as blob
      const blob: Blob = await response.blob();

      // Extract filename from URL
      const fileName: string = linkUrl.split('/').pop() || 'downloaded_file';

      // Trigger download
      const a: HTMLAnchorElement = document.createElement('a');
      const downloadUrl: string = window.URL.createObjectURL(blob);
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    }
    catch (error) {
      console.error('Error downloading the file:', error);
    }
  }
  else if (linksArray.length > 1) {
    // Multiple links: create a zip file
    const zip = new JSZip();
    const fileNamesSet = new Set<string>(); // To track file names for duplicates

    await Promise.all(
      linksArray.map(async (linkUrl: string) => {
        try {
          const response: Response = await fetch(linkUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${linkUrl}`);
          }
          const blob: Blob = await response.blob();

          // Extract filename from URL
          let fileName: string = linkUrl.split('/').pop() || 'file';

          // Get unique filename if duplicate exists
          fileName = getUniqueFileName(fileNamesSet, fileName);

          // Add file to the zip
          zip.file(fileName, blob);
        }
        catch (error) {
          console.error(`Error downloading file from ${linkUrl}:`, error);
        }
      }),
    );

    // Generate the zip file and trigger download
    zip.generateAsync({ type: 'blob' }).then((zipBlob: Blob) => {
      const downloadUrl: string = window.URL.createObjectURL(zipBlob);

      // Trigger download of the zip file
      const a: HTMLAnchorElement = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'downloaded_files.zip';
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    });
  }
}
