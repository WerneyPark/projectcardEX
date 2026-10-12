/**
 * antiCheatPrintView.js — Geração e Renderização do Relatório de Denúncia para Impressão.
 * 
 * Cria uma página de impressão limpa e estruturada, pronta para window.print(),
 * contendo o denunciado, o jogo, o NPWR, os troféus em destaque e a lista completa.
 */

class AntiCheatPrintView {
    /**
     * Formata um objeto Date ou timestamp para string legível (DD/MM/AAAA HH:mm:ss).
     * @param {Date|number|string} val
     * @returns {string}
     */
    static formatDate(val) {
        if (!val) return 'Não conquistado';
        const d = val instanceof Date ? val : new Date(val);
        if (isNaN(d.getTime())) return String(val);
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    /**
     * Gera o código HTML completo da página de impressão.
     * @param {Object} report
     * @returns {string}
     */
    static generatePrintHtml(report) {
        const generationDate = report.createdAt || new Date().toLocaleString('pt-BR');
        const selectedTrophies = report.selectedTrophies || [];
        const allTrophies = report.allTrophies || [];

        // Ordena cronologicamente os troféus em destaque (do primeiro ao último conquistado)
        const sortedSelected = [...selectedTrophies].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        // Monta as linhas da tabela de troféus em destaque (sem a coluna '#' de ordem)
        const highlightedRowsHtml = sortedSelected.map(t => `
            <tr class="highlight-row">
                <td>
                    <div style="font-weight: bold; font-size: 14px; color: #d32f2f;">${t.name || 'Sem nome'}</div>
                    <div style="font-size: 11px; color: #555;">${t.description || ''}</div>
                </td>
                <td style="text-align: center; width: 100px;">
                    <span class="type-badge type-${(t.type || 'trophy').toLowerCase()}">${t.type || 'Troféu'}</span>
                </td>
                <td style="text-align: right; width: 180px; font-weight: bold; font-family: monospace;">
                    ${t.earnedDate || AntiCheatPrintView.formatDate(t.timestamp)}
                </td>
            </tr>
        `).join('');

        // Monta as linhas da tabela completa de troféus
        const allRowsHtml = allTrophies.map((t, idx) => {
            const isSelected = selectedTrophies.some(st => st.name === t.name);
            const statusClass = t.isEarned ? 'status-earned' : 'status-locked';
            const rowClass = isSelected ? 'table-selected-row' : (idx % 2 === 0 ? 'even-row' : 'odd-row');
            const dateStr = t.isEarned ? (t.earnedDate || AntiCheatPrintView.formatDate(t.timestamp)) : '---';

            return `
                <tr class="${rowClass}">
                    <td style="text-align: center; width: 35px; color: #777;">${idx + 1}</td>
                    <td style="text-align: center; width: 50px;">
                        <span class="${statusClass}">${t.isEarned ? '✔' : '🔒'}</span>
                    </td>
                    <td>
                        <strong style="${isSelected ? 'color: #d32f2f;' : ''}">${t.name || 'Sem título'}</strong>
                        ${isSelected ? '<span class="denounced-tag">DENUNCIADO</span>' : ''}
                        <div style="font-size: 11px; color: #666;">${t.description || ''}</div>
                    </td>
                    <td style="text-align: center; width: 90px;">
                        <span class="type-badge type-${(t.type || 'trophy').toLowerCase()}">${t.type || 'Troféu'}</span>
                    </td>
                    <td style="text-align: right; width: 170px; font-family: monospace; font-size: 12px;">
                        ${dateStr}
                    </td>
                </tr>
            `;
        }).join('');

        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatório de Denúncia - ${report.denouncedUser || 'Usuário'} - ${report.gameTitle || 'Jogo'}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #111;
            background: #fff;
            margin: 0;
            padding: 20px;
            font-size: 13px;
            line-height: 1.4;
        }
        .header {
            border-bottom: 2px solid #d32f2f;
            padding-bottom: 12px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .header h1 {
            margin: 0 0 4px 0;
            font-size: 22px;
            color: #d32f2f;
            letter-spacing: -0.5px;
        }
        .header .subtitle {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
        }
        .meta-box {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            background: #f8f9fa;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px 16px;
            margin-bottom: 20px;
        }
        .meta-item .label {
            font-size: 10px;
            text-transform: uppercase;
            color: #718096;
            font-weight: 700;
            margin-bottom: 2px;
        }
        .meta-item .value {
            font-size: 14px;
            font-weight: 700;
            color: #1a202c;
            word-break: break-word;
        }
        .section-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            color: #2d3748;
            border-left: 4px solid #d32f2f;
            padding-left: 8px;
            margin: 20px 0 10px 0;
        }
        .explanation-box {
            background: #fff5f5;
            border: 1px solid #feb2b2;
            border-radius: 6px;
            padding: 12px 16px;
            margin-bottom: 20px;
            font-size: 13px;
            color: #742a2a;
            white-space: pre-wrap;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 12px;
        }
        th {
            background: #edf2f7;
            color: #4a5568;
            font-weight: 700;
            text-align: left;
            padding: 8px 10px;
            border-bottom: 2px solid #cbd5e0;
            font-size: 11px;
            text-transform: uppercase;
        }
        td {
            padding: 7px 10px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
        }
        tr {
            page-break-inside: avoid;
        }
        .highlight-table {
            border: 2px solid #feb2b2;
            background: #fffafa;
            border-radius: 6px;
            overflow: hidden;
        }
        .highlight-table th {
            background: #fee2e2;
            color: #991b1b;
        }
        .type-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .type-platina, .type-platinum { background: #e0f2fe; color: #0369a1; }
        .type-ouro, .type-gold { background: #fef3c7; color: #b45309; }
        .type-prata, .type-silver { background: #f1f5f9; color: #475569; }
        .type-bronze { background: #ffedd5; color: #9a3412; }
        .type-trophy { background: #f3f4f6; color: #374151; }

        .status-earned { color: #16a34a; font-weight: bold; }
        .status-locked { color: #9ca3af; }
        .table-selected-row {
            background: #fff1f2 !important;
            font-weight: 600;
        }
        .even-row { background: #ffffff; }
        .odd-row { background: #f8fafc; }
        .denounced-tag {
            background: #dc2626;
            color: white;
            font-size: 9px;
            font-weight: bold;
            padding: 1px 5px;
            border-radius: 3px;
            margin-left: 6px;
            vertical-align: middle;
        }
        .print-btn-bar {
            margin-bottom: 20px;
            padding: 12px;
            background: #1e293b;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .print-btn-bar button {
            background: #ef4444;
            color: #fff;
            border: none;
            padding: 8px 20px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
        }
        .print-btn-bar button:hover {
            background: #dc2626;
        }
        .footer {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            font-size: 10px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
        }
        @media print {
            .print-btn-bar {
                display: none !important;
            }
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="print-btn-bar">
        <span style="color: #fff; font-weight: 500;">
            📄 Relatório gerado com sucesso. Clique para imprimir ou salvar como PDF:
        </span>
        <button onclick="window.print()">🖨️ Imprimir Relatório (PDF)</button>
    </div>

    <div class="header">
        <div>
            <h1>Relatório de Denúncia & Inconsistência</h1>
            <div class="subtitle"> Gerado com auxílio da extensão projectcardEX </div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
            Emissão: <strong>${generationDate}</strong><br>
            ID: <span style="font-family: monospace;">${report.id || 'N/A'}</span>
        </div>
    </div>

    <div class="meta-box">
        <div class="meta-item">
            <div class="label">Usuário Denunciado</div>
            <div class="value">${report.denouncedUser || 'N/A'}</div>
        </div>
        <div class="meta-item">
            <div class="label">Jogo</div>
            <div class="value">${report.gameTitle || 'N/A'}</div>
        </div>
        <div class="meta-item">
            <div class="label">Código NPWR</div>
            <div class="value" style="color: #d32f2f; font-family: monospace;">${report.npwr || 'NPWR Desconhecido'}</div>
        </div>
    </div>

    <div class="section-title">Justificativa da Denúncia</div>
    <div class="explanation-box">
        ${report.explanation || 'Nenhuma justificativa detalhada foi fornecida.'}
    </div>

    <div class="section-title">Troféus Denunciados em Destaque (${selectedTrophies.length})</div>
    <table class="highlight-table">
        <thead>
            <tr>
                <th>Troféu</th>
                <th style="text-align: center; width: 100px;">Tipo</th>
                <th style="text-align: right; width: 180px;">Data e Hora Conquistado</th>
            </tr>
        </thead>
        <tbody>
            ${highlightedRowsHtml}
        </tbody>
    </table>

    <div class="section-title">Lista Completa de Troféus do Jogador (${allTrophies.length})</div>
    <table>
        <thead>
            <tr>
                <th style="text-align: center;">#</th>
                <th style="text-align: center;">Status</th>
                <th>Nome do Troféu e Descrição</th>
                <th style="text-align: center;">Tipo</th>
                <th style="text-align: right;">Data Conquistado</th>
            </tr>
        </thead>
        <tbody>
            ${allRowsHtml}
        </tbody>
    </table>

    <div class="footer">
        <div>Gerado localmente pela extensão projectcardEX. Dados extraídos diretamente da página de troféus.</div>
        <div>Página gerada para fins de verificação e revisão comunitária.</div>
    </div>
</body>
</html>`;
    }

    /**
     * Executa a impressão do relatório.
     * Abre uma janela limpa com o layout pronto e aciona window.print().
     * Caso popups estejam bloqueados, injeta o container imprimível na própria página.
     * @param {Object} report
     */
    static print(report) {
        if (!report) return;

        const html = AntiCheatPrintView.generatePrintHtml(report);

        // 1. Tenta abrir janela popup limpa
        try {
            const printWindow = window.open('', '_blank', 'width=950,height=1000,scrollbars=yes');
            if (printWindow && !printWindow.closed) {
                printWindow.document.open();
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.focus();
                
                // Aguarda o carregamento antes de acionar a impressão
                setTimeout(() => {
                    try {
                        printWindow.print();
                    } catch (e) {
                        console.warn('[AntiCheatPrintView] printWindow.print() falhou, aguardando clique manual do usuário:', e);
                    }
                }, 500);
                return;
            }
        } catch (e) {
            console.warn('[AntiCheatPrintView] Falha ao abrir popup de impressão, utilizando fallback in-page:', e);
        }

        // 2. Fallback: Injeta iframe invisível para impressão segura
        let printIframe = document.getElementById('pcex-print-iframe');
        if (!printIframe) {
            printIframe = document.createElement('iframe');
            printIframe.id = 'pcex-print-iframe';
            printIframe.style.position = 'fixed';
            printIframe.style.right = '0';
            printIframe.style.bottom = '0';
            printIframe.style.width = '0';
            printIframe.style.height = '0';
            printIframe.style.border = 'none';
            document.body.appendChild(printIframe);
        }

        const doc = printIframe.contentDocument || printIframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        setTimeout(() => {
            printIframe.contentWindow.focus();
            printIframe.contentWindow.print();
        }, 500);
    }
}

if (typeof globalThis !== 'undefined') {
    globalThis.AntiCheatPrintView = AntiCheatPrintView;
}
if (typeof window !== 'undefined') {
    window.AntiCheatPrintView = AntiCheatPrintView;
}
