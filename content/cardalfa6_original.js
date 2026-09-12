document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('cartaoCanvas');
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = "source-over";
    
    const formElements = document.querySelectorAll('#formularioJogador2 input');
    
    // --- Carregamento de Imagens ---
    const images = {};
    const imageSources = {
        imgFundopsxt: "img/ALFA/basepsxt.png",
        imgBordapsxt: "img/ALFA/basepsxtb.png",
        cdprojectcard: "img/ALFA/projectcard.png",
        
        // Níveis
        imglvb1: "img/lvspsn/bronze_level_1.png",
        imglvb2: "img/lvspsn/bronze_level_2.png",
        imglvb3: "img/lvspsn/bronze_level_3.png",
        imglvp1: "img/lvspsn/silver_level_1.png",
        imglvp2: "img/lvspsn/silver_level_2.png",
        imglvp3: "img/lvspsn/silver_level_3.png",
        imglvo1: "img/lvspsn/gold_level_1.png",
        imglvo2: "img/lvspsn/gold_level_2.png",
        imglvo3: "img/lvspsn/gold_level_3.png",
        imglvpl: "img/lvspsn/platinum_level.png"
    };

    let imagesLoaded = 0;
    const totalImages = Object.keys(imageSources).length;

    // Carrega todas as imagens
    for (let key in imageSources) {
        images[key] = new Image();
        images[key].src = imageSources[key];
        images[key].onload = function() {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                // Desenha a imagem inicial
                ctx.drawImage(images.cdprojectcard, 0, 0);
            }
        };
    }

    formElements.forEach(element => {
        element.addEventListener('input', desenharCartao);
        element.addEventListener('change', desenharCartao);
    });

    function desenharCartao() { 
        // 1. Coleta de Dados
        const psn_id = document.getElementById('psn_idpsxt').value;
        
        const platina = document.getElementById('platina_psxt').value;
        const ouro = document.getElementById('ouro_psxt').value;
        const prata = document.getElementById('prata_psxt').value;
        const bronze = document.getElementById('bronze_psxt').value;


        
        const ph = Number(document.getElementById('ph_psxt').value) || 0;
        const rg = Number(document.getElementById('rg_psxt').value) || 0;
        const rr = Number(document.getElementById('rr_psxt').value) || 0;
        const re = Number(document.getElementById('re_psxt').value) || 0;
        
        const cg = document.getElementById('cg_psxt').value; // Strings para manter formatação do user
        const cp = document.getElementById('cp_psxt').value;
        
        const vl = Number(document.getElementById('vl_psxt').value) || 0;
        const po = Number(document.getElementById('po_psxt').value) || 0;
        const dc = Number(document.getElementById('dc_psxt').value) || 0;
        const lk = Number(document.getElementById('lk_psxt').value) || 0;
        
        const img_perfil = document.getElementById('img_perfilpsxt').value;

        var platina2 = Number(platina.replace(",","").replace(".","")) || 0;
        var ouro2 = Number(ouro.replace(",","").replace(".","")) || 0;
        var prata2 = Number(prata.replace(",","").replace(".","")) || 0;
        var bronze2 = Number(bronze.replace(",","").replace(".","")) || 0;

        // 2. Cálculos e Formatação
        const f = (n) => n.toLocaleString("de-DE");

        const tTotal = platina2 + ouro2 + prata2 + bronze2;
        const PSNPoints = (platina2 * 300) + (ouro2 * 90) + (prata2* 30) + (bronze2 * 15);
        
        // Atualiza o input disabled de Pontos PSN (visual)
        document.getElementById('ppsn_psxt').value = PSNPoints;

        // Lógica de Nível (Original)
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
        
        const hoje = new Date();
        const datageracao = ("0" + hoje.getDate()).slice(-2) + "/" + ("0" + (hoje.getMonth() + 1)).slice(-2) + "/" + hoje.getFullYear() + " - " + ("0" + hoje.getHours()).slice(-2) + ":" + ("0" + hoje.getMinutes()).slice(-2);

        // 3. Desenho
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images.imgFundopsxt, 0, 0);

        // Avatar
        if (img_perfil) {
            const perfilImg = new Image();
            perfilImg.crossOrigin = "Anonymous";
            perfilImg.src = img_perfil;
            perfilImg.onload = function() {
                ctx.drawImage(perfilImg, 92, 16, 300, 300);
                ctx.drawImage(images.imgBordapsxt, 0, 0);
            }
            if (perfilImg.complete) {
                ctx.drawImage(perfilImg, 92, 16, 300, 300);
                ctx.drawImage(images.imgBordapsxt, 0, 0);
            }
        }

        // PSN ID
        if (psn_id) {
            ctx.font = '30px "Work Sans", sans-serif';
            ctx.textAlign = "center";
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(psn_id, 170, 363, 308);                                        
        }

        // Troféus (Alinhamento à Direita)
        ctx.font = '20px "Work Sans", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000000';

        if (document.getElementById('platina_psxt').value) ctx.fillText(f(platina2), 54, 592, 40);
        if (document.getElementById('ouro_psxt').value) ctx.fillText(f(ouro2), 135, 592, 52);
        if (document.getElementById('prata_psxt').value) ctx.fillText(f(prata2), 217, 592, 53);
        if (document.getElementById('bronze_psxt').value) ctx.fillText(f(bronze2), 296, 592, 54);

        // Total Troféus e Pontos PSN (Direita)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(f(tTotal), 372, 592, 51);

        ctx.font = '15px "Work Sans", sans-serif';
        ctx.fillText(f(PSNPoints), 316, 421, 105);

        // Rankings e PH
        if (document.getElementById('ph_psxt').value) ctx.fillText(f(ph), 316, 403, 105);
        if (document.getElementById('rg_psxt').value) ctx.fillText(`${f(rg)}º`, 316, 440, 105);
        if (document.getElementById('rr_psxt').value) ctx.fillText(`${f(rr)}º`, 316, 459, 105);
        if (document.getElementById('re_psxt').value) ctx.fillText(`${f(re)}º`, 316, 479, 105);
        
        // Completude
        if (cg) ctx.fillText(`${cg}%`, 316, 498, 105);
        if (cp) ctx.fillText(`${cp}%`, 316, 517, 105);

        // Extras (Esquerda, Centro)
        ctx.font = '20px "Work Sans", sans-serif';
        ctx.textAlign = 'center';
        
        if (document.getElementById('vl_psxt').value) ctx.fillText(f(vl), 47, 88, 35);
        if (document.getElementById('po_psxt').value) ctx.fillText(f(po), 47, 159, 35);
        if (document.getElementById('dc_psxt').value) ctx.fillText(f(dc), 47, 230, 35);
        if (document.getElementById('lk_psxt').value) ctx.fillText(f(lk), 47, 301, 35);

        // Nível (Ícone e Texto)
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
            
            // Texto Número Nível
            ctx.font = '22px "Work Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(nivelCalculado, 373, 413, 55);
            
            // Texto Nome Nível (Bronze 1, etc)
            ctx.font = '15px "Work Sans", sans-serif';
            ctx.fillText(textLevelName, 373, 434, 55); 
        }

        // Data (Rotacionada)
        ctx.translate(411, 175);
        ctx.rotate((-90 * Math.PI) / 180);
        ctx.font = '18px "Work Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(datageracao, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
});

function baixarCard() {
    const canvas = document.getElementById('cartaoCanvas');
    const psnId = document.getElementById('psn_idpsxt').value || 'jogador';
    const imageURL = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement('a');
    link.download = `card_psxt_${psnId}.png`;
    link.href = imageURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}