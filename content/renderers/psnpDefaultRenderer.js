/**
 * PsnpDefaultRenderer — Gera o card visual para perfis do PSNProfiles.
 *
 * Reutiliza o fundo padrão (basepsxt.png) e adapta os campos para os
 * dados disponíveis no PSNProfiles (level, completion, rankings, troféus).
 */
class PsnpDefaultRenderer extends BaseRenderer {
    async renderCard(data, ctx, canvas) {
        canvas.width = 419;
        canvas.height = 610;

        const imageSources = {
            imgFundopsnp: "https://projectcard.com.br/img/ALFA/basepsnp.png",
            imgBordapsnp: "https://projectcard.com.br/img/ALFA/bordapsnp.png",
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

        // Função Helper para Texto Rotacionado (-45 graus)
        function drawRotatedText(text, x, y, color = '#000000') {
            if (!text && text !== 0 && text !== '0') return;
            ctx.translate(x, y);
            ctx.rotate((-45 * Math.PI) / 180);
            ctx.font = '20px "Bahnschrift", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = color;
            ctx.fillText(text, 0, 0, 50);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        const platNum   = Number((data.plat || '0').replace(/[.,]/g, '')) || 0;
        const goldNum   = Number((data.gold || '0').replace(/[.,]/g, '')) || 0;
        const silverNum = Number((data.silver || '0').replace(/[.,]/g, '')) || 0;
        const bronzeNum = Number((data.bronze || '0').replace(/[.,]/g, '')) || 0;
        const tTotal    = platNum + goldNum + silverNum + bronzeNum;
        const PSNPoints = (platNum * 300) + (goldNum * 90) + (silverNum * 30) + (bronzeNum * 15);

        // Troféus (Topo)
        if (data.plat && data.plat !== '0') drawRotatedText(super.formatNumber(platNum), 170, 55);
        if (data.gold && data.gold !== '0') drawRotatedText(super.formatNumber(goldNum), 245, 55);
        if (data.silver && data.silver !== '0') drawRotatedText(super.formatNumber(silverNum), 318, 55);
        if (data.bronze && data.bronze !== '0') drawRotatedText(super.formatNumber(bronzeNum), 388, 55);
        
        // Total Troféus (Sempre desenha)
        drawRotatedText(super.formatNumber(tTotal), 98, 55);

        // Raridades (Lateral Esquerda)
        const urNum = Number((data.ur || '0').replace(/[.,]/g, '')) || 0;
        const vrNum = Number((data.vr || '0').replace(/[.,]/g, '')) || 0;
        const rrNum = Number((data.rr || '0').replace(/[.,]/g, '')) || 0;
        const ucNum = Number((data.uc || '0').replace(/[.,]/g, '')) || 0;
        const cmNum = Number((data.cm || '0').replace(/[.,]/g, '')) || 0;

        if (data.ur && data.ur !== '0') drawRotatedText(super.formatNumber(urNum), 57, 140, '#ff4500');
        if (data.vr && data.vr !== '0') drawRotatedText(super.formatNumber(vrNum), 57, 203, '#4b0082');
        if (data.rr && data.rr !== '0') drawRotatedText(super.formatNumber(rrNum), 57, 267, '#1e90ff');
        if (data.uc && data.uc !== '0') drawRotatedText(super.formatNumber(ucNum), 57, 335, '#228b22');
        if (data.cm && data.cm !== '0') drawRotatedText(super.formatNumber(cmNum), 57, 403, '#696969');

        // Stats Inferiores (Rodapé)
        ctx.font = '30px "Bahnschrift", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';

        const totalJogosNum = Number((data.totalJogos || '0').replace(/[.,]/g, '')) || 0;
        if (data.totalJogos && data.totalJogos !== '0') {
            ctx.fillText(super.formatNumber(totalJogosNum), 50, 546, 70);
        }
        if (data.trofeusPorDia && data.trofeusPorDia !== '0') {
            ctx.fillText(data.trofeusPorDia, 135, 546, 70);
        }
        if (data.completudeGeral && data.completudeGeral !== '0') {
            ctx.fillText(`${data.completudeGeral}%`, 242, 546, 70);
        }
        if (data.unearned && data.unearned !== '0') {
            const unearnedNum = Number((data.unearned || '0').replace(/[.,]/g, '')) || 0;
            ctx.fillText(super.formatNumber(unearnedNum), 352, 546, 70);
        }

        // Lógica de Nível
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

        const nivelCalculado = Number(data.level) || Math.floor(calcula_nivel(PSNPoints));

        // Ícone de Nível
        let iconLevel = null;
        if (nivelCalculado <= 99) iconLevel = images.imglvb1;
        else if (nivelCalculado <= 199) iconLevel = images.imglvb2;
        else if (nivelCalculado <= 299) iconLevel = images.imglvb3;
        else if (nivelCalculado <= 399) iconLevel = images.imglvp1;
        else if (nivelCalculado <= 499) iconLevel = images.imglvp2;
        else if (nivelCalculado <= 599) iconLevel = images.imglvp3;
        else if (nivelCalculado <= 699) iconLevel = images.imglvo1;
        else if (nivelCalculado <= 799) iconLevel = images.imglvo2;
        else if (nivelCalculado <= 998) iconLevel = images.imglvo3;
        else iconLevel = images.imglvpl;

        if (iconLevel) {
            ctx.drawImage(iconLevel, 29, 453, 35, 35);
        }

        // Data
        const hoje = new Date();
        const datageracao = ("0" + hoje.getDate()).slice(-2) + "/" + ("0" + (hoje.getMonth() + 1)).slice(-2) + "/" + hoje.getFullYear() + " - " + ("0" + hoje.getHours()).slice(-2) + ":" + ("0" + hoje.getMinutes()).slice(-2);

        ctx.font = '20px "Bahnschrift", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#000000';
        ctx.fillText(datageracao, 99, 432);
    }
}
