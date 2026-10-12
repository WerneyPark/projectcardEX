/**
 * antiCheatPresets.js — Catálogo de regras predefinidas baseadas no repositório PSN100 (Ragowit/psn100).
 * 
 * Contém regras clássicas de ordem impossível e intervalos de tempo inviáveis entre troféus,
 * convertidas para execução no cliente da extensão.
 */

const AntiCheatPresets = [
    // 1. Resonance of Fate (PS3)
    {
        id: 'psn100_resonance_of_fate_order',
        npwr: 'NPWR01103_00',
        gameTitle: 'Resonance of Fate',
        type: 'order',
        ruleDescription: 'Lap Two Complete não pode ser conquistado antes de A New Beginning',
        trophyIdentifiers: [
            { name: 'A New Beginning', order: 48 },
            { name: 'Lap Two Complete', order: 38 }
        ],
        // Ordem cronológica requerida: A New Beginning DEVE vir antes de Lap Two Complete
        requiredSequence: ['A New Beginning', 'Lap Two Complete'],
        forbiddenOrderNotice: 'esses troféus não costumam ser conquistados nessa ordem',
        source: 'psn100'
    },

    // 2. End of Eternity (Versão JP de Resonance of Fate)
    {
        id: 'psn100_end_of_eternity_order',
        npwr: 'NPWR01104_00',
        gameTitle: 'End of Eternity',
        type: 'order',
        ruleDescription: 'Segunda jornada não pode ser concluída antes da primeira',
        trophyIdentifiers: [
            { name: '2周目クリア', order: 38 },
            { name: '新たな旅立ち', order: 48 }
        ],
        requiredSequence: ['新たな旅立ち', '2周目クリア'],
        forbiddenOrderNotice: 'esses troféus não costumam ser conquistados nessa ordem',
        source: 'psn100'
    },

    // 3. FUEL (PS3) - Conquistas de tempo impossível
    {
        id: 'psn100_fuel_time',
        npwr: 'NPWR00481_00',
        gameTitle: 'FUEL',
        type: 'time',
        ruleDescription: 'Troféus de eventos não podem ser concluídos em menos de 60 segundos entre si',
        trophyIdentifiers: [
            { order: 33 },
            { order: 34 }
        ],
        minTimeSeconds: 60,
        forbiddenOrderNotice: 'esses troféus não costumam ser conquistados tão rápidos',
        source: 'psn100'
    },

    // 4. Lost Planet 2 - 200 Chapters vs 300 Chapters
    {
        id: 'psn100_lost_planet_2_chapters',
        npwr: 'NPWR00877_00',
        gameTitle: 'Lost Planet 2',
        type: 'order',
        ruleDescription: '300-Chapter Playback não pode ser obtido antes de 200-Chapter Playback',
        trophyIdentifiers: [
            { name: '200-Chapter Playback' },
            { name: '300-Chapter Playback' }
        ],
        requiredSequence: ['200-Chapter Playback', '300-Chapter Playback'],
        forbiddenOrderNotice: 'esses troféus não costumam ser conquistados nessa ordem',
        source: 'psn100'
    },

    // 5. Lost Planet 2 - Snow Pirate Leader vs Snow Pirate Commander
    {
        id: 'psn100_lost_planet_2_pirate',
        npwr: 'NPWR00877_00',
        gameTitle: 'Lost Planet 2',
        type: 'order',
        ruleDescription: 'Snow Pirate Commander não pode ser obtido antes de Snow Pirate Leader',
        trophyIdentifiers: [
            { name: 'Snow Pirate Leader' },
            { name: 'Snow Pirate Commander' }
        ],
        requiredSequence: ['Snow Pirate Leader', 'Snow Pirate Commander'],
        forbiddenOrderNotice: 'esses troféus não costumam ser conquistados nessa ordem',
        source: 'psn100'
    },

    // 6. Resident Evil: Revelations (PS4)
    {
        id: 'psn100_re_rev_ps4_bonus',
        npwr: 'NPWR09489_00',
        gameTitle: 'Resident Evil: Revelations [PS4]',
        type: 'order',
        ruleDescription: 'Bonus Demi-god não pode ser obtido antes de Bonus Legend',
        trophyIdentifiers: [
            { name: 'Bonus Legend' },
            { name: 'Bonus Demi-god' }
        ],
        requiredSequence: ['Bonus Legend', 'Bonus Demi-god'],
        forbiddenOrderNotice: 'esses troféus não costumam ser conquistados nessa ordem',
        source: 'psn100'
    },

    // 7. Resident Evil: Revelations (PS3)
    {
        id: 'psn100_re_rev_ps3_bonus',
        npwr: 'NPWR04101_00',
        gameTitle: 'Resident Evil: Revelations [PS3]',
        type: 'order',
        ruleDescription: 'Bonus Demi-god não pode ser obtido antes de Bonus Legend',
        trophyIdentifiers: [
            { name: 'Bonus Legend' },
            { name: 'Bonus Demi-god' }
        ],
        requiredSequence: ['Bonus Legend', 'Bonus Demi-god'],
        forbiddenOrderNotice: 'esses troféus não costumam ser conquistados nessa ordem',
        source: 'psn100'
    },

    // 8. Angry Birds Trilogy (PS3)
    {
        id: 'psn100_angry_birds_blocks',
        npwr: 'NPWR02693_00',
        gameTitle: 'Angry Birds Trilogy',
        type: 'order',
        ruleDescription: 'Block Annihilator (100k blocos) não pode ser obtido antes de Block Breaker (5k blocos)',
        trophyIdentifiers: [
            { name: 'Block Breaker' },
            { name: 'Block Annihilator' }
        ],
        requiredSequence: ['Block Breaker', 'Block Annihilator'],
        forbiddenOrderNotice: 'esses troféus não costumam ser conquistados nessa ordem',
        source: 'psn100'
    },

    // 9. Terminator Salvation
    {
        id: 'psn100_terminator_salvation_time',
        npwr: 'NPWR00600_00',
        gameTitle: 'Terminator Salvation',
        type: 'time',
        ruleDescription: 'Capítulos não podem ser finalizados em menos de 120 segundos',
        trophyIdentifiers: [
            { order: 0 },
            { order: 1 },
            { order: 2 }
        ],
        minTimeSeconds: 120,
        forbiddenOrderNotice: 'esses troféus não costumam ser conquistados tão rápidos',
        source: 'psn100'
    },

    // 10. SOCOM: U.S. NAVY SEALS CONFRONTATION
    {
        id: 'psn100_socom_time',
        npwr: 'NPWR00345_00',
        gameTitle: 'SOCOM: U.S. NAVY SEALS CONFRONTATION',
        type: 'time',
        ruleDescription: 'Tempo impossivelmente curto entre conquistas online de alto nível',
        trophyIdentifiers: [
            { order: 41 },
            { order: 42 }
        ],
        minTimeSeconds: 60,
        forbiddenOrderNotice: 'esses troféus não costumam ser conquistados tão rápidos',
        source: 'psn100'
    }
];

if (typeof globalThis !== 'undefined') {
    globalThis.AntiCheatPresets = AntiCheatPresets;
}
if (typeof window !== 'undefined') {
    window.AntiCheatPresets = AntiCheatPresets;
}
