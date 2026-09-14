/**
 * PsnpDefaultRenderer — Gera o card visual para perfis do PSNProfiles.
 */
class PsnpDefaultRenderer extends BaseRenderer {
    async renderCard(data, ctx, canvas) {
        canvas.width = 419;
        canvas.height = 610;

        const imageSources = {
            ...(typeof PSN_LEVEL_ASSETS !== 'undefined' ? PSN_LEVEL_ASSETS : {}),
            imgFundopsnp: "https://projectcard.com.br/img/ALFA/basepsnp.png",
            imgBordapsnp: "https://projectcard.com.br/img/ALFA/bordapsnp.png"
        };

        const images = await this.loadImages(imageSources, { avatar: data.avatar });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images.imgFundopsnp, 0, 0);

        // Avatar
        if (images.avatar) {
            ctx.drawImage(images.avatar, 98, 104, 300, 300);
        }
        ctx.drawImage(images.imgBordapsnp, 0, 0);

        // PSN ID
        if (data.psnId) {
            ctx.font = '40px "Roboto", sans-serif';
            ctx.textAlign = "center";
            ctx.fillStyle = '#000000';
            ctx.fillText(data.psnId, 247, 485, 308);
        }

        const platNum   = Formatters.parseNumber(data.plat);
        const goldNum   = Formatters.parseNumber(data.gold);
        const silverNum = Formatters.parseNumber(data.silver);
        const bronzeNum = Formatters.parseNumber(data.bronze);
        const tTotal    = platNum + goldNum + silverNum + bronzeNum;
        const PSNPoints = LevelCalculator.calculatePoints(platNum, goldNum, silverNum, bronzeNum);

        // Troféus (Topo)
        if (data.plat && data.plat !== '0') {
            CanvasUtils.drawRotatedText(ctx, { text: Formatters.formatNumber(platNum), x: 170, y: 55, angleDeg: -45, font: '20px "Bahnschrift", sans-serif', fillStyle: '#000000', textAlign: 'center', maxWidth: 50 });
        }
        if (data.gold && data.gold !== '0') {
            CanvasUtils.drawRotatedText(ctx, { text: Formatters.formatNumber(goldNum), x: 245, y: 55, angleDeg: -45, font: '20px "Bahnschrift", sans-serif', fillStyle: '#000000', textAlign: 'center', maxWidth: 50 });
        }
        if (data.silver && data.silver !== '0') {
            CanvasUtils.drawRotatedText(ctx, { text: Formatters.formatNumber(silverNum), x: 318, y: 55, angleDeg: -45, font: '20px "Bahnschrift", sans-serif', fillStyle: '#000000', textAlign: 'center', maxWidth: 50 });
        }
        if (data.bronze && data.bronze !== '0') {
            CanvasUtils.drawRotatedText(ctx, { text: Formatters.formatNumber(bronzeNum), x: 388, y: 55, angleDeg: -45, font: '20px "Bahnschrift", sans-serif', fillStyle: '#000000', textAlign: 'center', maxWidth: 50 });
        }
        
        // Total Troféus (Sempre desenha)
        CanvasUtils.drawRotatedText(ctx, { text: Formatters.formatNumber(tTotal), x: 98, y: 55, angleDeg: -45, font: '20px "Bahnschrift", sans-serif', fillStyle: '#000000', textAlign: 'center', maxWidth: 50 });

        // Raridades (Lateral Esquerda)
        const urNum = Formatters.parseNumber(data.ur);
        const vrNum = Formatters.parseNumber(data.vr);
        const rrNum = Formatters.parseNumber(data.rr);
        const ucNum = Formatters.parseNumber(data.uc);
        const cmNum = Formatters.parseNumber(data.cm);

        if (data.ur && data.ur !== '0') CanvasUtils.drawRotatedText(ctx, { text: Formatters.formatNumber(urNum), x: 57, y: 140, angleDeg: -45, font: '20px "Bahnschrift", sans-serif', fillStyle: '#ff4500', textAlign: 'center', maxWidth: 50 });
        if (data.vr && data.vr !== '0') CanvasUtils.drawRotatedText(ctx, { text: Formatters.formatNumber(vrNum), x: 57, y: 203, angleDeg: -45, font: '20px "Bahnschrift", sans-serif', fillStyle: '#4b0082', textAlign: 'center', maxWidth: 50 });
        if (data.rr && data.rr !== '0') CanvasUtils.drawRotatedText(ctx, { text: Formatters.formatNumber(rrNum), x: 57, y: 267, angleDeg: -45, font: '20px "Bahnschrift", sans-serif', fillStyle: '#1e90ff', textAlign: 'center', maxWidth: 50 });
        if (data.uc && data.uc !== '0') CanvasUtils.drawRotatedText(ctx, { text: Formatters.formatNumber(ucNum), x: 57, y: 335, angleDeg: -45, font: '20px "Bahnschrift", sans-serif', fillStyle: '#228b22', textAlign: 'center', maxWidth: 50 });
        if (data.cm && data.cm !== '0') CanvasUtils.drawRotatedText(ctx, { text: Formatters.formatNumber(cmNum), x: 57, y: 403, angleDeg: -45, font: '20px "Bahnschrift", sans-serif', fillStyle: '#696969', textAlign: 'center', maxWidth: 50 });

        // Stats Inferiores (Rodapé)
        ctx.font = '30px "Bahnschrift", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';

        const totalJogosNum = Formatters.parseNumber(data.totalJogos);
        if (data.totalJogos && data.totalJogos !== '0') {
            ctx.fillText(Formatters.formatNumber(totalJogosNum), 50, 546, 70);
        }
        if (data.trofeusPorDia && data.trofeusPorDia !== '0') {
            ctx.fillText(data.trofeusPorDia, 135, 546, 70);
        }
        if (data.completudeGeral && data.completudeGeral !== '0') {
            ctx.fillText(`${data.completudeGeral}%`, 242, 546, 70);
        }
        if (data.unearned && data.unearned !== '0') {
            const unearnedNum = Formatters.parseNumber(data.unearned);
            ctx.fillText(Formatters.formatNumber(unearnedNum), 352, 546, 70);
        }

        // Nível e Ícone
        const nivelCalculado = Number(data.level) || LevelCalculator.calculateLevel(PSNPoints);
        const tier = LevelCalculator.getTierInfo(nivelCalculado);
        const iconLevel = images[tier.iconKey];

        if (iconLevel) {
            ctx.drawImage(iconLevel, 29, 453, 35, 35);
        }

        // Data
        const datageracao = Formatters.formatGenerationDate();
        ctx.font = '20px "Bahnschrift", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#000000';
        ctx.fillText(datageracao, 99, 432);
    }
}
