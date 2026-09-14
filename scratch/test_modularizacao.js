const assert = require('assert');
const fs = require('fs');

// Carregar arquivos
eval(fs.readFileSync('content/utils/levelCalculator.js', 'utf8'));
eval(fs.readFileSync('content/utils/formatters.js', 'utf8'));
eval(fs.readFileSync('content/utils/canvasUtils.js', 'utf8'));
eval(fs.readFileSync('content/config/assets.js', 'utf8'));
eval(fs.readFileSync('content/config/mypstSpecialUsers.js', 'utf8'));

console.log('--- TESTANDO LEVEL CALCULATOR ---');
function old_calcula_nivel(points) {
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

const testPoints = [0, 50, 1000, 5940, 5941, 14940, 14941, 59940, 149940, 284940, 464940, 689940, 959940, 1274940, 1634940, 2039940, 10409940, 31649940, 35000000];
for (const p of testPoints) {
    const expected = p === 0 ? 1 : Math.floor(old_calcula_nivel(p));
    const actual = LevelCalculator.calculateLevel(p);
    assert.strictEqual(actual, expected, `Falha no cálculo para ${p} pontos`);
}
console.log('✓ LevelCalculator.calculateLevel bateu 100% com a fórmula original!');

// Test points calculation
const pts = LevelCalculator.calculatePoints(10, 50, 100, 200);
// 10*300 (3000) + 50*90 (4500) + 100*30 (3000) + 200*15 (3000) = 13500
assert.strictEqual(pts, 13500);
console.log('✓ LevelCalculator.calculatePoints calculou corretamente (13.500 pts)!');

// Test Tier Info
assert.strictEqual(LevelCalculator.getTierInfo(50).name, 'Bronze 1');
assert.strictEqual(LevelCalculator.getTierInfo(150).name, 'Bronze 2');
assert.strictEqual(LevelCalculator.getTierInfo(250).name, 'Bronze 3');
assert.strictEqual(LevelCalculator.getTierInfo(350).name, 'Prata 1');
assert.strictEqual(LevelCalculator.getTierInfo(450).name, 'Prata 2');
assert.strictEqual(LevelCalculator.getTierInfo(550).name, 'Prata 3');
assert.strictEqual(LevelCalculator.getTierInfo(650).name, 'Ouro 1');
assert.strictEqual(LevelCalculator.getTierInfo(750).name, 'Ouro 2');
assert.strictEqual(LevelCalculator.getTierInfo(950).name, 'Ouro 3');
assert.strictEqual(LevelCalculator.getTierInfo(999).name, 'Platina');
assert.strictEqual(LevelCalculator.getTierInfo(999).iconKey, 'imglvpl');
assert.strictEqual(LevelCalculator.getTierInfo(999).borderKey, 'imgbpl');
console.log('✓ LevelCalculator.getTierInfo retornou todas as patentes corretamente!');

console.log('\n--- TESTANDO FORMATTERS ---');
assert.strictEqual(Formatters.parseNumber("1.250.000"), 1250000);
assert.strictEqual(Formatters.parseNumber(" 450 "), 450);
assert.strictEqual(Formatters.parseNumber(null), 0);
assert.strictEqual(Formatters.parseNumber(undefined), 0);
assert.strictEqual(Formatters.parseNumber(99), 99);
console.log('✓ Formatters.parseNumber validado!');

const genDate = Formatters.formatGenerationDate();
assert.match(genDate, /^\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}$/);
console.log(`✓ Formatters.formatGenerationDate gerou formato válido: "${genDate}"`);

console.log('\n--- TESTANDO CANVAS UTILS ---');
let drawCalls = [];
const mockCtx = {
    save: () => drawCalls.push('save'),
    translate: (x, y) => drawCalls.push(`translate(${x},${y})`),
    rotate: (r) => drawCalls.push(`rotate(${r.toFixed(2)})`),
    fillText: (txt, x, y, max) => drawCalls.push(`fillText(${txt},${x},${y})`),
    restore: () => drawCalls.push('restore')
};

CanvasUtils.drawRotatedText(mockCtx, {
    text: 'WerneyPark',
    x: 100,
    y: 200,
    angleDeg: -45
});
assert.deepStrictEqual(drawCalls, [
    'save',
    'translate(100,200)',
    'rotate(-0.79)',
    'fillText(WerneyPark,0,0)',
    'restore'
]);
console.log('✓ CanvasUtils.drawRotatedText executou a pilha correta de transformação!');

console.log('\n--- TESTANDO MYPST SPECIAL USERS ---');
const dummyImages = {
    basewp: 'IMG_WP_NORMAL',
    basewpb: 'IMG_WP_PERFIL',
    baseplatina: 'IMG_BASE_PLATINA',
    imgFundo: 'IMG_DEFAULT_FUNDO',
    imgTperf: 'IMG_DEFAULT_PERFIL'
};

const wpResult = resolveMypstUserBases('WerneyPark', dummyImages, dummyImages.imgFundo, dummyImages.imgTperf);
assert.strictEqual(wpResult.normal, 'IMG_WP_NORMAL');
assert.strictEqual(wpResult.perfil, 'IMG_WP_PERFIL');

const platResult = resolveMypstUserBases('EduNews', dummyImages, dummyImages.imgFundo, dummyImages.imgTperf);
assert.strictEqual(platResult.normal, 'IMG_BASE_PLATINA');

const normalResult = resolveMypstUserBases('JogadorComum', dummyImages, dummyImages.imgFundo, dummyImages.imgTperf);
assert.strictEqual(normalResult.normal, 'IMG_DEFAULT_FUNDO');
assert.strictEqual(normalResult.perfil, 'IMG_DEFAULT_PERFIL');
console.log('✓ resolveMypstUserBases resolveu corretamente usuários especiais, platinas e comuns!');

console.log('\n=============================================');
console.log('🎉 TODOS OS TESTES PASSARAM COM SUCESSO! 🎉');
console.log('=============================================');
