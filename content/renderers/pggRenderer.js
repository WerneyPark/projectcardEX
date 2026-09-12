class PggRenderer extends BaseRenderer {
    async renderCard(data, ctx, canvas) {
        canvas.width = 419;
        canvas.height = 595;

        const imageSources = {
            imgTplat1pgg: "https://projectcard.com.br/img/ALFA/imgperfbordaplat1.png",
            imgTplat2pgg: "https://projectcard.com.br/img/ALFA/imgperfbordaplat2.png",
            imgTplat3pgg: "https://projectcard.com.br/img/ALFA/imgperfbordaplat3.png",
            imgTplat4pgg: "https://projectcard.com.br/img/ALFA/imgperfbordaplat4.png",
            imgFundoPG: "https://projectcard.com.br/img/ALFA/basealfa5.png",
            imgTperfpgg: "https://projectcard.com.br/img/ALFA/imgperfbordaPG.png",
            imglvb1: "https://projectcard.com.br/img/lvspsn/bronze_level_1.png",
            imglvb2: "https://projectcard.com.br/img/lvspsn/bronze_level_2.png",
            imglvb3: "https://projectcard.com.br/img/lvspsn/bronze_level_3.png",
            imglvp1: "https://projectcard.com.br/img/lvspsn/silver_level_1.png",
            imglvp2: "https://projectcard.com.br/img/lvspsn/silver_level_2.png",
            imglvp3: "https://projectcard.com.br/img/lvspsn/silver_level_3.png",
            imglvo1: "https://projectcard.com.br/img/lvspsn/gold_level_1.png",
            imglvo2: "https://projectcard.com.br/img/lvspsn/gold_level_2.png",
            imglvo3: "https://projectcard.com.br/img/lvspsn/gold_level_3.png",
            imglvpl: "https://projectcard.com.br/img/lvspsn/platinum_level.png",
            imgbpl: "https://projectcard.com.br/img/lvspsn/bordanivelplatina.png",
            imgbo: "https://projectcard.com.br/img/lvspsn/bordanivelouro.png",
            imgbp: "https://projectcard.com.br/img/lvspsn/bordanivelprata.png",
            imgbb: "https://projectcard.com.br/img/lvspsn/bordanivelbronze.png"
        };

        const keys = Object.keys(imageSources);
        const promises = keys.map(key => super.loadRemoteImage(imageSources[key]));
        if (data.avatar) promises.push(super.loadRemoteImage(data.avatar));
        
        const rarePlatsPromises = (data.platinasRaras || []).map(url => super.loadRemoteImage(url).catch(() => null));

        const loadedImgs = await Promise.all(promises);
        const rarePlatsImgs = await Promise.all(rarePlatsPromises);

        const images = {};
        keys.forEach((key, i) => images[key] = loadedImgs[i]);
        if (data.avatar) images.avatar = loadedImgs[loadedImgs.length - 1];

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

        const PNPG = Number(data.plat.replace(",", "").replace(".", "")) || 0;
        const ONPG = Number(data.gold.replace(",", "").replace(".", "")) || 0;
        const PtNPG = Number(data.silver.replace(",", "").replace(".", "")) || 0;
        const BNPG = Number(data.bronze.replace(",", "").replace(".", "")) || 0;

        const totalTrofeus = PNPG + ONPG + PtNPG + BNPG;
        const PSNPoints = (PNPG * 300) + (ONPG * 90) + (PtNPG * 30) + (BNPG * 15);

        const platinaStr = super.formatNumber(PNPG);
        const ouroStr = super.formatNumber(ONPG);
        const prataStr = super.formatNumber(PtNPG);
        const bronzeStr = super.formatNumber(BNPG);

        function drawRotatedStat(text, x, y) {
            if (!text) return;
            ctx.translate(x, y);
            ctx.rotate((-45 * Math.PI) / 180);
            ctx.font = '20px "Orbitron", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(text, 0, 0, 60);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        drawRotatedStat(platinaStr, 365, 440);
        drawRotatedStat(ouroStr, 280, 440);
        drawRotatedStat(prataStr, 190, 440);
        drawRotatedStat(bronzeStr, 108, 440);

        ctx.font = '20px "Courgette", cursive';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(super.formatNumber(totalTrofeus), 188, 504, 93);
        
        ctx.fillText(data.totalJogos !== '0' ? data.totalJogos : "---", 188, 531, 93); 
        ctx.fillText(data.completudeGeral ? `${data.completudeGeral}%` : "0%", 188, 561, 93); 

                // Troféus por Dia (Vertical -90 graus)
        function drawRotatedTrofDia(trofDiaPG) {
            ctx.translate(317, 523);
            ctx.rotate((-90 * Math.PI) / 180);
            ctx.font = '24px "Courgette"';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(trofDiaPG, 0, 0, 74);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        
        drawRotatedTrofDia(data.trofeusPorDia !== '0' ? data.trofeusPorDia : "---"); 

        // Desenhar Platinas Mais Raras (Fallback handled by skipping if null)
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
        

        const hoje = new Date();
        const datageracao = ("0" + hoje.getDate()).slice(-2) + "/" + ("0" + (hoje.getMonth() + 1)).slice(-2) + "/" + hoje.getFullYear() + " - " + ("0" + hoje.getHours()).slice(-2) + ":" + ("0" + hoje.getMinutes()).slice(-2);

        ctx.translate(26, 350);
        ctx.rotate((-90 * Math.PI) / 180);
        ctx.font = '18px "Courgette", cursive';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(datageracao, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

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
        let iconLevel = null;
        let borderLevel = null;

        if (nivelCalculado <= 99) { iconLevel = images.imglvb1; borderLevel = images.imgbb; }
        else if (nivelCalculado <= 199) { iconLevel = images.imglvb2; borderLevel = images.imgbb; }
        else if (nivelCalculado <= 299) { iconLevel = images.imglvb3; borderLevel = images.imgbb; }
        else if (nivelCalculado <= 399) { iconLevel = images.imglvp1; borderLevel = images.imgbp; }
        else if (nivelCalculado <= 499) { iconLevel = images.imglvp2; borderLevel = images.imgbp; }
        else if (nivelCalculado <= 599) { iconLevel = images.imglvp3; borderLevel = images.imgbp; }
        else if (nivelCalculado <= 699) { iconLevel = images.imglvo1; borderLevel = images.imgbo; }
        else if (nivelCalculado <= 799) { iconLevel = images.imglvo2; borderLevel = images.imgbo; }
        else if (nivelCalculado <= 998) { iconLevel = images.imglvo3; borderLevel = images.imgbo; }
        else { iconLevel = images.imglvpl; borderLevel = images.imgbpl; }

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
