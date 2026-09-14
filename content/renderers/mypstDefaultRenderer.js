/**
 * MypstDefaultRenderer — Gera o card visual para perfis do MyPST.
 *
 * Reutiliza o fundo padrão do PSXT (basepsxt.png) e adapta as coordenadas
 * de texto para os dados disponíveis no MyPST.
 */
class MypstDefaultRenderer extends BaseRenderer {
    async renderCard(data, ctx, canvas) {
        canvas.width = 419;
        canvas.height = 610;

        const imageSources = {
            imgFundo: "https://projectcard.com.br/img/ALFA/basealfa3.png",
            imgTperf: "https://projectcard.com.br/img/ALFA/tperf.png",
            imgTplat: "https://projectcard.com.br/img/ALFA/tplat.png",
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
            basebanin: "https://projectcard.com.br/img/ALFA/fundobanin.png",
            basebaninb: "https://projectcard.com.br/img/ALFA/fundobaninb.png",
            baseplatina: "https://projectcard.com.br/img/ALFA/baseplatina.png",
            baseanalista: "https://projectcard.com.br/img/ALFA/baseanalista.png",
            baseanalistab: "https://projectcard.com.br/img/ALFA/baseanalistab.png",
            basered: "https://projectcard.com.br/img/ALFA/basered.png",
            baseredb: "https://projectcard.com.br/img/ALFA/baseredb.png",
            basewp: "https://projectcard.com.br/img/ALFA/basewp.png",
            basewpb: "https://projectcard.com.br/img/ALFA/basewpb.png",
            basebad: "https://projectcard.com.br/img/ALFA/basebad.png",
            basebadb: "https://projectcard.com.br/img/ALFA/basebadb.png",
            baseden: "https://projectcard.com.br/img/ALFA/baseden.png",
            basedenb: "https://projectcard.com.br/img/ALFA/basedenb.png",
            basemod: "https://projectcard.com.br/img/ALFA/basemod.png",
            basemodb: "https://projectcard.com.br/img/ALFA/basemodb.png",
            basenot: "https://projectcard.com.br/img/ALFA/basenot.png",
            basenotb: "https://projectcard.com.br/img/ALFA/basenotb.png"
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
        
        //if (images.imgFundo) ctx.drawImage(images.imgFundo, 0, 0);


        


        const mapBases = {
            "WerneyPark": {normal: images.basewp, perfil: images.basewpb},

            "FBanin": {normal: images.basebanin, perfil: images.basebaninb},


            "LoiroCroft": {normal: images.baseanalista, perfil: images.baseanalistab},
            "LucasIIGD": {normal: images.baseanalista, perfil: images.baseanalistab},
            "MGZoio": {normal: images.basered, perfil: images.baseredb},
            "fabriciols": {normal: images.basered, perfil: images.baseredb},
            "Toushi-san": {normal: images.basered, perfil: images.baseredb},
            "MamyBR": {normal: images.basered, perfil: images.baseredb},
            "ZakJapa": {normal: images.basered, perfil: images.baseredb},
            "GIBATSAN": {normal: images.basered, perfil: images.baseredb},
            "Wesp_can": {normal: images.baseanalista, perfil: images.baseanalistab},
            "fabio_lokura": {normal: images.baseanalista, perfil: images.baseanalistab},
            "Kabanas22": {normal: images.baseanalista, perfil: images.baseanalistab},
            "InsaneMarcel": {normal: images.baseanalista, perfil: images.baseanalistab},
            "AnzaiRossi": {normal: images.baseanalista, perfil: images.baseanalistab},
            "DesmaBR": {normal: images.baseanalista, perfil: images.baseanalistab},
            "LeoCosAffo": {normal: images.baseanalista, perfil: images.baseanalistab},
            "nabinha": {normal: images.basebad, perfil: images.basebadb},
            "zTREVOLz": {normal: images.basebad, perfil: images.basebadb},
            "FreddieGellar": {normal: images.basebad, perfil: images.basebadb},
            "STARBLAC": {normal: images.basenot, perfil: images.basenotb},
            "blackgndrf": {normal: images.basenot, perfil: images.basenotb},
            "Tio_Maluco": {normal: images.basenot, perfil: images.basenotb},
            " EduNews": {normal: images.basenot, perfil: images.basenotb},
            " EduNews ": {normal: images.basemod, perfil: images.basemodb},
            " MamyBR": {normal: images.basemod, perfil: images.basemodb},
            " MamyBR ": {normal: images.basenot, perfil: images.basenotb},
            "gabriellobo1101": {normal: images.basemod, perfil: images.basemodb},
            " FBanin": {normal: images.basemod, perfil: images.basemodb},
            "MorpheuVRJ": {normal: images.basemod, perfil: images.basemodb},
            "Tognassolo": {normal: images.baseden, perfil: images.basedenb},
            "LucasDiasC": {normal: images.baseden, perfil: images.basedenb},
            "lionflu": {normal: images.baseden, perfil: images.basedenb},
            " MGZoio": {normal: images.baseden, perfil: images.basedenb},
            " MGZoio ": {normal: images.basemod, perfil: images.basemodb},

            "baseplat": {normal: images.baseplatina, perfil: images.imgTperf},

        };

        mapBases.EduNews = mapBases.SABBATH1979 = mapBases.laddyvalentine = mapBases.bklautau = mapBases.Marcel_pfs1 = mapBases.DaniloSouza84 = mapBases.Hidra13 = mapBases.SobrinhaYstranha = mapBases["Ikaros-NEX"] = mapBases.dfop02 = mapBases.baseplat;
        
        const idsPlatina = ["EduNews", "SABBATH1979", "laddyvalentine", "bklautau", "Marcel_pfs1", "DaniloSouza84", "Hidra13", "SobrinhaYstranha", "Ikaros-NEX", "dfop02"];

        let psnId = data.psnId || '';
        /*
        if (mapBases[psnId]) {
            if (images.avatar && mapBases[psnId].perfil) {
                let offsetY = 0;
                if (psnId === "WerneyPark") offsetY = 0;
                else if (["MGZoio", "LucasDiasC", "fabriciols", "Toushi-san", "MamyBR", "ZakJapa", "GIBATSAN", "Tognassolo", "nabinha", "zTREVOLz", "FreddieGellar", "lionflu"].includes(psnId)) offsetY = -1;
                ctx.drawImage(mapBases[psnId].perfil, 0, offsetY);
            }
            if (mapBases[psnId].normal) ctx.drawImage(mapBases[psnId].normal, 0, 0);
        } else if (idsPlatina.includes(psnId) && images.baseplatina) {
            ctx.drawImage(images.baseplatina, 0, 0);
        }
*/


        if (images.avatar) {
            ctx.drawImage(mapBases[psnId]?.normal || images.imgFundo, 0, 0);
            ctx.drawImage(images.avatar, 91, 91, 300, 300);
            if (images.imgTperf) ctx.drawImage(mapBases[psnId]?.perfil || images.imgTperf, 0, 0);
        }



        if (psnId) {
            ctx.font = '55px "Gemunu Libre"';
            ctx.textAlign = "center";
            ctx.fillStyle = '#ffffff';
            ctx.fillText(psnId, 180, 57, 316);
        }

        if (data.frase) {
            ctx.font = '20px "Gemunu Libre"';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(data.frase, 210, 472, 381);
        }

        const platNum = Number((data.plat || '0').replace(/[.,]/g, ''));
        const goldNum = Number((data.gold || '0').replace(/[.,]/g, ''));
        const silverNum = Number((data.silver || '0').replace(/[.,]/g, ''));
        const bronzeNum = Number((data.bronze || '0').replace(/[.,]/g, ''));

        ctx.font = '20px "Gemunu Libre"';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        if (platNum > 0) ctx.fillText(super.formatNumber(platNum), 75, 160, 56);
        if (goldNum > 0) ctx.fillText(super.formatNumber(goldNum), 75, 233, 56);
        if (silverNum > 0) ctx.fillText(super.formatNumber(silverNum), 75, 310, 56);
        if (bronzeNum > 0) ctx.fillText(super.formatNumber(bronzeNum), 75, 383, 56);

        const statsY = 563;
        ctx.textAlign = 'center';
        if (data.mensal && data.mensal) ctx.fillText(data.mensal, 206, statsY, 34);
        if (data.semanal && data.semanal) ctx.fillText(data.semanal, 243, statsY, 34);
        if (data.guias && data.guias) ctx.fillText(data.guias, 280, statsY, 34);
        if (data.pioneiro && data.pioneiro) ctx.fillText(data.pioneiro, 317, statsY, 34);
        if (data.velocista && data.velocista) ctx.fillText(data.velocista, 354, statsY, 34);
        if (data.tartaruga && data.tartaruga) ctx.fillText(data.tartaruga, 391, statsY, 34);

        if (pplatImg) {
            ctx.drawImage(pplatImg, 102, 520, 70, 70);
            if (images.imgTplat) ctx.drawImage(images.imgTplat, 0, 0);
        }

        let jComp = Number(data.jogosCompletos || 0);
        let jTot = Number(data.totalJogos || 0);
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

        const hoje = new Date();
        const datageracao = ("0" + hoje.getDate()).slice(-2) + "/" + ("0" + (hoje.getMonth() + 1)).slice(-2) + "/" + hoje.getFullYear() + " - " + ("0" + hoje.getHours()).slice(-2) + ":" + ("0" + hoje.getMinutes()).slice(-2);

        ctx.font = '20px "Gemunu Libre"';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(datageracao, 19, 410);

        const PSNPoints = (platNum * 300) + (goldNum * 90) + (silverNum * 30) + (bronzeNum * 15);

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
            let nx = 356, ny = 16;
            if(nivelCalculado >= 600 && nivelCalculado <= 998) ny = 15;
            if(nivelCalculado >= 0 && nivelCalculado <= 299) ny = 17;
            if(nivelCalculado >= 800 && nivelCalculado <= 998) nx = 357;
            ctx.drawImage(imgNivel, nx, ny, 49, 49);
        }
    }
}

