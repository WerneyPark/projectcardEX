# projectcardEX 🎮🏆

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-brightgreen?style=flat-square)
![Platform](https://img.shields.io/badge/Plataforma-PlayStation%20Trophies-003791?style=flat-square)
[![License](https://img.shields.io/badge/Licen%C3%A7a-MIT-yellow?style=flat-square)](LICENSE)

**projectcardEX** é uma extensão modular para navegadores baseados em Chromium (Google Chrome, Brave, Edge, Opera) desenvolvida para a comunidade de caçadores de troféus PlayStation. 

O projeto reúne uma suíte integrada de ferramentas que engloba a geração de **Cartões de Jogador (Gamer Cards)** via HTML5 Canvas, **Linha do Tempo e Splits de Conquista** em tempo real, um **Módulo Completo Anti-Cheat & Auditoria de Troféus** (com verificação automatizada, regras personalizadas e denúncias com impressão A4/PDF) e uma **Central de Controle (Popup Menu)** com gerenciamento local e backup via JSON.

---

## 📋 Sumário

- [projectcardEX 🎮🏆](#projectcardex-)
  - [📋 Sumário](#-sumário)
  - [🎯 Visão Geral do Sistema](#-visão-geral-do-sistema)
  - [✨ Pilares e Funcionalidades](#-pilares-e-funcionalidades)
    - [1. 🎨 Gerador de Gamer Cards (Canvas 2D)](#1--gerador-de-gamer-cards-canvas-2d)
    - [2. ⏱️ Linha do Tempo e Splits de Conquista (Trophy Timeline)](#2-️-linha-do-tempo-e-splits-de-conquista-trophy-timeline)
    - [3. 🛡️ Módulo Anti-Cheat \& Auditoria de Troféus](#3-️-módulo-anti-cheat--auditoria-de-troféus)
    - [4. ⚙️ Central de Controle da Extensão (Popup Menu)](#4-️-central-de-controle-da-extensão-popup-menu)
  - [🃏 Modelos de Cartões Suportados](#-modelos-de-cartões-suportados)
  - [🔒 Privacidade e Segurança (Privacy-First)](#-privacidade-e-segurança-privacy-first)
  - [📁 Estrutura e Arquitetura do Projeto](#-estrutura-e-arquitetura-do-projeto)
  - [🧪 Engenharia de Qualidade e Testes Automatizados](#-engenharia-de-qualidade-e-testes-automatizados)
  - [🚀 Como Instalar no Google Chrome](#-como-instalar-no-google-chrome)
  - [🔄 Como Atualizar a Extensão](#-como-atualizar-a-extensão)
  - [🌐 Compatibilidade](#-compatibilidade)
  - [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
  - [🤝 Contribuição](#-contribuição)
  - [📄 Licença](#-licença)

---

## 🎯 Visão Geral do Sistema

O **projectcardEX** atua nos principais portais da comunidade PlayStation brasileira e internacional: **PSX Trophies** (`psxtrophies.com.br`), **MyPST** (`mypst.com.br`) e **PSNProfiles** (`psnprofiles.com`). 

Projetado sob a arquitetura **Manifest V3**, o sistema opera de forma não-intrusiva, enriquecendo as páginas de perfil e páginas individuais de troféus sem comprometer o desempenho original do portal.

---

## ✨ Pilares e Funcionalidades

### 1. 🎨 Gerador de Gamer Cards (Canvas 2D)
- **Renderização Client-Side**: O navegador renderiza os cartões utilizando a API nativa do HTML5 Canvas, sem necessidade de servidores intermediários.
- **Tipografia Embutida**: Fontes pré-carregadas (`.woff2`) asseguram tipografia idêntica em qualquer sistema operacional (Windows, macOS, Linux).
- **Exportação Flexível**: Pré-visualização instantânea em modal com opções de **Baixar Imagem em PNG** em alta fidelidade ou **Copiar Imagem** para a área de transferência.

### 2. ⏱️ Linha do Tempo e Splits de Conquista (Trophy Timeline)
Injetado automaticamente na visualização de troféus de jogos do PSXT (`/:username/jogo/:gameSlug`):
- **Tempo Total Decorrido ($T_0$)**: Mostra exatamente quanto tempo se passou desde o primeiro troféu conquistado até a platina/100%.
- **Diferenças Parciais (Splits $+\Delta t$)**: Calcula e exibe o tempo decorrido em relação ao troféu imediatamente anterior na ordem cronológica.
- **Tratamento de Simultaneidade**: Identifica troféus obtidos no mesmo segundo com a marcação `(+0 segundos)`.
- **Destaque Inicial**: Marca com clareza visual o primeiro troféu conquistado pelo jogador na campanha.

### 3. 🛡️ Módulo Anti-Cheat & Auditoria de Troféus
Um ecossistema completo para preservar o *Fair Play* e auditar listas de troféus com tempos ou ordens tecnicamente inviáveis:
- **Verificação Automatizada (Presets PSN100)**:
  - Integra catálogo de regras clássicas adaptadas da comunidade internacional **PSN100** (*Ragowit/psn100*), cobrindo jogos notórios como *Resonance of Fate*, *FUEL*, *Lost Planet 2*, entre outros.
  - Ativado por padrão com chave de desativação rápida.
- **Criação de 3 Tipos de Regras Locais**:
  - **Regra de Ordem**: Dispara o alerta *"esses troféus não costumam ser conquistados nessa ordem"* quando um troféu obrigatório antecede outro incompatível.
  - **Regra de Tempo**: Define o tempo mínimo em segundos entre troféus, alertando *"esses troféus não costumam ser conquistados tão rápidos"*.
  - **Regra de Referência (Genérica)**: Seleciona um troféu referência e define se ele deve vir obrigatoriamente *Primeiro* ou *Depois* em relação a um conjunto de troféus, alertando *"esse troféu costuma aparecer em outra ordem"*.
- **Fluxo de Denúncia Manual & Relatório A4**:
  - Botão integrado no cartão lateral (`<aside>`) abaixo da Nota do jogo (`[ ⚠️ Gerar Relatorio - Denuncia ]`).
  - Modal interativo exigindo no mínimo 3 troféus selecionados e justificativa técnica detalhada.
  - Emissão de folha de denúncia formatada para **Impressão A4 / Salvar em PDF** via `window.print()`, com cabeçalho formal, tabela destacada em ordem cronológica (sem número de ordem rígido) e lista completa de troféus deduplicada.
  - Conversão imediata da denúncia em regra automatizada para o navegador do usuário.
- **Alerta Visual e Resiliência**:
  - Badge pulsante em gradiente vermelho (*"⚠️ Lista inconsistente"* ou *"⚠️ Troféus inconsistentes"*).
  - Modal popover de detalhes listando os troféus envolvidos e datas.
  - Sistema com auto-recuperação pós-renderização do DOM, parsing de datas resistente a tags `<br>` e proteção contra *race conditions*.

### 4. ⚙️ Central de Controle da Extensão (Popup Menu)
Interface moderna em tema *Dark Glassmorphism* (`480px × 560px`) estruturada em 4 abas:
- 📊 **Início**: Dashboard com métricas em tempo real (Total de Regras salvas, Presets ativos, Relatórios emitidos), status dos domínios compatíveis e dicas de uso.
- ⚖️ **Minhas Regras**: Gerenciador das regras locais com campo de busca instantânea, badges coloridos por categoria (*Ordem*, *Tempo* e *Referência*), exclusão com confirmação e botões de:
  - **📤 Exportar**: Gera arquivo `.json` de backup de todas as regras.
  - **📥 Importar**: Carrega arquivo `.json` com mesclagem inteligente (*merge*) sem duplicar IDs existentes.
- 🌐 **Presets PSN100**: Chave seletora (*Toggle Switch*) e listagem das regras de auditoria predefinidas.
- 📄 **Relatórios**: Histórico das denúncias salvas localmente com botão **🖨️ Reimprimir** em folha A4 instantânea.

---

## 🃏 Modelos de Cartões Suportados

| Portal | Modelos Disponíveis | Características |
| :--- | :--- | :--- |
| **PSX Trophies** (`psxtrophies.com.br`) | • **PSXT Extra**<br>• **PG Games**<br>• **PSN Legends**<br>• **Harém das Galas** | • Renders fiéis aos estilos clássicos e modernos.<br>• Modelo Harém exclusivo detectado dinamicamente para membros do grupo. |
| **MyPST** (`mypst.com.br`) | • **MyPST Classic**<br>• **MyPST New** | • Cartões nostálgicos com visual característico da comunidade. |
| **PSNProfiles** (`psnprofiles.com`) | • **PSNProfiles Custom Card** | • Layout horizontal compacto com avatar, nível PSN e badges de troféu. |

---

## 🔒 Privacidade e Segurança (Privacy-First)

O **projectcardEX** foi concebido sob princípios estritos de soberania de dados:
- **Armazenamento 100% Local**: Todas as regras criadas e relatórios de denúncia emitidos ficam salvos exclusivamente no armazenamento do seu próprio navegador (`chrome.storage.local`).
- **Zero Rastreamento**: Nenhuma informação de navegação, perfil ou denúncia é enviada para servidores externos ou bancos de dados remotos.
- **Portabilidade Total**: Através dos botões **Exportar** e **Importar** na aba *Minhas Regras*, você possui total controle para fazer backup ou compartilhar suas regras em formato `.json` com quem desejar.

---

## 📁 Estrutura e Arquitetura do Projeto

O código-fonte é estritamente modular, desacoplando o núcleo de extração gráfica do motor de auditoria e da interface de controle:

```text
projectcardEX/
├── assets/                          # Fontes e recursos gráficos estáticos
│   └── fonts/                       # Arquivos WOFF2 embutidos
├── content/                         # Scripts injetados (Content Scripts)
│   ├── antiCheat/                   # 🛡️ Módulo Anti-Cheat & Auditoria
│   │   ├── antiCheatEngine.js       # Motor lógico de validação de regras
│   │   ├── antiCheatPresets.js      # Catálogo predefinido adaptado do PSN100
│   │   ├── antiCheatPrintView.js    # Layout formal A4 para impressão/PDF
│   │   ├── antiCheatReportModal.js  # Modal interativo de seleção de troféus e denúncia
│   │   ├── antiCheatRuleModal.js    # Modal de criação de regras (Ordem, Tempo, Referência)
│   │   ├── antiCheatStorage.js      # Camada de persistência local (chrome.storage)
│   │   └── antiCheatUI.js           # Injetor no DOM, observador e badges de alerta
│   ├── config/                      # Configurações de URLs, assets e grupos especiais
│   ├── core/                        # Classes base (BaseExtractor, BaseRenderer, UIController)
│   ├── extractors/                  # Scrapers de dados por portal (PSXT, MyPST, PSNP)
│   ├── modules/                     # ⏱️ Módulos de gameplay (Trophy Timeline)
│   │   └── trophyTimeline.js        # Cálculo de splits e tempo decorrido
│   ├── renderers/                   # Renderizadores gráficos Canvas 2D
│   ├── utils/                       # Calculadora de nível PSN, formatadores e datas
│   ├── mypst_script.js              # Entrypoint de injeção no MyPST
│   ├── psnp_script.js               # Entrypoint de injeção no PSNProfiles
│   └── psxt_script.js               # Entrypoint de injeção no PSX Trophies
├── popup/                           # ⚙️ Central de Controle (Menu da Extensão)
│   ├── popup.html                   # Estrutura com as 4 abas interativas
│   ├── popup.css                    # Design Dark Glassmorphism responsivo (480px)
│   └── popup.js                     # Métricas, busca, exportação/importação e reimpressão
├── styles/                          # Folhas de estilo injetadas nas páginas
│   ├── common.css                   # Modais compartilhados e componentes base
│   ├── antiCheat_styles.css         # Botão lateral, badges pulsantes e formulários de denúncia
│   ├── psxt_styles.css              # Estilos específicos do PSXT
│   ├── mypst_styles.css             # Estilos específicos do MyPST
│   └── psnp_styles.css              # Estilos específicos do PSNProfiles
├── tests/                           # 🧪 Suíte de Testes Automatizados (Node.js)
│   ├── test_antiCheat.js            # Validação do motor, regras, storage e modal
│   ├── test_trophy_timeline.js      # Validação do cálculo de tempo e splits
│   └── test_popup.js                # Validação dos fluxos do menu popup e exportação
├── background.js                    # Service Worker em background (MV3)
├── manifest.json                    # Manifesto de permissões e content scripts
└── README.md                        # Documentação do projeto
```

---

## 🧪 Engenharia de Qualidade e Testes Automatizados

O projeto conta com uma suíte de testes unitários executável via Node.js, cobrindo o manifesto, motores lógicos, persistência, casos de borda e interfaces:

```powershell
# 1. Executar testes do Módulo Anti-Cheat, Motor e Regras
node tests/test_antiCheat.js

# 2. Executar testes da Linha do Tempo e Formatadores
node tests/test_trophy_timeline.js

# 3. Executar testes do Menu Popup e Fluxos de Backup
node tests/test_popup.js
```

Todos os testes validam cenários reais como deduplicação de listas desktop/mobile, tolerância a tags `<br>` em datas, detecção de ordem impossível e integridade de exportação/importação em JSON.

---

## 🚀 Como Instalar no Google Chrome

1. **Baixe ou clone os arquivos**:
   - Clique em **Code** > **Download ZIP** no GitHub e descompacte em uma pasta de sua escolha (ex: `C:\extensoes\projectcardEX`), ou clone via terminal:
     ```bash
     git clone https://github.com/SEU-USUARIO/projectcardEX.git
     ```
2. **Abra a tela de extensões**:
   - No Chrome, acesse `chrome://extensions`.
3. **Ative o Modo do Desenvolvedor**:
   - Ative a chave seletora **"Modo do desenvolvedor"** no canto superior direito.
4. **Carregue o projeto**:
   - Clique em **"Carregar sem compactação"** (*Load unpacked*).
   - Selecione a pasta raiz do projeto (onde está localizado o arquivo `manifest.json`).
5. **Fixe na barra de ferramentas**:
   - Clique no ícone de quebra-cabeça do navegador e fixe o **projectcardEX** com o ícone de alfinete para abrir o popup a qualquer momento.

---

## 🔄 Como Atualizar a Extensão

Sempre que efetuar alterações no código ou baixar atualizações:
1. Acesse `chrome://extensions`.
2. Localize o card do **projectcardEX**.
3. Clique no botão de recarregar (ícone de **seta circular 🔄**).
4. Dê **F5** na página do site de troféus para carregar as alterações imediatamente.

---

## 🌐 Compatibilidade

Totalmente homologado para navegadores baseados no motor **Chromium** (versão 88 ou superior, suporte a Manifest V3):
- Google Chrome
- Microsoft Edge
- Brave Browser
- Opera / Opera GX
- Vivaldi

---

## 🛠️ Tecnologias Utilizadas

- **Google Chrome Extensions Manifest V3**
- **JavaScript Moderno (ES6+)**
- **HTML5 Canvas API** (Renderização gráfica 2D)
- **Chrome Storage API** (`chrome.storage.local` para soberania de dados)
- **CSS3 Moderno** (Flexbox, Grid, Animações e Glassmorphism)
- **Node.js Test Runner / Assertions** (Garantia contínua de qualidade)

---

## 🤝 Contribuição

Contribuições para novos modelos de cartões, regras de auditoria ou otimizações são bem-vindas:
1. Faça um Fork do repositório.
2. Crie uma branch para a sua funcionalidade (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas alterações (`git commit -m "feat: adiciona nova funcionalidade"`).
4. Envie para o branch remoto (`git push origin feature/nova-funcionalidade`).
5. Abra um **Pull Request**.

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE). Desenvolvido por e para a comunidade de caçadores de troféus PlayStation.
