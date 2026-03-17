# po-toaster

@description

O Toaster serve para exibir uma mensagem temporária em linha na  interface, podendo ou não ser removida pelos usuários a depender do uso especificado.

#### Acessibilidade tratada no componente

Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:

- Permitir a interação via teclado (2.1.1: Keyboard (A));
- Permitir que o usuário feche facilmente o toaster e não retirar o foco de onde está. (2.2.4: Interrupções (AAA));
- Preservar o foco visível na navegação via teclado. (2.4.7: Foco visível (A));
- Áreas de clique ou toque para elementos interativos devem ter pelo menos 44x44 pixels (2.5.5: Área de clique (AAA));

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                             | Descrição                                            | Valor Padrão                                      |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Default Values**                     |                                                       |                                                   |
| `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                        |
| `--font-color`                         | Cor principal do texto                                | `var(--color-neutral-dark-90)`                    |
| `--font-color-support`                 | Cor principal do texto de supporte                    | `var(--color-neutral-dark-80)`                    |
| `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                         |
| **Type Success**                       |                                                       |                                                   |
| `--color-success`                      | Cor principal no tipo success                         | `var(--color-feedback-positive-base)`             |
| `--background-success`                 | Cor de fundo principal no tipo success                | `var(--color-feedback-positive-lightest)`         |
| `--border-color-success`               | Cor da borda principal tipo success                   | `var(--color-feedback-positive-lighter)`          |
| **Type Error**                         |                                                       |                                                   |
| `--color-error`                        | Cor principal no tipo error                           | `var(--color-feedback-negative-base)`             |
| `--background-error`                   | Cor de fundo principal no tipo error                  | `var(--color-feedback-negative-lightest)`         |
| `--border-color-error`                 | Cor da borda principal tipo error                     | `var(--color-feedback-negative-lighter)`          |
| **Type Warning**                       |                                                       |                                                   |
| `--color-icon-warning`                 | Cor principal do icone no tipo warning                | `var(--color-neutral-dark-90)`                    |
| `--color-warning`                      | Cor principal no tipo warning                         | `var(--color-feedback-warning-base)`              |
| `--background-warning`                 | Cor de fundo principal no tipo warning                | `var(--color-feedback-warning-lightest)`          |
| `--border-color-warning`               | Cor da borda principal tipo warning                   | `var(--color-feedback-warning-lighter)`           |
| **Type Info**                          |                                                       |                                                   |
| `--color-info`                         | Cor principal no tipo info                            | `var(--color-feedback-info-base)`                 |
| `--background-info`                    | Cor de fundo principal no tipo info                   | `var(--color-feedback-info-lightest)`             |
| `--border-color-info`                  | Cor da borda principal tipo info                      | `var(--color-feedback-info-lighter)`              |

---

**`p-action`**

@optional

@description

Ação para a notificação.

---

**`p-action-label`**

@optional

@description

Label do botão quando houver uma ação definida.

---

**`p-message`**

@optional

@description

Mensagem a ser exibida na notificação.

---

**`p-hide`**

@optional

@description

Define se o Toaster esta invisivel.

@default `false`

---

**`p-hide-change`**

@optional

@description

Evento emitido quando o valor de `isHide` é alterado.

---

**`p-show-close`**

@optional

@description

Exibe botão de fechar no toaster modo inline.

@default `true`

---

**`p-size-actions`**

@optional

@description

Define o tamanho das ações no componente:
- `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
- `medium`: aplica a medida medium de cada componente.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

---

**`p-support-message`**

@optional

@description

Mensagem de suporte a ser exibida na notificação.

---

**`p-type`**

@optional

@description

Determina o tipo de notificação.

Valores aceitos: `error`, `information`, `success` e `warning`.
@see PoToasterType

@default `PoToasterType.Information`

@docsExtends PoToasterBaseComponent

@example

<example name="po-toaster-basic" title="PO Toaster Basic">
 <file name="sample-po-toaster-basic/sample-po-toaster-basic.component.html"> </file>
 <file name="sample-po-toaster-basic/sample-po-toaster-basic.component.ts"> </file>
</example>

<example name="po-toaster-labs" title="PO Toaster Labs">
 <file name="sample-po-toaster-labs/sample-po-toaster-labs.component.html"> </file>
 <file name="sample-po-toaster-labs/sample-po-toaster-labs.component.ts"> </file>
</example>
