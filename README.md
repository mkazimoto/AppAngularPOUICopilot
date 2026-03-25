# App PO-UI gerado pelo Copilot e o modelo Claude Sonnet 4.6 no VSCODE.

## Demo
- https://mkazimoto.github.io/AppAngularPOUICopilot/dashboard

## Estrutura

AppAngularPOUICoplit/
├── .github/                     # Configurações do GitHub (actions, templates)
| ├── copilot-instructions.md    # Instruções do Copilot
| ├── prompts/
| | └── po-ui.prompt.md          # Prompt do PO-UI
│ └── workflows/                 # Pipelines de CI/CD
|   └── deploy.yml               # Configuração de publicação do App no Git Pages
├── ai/
│ └── po-ui-components-index.md  # Arquivo de índice da documentação local do PO-UI
└── docs/
  └── po-ui/                     # Documentação local do PO-UI

## Configuração do Copilot
- Utiliza um RAG local (base de conhecimento) da documentação do PO-UI.

## Ferramenta
- Este script nodeJS extrai a documentação atualizada do PO-UI e gera os arquivos .md:
  - https://github.com/mkazimoto/ExtrairRAG-POUI

