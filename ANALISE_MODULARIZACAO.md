# Análise de Modularização e Arquitetura — projectcardEX

> **Data da Análise:** 14 de Setembro de 2026  
> **Status:** Concluído (Sem alterações em arquivos existentes do projeto)  
> **Objetivo:** Mapeamento completo de duplicações, oportunidades de desacoplamento, extração de funções compartilhadas (com foco especial no cálculo de nível) e proposta de estrutura limpa e manutenível para a extensão Manifest V3.

---

## 1. Visão Geral e Contexto da Arquitetura

O **projectcardEX** é uma extensão Chrome (Manifest V3) que injeta interfaces, extrai dados de perfis de jogadores e renderiza cartões visuais via Canvas 2D em três plataformas de troféus:
- **PSX Trophies** (`psxtrophies.com.br`)
- **MyPST** (`mypst.com.br`)
- **PSNProfiles** (`psnprofiles.com`)

### Como os scripts funcionam no Manifest V3
Os content scripts rodam no *Isolated World* de cada aba. Ao listar arquivos no array `"js"` do `manifest.json`, os scripts são executados sequencialmente no mesmo escopo de janela do content script.  
Portanto, **qualquer classe, objeto ou função utilitária declarada em um arquivo prévio fica disponível para todos os scripts subsequentes** daquele domínio, sem necessidade de bundlers externos como Webpack ou Vite.

---

## 2. O Caso Principal: Cálculo de Nível PSN (`calcula_nivel`)

### 2.1 Diagnóstico do Problema Atual
Em **todos os 6 renderers** do projeto:
1. `content/renderers/psxtDefaultRenderer.js` (linhas 92–133)
2. `content/renderers/pggRenderer.js` (linhas 137–178)
3. `content/renderers/psnlRenderer.js` (linhas 137–178)
4. `content/renderers/psnpDefaultRenderer.js` (linhas 115–156)
5. `content/renderers/mypstDefaultRenderer.js` (linhas 210–251)
6. `content/renderers/mypst2Renderer.js` (linhas 132–173)

Existe exatamente o mesmo bloco com **42 linhas de código idênticas**:
```javascript
function calcula_nivel(points) {
    if (points <= 5940) return (points / 60) + 1;
    if (points <= 14940) return ((points - 5940) / 90) + 100;
    // ... ~40 faixas de pontuação até 31.649.940 pontos ...
    return ((points - 31649940) / 17550) + 3900;
}
```

Além disso, **3 outras lógicas diretamente ligadas ao nível estão duplicadas** em todos os renderers:
1. **Cálculo de Pontos PSN oficiais**:
   ```javascript
   const PSNPoints = (plat * 300) + (gold * 90) + (silver * 30) + (bronze * 15);
   ```
2. **Classificação do Nível por Patente (Tiers de Bronze 1 a Platina)**:
   ```javascript
   if (nivelCalculado <= 99) { iconLevel = ...; text = "Bronze 1"; }
   else if (nivelCalculado <= 199) { iconLevel = ...; text = "Bronze 2"; }
   // ... até Ouro 3 e Platina ...
   ```
3. **Mapeamento das Imagens de Nível**: As URLs dos ícones (`imglvb1` até `imglvpl`) estão copiadas nos 6 arquivos.

### 2.2 Solução Proposta: Módulo `LevelCalculator.js`
Criar o arquivo `content/utils/levelCalculator.js`:

