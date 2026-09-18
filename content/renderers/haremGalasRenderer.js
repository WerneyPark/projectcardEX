/**
 * haremGalasRenderer.js — Renderer para o card especial do grupo Harém das Galas no PSXTrophies.
 */

class HaremGalasRenderer extends BaseRenderer {
    /**
     * Retorna as variantes disponíveis de borda de avatar para o card.
     * @param {string} [psnId]
     * @returns {Array<{ id: string, label: string, isDefault?: boolean }>}
     */
    getAvailableVariants(psnId) {
        return typeof PSXT_HAREM_VARIANTS !== 'undefined'
            ? PSXT_HAREM_VARIANTS
            : [
                { id: "circular", label: "Circular", isDefault: true },
                { id: "quadrado", label: "Quadrado" }
            ];
    }

    /**
     * Renderiza o cartão especial Harém das Galas no canvas.
     * @param {PlayerData} data - Dados extraídos do jogador.
     * @param {CanvasRenderingContext2D} ctx - Contexto 2D do Canvas.
     * @param {HTMLCanvasElement} canvas - Elemento canvas.
     * @param {Object} [options={}] - Opções adicionais (ex: variantId).
     */
    async renderCard(data, ctx, canvas, options = {}) {
        canvas.width = 497;
        canvas.height = 779;

        const haremImages = typeof PSXT_HAREM_IMAGES !== 'undefined' ? PSXT_HAREM_IMAGES : {
            base:                "https://projectcard.com.br/img/ALFA/basegalaG.png",
            baseCirc:            "https://projectcard.com.br/img/ALFA/basegalaAvCirc.png",
            baseQuad:            "https://projectcard.com.br/img/ALFA/basegalaAvQuad.png",
            baseAvatarCircular:  "https://projectcard.com.br/img/ALFA/basegalaAvCircBor.png",
            baseAvatarQuadrado:  "https://projectcard.com.br/img/ALFA/basegalaAvQuadBord.png"
        };

        const imageSources = {
            base: haremImages.base,
            baseCirc: haremImages.baseCirc,
            baseQuad: haremImages.baseQuad,
            baseAvatarCircular: haremImages.baseAvatarCircular,
            baseAvatarQuadrado: haremImages.baseAvatarQuadrado
        };

        const images = await this.loadImages(imageSources, { avatar: data.avatar });

        // Determina a variante do avatar (circular por padrão ou quadrado)
        const variantId = options?.variantId || 'circular';
        const isSquare = variantId === 'quadrado';

        // 1. Limpa o canvas e desenha a base principal
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (images.base) {
            ctx.drawImage(images.base, 0, 0, 497, 779);
        }

        // 2. Desenha o avatar e as camadas de máscara/borda
        if (images.avatar) {
            ctx.drawImage(images.avatar, 193, 218, 266, 266);
        }

        if (isSquare) {
            if (images.baseQuad) ctx.drawImage(images.baseQuad, 0, 0);
            if (images.baseAvatarQuadrado) ctx.drawImage(images.baseAvatarQuadrado, 0, 0);
        } else {
            if (images.baseCirc) ctx.drawImage(images.baseCirc, 0, 0);
            if (images.baseAvatarCircular) ctx.drawImage(images.baseAvatarCircular, 0, 0);
        }

        // 3. Cálculos de Troféus e Pontuação
        const platinaNum = Formatters.parseNumber(data.plat);
        const ouroNum    = Formatters.parseNumber(data.gold);
        const prataNum   = Formatters.parseNumber(data.silver);
        const bronzeNum  = Formatters.parseNumber(data.bronze);

        const PSNPoints = LevelCalculator.calculatePoints(platinaNum, ouroNum, prataNum, bronzeNum);
        const pontosNum = data.pontosPSN ? (Formatters.parseNumber(data.pontosPSN) || PSNPoints) : PSNPoints;
        const pontosStr = Formatters.formatNumber(pontosNum);

        const platinaStr = Formatters.formatNumber(platinaNum);
        const ouroStr    = Formatters.formatNumber(ouroNum);
        const prataStr   = Formatters.formatNumber(prataNum);
        const bronzeStr  = Formatters.formatNumber(bronzeNum);

        // Completude
        let completudeStr = '0.00 %';
        if (data.completudeGeral) {
            const compClean = String(data.completudeGeral).replace('%', '').replace(',', '.').trim();
            const compVal = parseFloat(compClean);
            completudeStr = (!isNaN(compVal) ? compVal.toFixed(2) : data.completudeGeral) + ' %';
        }

        // Horas Jogadas
        let horasStr = '---';
        if (data.horasJogadas && data.horasJogadas !== '0') {
            const horasNum = Formatters.parseNumber(data.horasJogadas);
            horasStr = horasNum > 0 ? Formatters.formatNumber(horasNum) : String(data.horasJogadas);
        }

        // Data de geração
        const datageracao = Formatters.formatGenerationDate();

        // 4. Renderização dos Textos
        // PSN ID (Curvo no banner superior)
        if (data.psnId) {
            CanvasUtils.drawCurvedText(ctx, {
                text: data.psnId,
                cx: 245,
                cy: 490,
                radius: 400,
                font: '40px "Lobster Two"',
                fillStyle: '#000000'
            });
        }

        // Troféus (Platina, Ouro, Prata, Bronze)
        ctx.font = 'bold 20px "Lobster Two"';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.fillText(platinaStr, 95, 716, 75);
        ctx.fillText(ouroStr, 204, 716, 75);
        ctx.fillText(prataStr, 310, 716, 75);
        ctx.fillText(bronzeStr, 414, 716, 75);

        // Estatísticas Laterais (Horas, Completude, Experiência)
        ctx.font = 'bold 30px "Lobster Two"';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.fillText(horasStr, 80, 270, 82);
        ctx.fillText(completudeStr, 80, 376, 82);
        ctx.fillText(pontosStr, 80, 484, 82);

        // Data de Geração
        ctx.save();
        ctx.font = '16px "Inter Tight"';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.fillText(datageracao, 260, 583);
        ctx.restore();
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.HaremGalasRenderer = HaremGalasRenderer;
}
if (typeof window !== 'undefined') {
    window.HaremGalasRenderer = HaremGalasRenderer;
}
