document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('cartaoCanvas');
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = "source-over";
    
    const formElements = document.querySelectorAll('#formularioJogador2 input');
    
    // --- Carregamento de Imagens ---
    const images = {};
    const imageSources = {
        imgFundopsnp: "img/ALFA/basepsnp.png",
        imgBordapsnp: "img/ALFA/bordapsnp.png",
        cdprojectcard: "img/ALFA/projectcard.png",
        
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
        // 1. Dados do formulário
        const psn_id = document.getElementById('psn_idpsnp').value;
        
        const platina = document.getElementById('platina_psnp').value;
        const ouro = document.getElementById('ouro_psnp').value;
        const prata = document.getElementById('prata_psnp').value;
        const bronze = document.getElementById('bronze_psnp').value;


        
        const jogos = Number(document.getElementById('jogos_psnp').value) || 0;
        const t_day = document.getElementById('tday_psnp').value;
        const complet = document.getElementById('comple_psnp').value;
        const unearned = document.getElementById('une_psnp').value;

        // Raridades
        const ur = Number(document.getElementById('ur_psnp').value) || 0;
        const vr = Number(document.getElementById('vr_psnp').value) || 0;
        const rr = Number(document.getElementById('rr_psnp').value) || 0;
        const uc = Number(document.getElementById('uc_psnp').value) || 0;
        const cm = Number(document.getElementById('cm_psnp').value) || 0;
        
        const img_perfil = document.getElementById('img_perfilpsnp').value;


        var platina2 = Number(platina.replace(",","").replace(".","")) || 0;
        var ouro2 = Number(ouro.replace(",","").replace(".","")) || 0;
        var prata2 = Number(prata.replace(",","").replace(".","")) || 0;
        var bronze2 = Number(bronze.replace(",","").replace(".","")) || 0;
        // 2. Cálculos e Formatação
        // Strings formatadas (estilo Alemão conforme original)
        const f = (n) => n.toLocaleString("de-DE");

        var tTotal = platina2 + ouro2 + prata2 + bronze2;
        var PSNPoints = (platina2 * 300) + (ouro2 * 90) + (prata2 * 30) + (bronze2 * 15);

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

        const nivelCalculado = Math.floor(calcula_nivel(PSNPoints));

        // Data
        const hoje = new Date();
        const datageracao = ("0" + hoje.getDate()).slice(-2) + "/" + ("0" + (hoje.getMonth() + 1)).slice(-2) + "/" + hoje.getFullYear() + " - " + ("0" + hoje.getHours()).slice(-2) + ":" + ("0" + hoje.getMinutes()).slice(-2);

        // 3. Desenho
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(images.imgFundopsnp, 0, 0);

        // Avatar
        if (img_perfil) {
            const perfilImg = new Image();
            perfilImg.crossOrigin = "Anonymous";
            perfilImg.src = img_perfil;
            perfilImg.onload = function() {
                ctx.drawImage(perfilImg, 98, 104, 300, 300);
                ctx.drawImage(images.imgBordapsnp, 0, 0);
            }
            if (perfilImg.complete) {
                ctx.drawImage(perfilImg, 98, 104, 300, 300);
                ctx.drawImage(images.imgBordapsnp, 0, 0);
            }
        }

        // PSN ID
        if (psn_id) {
            ctx.font = '40px "Roboto", sans-serif';
            ctx.textAlign = "center";
            ctx.fillStyle = '#000000';
            ctx.fillText(psn_id, 247, 485, 308);                                        
        }

        // Função Helper para Texto Rotacionado (-45 graus)
        function drawRotatedText(text, x, y, color = '#000000') {
            if (!text && text !== 0) return;
            ctx.translate(x, y);
            ctx.rotate((-45 * Math.PI) / 180);
            ctx.font = '20px "Bahnschrift", sans-serif';
            ctx.textAlign = 'center';               
            ctx.fillStyle = color;             
            ctx.fillText(text, 0, 0, 50);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        // Troféus (Topo)
        if (document.getElementById('platina_psnp').value) drawRotatedText(f(platina2), 170, 55);
        if (document.getElementById('ouro_psnp').value)    drawRotatedText(f(ouro2), 245, 55);
        if (document.getElementById('prata_psnp').value)   drawRotatedText(f(prata2), 318, 55);
        if (document.getElementById('bronze_psnp').value)  drawRotatedText(f(bronze2), 388, 55);
        
        // Total Troféus (Sempre desenha)
        drawRotatedText(f(tTotal), 98, 55);

        // Raridades (Lateral Esquerda)
        if (document.getElementById('ur_psnp').value) drawRotatedText(f(ur), 57, 140, '#ff4500');
        if (document.getElementById('vr_psnp').value) drawRotatedText(f(vr), 57, 203, '#4b0082');
        if (document.getElementById('rr_psnp').value) drawRotatedText(f(rr), 57, 267, '#1e90ff');
        if (document.getElementById('uc_psnp').value) drawRotatedText(f(uc), 57, 335, '#228b22');
        if (document.getElementById('cm_psnp').value) drawRotatedText(f(cm), 57, 403, '#696969');

        // Stats Inferiores (Rodapé)
        ctx.font = '30px "Bahnschrift", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';

        if (document.getElementById('jogos_psnp').value) ctx.fillText(f(jogos), 50, 546, 70);
        if (t_day) ctx.fillText(t_day, 135, 546, 70);
        if (complet) ctx.fillText(`${complet}%`, 242, 546, 70);
        if (unearned) ctx.fillText(unearned, 352, 546, 70);

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
        ctx.font = '20px "Bahnschrift", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#000000';
        ctx.fillText(datageracao, 99, 432);
    }
});

function baixarCard() {
    const canvas = document.getElementById('cartaoCanvas');
    const psnId = document.getElementById('psn_idpsnp').value || 'jogador';
    const imageURL = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement('a');
    link.download = `card_psnp_${psnId}.png`;
    link.href = imageURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}