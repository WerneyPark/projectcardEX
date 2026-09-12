class Mypst2Renderer extends BaseRenderer {
    async renderCard(data, ctx, canvas) {
        canvas.width = 395;
        canvas.height = 566;

        const imageSources = {
            imgFundo: "https://projectcard.com.br/img/ALFA/basealfamypst2.png",
            imgBorda: "https://projectcard.com.br/img/ALFA/imgperfbordamypst22.png",
            imglvb1: "https://projectcard.com.br/img/lvspsn/bronze_level_1.png",
            imglvb2: "https://projectcard.com.br/img/lvspsn/bronze_level_2.png",
            imglvb3: "https://projectcard.com.br/img/lvspsn/bronze_level_3.png",
            imglvp1: "https://projectcard.com.br/img/lvspsn/silver_level_1.png",
            imglvp2: "https://projectcard.com.br/img/lvspsn/silver_level_2.png",
            imglvp3: "https://projectcard.com.br/img/lvspsn/silver_level_3.png",
            imglvo1: "https://projectcard.com.br/img/lvspsn/gold_level_1.png",
            imglvo2: "https://projectcard.com.br/img/lvspsn/gold_level_2.png",
            imglvo3: "https://projectcard.com.br/img/lvspsn/gold_level_3.png",
            imglvpl: "https://projectcard.com.br/img/lvspsn/platinum_level.png"
        };

        const keys = Object.keys(imageSources);
        const promises = keys.map(key => super.loadRemoteImage(imageSources[key]).catch(() => null));
        
        if (data.avatar) promises.push(super.loadRemoteImage(data.avatar).catch(() => null));
        if (data.platinasRaras && data.platinasRaras[0]) promises.push(super.loadRemoteImage(data.platinasRaras[0]).catch(() => null));

        const loadedImgs = await Promise.all(promises);
        const images = {};
        keys.forEach((key, i) => images[key] = loadedImgs[i]);
        
        let pplatImg = null;
        if (data.platinasRaras && data.platinasRaras[0] && data.avatar) {
            images.avatar = loadedImgs[loadedImgs.length - 2];
            pplatImg = loadedImgs[loadedImgs.length - 1];
        } else if (data.avatar) {
            images.avatar = loadedImgs[loadedImgs.length - 1];
        } else if (data.platinasRaras && data.platinasRaras[0]) {
            pplatImg = loadedImgs[loadedImgs.length - 1];
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (images.imgFundo) ctx.drawImage(images.imgFundo, 0, 0);

        if (images.avatar) {
            ctx.drawImage(images.avatar, 26, 71, 274, 274);
            if (images.imgBorda) ctx.drawImage(images.imgBorda, 0, 0);
        }

        if (pplatImg) {
            ctx.drawImage(pplatImg, 320, 374, 58, 58);
        }

        if (data.psnId) {
            ctx.font = '40px "Gemunu Libre"';
            ctx.textAlign = "center";
            ctx.fillStyle = '#000000';
            ctx.fillText(data.psnId, 159, 49, 263);
        }

        if (data.frase) {
            ctx.translate(22, 206);
            ctx.rotate((-90 * Math.PI) / 180);
            ctx.font = '25px "Gemunu Libre"';
            ctx.textAlign = "center";
            ctx.fillStyle = '#000000';
            ctx.fillText(data.frase, 0, 0, 263); 
            ctx.setTransform(1, 0, 0, 1, 0, 0);                                       
        }

        const platNum = Number((data.plat || '0').replace(/[.,]/g, ''));
        const goldNum = Number((data.gold || '0').replace(/[.,]/g, ''));
        const silverNum = Number((data.silver || '0').replace(/[.,]/g, ''));
        const bronzeNum = Number((data.bronze || '0').replace(/[.,]/g, ''));
        const tTotal = platNum + goldNum + silverNum + bronzeNum;

        function drawRotatedText(text, y) {
            if(!text) return;
            ctx.translate(360, y);
            ctx.rotate((-30 * Math.PI) / 180);
            ctx.font = '20px "Gemunu Libre"';
            ctx.textAlign = 'center';               
            ctx.fillStyle = '#000000';             
            ctx.fillText(text, 0, 0, 50);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        if (platNum > 0) drawRotatedText(super.formatNumber(platNum), 103);
        if (goldNum > 0) drawRotatedText(super.formatNumber(goldNum), 147);
        if (silverNum > 0) drawRotatedText(super.formatNumber(silverNum), 189);
        if (bronzeNum > 0) drawRotatedText(super.formatNumber(bronzeNum), 232);
        drawRotatedText(super.formatNumber(tTotal), 280);
        if (data.jogos100 && data.jogos100 !== '0') drawRotatedText(super.formatNumber(Number(data.jogos100)), 320);

        const PSNPoints = (platNum * 300) + (goldNum * 90) + (silverNum * 30) + (bronzeNum * 15);
        const PDMNum = Number((data.pdm || '0').replace(/[.,]/g, ''));
        const TotalJogos = Number(data.totalJogos || 0);

        ctx.font = '20px "Gemunu Libre"';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'right';
        ctx.fillText(super.formatNumber(PSNPoints), 148, 386, 70);
        if (PDMNum > 0) ctx.fillText(super.formatNumber(PDMNum), 148, 409, 70);
        if (TotalJogos > 0) ctx.fillText(super.formatNumber(TotalJogos), 148, 431, 70);

        const NacionalNum = Number((data.rankingGeral || '0').replace(/[.,]/g, ''));
        const DificuldadeNum = Number((data.rankingDificuldade || '0').replace(/[.,]/g, ''));
        
        let jComp = Number(data.jogosCompletos || 0);
        let perc = 0;
        if (TotalJogos > 0) perc = (jComp / TotalJogos) * 100;

        ctx.textAlign = 'left';
        if (NacionalNum > 0) ctx.fillText(super.formatNumber(NacionalNum), 260, 386, 45);
        if (DificuldadeNum > 0) ctx.fillText(super.formatNumber(DificuldadeNum), 260, 409, 45);
        ctx.fillText(perc.toFixed(2) + "%", 260, 430, 45);

        ctx.textAlign = 'center';
        const yBadges = 521;
        if (data.mensal && data.mensal !== '0') ctx.fillText(data.mensal, 30, yBadges, 39);
        if (data.semanal && data.semanal !== '0') ctx.fillText(data.semanal, 85, yBadges, 39);
        if (data.guias && data.guias !== '0') ctx.fillText(data.guias, 140, yBadges, 39);
        if (data.pioneiro && data.pioneiro !== '0') ctx.fillText(data.pioneiro, 195, yBadges, 39);
        if (data.velocista && data.velocista !== '0') ctx.fillText(data.velocista, 249, yBadges, 39);
        if (data.tartaruga && data.tartaruga !== '0') ctx.fillText(data.tartaruga, 306, yBadges, 39);
        if (data.totalBadges && data.totalBadges !== '0') ctx.fillText(data.totalBadges, 361, yBadges, 39);

        function calcula_nivel(points) {
            if (points <= 5940) return (points / 60) + 1;
            if (points <= 14940) return ((points - 5940) / 90) + 100;
            if (points <= 59940) return ((points - 14940) / 450) + 200;
            if (points <= 149940) return ((points - 59940) / 900) + 300;
            if (points <= 284940) return ((points - 149940) / 1350) + 400;
            if (points <= 464940) return ((points - 284940) / 1800) + 500;
            if (points <= 689940) return ((points - 464940) / 2250) + 600;
            if (points <= 959940) return ((points - 689940) / 2700) + 700;
            if (points <= 1274940) return ((points - 959940) / 3150) + 800;
            if (points <= 1634940) return ((points - 1274940) / 3600) + 900;
            if (points <= 2039940) return ((points - 1634940) / 4050) + 1000;
            if (points <= 2489940) return ((points - 2039940) / 4500) + 1100;
            if (points <= 2984940) return ((points - 2489940) / 4950) + 1200;
            if (points <= 3524940) return ((points - 2984940) / 5400) + 1300;
            if (points <= 4109940) return ((points - 3524940) / 5850) + 1400;
            if (points <= 4739940) return ((points - 4109940) / 6300) + 1500;
            if (points <= 5414940) return ((points - 4739940) / 6750) + 1600;
            if (points <= 6134940) return ((points - 5414940) / 7200) + 1700;
            if (points <= 6899940) return ((points - 6134940) / 7650) + 1800;
            if (points <= 7709940) return ((points - 6899940) / 8100) + 1900;
            if (points <= 8564940) return ((points - 7709940) / 8550) + 2000;
            if (points <= 9464940) return ((points - 8564940) / 9000) + 2100;
            if (points <= 10409940) return ((points - 9464940) / 9450) + 2200;
            if (points <= 11399940) return ((points - 10409940) / 9900) + 2300;
            if (points <= 12434940) return ((points - 11399940) / 10350) + 2400;
            if (points <= 13514940) return ((points - 12434940) / 10800) + 2500;
            if (points <= 14639940) return ((points - 13514940) / 11250) + 2600;
            if (points <= 15809940) return ((points - 14639940) / 11700) + 2700;
            if (points <= 17024940) return ((points - 15809940) / 12150) + 2800;
            if (points <= 18284940) return ((points - 17024940) / 12600) + 2900;
            if (points <= 19589940) return ((points - 18284940) / 13050) + 3000;
            if (points <= 20939940) return ((points - 19589940) / 13950) + 3100;
            if (points <= 22334940) return ((points - 20939940) / 14400) + 3200;
            if (points <= 23774940) return ((points - 22334940) / 14850) + 3300;
            if (points <= 25259940) return ((points - 23774940) / 15300) + 3400;
            if (points <= 26789940) return ((points - 25259940) / 15750) + 3500;
            if (points <= 28364940) return ((points - 26789940) / 16200) + 3600;
            if (points <= 29984940) return ((points - 28364940) / 16650) + 3700;
            if (points <= 31649940) return ((points - 29984940) / 17100) + 3800;
            return ((points - 31649940) / 17550) + 3900;
        }

        const nivelCalculado = Math.floor(calcula_nivel(PSNPoints));
        let imgNivel = null;
        if (nivelCalculado <= 99) imgNivel = images.imglvb1;
        else if (nivelCalculado <= 199) imgNivel = images.imglvb2;
        else if (nivelCalculado <= 299) imgNivel = images.imglvb3;
        else if (nivelCalculado <= 399) imgNivel = images.imglvp1;
        else if (nivelCalculado <= 499) imgNivel = images.imglvp2;
        else if (nivelCalculado <= 599) imgNivel = images.imglvp3;
        else if (nivelCalculado <= 699) imgNivel = images.imglvo1;
        else if (nivelCalculado <= 799) imgNivel = images.imglvo2;
        else if (nivelCalculado <= 998) imgNivel = images.imglvo3;
        else imgNivel = images.imglvpl;

        if (imgNivel) {
            ctx.drawImage(imgNivel, 315, 7, 65, 65);   
        }

        const hoje = new Date();
        const datageracao = ("0" + hoje.getDate()).slice(-2) + "/" + ("0" + (hoje.getMonth() + 1)).slice(-2) + "/" + hoje.getFullYear() + " - " + ("0" + hoje.getHours()).slice(-2) + ":" + ("0" + hoje.getMinutes()).slice(-2);

        ctx.font = '20px "Gemunu Libre"';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#000000';
        ctx.fillText(datageracao, 25, 361);
    }
}
