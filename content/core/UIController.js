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
     * @param {function(string): void} [onProgress] - Callback opcional para reportar progresso.
     * @returns {Promise<PlayerData>}
     */
    getData(onProgress) {
        return this.extractor.extractData(onProgress);
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
                <h2 id="psxt-modal-status">Lendo dados principais...</h2>
                <div id="psxt-modal-spinner" class="projectcardex-spinner"></div>
                <canvas id="cartaoCanvas"></canvas>
                <div id="projectcardex-variants-container" class="projectcardex-variants-container" style="display: none;"></div>
                <button id="psxt-download-btn" class="psxt-card-btn">Baixar Imagem</button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.psxt-modal-close').onclick = () => modal.remove();

        return {
            modal: modal,
            canvas: modal.querySelector('#cartaoCanvas'),
            downloadBtn: modal.querySelector('#psxt-download-btn'),
            statusText: modal.querySelector('#psxt-modal-status'),
            spinner: modal.querySelector('#psxt-modal-spinner'),
            variantsContainer: modal.querySelector('#projectcardex-variants-container')
        };
    }

    /**
     * Lida com o clique do botão de um card específico.
     * @param {string} rendererName
     */
    async handleGenerateCardClick(rendererName) {
        const renderer = this.renderers[rendererName]?.instance;
        if (!renderer) return;

        // 1. Abre o modal imediatamente com feedback inicial e spinner visível
        const { modal, canvas, downloadBtn, statusText, spinner, variantsContainer } = this.createCanvasModal();

        try {
            const onProgress = (msg) => {
                if (statusText) {
                    statusText.innerText = msg;
                }
            };

            // 2. Extrai os dados passando o callback de progresso
            const data = await this.getData(onProgress);

            // 3. Informa o início da renderização
            if (statusText) {
                statusText.innerText = "Pintando a cartinha...";
            }

            const ctx = canvas.getContext('2d');
            ctx.globalCompositeOperation = "source-over";

            // 4. Garante que as fontes estejam carregadas antes de pintar no canvas
            if (document.fonts) {
                await Promise.all([
                    document.fonts.load('40px "Gemunu Libre"').catch(() => {}),
                    document.fonts.load('20px "Gemunu Libre"').catch(() => {}),
                    document.fonts.load('30px "Work Sans"').catch(() => {}),
                    document.fonts.load('20px "Orbitron"').catch(() => {}),
                    document.fonts.load('20px "Courgette"').catch(() => {}),
                    document.fonts.load('40px "Lobster"').catch(() => {})
                ]);
                await document.fonts.ready;
            }

            // 5. Renderiza o cartão no canvas
            await renderer.renderCard(data, ctx, canvas);

            // 5. Finalizado: oculta o spinner e exibe canvas e botão de download
            if (spinner) {
                spinner.style.display = 'none';
            }
            statusText.innerText = "Cartão Gerado!";
            canvas.style.display = 'block';
            downloadBtn.style.display = 'inline-block';

            let currentVariantSuffix = '';

            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                const suffix = currentVariantSuffix ? `_${currentVariantSuffix}` : '';
                link.download = `card_${rendererName}_${data.psnId || 'jogador'}${suffix}.png`;
                link.href = canvas.toDataURL("image/png", 1.0);
                link.click();
            };

            // 6. Gerenciamento dinâmico de variantes (se houver)
            const variants = typeof renderer.getAvailableVariants === 'function'
                ? renderer.getAvailableVariants(data.psnId)
                : [];

            if (variantsContainer) {
                variantsContainer.innerHTML = '';
                if (variants && variants.length > 1) {
                    const activeVariant = variants.find(v => v.isDefault) || variants[0];
                    currentVariantSuffix = activeVariant.id;

                    const title = document.createElement('span');
                    title.className = 'projectcardex-variants-title';
                    title.innerText = 'Variações de Cartão:';
                    variantsContainer.appendChild(title);

                    const buttonsWrapper = document.createElement('div');
                    buttonsWrapper.className = 'projectcardex-variants-buttons';

                    variants.forEach(variant => {
                        const chip = document.createElement('button');
                        chip.type = 'button';
                        chip.className = `projectcardex-variant-chip ${variant.id === activeVariant.id ? 'active' : ''}`;
                        chip.innerText = variant.label;

                        chip.onclick = async () => {
                            buttonsWrapper.querySelectorAll('.projectcardex-variant-chip').forEach(b => b.classList.remove('active'));
                            chip.classList.add('active');
                            currentVariantSuffix = variant.id;

                            // Redesenha instantaneamente com a variante selecionada
                            await renderer.renderCard(data, ctx, canvas, { variantId: variant.id });
                        };

                        buttonsWrapper.appendChild(chip);
                    });

                    variantsContainer.appendChild(buttonsWrapper);
                    variantsContainer.style.display = 'flex';
                } else {
                    variantsContainer.style.display = 'none';
                }
            }
        } catch (e) {
            console.error(e);
            if (spinner) {
                spinner.style.display = 'none';
            }
            statusText.innerText = "Erro ao gerar cartão!";
            statusText.classList.add('error-text');
        }
    }
}