```javascript
/**
 * Utilitário para cálculos de nível e patentes oficiais da PlayStation Network.
 */
class LevelCalculator {
    /**
     * Calcula os pontos oficiais PSN com base na quantidade de troféus.
     */
    static calculatePoints(plat = 0, gold = 0, silver = 0, bronze = 0) {
        return (Number(plat) * 300) + (Number(gold) * 90) + (Number(silver) * 30) + (Number(bronze) * 15);
    }

    /**
     * Calcula o nível do jogador a partir do total de pontos PSN.
     */
    static calculateLevel(points) {
        if (!points || points <= 0) return 1;
        if (points <= 5940) return Math.floor((points / 60) + 1);
        if (points <= 14940) return Math.floor(((points - 5940) / 90) + 100);
        if (points <= 59940) return Math.floor(((points - 14940) / 450) + 200);
        if (points <= 149940) return Math.floor(((points - 59940) / 900) + 300);
        if (points <= 284940) return Math.floor(((points - 149940) / 1350) + 400);
        if (points <= 464940) return Math.floor(((points - 284940) / 1800) + 500);
        if (points <= 689940) return Math.floor(((points - 464940) / 2250) + 600);
        if (points <= 959940) return Math.floor(((points - 689940) / 2700) + 700);
        if (points <= 1274940) return Math.floor(((points - 959940) / 3150) + 800);
        if (points <= 1634940) return Math.floor(((points - 1274940) / 3600) + 900);
        if (points <= 2039940) return Math.floor(((points - 1634940) / 4050) + 1000);
        if (points <= 2489940) return Math.floor(((points - 2039940) / 4500) + 1100);
        if (points <= 2984940) return Math.floor(((points - 2489940) / 4950) + 1200);
        if (points <= 3524940) return Math.floor(((points - 2984940) / 5400) + 1300);
        if (points <= 4109940) return Math.floor(((points - 3524940) / 5850) + 1400);
        if (points <= 4739940) return Math.floor(((points - 4109940) / 6300) + 1500);
        if (points <= 5414940) return Math.floor(((points - 4739940) / 6750) + 1600);
        if (points <= 6134940) return Math.floor(((points - 5414940) / 7200) + 1700);
        if (points <= 6899940) return Math.floor(((points - 6134940) / 7650) + 1800);
        if (points <= 7709940) return Math.floor(((points - 6899940) / 8100) + 1900);
        if (points <= 8564940) return Math.floor(((points - 7709940) / 8550) + 2000);
        if (points <= 9464940) return Math.floor(((points - 8564940) / 9000) + 2100);
        if (points <= 10409940) return Math.floor(((points - 9464940) / 9450) + 2200);
        if (points <= 11399940) return Math.floor(((points - 10409940) / 9900) + 2300);
        if (points <= 12434940) return Math.floor(((points - 11399940) / 10350) + 2400);
        if (points <= 13514940) return Math.floor(((points - 12434940) / 10800) + 2500);
        if (points <= 14639940) return Math.floor(((points - 13514940) / 11250) + 2600);
        if (points <= 15809940) return Math.floor(((points - 14639940) / 11700) + 2700);
        if (points <= 17024940) return Math.floor(((points - 15809940) / 12150) + 2800);
        if (points <= 18284940) return Math.floor(((points - 17024940) / 12600) + 2900);
        if (points <= 19589940) return Math.floor(((points - 18284940) / 13050) + 3000);
        if (points <= 20939940) return Math.floor(((points - 19589940) / 13950) + 3100);
        if (points <= 22334940) return Math.floor(((points - 20939940) / 14400) + 3200);
        if (points <= 23774940) return Math.floor(((points - 22334940) / 14850) + 3300);
        if (points <= 25259940) return Math.floor(((points - 23774940) / 15300) + 3400);
        if (points <= 26789940) return Math.floor(((points - 25259940) / 15750) + 3500);
        if (points <= 28364940) return Math.floor(((points - 26789940) / 16200) + 3600);
        if (points <= 29984940) return Math.floor(((points - 28364940) / 16650) + 3700);
        if (points <= 31649940) return Math.floor(((points - 29984940) / 17100) + 3800);
        return Math.floor(((points - 31649940) / 17550) + 3900);
    }

    /**
     * Retorna os metadados da patente (tier, nome amigável e chave do ícone).
     */
    static getTierInfo(level) {
        const lvl = Number(level) || 1;
        if (lvl <= 99)  return { tier: 'bronze', subTier: 1, name: "Bronze 1", iconKey: "imglvb1", borderKey: "imgbb" };
        if (lvl <= 199) return { tier: 'bronze', subTier: 2, name: "Bronze 2", iconKey: "imglvb2", borderKey: "imgbb" };
        if (lvl <= 299) return { tier: 'bronze', subTier: 3, name: "Bronze 3", iconKey: "imglvb3", borderKey: "imgbb" };
        if (lvl <= 399) return { tier: 'silver', subTier: 1, name: "Prata 1",  iconKey: "imglvp1", borderKey: "imgbp" };
        if (lvl <= 499) return { tier: 'silver', subTier: 2, name: "Prata 2",  iconKey: "imglvp2", borderKey: "imgbp" };
        if (lvl <= 599) return { tier: 'silver', subTier: 3, name: "Prata 3",  iconKey: "imglvp3", borderKey: "imgbp" };
        if (lvl <= 699) return { tier: 'gold',   subTier: 1, name: "Ouro 1",   iconKey: "imglvo1", borderKey: "imgbo" };
        if (lvl <= 799) return { tier: 'gold',   subTier: 2, name: "Ouro 2",   iconKey: "imglvo2", borderKey: "imgbo" };
        if (lvl <= 998) return { tier: 'gold',   subTier: 3, name: "Ouro 3",   iconKey: "imglvo3", borderKey: "imgbo" };
        return { tier: 'platinum', subTier: 1, name: "Platina", iconKey: "imglvpl", borderKey: "imgbpl" };
    }
}
```

