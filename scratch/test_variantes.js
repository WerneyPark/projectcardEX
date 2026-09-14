const assert = require('assert');
const fs = require('fs');

// Carregar arquivos
eval(fs.readFileSync('content/config/assets.js', 'utf8'));
eval(fs.readFileSync('content/config/mypstSpecialUsers.js', 'utf8'));
eval(fs.readFileSync('content/utils/levelCalculator.js', 'utf8'));
eval(fs.readFileSync('content/utils/formatters.js', 'utf8'));
eval(fs.readFileSync('content/core/BaseRenderer.js', 'utf8'));
eval(fs.readFileSync('content/renderers/mypstDefaultRenderer.js', 'utf8'));

console.log('--- TESTANDO VARIANTES MYPST ---');

// 1. MamyBR
const mamyVariants = getMypstUserVariants('MamyBR');
assert.strictEqual(mamyVariants.length, 3, 'MamyBR deve ter 3 variantes');
assert.strictEqual(mamyVariants[0].id, 'redatora');
assert.strictEqual(mamyVariants[1].id, 'moderadora');
assert.strictEqual(mamyVariants[2].id, 'noticiarista');
console.log('✓ getMypstUserVariants(MamyBR) retornou 3 variantes:', mamyVariants.map(v => v.label).join(', '));

// 2. EduNews
const eduVariants = getMypstUserVariants('EduNews');
assert.strictEqual(eduVariants.length, 3, 'EduNews deve ter 3 variantes');
assert.strictEqual(eduVariants[0].id, 'platina');
assert.strictEqual(eduVariants[1].id, 'noticiarista');
assert.strictEqual(eduVariants[2].id, 'moderador');
console.log('✓ getMypstUserVariants(EduNews) retornou 3 variantes:', eduVariants.map(v => v.label).join(', '));

// 3. FBanin
const baninVariants = getMypstUserVariants('FBanin');
assert.strictEqual(baninVariants.length, 2, 'FBanin deve ter 2 variantes');
assert.strictEqual(baninVariants[0].id, 'exclusiva');
assert.strictEqual(baninVariants[1].id, 'moderador');
console.log('✓ getMypstUserVariants(FBanin) retornou 2 variantes:', baninVariants.map(v => v.label).join(', '));

// 4. MGZoio
const zoioVariants = getMypstUserVariants('MGZoio');
assert.strictEqual(zoioVariants.length, 3, 'MGZoio deve ter 3 variantes');
assert.strictEqual(zoioVariants[0].id, 'redator');
assert.strictEqual(zoioVariants[1].id, 'denunciante');
assert.strictEqual(zoioVariants[2].id, 'moderador');
console.log('✓ getMypstUserVariants(MGZoio) retornou 3 variantes:', zoioVariants.map(v => v.label).join(', '));

// 5. Usuário comum
const comumVariants = getMypstUserVariants('JogadorComum');
assert.strictEqual(comumVariants.length, 0, 'Jogador comum não deve ter variantes');
console.log('✓ getMypstUserVariants(JogadorComum) retornou lista vazia');

// 6. Teste de resolução de imagens por variante
const dummyImages = {
    basered: 'IMG_REDATOR_NORMAL',
    baseredb: 'IMG_REDATOR_PERFIL',
    basemod: 'IMG_MODERADOR_NORMAL',
    basemodb: 'IMG_MODERADOR_PERFIL',
    basenot: 'IMG_NOTICIA_NORMAL',
    basenotb: 'IMG_NOTICIA_PERFIL',
    baseplatina: 'IMG_PLATINA_NORMAL',
    basebanin: 'IMG_BANIN_NORMAL',
    basebaninb: 'IMG_BANIN_PERFIL',
    baseden: 'IMG_DENUNCIA_NORMAL',
    basedenb: 'IMG_DENUNCIA_PERFIL',
    imgFundo: 'IMG_DEFAULT_FUNDO',
    imgTperf: 'IMG_DEFAULT_PERFIL'
};

// MamyBR default -> Redatora
const mamyDefault = resolveMypstUserBases('MamyBR', dummyImages, dummyImages.imgFundo, dummyImages.imgTperf);
assert.strictEqual(mamyDefault.normal, 'IMG_REDATOR_NORMAL');
assert.strictEqual(mamyDefault.perfil, 'IMG_REDATOR_PERFIL');
console.log('✓ MamyBR default selecionou Redatora corretamente');

// MamyBR moderadora
const mamyMod = resolveMypstUserBases('MamyBR', dummyImages, dummyImages.imgFundo, dummyImages.imgTperf, 'moderadora');
assert.strictEqual(mamyMod.normal, 'IMG_MODERADOR_NORMAL');
assert.strictEqual(mamyMod.perfil, 'IMG_MODERADOR_PERFIL');
console.log('✓ MamyBR variante "moderadora" selecionou basemod corretamente');

// MamyBR noticiarista
const mamyNot = resolveMypstUserBases('MamyBR', dummyImages, dummyImages.imgFundo, dummyImages.imgTperf, 'noticiarista');
assert.strictEqual(mamyNot.normal, 'IMG_NOTICIA_NORMAL');
assert.strictEqual(mamyNot.perfil, 'IMG_NOTICIA_PERFIL');
console.log('✓ MamyBR variante "noticiarista" selecionou basenot corretamente');

// 7. MypstDefaultRenderer delegando getAvailableVariants
const renderer = new MypstDefaultRenderer();
assert.strictEqual(typeof renderer.getAvailableVariants, 'function');
const rendererVariants = renderer.getAvailableVariants('MamyBR');
assert.strictEqual(rendererVariants.length, 3);
console.log('✓ MypstDefaultRenderer.getAvailableVariants funcionou corretamente');

console.log('\n=============================================');
console.log('🎉 TODOS OS TESTES DE VARIANTES PASSARAM! 🎉');
console.log('=============================================');
