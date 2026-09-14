/**
 * canvasUtils.js — Utilitários de desenho em Canvas 2D para renderização de cartões.
 */

class CanvasUtils {
    /**
     * Desenha um texto rotacionado no canvas, salvando e restaurando o contexto com segurança.
     * @param {CanvasRenderingContext2D} ctx - Contexto 2D do Canvas.
     * @param {Object} options
     * @param {string|number} options.text - Texto a ser desenhado.
     * @param {number} options.x - Posição X de ancoragem do texto.
     * @param {number} options.y - Posição Y de ancoragem do texto.
     * @param {number} [options.angleDeg=0] - Ângulo de rotação em graus (ex: -45, -90, -30).
     * @param {string} [options.font] - Fonte CSS (ex: '20px "Orbitron", sans-serif').
     * @param {string} [options.fillStyle='#ffffff'] - Cor do texto.
     * @param {CanvasTextAlign} [options.textAlign='center'] - Alinhamento do texto ('center', 'left', 'right').
     * @param {number} [options.maxWidth] - Largura máxima opcional para compressão horizontal.
     */
    static drawRotatedText(ctx, { text, x, y, angleDeg = 0, font, fillStyle = '#ffffff', textAlign = 'center', maxWidth } = {}) {
        if (text === undefined || text === null || text === '') return;
        
        ctx.save();
        ctx.translate(x, y);
        if (angleDeg !== 0) {
            ctx.rotate((angleDeg * Math.PI) / 180);
        }
        if (font) ctx.font = font;
        if (fillStyle) ctx.fillStyle = fillStyle;
        if (textAlign) ctx.textAlign = textAlign;

        if (maxWidth) {
            ctx.fillText(String(text), 0, 0, maxWidth);
        } else {
            ctx.fillText(String(text), 0, 0);
        }
        ctx.restore();
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.CanvasUtils = CanvasUtils;
}
if (typeof window !== 'undefined') {
    window.CanvasUtils = CanvasUtils;
}