### 2.3 Como os Renderers passariam a consumir:
Em qualquer renderer:
```javascript
// Antes: 60+ linhas manuais de cálculo e seleção de if/else
// Depois:
const psnPoints = LevelCalculator.calculatePoints(plat, gold, silver, bronze);
const nivel = Number(data.level) || LevelCalculator.calculateLevel(psnPoints);
const tierInfo = LevelCalculator.getTierInfo(nivel);

// tierInfo.name -> "Ouro 2"
// tierInfo.iconKey -> "imglvo2"
// tierInfo.borderKey -> "imgbo"
```
**Impacto:** Eliminação imediata de ~300 linhas de código duplicado!

---

## 3. Lista Completa de Oportunidades de Modularização

Além do cálculo de nível, a análise minuciosa de todo o repositório identificou **9 frentes de melhoria**:

### Frente 1: Módulo Central de Constantes e Assets (`content/config/assets.js`)
**Diagnóstico:**
As URLs das imagens de nível e bordas da PSN são repetidas como strings literais em 6 arquivos JS:
- `imglvb1` até `imglvpl` (10 URLs de ícones de nível)
- `imgbb`, `imgbp`, `imgbo`, `imgbpl` (4 URLs de bordas de nível)
- Ícones dos botões da extensão (`logo180.png`, `pggLogo64.png`, `icone_psnl.png`, `projectcard.png`)

**Proposta:**
Criar `content/config/assets.js` exportando / declarando:
```javascript
const PSN_LEVEL_ASSETS = {
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
    imgbpl:  "https://projectcard.com.br/img/lvspsn/bordanivelplatina.png",
    imgbo:   "https://projectcard.com.br/img/lvspsn/bordanivelouro.png",
    imgbp:   "https://projectcard.com.br/img/lvspsn/bordanivelprata.png",
    imgbb:   "https://projectcard.com.br/img/lvspsn/bordanivelbronze.png"
};
```
Cada renderer faz apenas:
```javascript
const imageSources = {
    ...PSN_LEVEL_ASSETS,
    imgFundo: "...",
    imgBorda: "..."
};
```

---

### Frente 2: Utilitário de Formatação (`content/utils/formatters.js`)
**Diagnóstico:**
1. **Formatação de Data do Cartão**:
   Presente de forma idêntica em 5 arquivos (`psxtDefaultRenderer`, `pggRenderer`, `psnlRenderer`, `mypstDefaultRenderer`, `mypst2Renderer`):
   ```javascript
   const hoje = new Date();
   const datageracao = ("0" + hoje.getDate()).slice(-2) + "/" + ("0" + (hoje.getMonth() + 1)).slice(-2) + "/" + hoje.getFullYear() + " - " + ("0" + hoje.getHours()).slice(-2) + ":" + ("0" + hoje.getMinutes()).slice(-2);
   ```
