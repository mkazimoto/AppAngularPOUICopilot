# po-divider

@description

Este componente apresenta uma linha demarcadora de blocos e pode conter um *label*. Seu uso é indicado para definição
e organização de informações em uma tela e sua característica é semelhante à tag `<hr>`.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                            | Descrição                                             | Valor Padrão                                    |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values**                     |                                                       |                                                 |
| `--color`                              | Cor principla do divider&nbsp;                        | `var(--color-neutral-mid-40)`                   |
| `--stroke-linecap`                     | Extremidade da linha&nbsp;                            | `round`                                         |

---

**`p-label`**

Valor do rótulo a ser exibido.

---

**`p-border-width`**

@optional

@description

Define a espessura da linha.

Valores válidos:
- small
- medium
- large

@default `small`

@docsExtends PoDividerBaseComponent

@example

<example name="po-divider-basic" title="PO Divider Basic" >
 <file name="sample-po-divider-basic/sample-po-divider-basic.component.html"> </file>
 <file name="sample-po-divider-basic/sample-po-divider-basic.component.ts"> </file>
</example>

<example name="po-divider-labs" title="PO Divider Labs" >
 <file name="sample-po-divider-labs/sample-po-divider-labs.component.html"> </file>
 <file name="sample-po-divider-labs/sample-po-divider-labs.component.ts"> </file>
</example>

<example name="po-divider-user-detail" title="PO Divider - User Detail" >
 <file name="sample-po-divider-user-detail/sample-po-divider-user-detail.component.html"> </file>
 <file name="sample-po-divider-user-detail/sample-po-divider-user-detail.component.ts"> </file>
</example>
