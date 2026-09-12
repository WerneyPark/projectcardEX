class UIController {
    /**
     * @param {BaseExtractor} extractor - Instância do extractor de dados.
     * @param {object} injectionConfig - Configuração dos seletores de injeção de UI.
     * @param {string} injectionConfig.primarySelector - Seletor CSS para o ponto principal de injeção.
     * @param {string} injectionConfig.fallbackSelector - Seletor CSS de fallback.
     * @param {string} injectionConfig.insertPosition - 'before' | 'after' | 'append'
     */
    constructor(extractor, injectionConfig = {}) {
        this.extractor = extractor;
        this.renderers = {};
        this.injectionConfig = {
            primarySelector: injectionConfig.primarySelector || 'section.desktop_follow-wrap__qqPAZ',
            fallbackSelector: injectionConfig.fallbackSelector || '.desktop_image__riKsf, .mobile_idpsn-info__bxUGq',
            insertPosition: injectionConfig.insertPosition || 'before'
        };
    }

    /**
     * Registra um renderer disponível para o UI Controller.
     * @param {string} name - Nome de identificação do renderer (ex: 'original', 'pgg', 'psnl').
     * @param {BaseRenderer} rendererInstance - A instância do renderer.
     * @param {string} buttonIconUrl - URL da imagem que será usada no botão.
     * @param {string} buttonTitle - Título que aparecerá no hover do botão.
     */
    registerRenderer(name, rendererInstance, buttonIconUrl, buttonTitle) {
        this.renderers[name] = {
            instance: rendererInstance,
            iconUrl: buttonIconUrl,
            title: buttonTitle
        };
    }

    /**
     * Retorna os dados extraídos pelo Extractor atual.
     * @returns {PlayerData}
     */
    getData() {
        return this.extractor.extractData();
    }

    /**
     * Injeta o container de botões na página.
     */
    injectUI() {
        if (document.querySelector('.projectcardex-modal')) return;

        const { primarySelector, fallbackSelector, insertPosition } = this.injectionConfig;

        const primaryEl = document.querySelector(primarySelector);
        const fallbackEl = fallbackSelector
            ? fallbackSelector.split(',').map(s => document.querySelector(s.trim())).find(Boolean)
            : null;

        const anchorEl = primaryEl || fallbackEl;
        if (!anchorEl) return;

        const modalSection = document.createElement('section');
        modalSection.className = 'projectcardex-modal';

        const sectionTitle = document.createElement('span');
        sectionTitle.className = 'projectcardex-title';
        sectionTitle.innerText = 'Project Card EX';
        modalSection.appendChild(sectionTitle);

        const container = document.createElement('div');
        container.id = 'psxt-cards-container';
        container.className = 'projectcardex-container';

        for (const [name, rendererData] of Object.entries(this.renderers)) {
            const icon = document.createElement('img');
            icon.src = rendererData.iconUrl;
            icon.alt = rendererData.title;
            icon.title = rendererData.title;
            icon.className = 'projectcardex-icon';

            icon.onclick = () => {
                this.handleGenerateCardClick(name);
            };
            container.appendChild(icon);
        }

        modalSection.appendChild(container);

        if (insertPosition === 'before') {
            anchorEl.parentNode.insertBefore(modalSection, anchorEl);
        } else if (insertPosition === 'after') {
            if (anchorEl.nextSibling) {
                anchorEl.parentNode.insertBefore(modalSection, anchorEl.nextSibling);
            } else {
                anchorEl.parentNode.appendChild(modalSection);
            }
        } else if (insertPosition === 'append') {
            anchorEl.appendChild(modalSection);
        }
    }

    /**
     * Cria e exibe o modal de carregamento/preview do canvas.
     */
    createCanvasModal() {
        let modal = document.getElementById('psxt-card-modal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'psxt-card-modal';
        modal.innerHTML = `
            <div class="psxt-modal-content projectcardex-modal-content">
                <span class="psxt-modal-close">&times;</span>
                <h2 id="psxt-modal-status">Gerando Cartão...</h2>
                <canvas id="cartaoCanvas"></canvas>
                <button id="psxt-download-btn" class="psxt-card-btn">Baixar Imagem</button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.psxt-modal-close').onclick = () => modal.remove();

        return {
            modal: modal,
            canvas: modal.querySelector('#cartaoCanvas'),
            downloadBtn: modal.querySelector('#psxt-download-btn'),
            statusText: modal.querySelector('#psxt-modal-status')
        };
    }

    /**
     * Lida com o clique do botão de um card específico.
     * @param {string} rendererName
     */
    async handleGenerateCardClick(rendererName) {
        const renderer = this.renderers[rendererName].instance;
        const data = await this.getData();
        const { modal, canvas, downloadBtn, statusText } = this.createCanvasModal();
        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = "source-over";

        try {
            await renderer.renderCard(data, ctx, canvas);
            statusText.innerText = "Cartão Gerado!";
            canvas.style.display = 'block';
            downloadBtn.style.display = 'inline-block';

            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.download = `card_${rendererName}_${data.psnId || 'jogador'}.png`;
                link.href = canvas.toDataURL("image/png", 1.0);
                link.click();
            };
        } catch (e) {
            console.error(e);
            statusText.innerText = "Erro ao gerar cartão!";
            statusText.classList.add('error-text');
        }
    }
}