2. **Sanitização e Conversão de Números**:
   - `psxtDefaultRenderer`: `Number(data.plat.replace(",", "").replace(".", "")) || 0` *(só remove a 1ª ocorrência se for string com 2 pontos!)*
   - `mypstDefaultRenderer`: `Number((data.plat || '0').replace(/[.,]/g, ''))`
   - `psnpDefaultRenderer`: `Number((data.plat || '0').replace(/[.,]/g, '')) || 0`
   - `mypstExtractor`: `parseInt(val.replace(/[.,]/g, ''), 10)`

**Proposta:**
Criar `content/utils/formatters.js`:
```javascript
class Formatters {
    /** Formata números no padrão brasileiro/alemão (ex: 1.250) */
    static formatNumber(n) {
        return Number(n || 0).toLocaleString("de-DE");
    }

    /** Limpa pontuação de string e converte seguramente para Inteiro */
    static parseNumber(str) {
        if (typeof str === 'number') return str;
        if (!str) return 0;
        const cleaned = String(str).replace(/[^\d]/g, '');
        return parseInt(cleaned, 10) || 0;
    }

    /** Retorna a data e hora de geração no formato DD/MM/AAAA - HH:mm */
    static formatGenerationDate(date = new Date()) {
        const pad = (num) => String(num).padStart(2, '0');
        const dia = pad(date.getDate());
        const mes = pad(date.getMonth() + 1);
        const ano = date.getFullYear();
        const hora = pad(date.getHours());
        const min = pad(date.getMinutes());
        return `${dia}/${mes}/${ano} - ${hora}:${min}`;
    }
}
```

---

### Frente 3: Carregador de Imagens em Lote no `BaseRenderer.js`
**Diagnóstico:**
Em todos os renderers, existem de 12 a 20 linhas apenas para orquestrar o `Promise.all` de imagens remotas e montar o dicionário resultante:
```javascript
const keys = Object.keys(imageSources);
const promises = keys.map(key => super.loadRemoteImage(imageSources[key]));
if (data.avatar) promises.push(super.loadRemoteImage(data.avatar));
const loadedImgs = await Promise.all(promises);
const images = {};
keys.forEach((key, i) => images[key] = loadedImgs[i]);
```
Além disso, alguns renderers usam `.catch(() => null)` e outros deixam quebrar se uma imagem remota falhar.

**Proposta:**
Adicionar o método `loadImages(sourceMap, optionalUrls = {})` diretamente na classe `BaseRenderer`:
```javascript
class BaseRenderer {
    // ... loadRemoteImage existente ...

    /**
     * Carrega um mapa de imagens remotas em paralelo de forma resiliente.
     * @param {Object.<string, string>} sourceMap
     * @param {Object.<string, string>} [optionalMap]
     * @returns {Promise<Object.<string, HTMLImageElement|null>>}
     */
    async loadImages(sourceMap, optionalMap = {}) {
        const allEntries = [
            ...Object.entries(sourceMap),
            ...Object.entries(optionalMap).filter(([_, url]) => Boolean(url))
        ];

        const results = await Promise.all(
            allEntries.map(async ([key, url]) => {
                try {
                    const img = await this.loadRemoteImage(url);
                    return [key, img];
                } catch {
                    return [key, null];
                }
            })
        );

        return Object.fromEntries(results);
    }
}
```
**Redução:** Cada renderer substitui ~20 linhas de boilerplate por:
```javascript
const images = await this.loadImages(imageSources, { avatar: data.avatar });
```

---

