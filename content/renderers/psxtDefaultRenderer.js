class PsxtDefaultRenderer extends BaseRenderer {
    async renderCard(data, ctx, canvas) {
        canvas.width = 419;
        canvas.height = 610;

        const imageSources = {
            imgFundopsxt: "https://projectcard.com.br/img/ALFA/basepsxt.png",
            imgBordapsxt: "https://projectcard.com.br/img/ALFA/basepsxtb.png",
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
        const promises = keys.map(key => super.loadRemoteImage(imageSources[key]));
        if (data.avatar) promises.push(super.loadRemoteImage(data.avatar));

        const loadedImgs = await Promise.all(promises);
        const images = {};
        keys.forEach((key, i) => images[key] = loadedImgs[i]);
        if (data.avatar) images.avatar = loadedImgs[loadedImgs.length - 1];

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images.imgFundopsxt, 0, 0);

        if (images.avatar) {
            ctx.drawImage(images.avatar, 92, 16, 300, 300);
        }
        ctx.drawImage(images.imgBordapsxt, 0, 0);

        if (data.psnId) {
            ctx.font = '30px "Work Sans", sans-serif'; 
            ctx.textAlign = "center";
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(data.psnId, 170, 363, 308);
        }

        const platina2 = Number(data.plat.replace(",", "").replace(".", "")) || 0;
        const ouro2 = Number(data.gold.replace(",", "").replace(".", "")) || 0;
        const prata2 = Number(data.silver.replace(",", "").replace(".", "")) || 0;
        const bronze2 = Number(data.bronze.replace(",", "").replace(".", "")) || 0;

        const tTotal = platina2 + ouro2 + prata2 + bronze2;
        const PSNPoints = (platina2 * 300) + (ouro2 * 90) + (prata2 * 30) + (bronze2 * 15);

        ctx.font = '20px "Work Sans", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000000';
        if (data.plat) ctx.fillText(super.formatNumber(platina2), 54, 592, 40);
        if (data.gold) ctx.fillText(super.formatNumber(ouro2), 135, 592, 52);
        if (data.silver) ctx.fillText(super.formatNumber(prata2), 217, 592, 53);
        if (data.bronze) ctx.fillText(super.formatNumber(bronze2), 296, 592, 54);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(super.formatNumber(tTotal), 372, 592, 51);

        ctx.font = '15px "Work Sans", sans-serif';
        ctx.fillText(super.formatNumber(PSNPoints), 316, 421, 105);

        const ph = Number(data.pontosPH.replace(/\./g, "").replace(",", ".")) || 0;
        const rg = Number(data.rankingGeral) || 0;
        const rr = Number(data.rankingRegional) || 0;
        const re = Number(data.rankingEstadual) || 0;

        if (data.pontosPH) ctx.fillText(super.formatNumber(ph), 316, 403, 105);
        if (data.rankingGeral) ctx.fillText(`${super.formatNumber(rg)}º`, 316, 440, 105);
        if (data.rankingRegional) ctx.fillText(`${super.formatNumber(rr)}º`, 316, 459, 105);
        if (data.rankingEstadual) ctx.fillText(`${super.formatNumber(re)}º`, 316, 479, 105);
        if (data.completudeGeral) ctx.fillText(`${data.completudeGeral}%`, 316, 498, 105);
        if (data.completudePlatina) ctx.fillText(`${data.completudePlatina}%`, 316, 517, 105);

        ctx.font = '20px "Work Sans", sans-serif';
        ctx.textAlign = 'center';
        
        const vl = Number(data.velocista) || 0;
        const po = Number(data.pioneiro) || 0;
        const dc = Number(data.dicas) || 0;
        const lk = Number(data.likes) || 0;

        if (data.velocista) ctx.fillText(super.formatNumber(vl), 47, 88, 35);
        if (data.pioneiro) ctx.fillText(super.formatNumber(po), 47, 159, 35);
        if (data.dicas) ctx.fillText(super.formatNumber(dc), 47, 230, 35);
        if (data.likes) ctx.fillText(super.formatNumber(lk), 47, 301, 35);

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
        let textLevelName = "";

        if (nivelCalculado <= 99) { iconLevel = images.imglvb1; textLevelName = "Bronze 1"; }
        else if (nivelCalculado <= 199) { iconLevel = images.imglvb2; textLevelName = "Bronze 2"; }
        else if (nivelCalculado <= 299) { iconLevel = images.imglvb3; textLevelName = "Bronze 3"; }
        else if (nivelCalculado <= 399) { iconLevel = images.imglvp1; textLevelName = "Prata 1"; }
        else if (nivelCalculado <= 499) { iconLevel = images.imglvp2; textLevelName = "Prata 2"; }
        else if (nivelCalculado <= 599) { iconLevel = images.imglvp3; textLevelName = "Prata 3"; }
        else if (nivelCalculado <= 699) { iconLevel = images.imglvo1; textLevelName = "Ouro 1"; }
        else if (nivelCalculado <= 799) { iconLevel = images.imglvo2; textLevelName = "Ouro 2"; }
        else if (nivelCalculado <= 998) { iconLevel = images.imglvo3; textLevelName = "Ouro 3"; }
        else { iconLevel = images.imglvpl; textLevelName = "Platina"; }

        if (iconLevel) {
            ctx.drawImage(iconLevel, 343, 333, 60, 60);
            ctx.font = '22px "Work Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(nivelCalculado, 373, 413, 55);
            ctx.font = '15px "Work Sans", sans-serif';
            ctx.fillText(textLevelName, 373, 434, 55); 
        }

        const hoje = new Date();
        const datageracao = ("0" + hoje.getDate()).slice(-2) + "/" + ("0" + (hoje.getMonth() + 1)).slice(-2) + "/" + hoje.getFullYear() + " - " + ("0" + hoje.getHours()).slice(-2) + ":" + ("0" + hoje.getMinutes()).slice(-2);

        ctx.translate(411, 175);
        ctx.rotate((-90 * Math.PI) / 180);
        ctx.font = '18px "Work Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(datageracao, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
