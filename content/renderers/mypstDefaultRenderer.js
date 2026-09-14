/**
 * MypstDefaultRenderer — Gera o card visual para perfis do MyPST.
 */
class MypstDefaultRenderer extends BaseRenderer {
    /**
     * Retorna as variantes disponíveis para um PSN ID no MyPST.
     * @param {string} psnId
     * @returns {Array}
     */
    getAvailableVariants(psnId) {
        return typeof getMypstUserVariants === 'function' ? getMypstUserVariants(psnId) : [];
    }

    async renderCard(data, ctx, canvas, options = {}) {
        canvas.width = 419;
        canvas.height = 610;

        const imageSources = {
            imgFundo: "https://projectcard.com.br/img/ALFA/basealfa3.png",
            imgTperf: "https://projectcard.com.br/img/ALFA/tperf.png",
            imgTplat: "https://projectcard.com.br/img/ALFA/tplat.png",
            ...(typeof PSN_LEVEL_ASSETS !== 'undefined' ? PSN_LEVEL_ASSETS : {}),
            ...(typeof MYPST_SPECIAL_IMAGES !== 'undefined' ? MYPST_SPECIAL_IMAGES : {})
        };

        const optionalImgs = {};
        if (data.avatar) optionalImgs.avatar = data.avatar;
        if (data.platinasRaras && data.platinasRaras[0]) optionalImgs.pplat = data.platinasRaras[0];

        const images = await this.loadImages(imageSources, optionalImgs);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const psnId = data.psnId || '';
        const variantId = options?.variantId || null;
        const userBases = typeof resolveMypstUserBases === 'function' 
            ? resolveMypstUserBases(psnId, images, images.imgFundo, images.imgTperf, variantId)
            : { normal: images.imgFundo, perfil: images.imgTperf };

        if (userBases.normal) {
            ctx.drawImage(userBases.normal, 0, 0);
        }

        if (images.avatar) {
            ctx.drawImage(images.avatar, 91, 91, 300, 300);
            if (userBases.perfil) {
                ctx.drawImage(userBases.perfil, 0, 0);
            }
        }

        if (psnId) {
            ctx.font = '55px "Gemunu Libre"';
            ctx.textAlign = "center";
            ctx.fillStyle = '#ffffff';
            ctx.fillText(psnId, 180, 57, 316);
        }

        if (data.frase) {
            ctx.font = '20px "Gemunu Libre"';
            ctx.textAlign = "center";
            ctx.fillStyle = '#ffffff';
            ctx.fillText(data.frase, 210, 472, 381);
        }

        const platNum   = Formatters.parseNumber(data.plat);
        const goldNum   = Formatters.parseNumber(data.gold);
        const silverNum = Formatters.parseNumber(data.silver);
        const bronzeNum = Formatters.parseNumber(data.bronze);

        ctx.font = '20px "Gemunu Libre"';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        if (platNum > 0) ctx.fillText(Formatters.formatNumber(platNum), 75, 160, 56);
        if (goldNum > 0) ctx.fillText(Formatters.formatNumber(goldNum), 75, 233, 56);
        if (silverNum > 0) ctx.fillText(Formatters.formatNumber(silverNum), 75, 310, 56);
        if (bronzeNum > 0) ctx.fillText(Formatters.formatNumber(bronzeNum), 75, 383, 56);

        const statsY = 563;
        ctx.textAlign = 'center';
        if (data.mensal) ctx.fillText(data.mensal, 206, statsY, 34);
        if (data.semanal) ctx.fillText(data.semanal, 243, statsY, 34);
        if (data.guias) ctx.fillText(data.guias, 280, statsY, 34);
        if (data.pioneiro) ctx.fillText(data.pioneiro, 317, statsY, 34);
        if (data.velocista) ctx.fillText(data.velocista, 354, statsY, 34);
        if (data.tartaruga) ctx.fillText(data.tartaruga, 391, statsY, 34);

        if (images.pplat) {
            ctx.drawImage(images.pplat, 102, 520, 70, 70);
            if (images.imgTplat) ctx.drawImage(images.imgTplat, 0, 0);
        }

        const jComp = Number(data.jogosCompletos || 0);
        const jTot = Number(data.totalJogos || 0);
        let percStr = data.percentual100 && data.percentual100 !== '0%' ? data.percentual100 : '';
        if (!percStr) {
            let perc = 0;
            if (jTot > 0) perc = (jComp / jTot) * 100;
            percStr = perc.toFixed(2) + "%";
        }
        
        ctx.font = '20px "Gemunu Libre"';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(percStr, 254, 598, 93);

        const datageracao = Formatters.formatGenerationDate();
        ctx.font = '20px "Gemunu Libre"';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(datageracao, 19, 410);

        const PSNPoints = LevelCalculator.calculatePoints(platNum, goldNum, silverNum, bronzeNum);
        const nivelCalculado = LevelCalculator.calculateLevel(PSNPoints);
        const tier = LevelCalculator.getTierInfo(nivelCalculado);
        const imgNivel = images[tier.iconKey];

        if (imgNivel) {
            let nx = 356, ny = 16;
            if (nivelCalculado >= 600 && nivelCalculado <= 998) ny = 15;
            if (nivelCalculado >= 0 && nivelCalculado <= 299) ny = 17;
            if (nivelCalculado >= 800 && nivelCalculado <= 998) nx = 357;
            ctx.drawImage(imgNivel, nx, ny, 49, 49);
        }
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.MypstDefaultRenderer = MypstDefaultRenderer;
}
if (typeof window !== 'undefined') {
    window.MypstDefaultRenderer = MypstDefaultRenderer;
}
