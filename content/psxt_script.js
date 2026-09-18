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
    'https://projectcard.com.br/img/icons/psnlLogo64.png', // Usando um placeholder ou icone específico se houver
    'Gerar Cartão PSN Legends'
);

// Atualiza renderers especiais baseados no perfil atual (ex: grupo Harém das Galas)
function updateSpecialRenderers() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const currentPsnId = (pathParts.length > 0 && !['rankings', 'ranking', 'jogos', 'guias', 'noticias', 'insignias', 'feed', 'membros', 'faq'].includes(pathParts[0].toLowerCase()))
        ? pathParts[0].trim()
        : '';

    if (typeof isPsxtHaremMember === 'function' && isPsxtHaremMember(currentPsnId)) {
        if (!uiController.renderers['harem_galas']) {
            uiController.registerRenderer(
                'harem_galas',
                new HaremGalasRenderer(),
                'https://projectcard.com.br/img/icons/galasLogo64.png',
                'Gerar Cartão Harém das Galas'
            );
            const existingModal = document.querySelector('.projectcardex-modal');
            if (existingModal && !existingModal.querySelector('img[title="Gerar Cartão Harém das Galas"]')) {
                existingModal.remove();
            }
        }
    } else {
        if (uiController.renderers['harem_galas']) {
            delete uiController.renderers['harem_galas'];
            const existingModal = document.querySelector('.projectcardex-modal');
            if (existingModal) {
                existingModal.remove();
            }
        }
    }
}

// Inicializa a UI periodicamente caso a página mude (SPA)
setInterval(() => {
    updateSpecialRenderers();
    uiController.injectUI();
}, 1500);
