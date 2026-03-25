# App PO-UI gerado pelo Copilot e o modelo Claude Sonnet 4.6 no VSCODE.

## Demo
- https://mkazimoto.github.io/AppAngularPOUICopilot/dashboard

## Estrutura

```
/AppAngularPOUICopilot/
├── .github/                          # Configurações do GitHub (actions, templates)
│   ├── copilot-instructions.md       # Instruções do Copilot
│   ├── prompts/
│   │   └── po-ui.prompt.md           # Prompt do PO-UI
│   └── workflows/                    # Pipelines de CI/CD
│       └── deploy.yml                # Configuração de publicação do App no Git Pages
├── ai/
│   └── po-ui-components-index.md     # Arquivo de índice da documentação local do PO-UI
├── app-clientes/                     # Projeto Angular
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   │   └── 404.html
│   └── src/
│       ├── index.html
│       ├── main.ts
│       ├── styles.css
│       └── app/
│           ├── app.config.ts
│           ├── app.routes.ts
│           ├── app.ts
│           ├── agendamento/
│           ├── carros/
│           ├── clientes/
│           │   ├── cliente.service.ts
│           │   └── cliente-edit/
│           ├── cursos/
│           ├── dashboard/
│           ├── imoveis/
│           ├── kanban/
│           │   ├── kanban-card/
│           │   └── kanban-column/
│           ├── organograma/
│           ├── passagens/
│           ├── pets/
│           ├── produtos/
│           ├── tarefas/
│           └── workflow/
├── docs/
│   └── po-ui/                        # Documentação local do PO-UI (47 componentes)
├── package-lock.json
└── README.md
```

## Configuração do Copilot
- Utiliza um RAG local (base de conhecimento) da documentação do PO-UI.

## Ferramenta
- Este script nodeJS extrai a documentação atualizada do PO-UI e gera os arquivos .md:
  - https://github.com/mkazimoto/ExtrairRAG-POUI

