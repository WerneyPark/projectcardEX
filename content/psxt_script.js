// Instanciação e controle para o PSX Trophies
const extractor = new PsxtExtractor();
const uiController = new UIController(extractor, {
    primarySelector: 'section.desktop_follow-wrap__qqPAZ',
    fallbackSelector: '.desktop_image__riKsf, .mobile_idpsn-info__bxUGq',
    insertPosition: 'before'
});

// Registra os renderers disponíveis
uiController.registerRenderer(
    'original', 
    new PsxtDefaultRenderer(), 
    'https://projectcard.com.br/img/icons/logo180.png', 
    'Gerar Cartão PSXT Original'
);
uiController.registerRenderer(
    'pgg', 
    new PggRenderer(), 
    'https://projectcard.com.br/img/icons/pggLogo64.png', // Usando um placeholder ou icone específico se houver
    'Gerar Cartão PG Games'
);
uiController.registerRenderer(
    'psnl', 
    new PsnlRenderer(), 
    'https://projectcard.com.br/img/icons/icone_psnl.png', // Usando um placeholder ou icone específico se houver
    'Gerar Cartão PSN Legends'
);

// O código abaixo lida com configurações que já existiam (dark mode, hide ads)
chrome.storage.local.get(['darkMode', 'hideAds'], (result) => {
    if (result.darkMode) document.body.classList.add('psxt-dark-mode');
    if (result.hideAds) document.body.classList.add('psxt-hide-ads');
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.darkMode) {
        document.body.classList.toggle('psxt-dark-mode', changes.darkMode.newValue);
    }
    if (changes.hideAds) {
        document.body.classList.toggle('psxt-hide-ads', changes.hideAds.newValue);
    }
});

// Inicializa a UI periodicamente caso a página mude (SPA)
setInterval(() => uiController.injectUI(), 1500);
