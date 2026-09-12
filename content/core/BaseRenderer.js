class BaseRenderer {
    /**
     * Método auxiliar para carregar imagens remotas de forma assíncrona.
     * @param {string} url - A URL da imagem.
     * @returns {Promise<HTMLImageElement>}
     */
    loadRemoteImage(url) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: 'fetchImageAsBase64', url: url }, response => {
                if (response && response.dataUrl) {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error('Image load error: ' + url));
                    img.src = response.dataUrl;
                } else {
                    reject(new Error('Failed to fetch image: ' + url));
                }
            });
        });
    }

    /**
     * Auxiliar para formatar números no formato europeu (ex: 1.000).
     * @param {number|string} n 
     * @returns {string}
     */
    formatNumber(n) {
        return Number(n).toLocaleString("de-DE");
    }

    /**
     * Desenha o cartão no canvas fornecido.
     * @param {PlayerData} data - Dados extraídos do jogador.
     * @param {CanvasRenderingContext2D} ctx - O contexto 2D do canvas onde será desenhado.
     * @param {HTMLCanvasElement} canvas - O elemento canvas (útil para referenciar width/height).
     * @returns {Promise<void>}
     */
    async renderCard(data, ctx, canvas) {
        throw new Error("O método renderCard() deve ser implementado pelas subclasses.");
    }
}
