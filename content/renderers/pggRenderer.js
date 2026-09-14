class PggRenderer extends BaseRenderer {
    async renderCard(data, ctx, canvas) {
        canvas.width = 419;
        canvas.height = 595;

        const imageSources = {
            ...(typeof PSN_LEVEL_ASSETS !== 'undefined' ? PSN_LEVEL_ASSETS : {}),
            imgTplat1pgg: "https://projectcard.com.br/img/ALFA/imgperfbordaplat1.png",
            imgTplat2pgg: "https://projectcard.com.br/img/ALFA/imgperfbordaplat2.png",
            imgTplat3pgg: "https://projectcard.com.br/img/ALFA/imgperfbordaplat3.png",
            imgTplat4pgg: "https://projectcard.com.br/img/ALFA/imgperfbordaplat4.png",
            imgFundoPG: "https://projectcard.com.br/img/ALFA/basealfa5.png",
            imgTperfpgg: "https://projectcard.com.br/img/ALFA/imgperfbordaPG.png"
        };

        const images = await this.loadImages(imageSources, { avatar: data.avatar });
        
        const rarePlatsPromises = (data.platinasRaras || []).map(url => this.loadRemoteImage(url).catch(() => null));
        const rarePlatsImgs = await Promise.all(rarePlatsPromises);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images.imgFundoPG, 0, 0);

        if (images.avatar) {
            ctx.drawImage(images.avatar, 44, 108, 273, 273);
            ctx.drawImage(images.imgTperfpgg, 0, 0);
        }

        if (data.psnId) {
            ctx.font = '40px "Gemunu Libre", sans-serif';
            ctx.textAlign = "center";
            ctx.fillStyle = '#ffffff';
            ctx.fillText(data.psnId, 248, 74, 263);
        }

        const PNPG = Formatters.parseNumber(data.plat);
        const ONPG = Formatters.parseNumber(data.gold);
        const PtNPG = Formatters.parseNumber(data.silver);
        const BNPG = Formatters.parseNumber(data.bronze);

        const totalTrofeus = PNPG + ONPG + PtNPG + BNPG;
        const PSNPoints = LevelCalculator.calculatePoints(PNPG, ONPG, PtNPG, BNPG);

        const platinaStr = Formatters.formatNumber(PNPG);
        const ouroStr = Formatters.formatNumber(ONPG);
        const prataStr = Formatters.formatNumber(PtNPG);
        const bronzeStr = Formatters.formatNumber(BNPG);

        CanvasUtils.drawRotatedText(ctx, { text: platinaStr, x: 365, y: 440, angleDeg: -45, font: '20px "Orbitron", sans-serif', fillStyle: '#ffffff', textAlign: 'center', maxWidth: 60 });
        CanvasUtils.drawRotatedText(ctx, { text: ouroStr, x: 280, y: 440, angleDeg: -45, font: '20px "Orbitron", sans-serif', fillStyle: '#ffffff', textAlign: 'center', maxWidth: 60 });
        CanvasUtils.drawRotatedText(ctx, { text: prataStr, x: 190, y: 440, angleDeg: -45, font: '20px "Orbitron", sans-serif', fillStyle: '#ffffff', textAlign: 'center', maxWidth: 60 });
        CanvasUtils.drawRotatedText(ctx, { text: bronzeStr, x: 108, y: 440, angleDeg: -45, font: '20px "Orbitron", sans-serif', fillStyle: '#ffffff', textAlign: 'center', maxWidth: 60 });

        ctx.font = '20px "Courgette", cursive';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(Formatters.formatNumber(totalTrofeus), 188, 504, 93);
        ctx.fillText(data.totalJogos !== '0' ? data.totalJogos : "---", 188, 531, 93); 
        ctx.fillText(data.completudeGeral ? `${data.completudeGeral}%` : "0%", 188, 561, 93); 

        // Troféus por Dia (Vertical -90 graus)
        CanvasUtils.drawRotatedText(ctx, {
            text: data.trofeusPorDia !== '0' ? data.trofeusPorDia : "---",
            x: 317,
            y: 523,
            angleDeg: -90,
            font: '24px "Courgette"',
            fillStyle: '#ffffff',
            textAlign: 'center',
            maxWidth: 74
        });

        // Desenhar Platinas Mais Raras
        const platPositions = [
            { x: 325, y: 108 },
            { x: 325, y: 180 },
            { x: 325, y: 249 },
            { x: 325, y: 321 }
        ];

        const bordaplat = [images.imgTplat1pgg, images.imgTplat2pgg, images.imgTplat3pgg, images.imgTplat4pgg];

        for (let i = 0; i < 4; i++) {
            if (rarePlatsImgs[i]) {
                ctx.drawImage(rarePlatsImgs[i], platPositions[i].x, platPositions[i].y, 61, 61);
                ctx.drawImage(bordaplat[i], 0, 0);
            }
        }

        const datageracao = Formatters.formatGenerationDate();
        CanvasUtils.drawRotatedText(ctx, {
            text: datageracao,
            x: 26,
            y: 350,
            angleDeg: -90,
            font: '18px "Courgette", cursive',
            fillStyle: '#ffffff',
            textAlign: 'center'
        });

        const nivelCalculado = LevelCalculator.calculateLevel(PSNPoints);
        const tier = LevelCalculator.getTierInfo(nivelCalculado);
        const iconLevel = images[tier.iconKey];
        const borderLevel = images[tier.borderKey];

        if (iconLevel && borderLevel) {
            ctx.drawImage(borderLevel, 0, 0);
            ctx.drawImage(iconLevel, 42, 38, 54, 54);
        }

        ctx.font = '40px "Lobster", cursive';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(nivelCalculado, 361, 510, 60);
    }
}
