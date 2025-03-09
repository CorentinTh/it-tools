export function downloadFile(harOutput: string, name: string) {
  const blob = new Blob([harOutput], { type: 'application/json' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  // Set file name
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();

  // Clean up by removing the anchor and revoking the URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
