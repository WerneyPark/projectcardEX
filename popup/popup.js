document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const hideAdsToggle = document.getElementById('hideAdsToggle');

  // Carrega configurações salvas
  chrome.storage.local.get(['darkMode', 'hideAds'], (result) => {
    darkModeToggle.checked = result.darkMode || false;
    hideAdsToggle.checked = result.hideAds || false;
  });

  // Salva alterações e envia mensagem para os tabs abertos
  darkModeToggle.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    chrome.storage.local.set({ darkMode: isChecked });
  });

  hideAdsToggle.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    chrome.storage.local.set({ hideAds: isChecked });
  });
});
