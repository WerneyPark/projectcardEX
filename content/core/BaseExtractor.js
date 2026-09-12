class BaseExtractor {
    /**
     * Extrai os dados do jogador a partir do DOM da página atual.
     * @returns {PlayerData} O objeto padronizado com as informações do jogador.
     */
    extractData() {
        throw new Error("O método extractData() deve ser implementado pelas subclasses.");
    }
}
