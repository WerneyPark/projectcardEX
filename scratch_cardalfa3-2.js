document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('cartaoCanvas');
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = "source-over";
    
    // Adiciona listener aos inputs e radio buttons
    const formElements = document.querySelectorAll('#formularioJogador2 input');
    
    // --- Carregamento de Imagens ---
    const images = {};
    const imageSources = {
        // Bordas e Bases
        imgTperfpsnl: "img/ALFA/psnlegendsborda.png",
        imgTperfpgg: "img/ALFA/imgperfbordaPG.png",
        
        // Bordas das Platinas Raras (PG Games)
        imgTplat1pgg: "img/ALFA/imgperfbordaplat1.png",
        imgTplat2pgg: "img/ALFA/imgperfbordaplat2.png",
        imgTplat3pgg: "img/ALFA/imgperfbordaplat3.png",
        imgTplat4pgg: "img/ALFA/imgperfbordaplat4.png",
        
        // Bordas das Platinas Raras (PSN Legends)
        imgTplat1psnl: "img/ALFA/psnlegendsbordat1.png",
        imgTplat2psnl: "img/ALFA/psnlegendsbordat2.png",
        imgTplat3psnl: "img/ALFA/psnlegendsbordat3.png",
        imgTplat4psnl: "img/ALFA/psnlegendsbordat4.png",

        // Backgrounds
        imgFundopsnl: "img/ALFA/basepsnl.png", // Base PSN Legends
        imgFundoPG: "img/ALFA/basealfa5.png",  // Base PG Games
        
        // Projeto Card (Overlay inicial)
        cdprojectcard: "img/ALFA/projectcard.png",

        // Níveis e Bordas de Nível
        imglvb1: "img/lvspsn/bronze_level_1.png",
        imglvb2: "img/lvspsn/bronze_level_2.png",
        imglvb3: "img/lvspsn/bronze_level_3.png",
        imglvp1: "img/lvspsn/silver_level_1.png",
        imglvp2: "img/lvspsn/silver_level_2.png",
        imglvp3: "img/lvspsn/silver_level_3.png",
        imglvo1: "img/lvspsn/gold_level_1.png",
        imglvo2: "img/lvspsn/gold_level_2.png",
        imglvo3: "img/lvspsn/gold_level_3.png",
        imglvpl: "img/lvspsn/platinum_level.png",
        
        imgbpl: "img/lvspsn/bordanivelplatina.png",
        imgbo: "img/lvspsn/bordanivelouro.png",
        imgbp: "img/lvspsn/bordanivelprata.png",
        imgbb: "img/lvspsn/bordanivelbronze.png"
    };

    let imagesLoaded = 0;
    const totalImages = Object.keys(imageSources).length;

    // Função para carregar todas as imagens antes de começar
    for (let key in imageSources) {
        images[key] = new Image();
        images[key].src = imageSources[key];
        images[key].onload = function() {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                // Desenha a imagem de "Project Card" inicial
                ctx.drawImage(images.cdprojectcard, 0, 0, 419, 595);
            }
        };
    }

    // Adiciona listeners para atualizar ao digitar
    formElements.forEach(element => {
        element.addEventListener('input', desenharCartao);
        element.addEventListener('change', desenharCartao);
    });

    function desenharCartao() { 
        // 1. Coleta de Dados
        const psn_id_pg = document.getElementById('psn_idPG').value;
        const platinaPG = document.getElementById('platina_PG').value;
        const ouroPG = document.getElementById('ouro_PG').value;
        const prataPG = document.getElementById('prata_PG').value;
        const bronzePG = document.getElementById('bronze_PG').value;
        const jogos_totalPG = document.getElementById('jogos_PG').value;
        const jogos_completosPG = document.getElementById('jogos_completosPG').value;
        const trofDiaPG = document.getElementById('trof_DiaPG').value;
        
        const img_perfilPG = document.getElementById('img_perfilPG').value;
        const img_pplat1 = document.getElementById('img_pplat1').value;
        const img_pplat2 = document.getElementById('img_pplat2').value;
        const img_pplat3 = document.getElementById('img_pplat3').value;
        const img_pplat4 = document.getElementById('img_pplat4').value;

        // Verifica qual rádio está marcado
        const tipocardpgg = document.getElementById('cardPGG').checked;
        const tipocardpsnl = document.getElementById('cardPSNL').checked;

        // 2. Cálculos Matemáticos
        const jogosTotais = Number(jogos_totalPG) || 1; // Evita divisão por zero
        const jogosCompletos = Number(jogos_completosPG) || 0;
        
        const perc_jogos = (jogosCompletos / jogosTotais) * 100;
        const perc_jogos_formatado = perc_jogos.toFixed(2);
        
        const PNPG = Number(platinaPG.replace(",","").replace(".","")) || 0;
        const ONPG = Number(ouroPG.replace(",","").replace(".","")) || 0;
        const PtNPG = Number(prataPG.replace(",","").replace(".","")) || 0;
        const BNPG = Number(bronzePG.replace(",","").replace(".","")) || 0;
        
        const totalTrofeus = PNPG + ONPG + PtNPG + BNPG;
        const totalTrofeusStr = totalTrofeus.toLocaleString("pt-BR");
        
        // Pontuação PSN para Nível
        const PSNPoints = (PNPG * 300) + (ONPG * 90) + (PtNPG * 30) + (BNPG * 15);

        // Formatação Alemã (Pontos como separadores de milhar)
        const platinaStr = PNPG.toLocaleString("de-DE");
        const ouroStr = ONPG.toLocaleString("de-DE");
        const prataStr = PtNPG.toLocaleString("de-DE");
        const bronzeStr = BNPG.toLocaleString("de-DE");
        const jogosTotalStr = Number(jogos_totalPG).toLocaleString("de-DE");

        // Função de Cálculo de Nível (Lógica Original Preservada)
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
        
        // Data
        const hoje = new Date();
        const datageracao = ("0" + hoje.getDate()).slice(-2) + "/" + ("0" + (hoje.getMonth() + 1)).slice(-2) + "/" + hoje.getFullYear() + " - " + ("0" + hoje.getHours()).slice(-2) + ":" + ("0" + hoje.getMinutes()).slice(-2);

        // 3. Desenho no Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        if (tipocardpgg) ctx.drawImage(images.imgFundoPG, 0, 0);
        else ctx.drawImage(images.imgFundopsnl, 0, 0);

        // Função Auxiliar para Imagens Externas (Avatar e Platinas)
        function drawExternalImage(url, x, y, w, h, borderImage) {
            if (!url) return;
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Importante para o download funcionar
            img.src = url;
            img.onload = function() {
                ctx.drawImage(img, x, y, w, h);
                if (borderImage) ctx.drawImage(borderImage, 0, 0);
            };
            if (img.complete) {
                ctx.drawImage(img, x, y, w, h);
                if (borderImage) ctx.drawImage(borderImage, 0, 0);
            }
        }

        // Avatar
        const avatarBorder = tipocardpgg ? images.imgTperfpgg : images.imgTperfpsnl;
        drawExternalImage(img_perfilPG, 44, 108, 273, 273, avatarBorder);

        // Platinas Raras (4 posições)
        const platBorders = tipocardpgg ? 
            [images.imgTplat1pgg, images.imgTplat2pgg, images.imgTplat3pgg, images.imgTplat4pgg] : 
            [images.imgTplat1psnl, images.imgTplat2psnl, images.imgTplat3psnl, images.imgTplat4psnl];

        drawExternalImage(img_pplat1, 325, 108, 61, 61, platBorders[0]);
        drawExternalImage(img_pplat2, 325, 180, 61, 61, platBorders[1]);
        drawExternalImage(img_pplat3, 325, 249, 61, 61, platBorders[2]);
        drawExternalImage(img_pplat4, 325, 321, 61, 61, platBorders[3]);

        // Textos
        // PSN ID
        if (psn_id_pg) {
            ctx.font = '40px "Gemunu Libre"';
            ctx.textAlign = "center";
            ctx.fillStyle = '#ffffff';
            ctx.fillText(psn_id_pg, 248, 74, 263);
        }

        // Troféus (Rotacionados -45 graus)
        function drawRotatedStat(text, x, y) {
            if (!text) return;
            ctx.translate(x, y);
            ctx.rotate((-45 * Math.PI) / 180);
            ctx.font = '20px "Orbitron"';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(text, 0, 0, 60);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        if (platinaPG) drawRotatedStat(platinaStr, 365, 440);
        if (ouroPG)    drawRotatedStat(ouroStr, 280, 440);
        if (prataPG)   drawRotatedStat(prataStr, 190, 440);
        if (bronzePG)  drawRotatedStat(bronzeStr, 108, 440);

        // Troféus por Dia (Vertical -90 graus)
        if (trofDiaPG) {
            ctx.translate(317, 523);
            ctx.rotate((-90 * Math.PI) / 180);
            ctx.font = '24px "Courgette"';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(trofDiaPG, 0, 0, 74);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        // Stats Inferiores (Jogos e Percentual)
        ctx.font = '20px "Courgette"';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        
        ctx.fillText(totalTrofeusStr, 188, 504, 93);  // Total Troféus
        ctx.fillText(jogosTotalStr, 188, 531, 93);    // Total Jogos
        ctx.fillText(`${perc_jogos_formatado}%`, 188, 561, 93); // Percentual

        // Data de Geração (Lateral Esquerda)
        ctx.translate(26, 350);
        ctx.rotate((-90 * Math.PI) / 180);
        ctx.font = '18px "Courgette"';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(datageracao, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Lógica de Ícone de Nível
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

        // Texto do Nível
        ctx.font = '40px "Lobster"';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(nivelCalculado, 361, 510, 60);
    }
});

function baixarCard() {
    const canvas = document.getElementById('cartaoCanvas');
    const psnId = document.getElementById('psn_idPG').value || 'jogador';
    const imageURL = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement('a');
    link.download = `card_legends_${psnId}.png`;
    link.href = imageURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}