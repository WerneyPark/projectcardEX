class Mypst2Renderer extends BaseRenderer {
    async renderCard(data, ctx, canvas) {
        canvas.width = 395;
        canvas.height = 566;

        const imageSources = {
            imgFundo: "https://projectcard.com.br/img/ALFA/basealfamypst2.png",
            imgBorda: "https://projectcard.com.br/img/ALFA/imgperfbordamypst22.png",
            ...(typeof PSN_LEVEL_ASSETS !== 'undefined' ? PSN_LEVEL_ASSETS : {})
        };

        const optionalImgs = {};
        if (data.avatar) optionalImgs.avatar = data.avatar;
        if (data.platinasRaras && data.platinasRaras[0]) optionalImgs.pplat = data.platinasRaras[0];

        const images = await this.loadImages(imageSources, optionalImgs);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (images.imgFundo) ctx.drawImage(images.imgFundo, 0, 0);

        if (images.avatar) {
            ctx.drawImage(images.avatar, 26, 71, 274, 274);
            if (images.imgBorda) ctx.drawImage(images.imgBorda, 0, 0);
        }

        if (images.pplat) {
            ctx.drawImage(images.pplat, 320, 374, 58, 58);
        }

        if (data.psnId) {
            ctx.font = '40px "Gemunu Libre"';
            ctx.textAlign = "center";
            ctx.fillStyle = '#000000';
            ctx.fillText(data.psnId, 159, 49, 263);
        }

        if (data.frase) {
            CanvasUtils.drawRotatedText(ctx, {
                text: data.frase,
                x: 22,
                y: 206,
                angleDeg: -90,
                font: '25px "Gemunu Libre"',
                fillStyle: '#000000',
                textAlign: 'center',
                maxWidth: 263
            });
        }

        if (data.usuarioDesde && data.usuarioNumero) {
            ctx.font = '12px "Gemunu Libre"';
            ctx.textAlign = "right";
            ctx.fillStyle =  '#000000',
            ctx.fillText( "#" + data.usuarioNumero + " - " + data.usuarioDesde,  382, 451, 381);
        }



        const platNum   = Formatters.parseNumber(data.plat);
        const goldNum   = Formatters.parseNumber(data.gold);
        const silverNum = Formatters.parseNumber(data.silver);
        const bronzeNum = Formatters.parseNumber(data.bronze);
        const tTotal    = platNum + goldNum + silverNum + bronzeNum;

        const drawRotatedStat = (text, y) => {
            CanvasUtils.drawRotatedText(ctx, {
                text,
                x: 360,
                y: y,
                angleDeg: -30,
                font: '20px "Gemunu Libre"',
                fillStyle: '#000000',
                textAlign: 'center',
                maxWidth: 50
            });
        };

        if (platNum > 0) drawRotatedStat(Formatters.formatNumber(platNum), 103);
        if (goldNum > 0) drawRotatedStat(Formatters.formatNumber(goldNum), 147);
        if (silverNum > 0) drawRotatedStat(Formatters.formatNumber(silverNum), 189);
        if (bronzeNum > 0) drawRotatedStat(Formatters.formatNumber(bronzeNum), 232);
        drawRotatedStat(Formatters.formatNumber(tTotal), 280);
        if (data.jogos100 && data.jogos100 !== '0') drawRotatedStat(Formatters.formatNumber(Number(data.jogos100)), 320);

        const PSNPoints = LevelCalculator.calculatePoints(platNum, goldNum, silverNum, bronzeNum);
        const PDMNum = Formatters.parseNumber(data.pdm);
        const TotalJogos = Number(data.totalJogos || 0);

        ctx.font = '20px "Gemunu Libre"';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'right';
        ctx.fillText(Formatters.formatNumber(PSNPoints), 148, 386, 70);
        if (PDMNum > 0) ctx.fillText(Formatters.formatNumber(PDMNum), 148, 409, 70);
        if (TotalJogos > 0) ctx.fillText(Formatters.formatNumber(TotalJogos), 148, 431, 70);

        const NacionalNum = Formatters.parseNumber(data.rankingGeral);
        const DificuldadeNum = Formatters.parseNumber(data.rankingDificuldade);
        
        const jComp = Number(data.jogosCompletos || 0);
        let percStr = data.percentual100 && data.percentual100 !== '0%' ? data.percentual100 : '';
        if (!percStr) {
            let perc = 0;
            if (TotalJogos > 0) perc = (jComp / TotalJogos) * 100;
            percStr = perc.toFixed(2) + "%";
        }

        ctx.textAlign = 'left';
        if (NacionalNum > 0) ctx.fillText(Formatters.formatNumber(NacionalNum), 260, 386, 45);
        if (DificuldadeNum > 0) ctx.fillText(Formatters.formatNumber(DificuldadeNum), 260, 409, 45);
        ctx.fillText(percStr, 260, 430, 45);

        ctx.textAlign = 'center';
        const yBadges = 521;
        if (data.mensal && data.mensal) ctx.fillText(data.mensal, 30, yBadges, 39);
        if (data.semanal && data.semanal) ctx.fillText(data.semanal, 85, yBadges, 39);
        if (data.guias && data.guias) ctx.fillText(data.guias, 140, yBadges, 39);
        if (data.pioneiro && data.pioneiro) ctx.fillText(data.pioneiro, 195, yBadges, 39);
        if (data.velocista && data.velocista) ctx.fillText(data.velocista, 249, yBadges, 39);
        if (data.tartaruga && data.tartaruga) ctx.fillText(data.tartaruga, 306, yBadges, 39);
        if (data.totalBadges && data.totalBadges) ctx.fillText(data.totalBadges, 361, yBadges, 39);

        const nivelCalculado = LevelCalculator.calculateLevel(PSNPoints);
        const tier = LevelCalculator.getTierInfo(nivelCalculado);
        const imgNivel = images[tier.iconKey];

        if (imgNivel) {
            ctx.drawImage(imgNivel, 315, 7, 65, 65);   
        }

        const datageracao = Formatters.formatGenerationDate();
        ctx.font = '20px "Gemunu Libre"';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#000000';
        ctx.fillText(datageracao, 25, 361);
    }
}
