document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('cartaoCanvas');
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = "source-over";
    
    // Adiciona listener aos inputs e radio buttons
    const formElements = document.querySelectorAll('#formularioJogador2 input');
        
    // Carregamento de Imagens
    const imgFundomypst2 = new Image();
    imgFundomypst2.src = "img/ALFA/basealfamypst2.png";

    const imgFundomypst2preto = new Image();
    imgFundomypst2preto.src = "img/ALFA/basealfamypst2preto.png";

    const cdprojectcard = new Image();
    cdprojectcard.src = "img/ALFA/projectcard.png";

    const imgBordaperfMYPST2 = new Image();
    imgBordaperfMYPST2.src = "img/ALFA/imgperfbordamypst22.png";

    const imgBordaperfMYPST2preto = new Image();
    imgBordaperfMYPST2preto.src = "img/ALFA/imgperfbordamypst2preta.png";

    // Imagens de Nível
    const imglvb1 = new Image(); imglvb1.src = "img/lvspsn/bronze_level_1.png";
    const imglvb2 = new Image(); imglvb2.src = "img/lvspsn/bronze_level_2.png";
    const imglvb3 = new Image(); imglvb3.src = "img/lvspsn/bronze_level_3.png";
    const imglvp1 = new Image(); imglvp1.src = "img/lvspsn/silver_level_1.png";
    const imglvp2 = new Image(); imglvp2.src = "img/lvspsn/silver_level_2.png";
    const imglvp3 = new Image(); imglvp3.src = "img/lvspsn/silver_level_3.png";
    const imglvo1 = new Image(); imglvo1.src = "img/lvspsn/gold_level_1.png";
    const imglvo2 = new Image(); imglvo2.src = "img/lvspsn/gold_level_2.png";
    const imglvo3 = new Image(); imglvo3.src = "img/lvspsn/gold_level_3.png";
    const imglvpl = new Image(); imglvpl.src = "img/lvspsn/platinum_level.png";

    cdprojectcard.onload = function(){
        ctx.drawImage(cdprojectcard, 0, 0, 395, 566)
    };

    formElements.forEach(element => {
        element.addEventListener('input', desenharCartao);
        element.addEventListener('change', desenharCartao); 
    });
     
    function desenharCartao() { 
        // Dados do formulário
        const psn_id_mypst2 = document.getElementById('psn_idmypst2').value;
        const frasemypst2 = document.getElementById('frase_frmypst2').value;
        const platinamypst2 = document.getElementById('platina_mypst2').value;
        const ouromypst2 = document.getElementById('ouro_mypst2').value;
        const pratamypst2 = document.getElementById('prata_mypst2').value;
        const bronzemypst2 = document.getElementById('bronze_mypst2').value;
        const psn100mypst2 = document.getElementById('psn100_mypst2').value;
        const jogos_totalmypst2 = document.getElementById('jogos_mypst2').value;
        const jogos_completosmypst2 = document.getElementById('jogos_completosmypst2').value;
        const pdmmypst2 = document.getElementById('jogos_pdmmypst2').value;
        const nacionalmypst2 = document.getElementById('jogos_nacionalmypst2').value;
        const dificuldademypst2 = document.getElementById('jogos_dificuldademypst2').value;

        const mensalmypst2 = document.getElementById('mensal_mypst2').value;
        const semanalmypst2 = document.getElementById('semanal_mypst2').value;
        const guiasmypst2 = document.getElementById('guias_mypst2').value;
        const pioneiromypst2 = document.getElementById('pioneiro_mypst2').value;
        const velocistamypst2 = document.getElementById('velocista_mypst2').value;
        const tartarugamypst2 = document.getElementById('tartaruga_mypst2').value;
        const badgesmypst2 = document.getElementById('badges_mypst2').value;

        const img_perfilmypst2 = document.getElementById('img_perfilmypst2').value;
        const img_pplatmypst2 = document.getElementById('img_pplatmypst2').value;

        const tipocardmypst2 = document.getElementById('cardAzul_mypst2').checked;
        const tipocardmypst22 = document.getElementById('cardPreto_mypst2').checked;
        
        // Cálculos
        var perc_jogos1MYPST2 = jogos_completosmypst2 / jogos_totalmypst2 || 0;
        var perc_jogos2MYPST2 = perc_jogos1MYPST2 * 100;
        var perc_jogos3MYPST2 = perc_jogos2MYPST2.toFixed(2);
        
        var PNMYPST = Number(platinamypst2.replace(",","").replace(".",""));
        var ONMYPST = Number(ouromypst2.replace(",","").replace(".",""));
        var PtNMYPST = Number(pratamypst2.replace(",","").replace(".",""));
        var BNMYPST = Number(bronzemypst2.replace(",","").replace(".",""));
        var P100NMYPST = Number(psn100mypst2.replace(",","").replace(".",""))
        var tTotalMYPST = PNMYPST + ONMYPST + PtNMYPST + BNMYPST;
        var tTotalmypst22 = tTotalMYPST.toLocaleString("de-DE");
       
        var platinamypst22 = PNMYPST.toLocaleString("de-DE");
        var ouromypst22 = ONMYPST.toLocaleString("de-DE");
        var pratamypst22 = PtNMYPST.toLocaleString("de-DE");
        var bronzemypst22 = BNMYPST.toLocaleString("de-DE");
        var psn100mypst22 = P100NMYPST.toLocaleString("de-DE");

        var JTMYPST2 = Number(jogos_totalmypst2);
        var jogos_totalmypst22 = JTMYPST2.toLocaleString("de-DE");
        
        var PSNPNMYPST = (PNMYPST * 300) + (ONMYPST * 90) + (PtNMYPST * 30) + (BNMYPST * 15);
        var PSNPNMYPST2 = PSNPNMYPST.toLocaleString("de-DE");

        function calcula_nivel (PSNPNMYPST) {
            if (PSNPNMYPST <= 5940 ) return (PSNPNMYPST / 60) + 1;
            if (PSNPNMYPST <= 14940 ) return ((PSNPNMYPST - 5940) / 90) + 100; 
            if (PSNPNMYPST <= 59940 ) return ((PSNPNMYPST - 14940) / 450) + 200;
            if (PSNPNMYPST <= 149940 ) return ((PSNPNMYPST - 59940) / 900) + 300;
            if (PSNPNMYPST <= 284940 ) return ((PSNPNMYPST - 149940) / 1350) + 400;
            if (PSNPNMYPST <= 464940 ) return ((PSNPNMYPST - 284940) / 1800) + 500;
            if (PSNPNMYPST <= 689940 ) return ((PSNPNMYPST - 464940) / 2250) + 600;
            if (PSNPNMYPST <= 959940 ) return ((PSNPNMYPST - 689940) / 2700) + 700;
            if (PSNPNMYPST <= 1274940 ) return ((PSNPNMYPST - 959940) / 3150) + 800;
            if (PSNPNMYPST <= 1634940 ) return ((PSNPNMYPST - 1274940) / 3600) + 900;
            if (PSNPNMYPST <= 2039940 ) return ((PSNPNMYPST - 1634940) / 4050) + 1000;
            if (PSNPNMYPST <= 2489940 ) return ((PSNPNMYPST - 2039940) / 4500) + 1100;
            if (PSNPNMYPST <= 2984940) return ((PSNPNMYPST - 2489940) / 4950) + 1200;
            if (PSNPNMYPST <= 3524940) return ((PSNPNMYPST - 2984940) / 5400) + 1300;
            if (PSNPNMYPST <= 4109940) return ((PSNPNMYPST - 3524940) / 5850) + 1400;
            if (PSNPNMYPST <= 4739940) return ((PSNPNMYPST - 4109940) / 6300) + 1500;
            if (PSNPNMYPST <= 5414940) return ((PSNPNMYPST - 4739940) / 6750) + 1600;
            if (PSNPNMYPST <= 6134940) return ((PSNPNMYPST - 5414940) / 7200) + 1700;
            if (PSNPNMYPST <= 6899940) return ((PSNPNMYPST - 6134940) / 7650) + 1800;
            if (PSNPNMYPST <= 7709940) return ((PSNPNMYPST - 6899940) / 8100) + 1900;
            if (PSNPNMYPST <= 8564940) return ((PSNPNMYPST - 7709940) / 8550) + 2000;
            if (PSNPNMYPST <= 9464940) return ((PSNPNMYPST - 8564940) / 9000) + 2100;
            if (PSNPNMYPST <= 10409940) return ((PSNPNMYPST - 9464940) / 9450) + 2200;
            if (PSNPNMYPST <= 11399940) return ((PSNPNMYPST - 10409940) / 9900) + 2300;
            if (PSNPNMYPST <= 12434940) return ((PSNPNMYPST - 11399940) / 10350) + 2400;
            if (PSNPNMYPST <= 13514940) return ((PSNPNMYPST - 12434940) / 10800) + 2500;
            if (PSNPNMYPST <= 14639940) return ((PSNPNMYPST - 13514940) / 11250) + 2600;
            if (PSNPNMYPST <= 15809940) return ((PSNPNMYPST - 14639940) / 11700) + 2700;
            if (PSNPNMYPST <= 17024940) return ((PSNPNMYPST - 15809940) / 12150) + 2800;
            if (PSNPNMYPST <= 18284940) return ((PSNPNMYPST - 17024940) / 12600) + 2900;
            if (PSNPNMYPST <= 19589940) return ((PSNPNMYPST - 18284940) / 13050) + 3000;
            if (PSNPNMYPST <= 20939940) return ((PSNPNMYPST - 19589940) / 13950) + 3100;
            if (PSNPNMYPST <= 22334940) return ((PSNPNMYPST - 20939940) / 14400) + 3200;
            if (PSNPNMYPST <= 23774940) return ((PSNPNMYPST - 22334940) / 14850) + 3300;
            if (PSNPNMYPST <= 25259940) return ((PSNPNMYPST - 23774940) / 15300) + 3400;
            if (PSNPNMYPST <= 26789940) return ((PSNPNMYPST - 25259940) / 15750) + 3500;
            if (PSNPNMYPST <= 28364940) return ((PSNPNMYPST - 26789940) / 16200) + 3600;
            if (PSNPNMYPST <= 29984940) return ((PSNPNMYPST - 28364940) / 16650) + 3700;
            if (PSNPNMYPST <= 31649940) return ((PSNPNMYPST - 29984940) / 17100) + 3800;
            return ((PSNPNMYPST - 31649940) / 17550) + 3900;
        };

        let nivelauto = calcula_nivel(PSNPNMYPST);
        var nivelauto2 = Math.floor(nivelauto);

        var PDMNMYPST = Number(pdmmypst2.replace(",","").replace(".",""));
        var PDMNMYPST2 = PDMNMYPST.toLocaleString("de-DE");

        var PNACMYPST = Number(nacionalmypst2.replace(",","").replace(".",""));
        var PNACMYPST2 = PNACMYPST.toLocaleString("de-DE");

        var PDIFMYPST = Number(dificuldademypst2.replace(",","").replace(".",""));
        var PDIFMYPST2 = PDIFMYPST.toLocaleString("de-DE");

        var datahojegeral = new Date();
        var horahoje = datahojegeral.getHours();
        var meshoje = datahojegeral.getMonth();
        var meshojeajustado = meshoje + 1; 

        var datageracao = ("0" + datahojegeral.getDate()).slice(-2) + "/" + ("0" + meshojeajustado).slice(-2) + "/" + datahojegeral.getFullYear() + " - " + ("0" + horahoje).slice(-2) + ":" + ("0" + datahojegeral.getMinutes()).slice(-2);

        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenha Background
        if (tipocardmypst2) {
            ctx.drawImage(imgFundomypst2, 0, 0);
        }
        if (tipocardmypst22) {
            ctx.drawImage(imgFundomypst2preto, 0, 0);
        }

        // Função auxiliar para desenhar imagens
        function drawOverlayImages() {
             if (img_perfilmypst2) {
                const perfilImgmypst2 = new Image();
                perfilImgmypst2.src = img_perfilmypst2;
                perfilImgmypst2.onload = function() {
                    ctx.drawImage(perfilImgmypst2, 26, 71, 274, 274);
                    if (tipocardmypst22) ctx.drawImage(imgBordaperfMYPST2preto, 0, 0);
                    else ctx.drawImage(imgBordaperfMYPST2, 0, 0);
                }
                 if(perfilImgmypst2.complete) {
                    ctx.drawImage(perfilImgmypst2, 26, 71, 274, 274);
                    if (tipocardmypst22) ctx.drawImage(imgBordaperfMYPST2preto, 0, 0);
                    else ctx.drawImage(imgBordaperfMYPST2, 0, 0);
                 }
            }

            if (img_pplatmypst2) {
                const pplatImg1mypst2 = new Image();
                pplatImg1mypst2.src = img_pplatmypst2;
                pplatImg1mypst2.onload = function() {
                    ctx.drawImage(pplatImg1mypst2, 320, 374, 58, 58);
                }     
                 if(pplatImg1mypst2.complete) {
                     ctx.drawImage(pplatImg1mypst2, 320, 374, 58, 58);
                 }
            }
        }
        drawOverlayImages();
            
        // Textos (PSN ID e Frase)
        if (psn_id_mypst2) {
            ctx.font = '40px "Gemunu Libre"';
            ctx.textAlign = "center";
            ctx.fillStyle = '#000000';
            ctx.fillText(`${psn_id_mypst2}`, 159, 49, 263);                                        
        }
        
        if (frasemypst2) {
            ctx.translate(22, 206);
            ctx.rotate((-90 * Math.PI) / 180);
            ctx.font = '25px "Gemunu Libre"';
            ctx.textAlign = "center";
            ctx.fillStyle = tipocardmypst22 ? '#ffffff' : '#000000';
            ctx.fillText(`${frasemypst2}`, 0, 0, 263); 
            ctx.setTransform(1, 0, 0, 1, 0, 0);                                       
        }
            
        // FUNÇÃO CORRIGIDA: Troféus (Rotação -30 graus)
        // 
        function drawRotatedText(text, y) {
            if(!text) return;
            ctx.translate(360, y);
            ctx.rotate((-30 * Math.PI) / 180);
            ctx.font = '20px "Gemunu Libre"';
            ctx.textAlign = 'center';               
            ctx.fillStyle = '#000000';             
            ctx.fillText(`${text}`, 0, 0, 50);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        // Aplica apenas se houver valor no input original
        if(platinamypst2) drawRotatedText(platinamypst22, 103);
        if(ouromypst2) drawRotatedText(ouromypst22, 147);
        if(pratamypst2) drawRotatedText(pratamypst22, 189);
        if(bronzemypst2) drawRotatedText(bronzemypst22, 232);
        
        drawRotatedText(tTotalmypst22, 280); // Total é sempre desenhado
        
        if(psn100mypst2) drawRotatedText(psn100mypst22, 320);

        // Stats Normais
        ctx.font = '20px "Gemunu Libre"';
        ctx.fillStyle = '#000000';
        
        ctx.textAlign = 'right';
        ctx.fillText(`${PSNPNMYPST2}`, 148, 386, 70);
        if (pdmmypst2) ctx.fillText(`${PDMNMYPST2}`, 148, 409, 70);
        if (jogos_totalmypst2) ctx.fillText(`${jogos_totalmypst22}`, 148, 431, 70);

        ctx.textAlign = 'left';
        if (nacionalmypst2) ctx.fillText(`${PNACMYPST2}`, 260, 386, 45);
        if (dificuldademypst2) ctx.fillText(`${PDIFMYPST2}`, 260, 409, 45);
        ctx.fillText(`${perc_jogos3MYPST2}%`, 260, 430, 45);

        // Rodapé (Badges)
        ctx.textAlign = 'center';
        const yBadges = 521;
        if (mensalmypst2) ctx.fillText(`${mensalmypst2}`, 30, yBadges, 39);
        if (semanalmypst2) ctx.fillText(`${semanalmypst2}`, 85, yBadges, 39);
        if (guiasmypst2) ctx.fillText(`${guiasmypst2}`, 140, yBadges, 39);
        if (pioneiromypst2) ctx.fillText(`${pioneiromypst2}`, 195, yBadges, 39);
        if (velocistamypst2) ctx.fillText(`${velocistamypst2}`, 249, yBadges, 39);
        if (tartarugamypst2) ctx.fillText(`${tartarugamypst2}`, 306, yBadges, 39);
        if (badgesmypst2) ctx.fillText(`${badgesmypst2}`, 361, yBadges, 39);
         
        // Nível (Imagem)
        let imgNivel = null;
        if (nivelauto2 <= 99) imgNivel = imglvb1;
        else if (nivelauto2 <= 199) imgNivel = imglvb2;
        else if (nivelauto2 <= 299) imgNivel = imglvb3;
        else if (nivelauto2 <= 399) imgNivel = imglvp1;
        else if (nivelauto2 <= 499) imgNivel = imglvp2;
        else if (nivelauto2 <= 599) imgNivel = imglvp3;
        else if (nivelauto2 <= 699) imgNivel = imglvo1;
        else if (nivelauto2 <= 799) imgNivel = imglvo2;
        else if (nivelauto2 <= 998) imgNivel = imglvo3;
        else imgNivel = imglvpl;

        if (imgNivel) {
             ctx.drawImage(imgNivel, 315, 7, 65, 65);   
        }

        // Data de Geração
        ctx.font = '20px "Gemunu Libre"';
        ctx.textAlign = 'left';
        ctx.fillStyle = tipocardmypst22 ? '#ffffff' : '#000000';
        ctx.fillText(`${datageracao}`, 25, 361);
    }
});

function baixarCard() {
    const canvas = document.getElementById('cartaoCanvas');
    const psnId = document.getElementById('psn_idmypst2').value || 'jogador';
    const imageURL = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement('a');
    link.download = `card_mypst2_${psnId}.png`;
    link.href = imageURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}