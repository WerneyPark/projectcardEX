class PsxtDefaultRenderer extends BaseRenderer {
    async renderCard(data, ctx, canvas) {
        canvas.width = 419;
        canvas.height = 610;

        const imageSources = {
            ...(typeof PSN_LEVEL_ASSETS !== 'undefined' ? PSN_LEVEL_ASSETS : {}),
            imgFundopsxt: "https://projectcard.com.br/img/ALFA/basepsxt.png",
            imgBordapsxt: "https://projectcard.com.br/img/ALFA/basepsxtb.png"
        };

        const images = await this.loadImages(imageSources, { avatar: data.avatar });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images.imgFundopsxt, 0, 0);

        if (images.avatar) {
            ctx.drawImage(images.avatar, 92, 16, 300, 300);
        }
        ctx.drawImage(images.imgBordapsxt, 0, 0);

        if (data.psnId) {
            ctx.font = '30px "ProjectCardWorkSans", sans-serif'; 
            ctx.textAlign = "center";
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(data.psnId, 170, 363, 308);
        }

        const platina2 = Formatters.parseNumber(data.plat);
        const ouro2 = Formatters.parseNumber(data.gold);
        const prata2 = Formatters.parseNumber(data.silver);
        const bronze2 = Formatters.parseNumber(data.bronze);

        const tTotal = platina2 + ouro2 + prata2 + bronze2;
        const PSNPoints = LevelCalculator.calculatePoints(platina2, ouro2, prata2, bronze2);

        ctx.font = '20px "ProjectCardWorkSans", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000000';
        if (data.plat) ctx.fillText(Formatters.formatNumber(platina2), 54, 592, 40);
        if (data.gold) ctx.fillText(Formatters.formatNumber(ouro2), 135, 592, 52);
        if (data.silver) ctx.fillText(Formatters.formatNumber(prata2), 217, 592, 53);
        if (data.bronze) ctx.fillText(Formatters.formatNumber(bronze2), 296, 592, 54);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(Formatters.formatNumber(tTotal), 372, 592, 51);

        ctx.font = '15px "ProjectCardWorkSans", sans-serif';
        ctx.fillText(Formatters.formatNumber(PSNPoints), 316, 421, 105);

        const ph = Number(String(data.pontosPH || 0).replace(/\./g, "").replace(",", ".")) || 0;
        const rg = Number(data.rankingGeral) || 0;
        const rr = Number(data.rankingRegional) || 0;
        const re = Number(data.rankingEstadual) || 0;

        if (data.pontosPH) ctx.fillText(Formatters.formatNumber(ph), 316, 403, 105);
        if (data.rankingGeral) ctx.fillText(`${Formatters.formatNumber(rg)}º`, 316, 440, 105);
        if (data.rankingRegional) ctx.fillText(`${Formatters.formatNumber(rr)}º`, 316, 459, 105);
        if (data.rankingEstadual) ctx.fillText(`${Formatters.formatNumber(re)}º`, 316, 479, 105);
        if (data.completudeGeral) ctx.fillText(`${data.completudeGeral}%`, 316, 498, 105);
        if (data.completudePlatina) ctx.fillText(`${data.completudePlatina}%`, 316, 517, 105);

        ctx.font = '20px "ProjectCardWorkSans", sans-serif';
        ctx.textAlign = 'center';
        
        const vl = Number(data.velocista) || 0;
        const po = Number(data.pioneiro) || 0;
        const dc = Number(data.dicas) || 0;
        const lk = Number(data.likes) || 0;

        if (data.velocista) ctx.fillText(Formatters.formatNumber(vl), 47, 88, 35);
        if (data.pioneiro) ctx.fillText(Formatters.formatNumber(po), 47, 159, 35);
        if (data.dicas) ctx.fillText(Formatters.formatNumber(dc), 47, 230, 35);
        if (data.likes) ctx.fillText(Formatters.formatNumber(lk), 47, 301, 35);

        const nivelCalculado = LevelCalculator.calculateLevel(PSNPoints);
        const tier = LevelCalculator.getTierInfo(nivelCalculado);
        const iconLevel = images[tier.iconKey];
        const textLevelName = tier.name;

        if (iconLevel) {
            ctx.drawImage(iconLevel, 343, 333, 60, 60);
            ctx.font = '22px "ProjectCardWorkSans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(nivelCalculado, 373, 413, 55);
            ctx.font = '15px "ProjectCardWorkSans", sans-serif';
            ctx.fillText(textLevelName, 373, 434, 55); 
        }

        const datageracao = Formatters.formatGenerationDate();
        CanvasUtils.drawRotatedText(ctx, {
            text: datageracao,
            x: 411,
            y: 175,
            angleDeg: -90,
            font: '18px "ProjectCardWorkSans", sans-serif',
            fillStyle: '#FFFFFF',
            textAlign: 'center'
        });
    }
}
