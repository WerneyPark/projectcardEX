class BaseExtractor {
    /**
     * Extrai os dados do jogador a partir do DOM da página atual.
     * @param {function(string): void} [onProgress] - Callback opcional para reportar progresso.
     * @returns {Promise<PlayerData>} O objeto padronizado com as informações do jogador.
     */
    extractData(onProgress) {
        throw new Error("O método extractData() deve ser implementado pelas subclasses.");
    }
}
