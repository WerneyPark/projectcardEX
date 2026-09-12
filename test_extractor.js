const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('scratch_perfil.html', 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

function extractData() {
    const getTextFromSibling = (label) => {
        const spans = Array.from(document.querySelectorAll('span'));
        const targetSpan = spans.find(span => span.innerText && span.innerText.includes(label) || span.textContent && span.textContent.includes(label));
        if (targetSpan && targetSpan.nextElementSibling) {
            return targetSpan.nextElementSibling.innerText || targetSpan.nextElementSibling.textContent;
        }
        return '0';
    };

    const getImgSrcByTitle = (title) => {
        const div = document.querySelector(`div[title="${title}"]`);
        if (div) {
            const span = div.querySelector('span');
            if (span) return span.innerText || span.textContent;
        }
        return '0';
    };

    // Extrair ID da PSN
    let psnId = '';
    const titleObj = document.querySelector('title');
    if (titleObj) {
        psnId = titleObj.textContent.replace("Perfil de ", "").replace(" | PSX Trophies", "").trim();
    }

    // Avatar
    let avatarUrl = '';
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
        avatarUrl = ogImage.content;
    }

    // Level
    let level = '0';
    const levelSpans = Array.from(document.querySelectorAll('span'));
    const levelSpan = levelSpans.find(span => span.textContent && span.textContent.includes('Level'));
    if (levelSpan) {
        const match = levelSpan.textContent.match(/Level\s*(\d+)/);
        if (match) {
            level = match[1];
        }
    }

    // Trophies
    let plat = '0', gold = '0', silver = '0', bronze = '0';
    const trophiesSection = document.querySelector('section[class*="trophies"]');
    if (trophiesSection) {
        const trophySpans = trophiesSection.querySelectorAll('div > span');
        if (trophySpans.length >= 4) {
            plat = trophySpans[0].textContent;
            gold = trophySpans[1].textContent;
            silver = trophySpans[2].textContent;
            bronze = trophySpans[3].textContent;
        }
    }

    return {
        psnId: psnId,
        level: level,
        plat: plat,
        gold: gold,
        silver: silver,
        bronze: bronze,
        rankingGeral: getTextFromSibling('Geral'),
        rankingRegional: getTextFromSibling('Regional'),
        rankingEstadual: getTextFromSibling('Estadual'),
        pontosPH: getTextFromSibling('Pontos PH'),
        pontosPSN: getTextFromSibling('Pontos PSN'),
        completudeGeral: getTextFromSibling('Completude Geral'),
        completudePlatina: getTextFromSibling('Completude Platina'),
        avatar: avatarUrl,
        velocista: getImgSrcByTitle('Velocista'),
        pioneiro: getImgSrcByTitle('Pioneiro'),
        dicas: getImgSrcByTitle('Dicas'),
        likes: getImgSrcByTitle('Likes')
    };
}

console.log(JSON.stringify(extractData(), null, 2));