### Frente 4: Utilitário de Renderização Canvas (`content/utils/canvasUtils.js`)
**Diagnóstico:**
Helpers locais idênticos para desenhar texto com rotação e alinhamento:
- `pggRenderer`: `drawRotatedStat(text, x, y)` e `drawRotatedTrofDia(text)` (rotação -45° e -90°)
- `psnlRenderer`: exatamente as mesmas funções `drawRotatedStat` e `drawRotatedTrofDia`
- `psnpDefaultRenderer`: `drawRotatedText(text, x, y, color)` (-45°)
- `mypst2Renderer`: `drawRotatedText(text, y)` (-30°)
- Rotação da data vertical a -90° em 4 renderers.

**Proposta:**
Criar `content/utils/canvasUtils.js`:
```javascript
class CanvasUtils {
    /**
     * Desenha texto rotacionado preservando o estado do canvas via translate/rotate/setTransform.
     */
    static drawRotatedText(ctx, { text, x, y, angleDeg = 0, font, fillStyle = '#ffffff', textAlign = 'center', maxWidth }) {
        if (text === undefined || text === null || text === '') return;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((angleDeg * Math.PI) / 180);
        if (font) ctx.font = font;
        if (fillStyle) ctx.fillStyle = fillStyle;
        if (textAlign) ctx.textAlign = textAlign;
        if (maxWidth) {
            ctx.fillText(text, 0, 0, maxWidth);
        } else {
            ctx.fillText(text, 0, 0);
        }
        ctx.restore();
    }
}
```

---

### Frente 5: Herança e Reuso Entre Renderers Irmãos (`pggRenderer` vs `psnlRenderer`)
**Diagnóstico:**
Comparando `content/renderers/pggRenderer.js` e `content/renderers/psnlRenderer.js`, eles possuem **95% do código exatamente idêntico**:
- Mesmas dimensões: `419 x 595`
- Mesmas posições de troféus, rankings, badges, total de jogos e completude
- Mesmas coordenadas dos 4 slots de platinas mais raras (`x: 325, y: 108/180/249/321`)
- Mesma posição da data (`x: 26, y: 350`) e do nível (`x: 361, y: 510`)

As únicas diferenças são:
- As URLs dos backgrounds (`basealfa5.png` vs `basepsnl.png`)
- As molduras do avatar e das platinas raras

**Proposta:**
Criar uma classe base compartilhada `content/renderers/base/VerticalBadgeCardRenderer.js` (ou permitir passar a configuração de temas).
Com isso, `PggRenderer` e `PsnlRenderer` passam a ter apenas **~25 linhas cada**, herdando a estrutura comum e passando apenas os assets específicos do tema!

---

### Frente 6: Extração dos Dados Hardcoded de Usuários VIP (`content/config/mypstSpecialUsers.js`)
**Diagnóstico:**
No arquivo `content/renderers/mypstDefaultRenderer.js` (linhas 73–120), há um dicionário gigante com mais de 45 linhas mapeando usernames de usuários específicos (administradores, moderadores, analistas como "WerneyPark", "FBanin", "LoiroCroft", "MGZoio", "EduNews", etc.) para bases e bordas customizadas (`basewp`, `basebanin`, `baseanalista`, `basered`, `basebad`, `baseplat`).

Isso polui a lógica do renderer com dados estáticos que mudam com frequência.

**Proposta:**
Extrair para `content/config/mypstSpecialUsers.js`:
```javascript
const MYPST_SPECIAL_USERS_CONFIG = {
    mapBases: {
        "WerneyPark": { normal: "basewp", perfil: "basewpb" },
        "FBanin": { normal: "basebanin", perfil: "basebaninb" },
        "LoiroCroft": { normal: "baseanalista", perfil: "baseanalistab" },
        // ...
    },
    platinumIds: [
        "EduNews", "SABBATH1979", "laddyvalentine", "bklautau", 
        "Marcel_pfs1", "DaniloSouza84", "Hidra13", "SobrinhaYstranha", 
        "Ikaros-NEX", "dfop02"
    ]
};
```

---

### Frente 7: Unificação dos Estilos CSS (`styles/common.css`)
**Diagnóstico:**
Ao comparar:
- `styles/psxt_styles.css` (203 linhas)
- `styles/mypst_styles.css` (183 linhas)
- `styles/psnp_styles.css` (183 linhas)

