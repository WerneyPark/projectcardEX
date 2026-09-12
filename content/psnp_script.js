/**
 * Entry script do projectcardEX para o PSNProfiles (psnprofiles.com).
 *
 * O PSNProfiles é server-rendered. O content script é injetado após o DOM
 * estar disponível (run_at: document_end). O ponto de injeção é o header
 * do perfil, ao lado do avatar/username.
 *
 * Ponto de injeção: #user-bar (barra superior com avatar, username e stats).
 * Fallback: .sidebar, .profile-header, #main
 */
const psnpExtractor = new PsnpExtractor();
const psnpController = new UIController(psnpExtractor, {
    primarySelector: '#user-bar',
    fallbackSelector: '.sidebar-bottom, .profile-header, #main',
    insertPosition: 'after'
});

psnpController.registerRenderer(
    'psnp',
    new PsnpDefaultRenderer(),
    'https://projectcard.com.br/img/ALFA/projectcard.png',
    'Gerar Cartão PSNProfiles'
);

// Injeta periodicamente para cobrir casos de navegação SPA
setInterval(() => psnpController.injectUI(), 1500);
