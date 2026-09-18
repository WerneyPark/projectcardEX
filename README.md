# projectcardEX 🎮🏆

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-brightgreen?style=flat-square)
![Platform](https://img.shields.io/badge/Plataforma-PlayStation%20Trophies-003791?style=flat-square)
![License](https://img.shields.io/badge/Licen%C3%A7a-MIT-yellow?style=flat-square)

Extensão para navegadores baseados em Chromium (Google Chrome, Brave, Edge, Opera) que injeta ferramentas e geradores de **Cartões de Troféus (Gamer Cards)** diretamente em páginas de perfis dos principais sites da comunidade PlayStation: **PSX Trophies**, **MyPST** e **PSNProfiles**.

---

## 📋 Sumário

- [projectcardEX 🎮🏆](#projectcardex-)
  - [📋 Sumário](#-sumário)
  - [🎯 Visão Geral](#-visão-geral)
  - [✨ Funcionalidades](#-funcionalidades)
  - [🃏 Modelos de Cartões Suportados](#-modelos-de-cartões-suportados)
  - [🚀 Como Baixar e Instalar no Google Chrome](#-como-baixar-e-instalar-no-google-chrome)
    - [Passo 1: Obter os arquivos](#passo-1-obter-os-arquivos)
      - [Opção A: Baixar como arquivo ZIP (Mais simples)](#opção-a-baixar-como-arquivo-zip-mais-simples)
      - [Opção B: Clonar via Git (Para desenvolvedores)](#opção-b-clonar-via-git-para-desenvolvedores)
    - [Passo 2: Ativar o Modo do Desenvolvedor](#passo-2-ativar-o-modo-do-desenvolvedor)
    - [Passo 3: Carregar a Extensão](#passo-3-carregar-a-extensão)
    - [Passo 4: Fixar na Barra de Ferramentas](#passo-4-fixar-na-barra-de-ferramentas)
  - [🔄 Como Atualizar a Extensão](#-como-atualizar-a-extensão)
  - [🕹️ Como Utilizar](#️-como-utilizar)
  - [📁 Estrutura do Projeto](#-estrutura-do-projeto)
  - [🌐 Compatibilidade](#-compatibilidade)
  - [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
  - [🤝 Contribuição](#-contribuição)
  - [📄 Licença](#-licença)
  - [Contato](#contato)

---

## 🎯 Visão Geral

O **projectcardEX** foi desenvolvido para a comunidade de caçadores de troféus. A extensão captura as informações públicas do jogador e desenha em tempo real um cartão estilizado em HTML5 Canvas, pronto para ser compartilhado em redes sociais, fóruns ou guardado como lembrança.

---

## ✨ Funcionalidades

- **Renderização via Canvas**: Gera imagens nítidas diretamente no navegador, sem necessidade de servidores externos para montagem.
- **Múltiplos Modelos de Cartão**: Vários designs clássicos e modernos inspirados nas comunidades mais conhecidas.
- **Injeção Automática e Não-Intrusiva**: Botões integrados diretamente na interface dos sites de perfil.
- **Modal de Pré-visualização**: Veja o cartão antes de salvar, com botões para **Baixar PNG** ou **Copiar Imagem** para a área de transferência.
- **Tipografia Embutida**: Fontes pré-carregadas (`woff2`) garantindo renderização consistente em qualquer sistema operacional.


---

## 🃏 Modelos de Cartões Suportados

| Site | Modelos Disponíveis |
| :--- | :--- |
| **PSX Trophies** (`psxtrophies.com.br`) | • **PSXT Extra**<br>• **PG Games**<br>• **PSN Legends**<br>• **Harém das Galas** (exclusivo para membros) |
| **MyPST** (`mypst.com.br`) | • **MyPST Classic**<br>• **MyPST New** |
| **PSNProfiles** (`psnprofiles.com`) | • **PSNProfiles Custom Card** |

---

## 🚀 Como Baixar e Instalar no Google Chrome

Como esta é uma extensão em desenvolvimento (ainda não publicada na Chrome Web Store), a instalação é feita de forma simples e rápida utilizando o **Modo do Desenvolvedor** do navegador.

### Passo 1: Obter os arquivos

Você pode obter os arquivos do projeto de duas maneiras:

#### Opção A: Baixar como arquivo ZIP (Mais simples)
1. No topo desta página do GitHub, clique no botão verde **Code** e selecione **Download ZIP**.
2. Após o download, extraia o arquivo `.zip` em uma pasta de sua preferência no computador (exemplo: `C:\extensoes\projectcardEX` ou `Documentos/projectcardEX`).
   > ⚠️ **Importante**: Não exclua nem mova essa pasta após a instalação, pois o Chrome continuará lendo os arquivos dela.

#### Opção B: Clonar via Git (Para desenvolvedores)
Abra o terminal e execute:
```bash
git clone https://github.com/SEU-USUARIO/projectcardEX.git
```

---

### Passo 2: Ativar o Modo do Desenvolvedor

1. Abra o **Google Chrome**.
2. Na barra de endereços, digite:
   ```text
   chrome://extensions
   ```
   *(ou acesse pelo menu de 3 pontinhos no canto superior direito > **Extensões** > **Gerenciar extensões**)*.
3. No canto superior direito da página de extensões, **ative a chave seletora "Modo do desenvolvedor"** (Developer mode).

---

### Passo 3: Carregar a Extensão

1. Com o modo do desenvolvedor ativo, surgirão três novos botões no canto superior esquerdo.
2. Clique no botão **"Carregar sem compactação"** (ou *Load unpacked* em inglês).
3. Na janela de seleção de pastas, navegue até a pasta do projeto (a pasta onde está o arquivo `manifest.json`) e clique em **"Selecionar pasta"**.
4. A extensão **projectcardEX** aparecerá listada entre as suas extensões ativas!

---

### Passo 4: Fixar na Barra de Ferramentas

1. Clique no ícone de **quebra-cabeça** (ícone de extensões) ao lado da barra de endereços do Chrome.
2. Localize o **projectcardEX** e clique no ícone de **alfinete** para fixá-lo na barra superior para fácil acesso.

---

## 🔄 Como Atualizar a Extensão

Sempre que você baixar uma versão mais recente do código ou fizer alterações locais:

1. Abra a página `chrome://extensions`.
2. Localize o card do **projectcardEX**.
3. Clique no botão de recarregar (ícone de **seta circular 🔄**).
4. Recarregue a aba do site de troféus (F5) para ver as mudanças refletidas.

---

## 🕹️ Como Utilizar

1. Acesse seu perfil (ou de qualquer outro jogador) em um dos sites suportados:
   - [PSX Trophies](https://psxtrophies.com.br)
   - [MyPST](https://mypst.com.br)
   - [PSNProfiles](https://psnprofiles.com)
2. A extensão injetará automaticamente os botões dos modelos de cartões disponíveis na interface da página de perfil.
3. Clique no modelo de cartão desejado.
4. O modal do **projectcardEX** será aberto exibindo a prévia do cartão gerado:
   - Clique em **"Baixar Imagem"** para salvar o arquivo `.png` no seu computador.
   - Clique em **"Copiar"** para copiar a imagem diretamente para a área de transferência.

---

## 📁 Estrutura do Projeto

```text
projectcardEX/
├── assets/                  # Recursos estáticos
│   └── fonts/               # Fontes WOFF2 utilizadas nos cartões
├── content/                 # Scripts injetados nas páginas (Content Scripts)
│   ├── config/              # Configurações de URLs, assets e grupos especiais
│   ├── core/                # Classes base (BaseExtractor, BaseRenderer, UIController)
│   ├── extractors/          # Lógica de extração de dados por site (PSXT, MyPST, PSNP)
│   ├── renderers/           # Lógica de desenho Canvas para cada estilo de cartão
│   ├── utils/               # Calculadora de nível PSN, formatadores e utilitários Canvas
│   ├── mypst_script.js      # Entrypoint de injeção no MyPST
│   ├── psnp_script.js       # Entrypoint de injeção no PSNProfiles
│   └── psxt_script.js       # Entrypoint de injeção no PSX Trophies
├── popup/                   # Interface do popup da extensão
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── styles/                  # Estilos CSS injetados nas páginas
│   ├── common.css           # Estilos do modal, botões e controles compartilhados
│   ├── mypst_styles.css
│   ├── psnp_styles.css
│   └── psxt_styles.css
├── background.js            # Service worker em background (Manifest V3)
├── manifest.json            # Manifesto de configuração da extensão Chrome
├── .gitignore               # Regras de exclusão para o repositório Git
└── README.md                # Documentação do projeto
```

---

## 🌐 Compatibilidade

Testado e compatível com navegadores baseados em **Chromium** (versão 88 ou superior com suporte a Manifest V3):
- Google Chrome
- Microsoft Edge
- Brave Browser
- Opera / Opera GX
- Vivaldi

---

## 🛠️ Tecnologias Utilizadas

- **Manifest V3** (padrão mais recente e seguro de extensões do Chrome)
- **Vanilla JavaScript (ES6+)**
- **HTML5 Canvas API** (para renderização gráfica dos cartões em 2D)
- **CSS3** (com variáveis CSS e temas customizados)

---

## 🤝 Contribuição

Contribuições, correções de bugs e novos modelos de cartões são sempre bem-vindos!

1. Faça um Fork do projeto.
2. Crie uma branch para sua funcionalidade:
   ```bash
   git checkout -b feature/novo-modelo-cartao
   ```
3. Faça commit das suas alterações:
   ```bash
   git commit -m "feat: adiciona novo modelo de cartão para PSX Trophies"
   ```
4. Envie para o branch remoto:
   ```bash
   git push origin feature/novo-modelo-cartao
   ```
5. Abra um **Pull Request**.

---

## 📄 Licença

Este projeto é disponibilizado para a comunidade sob a licença [MIT](LICENSE).
Sinta-se livre para usar, estudar e contribuir!

## Contato

contato@projectcard.com.br