Nota-se que **mais de 70% das regras são estritamente idênticas**:
- O modal (`#psxt-card-modal`, `.psxt-modal-content`, `.projectcardex-modal-content`)
- O botão de fechar (`.psxt-modal-close`)
- O canvas e o botão de download (`#cartaoCanvas`, `#psxt-download-btn`)
- O spinner de carregamento (`.projectcardex-spinner`, `@keyframes projectcardex-spin`)
- O container dos botões da extensão (`.projectcardex-container`, `.projectcardex-icon`)
- A classe `.error-text`

As únicas diferenças são:
- As cores do gradiente da barra do card (`.projectcardex-modal`)
- As regras de dark mode e ocultação de anúncios específicas do PSXT

**Proposta:**
1. Criar `styles/common.css` contendo toda a estrutura base do modal, spinner, canvas, botões e animações.
2. Manter em `styles/psxt_styles.css`, `styles/mypst_styles.css` e `styles/psnp_styles.css` apenas as cores e temas específicos de cada plataforma.
3. No `manifest.json`, injetar ambos:
   ```json
   "css": ["styles/common.css", "styles/psxt_styles.css"]
   ```

---

### Frente 8: Utilitários DOM para os Extractors (`content/utils/domUtils.js`)
**Diagnóstico:**
Em `psnpExtractor.js` e `psxtExtractor.js`, repete-se o padrão de testar múltiplos seletores CSS para encontrar um valor e extrair apenas os dígitos:
```javascript
for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
        const val = (el.textContent || '').replace(/[^0-9]/g, '').trim();
        if (val) { ... }
    }
}
```
**Proposta:**
Criar `content/utils/domUtils.js` com métodos como:
- `DOMUtils.queryFirstText(selectors)`
- `DOMUtils.queryFirstNumber(selectors)`

---

### Frente 9: Limpeza de Arquivos Órfãos / Legados na Raiz
**Diagnóstico:**
- `scripts.js` (114 KB, 5.156 linhas): arquivo legado que contém código do Dreamweaver (`MM_swapImgRestore`), jQuery e funções antigas do MyPST. **Não está referenciado no `manifest.json` nem em nenhum outro arquivo**.
- `scratch_mypst_stats.html` (128 KB): snapshot HTML usado durante testes de scraping.
- `scratch/test_novos_campos.js`: script de teste em node/scratch.

**Proposta:**
- Mover arquivos de teste e snapshots para uma pasta dedicada `archive/` ou `tests/`, ou deletar o `scripts.js` legado se não for mais necessário, reduzindo em mais de 250 KB o tamanho do pacote da extensão.

---

## 4. Nova Estrutura de Pastas Proposta

```text
projectcardEX/
├── background.js
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── styles/
│   ├── common.css               <-- [NOVO] CSS compartilhado (modal, spinner, canvas, botões)
│   ├── psxt_styles.css          <-- Apenas temas e regras do PSXT
│   ├── mypst_styles.css         <-- Apenas temas do MyPST
│   └── psnp_styles.css          <-- Apenas temas do PSNProfiles
└── content/
    ├── core/
    │   ├── types.js
    │   ├── BaseExtractor.js
    │   ├── BaseRenderer.js      <-- [MELHORADO] com loadImages() genérico
    │   └── UIController.js
    ├── config/                  <-- [NOVO] Centralização de constantes e assets
    │   ├── assets.js            <-- URLs de ícones de nível, bordas e badges
    │   └── mypstSpecialUsers.js <-- Configuração de bases/skins VIP
    ├── utils/                   <-- [NOVO] Funções utilitárias puras
    │   ├── levelCalculator.js   <-- Cálculo oficial de nível PSN, pontos e tiers
    │   ├── formatters.js        <-- Formatação de números e data de geração
    │   ├── canvasUtils.js       <-- Desenho de texto rotacionado e helpers de canvas
    │   └── domUtils.js          <-- Helpers para seletores múltiplos de scraping
    ├── extractors/
    │   ├── psxtExtractor.js
    │   ├── mypstExtractor.js
    │   └── psnpExtractor.js
    ├── renderers/
    │   ├── base/
    │   │   └── BaseBadgeRenderer.js <-- [OPCIONAL] Base compartilhada PGG/PSNL
    │   ├── psxtDefaultRenderer.js
    │   ├── pggRenderer.js
    │   ├── psnlRenderer.js
    │   ├── mypstDefaultRenderer.js
    │   ├── mypst2Renderer.js
    │   └── psnpDefaultRenderer.js
    ├── psxt_script.js
    ├── mypst_script.js
    └── psnp_script.js
```

