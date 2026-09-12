document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('cartaoCanvas');
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = "source-over";
    
    const formElements = document.querySelectorAll('#formularioJogador2 input');
    
    // Carregamento de imagens
    const imgTperf = new Image(); imgTperf.src = "img/ALFA/tperf.png";
    const imgTplat = new Image(); imgTplat.src = "img/ALFA/tplat.png"
    const imgFundo = new Image(); imgFundo.src = "img/ALFA/basealfa3.png";
    const cdprojectcard = new Image(); cdprojectcard.src = "img/ALFA/projectcard.png";

    // Bases customizadas
    const basebanin = new Image(); basebanin.src = "img/ALFA/fundobanin.png";
    const basebaninb = new Image(); basebaninb.src = "img/ALFA/fundobaninb.png";
    const baseplatina = new Image(); baseplatina.src = "img/ALFA/baseplatina.png";
    const baseanalista = new Image(); baseanalista.src = "img/ALFA/baseanalista.png";
    const baseanalistab = new Image(); baseanalistab.src = "img/ALFA/baseanalistab.png";
    const basered = new Image(); basered.src = "img/ALFA/basered.png";
    const baseredb = new Image(); baseredb.src = "img/ALFA/baseredb.png";
    const basewp = new Image(); basewp.src = "img/ALFA/basewp.png";
    const basewpb = new Image(); basewpb.src = "img/ALFA/basewpb.png";
    const basebad = new Image(); basebad.src = "img/ALFA/basebad.png";
    const basebadb = new Image(); basebadb.src = "img/ALFA/basebadb.png";
    const baseden = new Image(); baseden.src = "img/ALFA/baseden.png";
    const basedenb = new Image(); basedenb.src = "img/ALFA/basedenb.png";
    const basemod = new Image(); basemod.src = "img/ALFA/basemod.png";
    const basemodb = new Image(); basemodb.src = "img/ALFA/basemodb.png";
    const basenot = new Image(); basenot.src = "img/ALFA/basenot.png";
    const basenotb = new Image(); basenotb.src = "img/ALFA/basenotb.png";

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

    var datahojegeral = new Date();
    var horahoje = datahojegeral.getHours();
    var meshoje = datahojegeral.getMonth();
    var meshojeajustado = meshoje + 1; 

    var datageracao = ("0" + datahojegeral.getDate()).slice(-2) + "/" + ("0" + meshojeajustado).slice(-2) + "/" + datahojegeral.getFullYear() + " - " + ("0" + horahoje).slice(-2) + ":" + ("0" + datahojegeral.getMinutes()).slice(-2);

    cdprojectcard.onload = function() {
        ctx.drawImage(cdprojectcard, 0, 0)
    };
        
    formElements.forEach(element => {
        element.addEventListener('input', desenharCartao);
        ctx.globalCompositeOperation = "source-over";
    });
     
    function desenharCartao() { 
        // Dados do formulário
        const psn_id = document.getElementById('psn_idmypst').value;
        const frase = document.getElementById('frase_frmypst').value;
        const platina = document.getElementById('platina_plmypst').value;
        const ouro = document.getElementById('ouro_oumypst').value;
        const prata = document.getElementById('prata_prmypst').value;
        const bronze = document.getElementById('bronze_brmypst').value;
        const mensal = document.getElementById('mensal_mypst').value;
        const semanal = document.getElementById('semanal_mypst').value;
        const guias = document.getElementById('guias_mypst').value;
        const pioneiro = document.getElementById('pioneiro_mypst').value;
        const velocista = document.getElementById('velocista_mypst').value;
        const tartaruga = document.getElementById('tartaruga_mypst').value;
        const jogos_total = document.getElementById('jogos_totalmypst').value;
        const jogos_completos = document.getElementById('jogos_completosmypst').value;
        const img_perfil = document.getElementById('img_perfilmypst').value;
        const img_pplat = document.getElementById('img_pplatmypst').value;
        
        var perc_jogos1 = jogos_completos / jogos_total || 0;
        var perc_jogos2 = perc_jogos1 * 100;
        var perc_jogos3 = perc_jogos2.toFixed(2);
        
        var PNMYPST = Number(platina.replace(",","").replace(".",""));
        var ONMYPST = Number(ouro.replace(",","").replace(".",""));
        var PtNMYPST = Number(prata.replace(",","").replace(".",""));
        var BNMYPST = Number(bronze.replace(",","").replace(".",""));
        var tTotalMYPST = PNMYPST + ONMYPST + PtNMYPST + BNMYPST;
       
        var platina2 = PNMYPST.toLocaleString("de-DE");
        var ouro2 = ONMYPST.toLocaleString("de-DE");
        var prata2 = PtNMYPST.toLocaleString("de-DE");
        var bronze2 = BNMYPST.toLocaleString("de-DE");

        var PSNPNMYPST = (PNMYPST * 300) + (ONMYPST * 90) + (PtNMYPST * 30) + (BNMYPST * 15);

        function calcula_nivel (PSNPNMYPST) {
            // Lógica de níveis resumida para poupar espaço visual (mantendo a mesma lógica matemática)
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

        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenha Fundo Padrão
        ctx.drawImage(imgFundo, 0, 0);
    
        if (img_perfil) {
            const perfilImg = new Image();
            perfilImg.src = img_perfil;
            // Para garantir que desenha apenas após carregar, idealmente seria async, mas para este fluxo:
            // O navegador provavelmente fará cache após a primeira digitação.
            perfilImg.onload = function() {
                ctx.drawImage(perfilImg, 91, 91, 300, 300);
                // Redesenha o overlay Tperf por cima da imagem de perfil
                ctx.drawImage(imgTperf, 0, 0);
                redesenharBasesEspeciais(psn_id); // Re-aplica bases se tiver ID especial
                desenharTextosFinais(); // Garante que o texto fique por cima
            }
             // Caso a imagem já esteja em cache e não dispare onload:
             if(perfilImg.complete) {
                 ctx.drawImage(perfilImg, 91, 91, 300, 300);
                 ctx.drawImage(imgTperf, 0, 0);
             }
        }

        // Função auxiliar para organizar as bases especiais (reduz duplicidade de código)
        function redesenharBasesEspeciais(id) {
            const mapBases = {
                "WerneyPark": {normal: basewp, perfil: basewpb},
                "FBanin": {normal: basebanin, perfil: basebaninb},
                "LoiroCroft": {normal: baseanalista, perfil: baseanalistab},
                "LucasIIGD": {normal: baseanalista, perfil: baseanalistab},
                "MGZoio": {normal: basered, perfil: baseredb},
                "fabriciols": {normal: basered, perfil: baseredb},
                "Toushi-san": {normal: basered, perfil: baseredb},
                "MamyBR": {normal: basered, perfil: baseredb},
                "ZakJapa": {normal: basered, perfil: baseredb},
                "GIBATSAN": {normal: basered, perfil: baseredb},
                "Wesp_can": {normal: baseanalista, perfil: baseanalistab},
                "fabio_lokura": {normal: baseanalista, perfil: baseanalistab},
                "Kabanas22": {normal: baseanalista, perfil: baseanalistab},
                "InsaneMarcel": {normal: baseanalista, perfil: baseanalistab},
                "AnzaiRossi": {normal: baseanalista, perfil: baseanalistab},
                "DesmaBR": {normal: baseanalista, perfil: baseanalistab},
                "LeoCosAffo": {normal: baseanalista, perfil: baseanalistab},
                "nabinha": {normal: basebad, perfil: basebadb},
                "zTREVOLz": {normal: basebad, perfil: basebadb},
                "FreddieGellar": {normal: basebad, perfil: basebadb},
                "STARBLAC": {normal: basenot, perfil: basenotb},
                "blackgndrf": {normal: basenot, perfil: basenotb},
                "Tio_Maluco": {normal: basenot, perfil: basenotb},
                " EduNews": {normal: basenot, perfil: basenotb},
                " EduNews ": {normal: basemod, perfil: basemodb},
                " MamyBR": {normal: basemod, perfil: basemodb},
                " MamyBR ": {normal: basenot, perfil: basenotb},
                "gabriellobo1101": {normal: basemod, perfil: basemodb},
                " FBanin": {normal: basemod, perfil: basemodb},
                "MorpheuVRJ": {normal: basemod, perfil: basemodb},
                "Tognassolo": {normal: baseden, perfil: basedenb},
                "LucasDiasC": {normal: baseden, perfil: basedenb},
                "lionflu": {normal: baseden, perfil: basedenb},
                " MGZoio": {normal: baseden, perfil: basedenb},
                " MGZoio ": {normal: basemod, perfil: basemodb}
            };

            // IDs que usam base Platina apenas (sem perfil especial definido no original)
            const idsPlatina = ["EduNews", "SABBATH1979", "laddyvalentine", "bklautau", "Marcel_pfs1", "DaniloSouza84", "Hidra13", "SobrinhaYstranha", "Ikaros-NEX", "dfop02"];

            // Aplica a lógica
            if (mapBases[id]) {
                if (img_perfil) ctx.drawImage(mapBases[id].perfil, 0, (id === "WerneyPark" ? 0 : (["MGZoio", "LucasDiasC", "fabriciols", "Toushi-san", "MamyBR", "ZakJapa", "GIBATSAN", "Tognassolo", "nabinha", "zTREVOLz", "FreddieGellar", "lionflu"].includes(id) ? -1 : 0)));
                ctx.drawImage(mapBases[id].normal, 0, 0);
            } else if (idsPlatina.includes(id)) {
                ctx.drawImage(baseplatina, 0, 0);
            }
        }
        
        redesenharBasesEspeciais(psn_id);

        function desenharTextosFinais() {
            if (psn_id) {
                ctx.font = '55px "Gemunu Libre"';
                ctx.textAlign = "center";
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${psn_id}`, 180, 57, 316);
            }
            if (frase) {
                ctx.font = '20px "Gemunu Libre"';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${frase}`, 210, 472, 381);
            }
            if (platina) {
                ctx.font = '20px "Gemunu Libre"';
                ctx.textAlign = 'right';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${platina2}`, 75, 160, 56);
            }
            if (ouro) {
                ctx.font = '20px "Gemunu Libre"';
                ctx.textAlign = 'right';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${ouro2}`, 75, 233, 56);
            }
            if (prata) {
                ctx.font = '20px "Gemunu Libre"';
                ctx.textAlign = 'right';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${prata2}`, 75, 310, 56);
            }
            if (bronze) {
                ctx.font = '20px "Gemunu Libre"';
                ctx.textAlign = 'right';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${bronze2}`, 75, 383, 56);
            }
            // Stats inferiores
            const statsY = 563;
            ctx.textAlign = 'center';
            if (mensal) ctx.fillText(`${mensal}`, 206, statsY, 34);
            if (semanal) ctx.fillText(`${semanal}`, 243, statsY, 34);
            if (guias) ctx.fillText(`${guias}`, 280, statsY, 34);
            if (pioneiro) ctx.fillText(`${pioneiro}`, 317, statsY, 34);
            if (velocista) ctx.fillText(`${velocista}`, 354, statsY, 34);
            if (tartaruga) ctx.fillText(`${tartaruga}`, 391, statsY, 34);

            // Badge Platina
            if (img_pplat) {
                const pplatImg = new Image();
                pplatImg.src = img_pplat;
                pplatImg.onload = function() {
                    ctx.drawImage(pplatImg, 102, 520, 70, 70);
                    ctx.drawImage(imgTplat, 0, 0); // Overlay platina
                }
                 if(pplatImg.complete) {
                    ctx.drawImage(pplatImg, 102, 520, 70, 70);
                    ctx.drawImage(imgTplat, 0, 0);
                 }
            }

            // Porcentagem
            ctx.font = '20px "Gemunu Libre"';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${perc_jogos3}%`, 254, 598, 93);

            // Data
            ctx.font = '20px "Gemunu Libre"';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${datageracao}`, 19, 410);

            // Nível (Badge)
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

            if(imgNivel) {
                // Ajuste fino das posições conforme original
                let nx = 356, ny = 16;
                if(nivelauto2 >= 600 && nivelauto2 <= 998) ny = 15;
                if(nivelauto2 >= 0 && nivelauto2 <= 299) ny = 17;
                if(nivelauto2 >= 800 && nivelauto2 <= 998) nx = 357;

                ctx.drawImage(imgNivel, nx, ny, 49, 49);
            }
        }
        
        desenharTextosFinais(); // Chamada inicial para desenhar sem imagens externas se elas demorarem
    }
});

// NOVA FUNÇÃO DE DOWNLOAD (Nativa)
function baixarCard() {
    const canvas = document.getElementById('cartaoCanvas');
    const psnId = document.getElementById('psn_idmypst').value || 'jogador';
    
    // Cria uma URL temporária com a imagem em resolução máxima (419x610)
    const imageURL = canvas.toDataURL("image/png", 1.0);
    
    // Cria elemento de link invisível para forçar download
    const link = document.createElement('a');
    link.download = `card_${psnId}.png`;
    link.href = imageURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}