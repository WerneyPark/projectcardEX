chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchImageAsBase64') {
    fetch(request.url)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => sendResponse({ dataUrl: reader.result });
        reader.readAsDataURL(blob);
      })
      .catch(err => {
        console.error('Error fetching image:', request.url, err);
        sendResponse({ error: err.toString() });
      });
    return true; // Async response
  }
});