---

## 5. Exemplo de Atualização no `manifest.json`

Como os scripts são executados na ordem da lista, basta colocar os utilitários e configs antes dos renderers e scripts principais:

```json
{
  "matches": ["*://*.psxtrophies.com.br/*"],
  "js": [
    "content/config/assets.js",
    "content/utils/levelCalculator.js",
    "content/utils/formatters.js",
    "content/utils/canvasUtils.js",
    "content/utils/domUtils.js",
    "content/core/BaseExtractor.js",
    "content/core/BaseRenderer.js",
    "content/core/UIController.js",
    "content/extractors/psxtExtractor.js",
    "content/renderers/psxtDefaultRenderer.js",
    "content/renderers/pggRenderer.js",
    "content/renderers/psnlRenderer.js",
    "content/psxt_script.js"
  ],
  "css": [
    "styles/common.css",
    "styles/psxt_styles.css"
  ],
  "run_at": "document_end"
}
```

---

## 6. Comparativo de Impacto (Antes vs Depois)

| Métrica / Critério | Antes | Depois |
|---|---|---|
| **Definições de `calcula_nivel`** | 6 vezes (42 linhas cada = ~250 linhas) | **1 única vez** em `levelCalculator.js` |
| **Lógica de Tiers (Bronze, Prata, etc.)** | 6 vezes com ifs repetidos | **1 função** `LevelCalculator.getTierInfo()` |
| **Formatação de Data (`datageracao`)** | 5 vezes idêntica | **1 função** `Formatters.formatGenerationDate()` |
| **Carregamento de Imagens** | 15-20 linhas de boilerplate por renderer | **1 chamada** `this.loadImages()` no `BaseRenderer` |
| **Duplicação PGG vs PSNL** | 2 arquivos quase 100% idênticos (~400 linhas) | Herança compartilhada ou template unificado (~150 linhas) |
| **Duplicação de CSS** | ~400 linhas de CSS repetidas em 3 arquivos | **1 arquivo base** `common.css` + folhas de tema leves |
| **Facilidade de Manutenção** | Alterar uma fórmula ou asset exige editar 6 a 8 arquivos | Alterar em **1 único arquivo** reflete em todo o projeto |

---

## 7. Roteiro Sugerido para Implementação (Faseado)

Quando você decidir aplicar as mudanças, a ordem recomendada mais segura é:

1. **Fase 1 (Imediata — O que você pediu):**
   - Criar `content/utils/levelCalculator.js` e `content/config/assets.js`.
   - Adicioná-los no `manifest.json` nos 3 `content_scripts`.
   - Substituir as chamadas locais de `calcula_nivel` nos 6 renderers por `LevelCalculator.calculateLevel()`.

2. **Fase 2 (Formatadores e Imagens):**
   - Criar `content/utils/formatters.js`.
   - Adicionar o helper `loadImages()` em `BaseRenderer.js`.
   - Limpar a data e o carregamento de imagens nos renderers.

3. **Fase 3 (CSS e Canvas):**
   - Criar `styles/common.css` e enxugar os 3 CSS de plataforma.
   - Criar `content/utils/canvasUtils.js` para rotação de texto.

4. **Fase 4 (Arquitetural):**
   - Extrair `mypstSpecialUsers.js`.
   - Unificar a base do `pggRenderer` e `psnlRenderer`.
   - Limpar ou arquivar `scripts.js` da raiz.
