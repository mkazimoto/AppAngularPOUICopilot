# po-widget

@description

O componente `po-widget` é recomendado para exibição de *dashboards*, podendo ser utilizado
para incluir vários tipos de conteúdo como: gráficos, tabelas, grids e imagens.

Além da exibição de conteúdos, este componente possibilita adicionar ações e um link
para ajuda, como também possibilita ser utilizado com ou sem sombra.

Para controlar sua largura, é possível utilizar o [Grid System](/guides/grid-system) para um maior
controle de seu redimensionamento, assim possibilitando o tratamento para diferentes resoluções.

#### Boas práticas

Utilize um tamanho mínimo de largura de aproximadamente `18.75rem` no componente.

#### Acessibilidade tratada no componente

Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas. São elas:
- Utiliza medidas relativas, para se adequar às preferências e necessidades de quem for utilizar o sistema.
- Desenvolvido com uso de controles padrões HTML, o que permite a identificação na interface por tecnologias assistivas. (WCAG [4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value))
- O foco é visível e possui uma espessura superior a 2 pixels CSS, não ficando escondido por outros elementos da tela. (WCAG [2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced))
- Quando selecionável, prevê interação por teclado, podendo ser selecionado através da tecla space (WCAG [2.4.1 - Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard))

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                                  | Descrição                                                        | Valor Padrão                                                                |
|----------------------------------------------|------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **Default Values**                           |                                                                  |                                                                             |
| `--font-family`                              | Família tipográfica usada                                        | `var(--font-family-theme) `                                                 |
| `--font-size`                                | Tamanho da fonte                                                 | `var(--font-size-sm)`                                                       |
| `--font-weight`                              | Peso da fonte                                                    | `var(--font-weight-bold)`                                                   |
| `--font-color`                               | Cor da fonte                                                     | `var(--color-neutral-dark-95)`                                              |
| `--padding` - `@deprecated 21.x.x`           | Preenchimento do componente                                      | `1rem`                                                                      |
| `--padding-header`                           | Preenchimento do header                                          | `var(--spacing-sm) var(--spacing-sm) var(--spacing-xs) var(--spacing-sm)`   |
| `--padding-body`                             | Preenchimento do body                                            | `var(--spacing-xs) var(--spacing-sm) var(--spacing-xs) var(--spacing-sm)`   |
| `--padding-avatar`                           | Preenchimento do avatar                                          | `var(--spacing-sm) 0 var(--spacing-xs) var(--spacing-sm)`                   |
| `--padding-footer`                           | Preenchimento do footer                                          | `var(--spacing-xs) var(--spacing-sm) var(--spacing-sm) var(--spacing-sm)`   |
| `--border-radius`                            | Contém o valor do raio dos cantos do elemento&nbsp;              | `var(--border-radius-md)`                                                   |
| `--border-width`                             | Contém o valor da largura dos cantos do elemento&nbsp;           | `var(--border-width-sm)`                                                    |
| `--border-color`                             | Cor da borda                                                     | `var(--color-neutral-light-20)`                                             |
| `--background`                               | Cor de background                                                | `var(--color-neutral-light-00)`                                             |
| `--shadow`                                   | Contém o valor da sombra do elemento                             | `var(--shadow-md)`                                                          |
| **Hover**                                    |                                                                  |                                                                             |
| `--border-color-hover`                       | Cor da borda no estado hover                                     | `var(--color-action-hover)`                                                 |
| **Focused**                                  |                                                                  |                                                                             |
| `--color-focused`                            | Cor principal no estado de focus                                 | `var(--color-action-default)`                                               |
| `--outline-color-focused` &nbsp;             | Cor do outline do estado de focus                                | `var(--color-action-focus)`                                                 |

---

**`p-secondary-label`**

@optional

@description
Define o label e exibe a ação secundária no footer do componente.

> Exibida apenas quando `p-primary-label` estiver definida.

---

**`p-danger-primary-action`**

@optional

@description

Caso verdadeiro o botão da ação `p-primary-label` ativará o modo `danger`.

> Incompatível com o tipo **tertiary** da propriedade `p-kind-primary-action`.

@default `false`

---

**`p-danger-secondary-action`**

@optional

@description

Caso verdadeiro o botão da ação `p-secondary-label` ativará o modo `danger`.

> Incompatível com o tipo **tertiary** da propriedade `p-kind-primary-action`.

@default `false`

---

**`p-kind-primary-action`**

@optional

@description

Define o estilo do botão da ação `p-primary-label`, conforme o enum `PoButtonKind`.

@default `tertiary`

---

**`p-kind-secondary-action`**

@optional

@description

Define o estilo do botão da ação `p-secondary-label`, conforme o enum `PoButtonKind`.

@default `tertiary`

---

**`p-tag`**

@optional

@description

Label da tag exibida no header.

> Quando a tag atingir uma largura máxima de 15rem (240px), será truncado com reticências.
O conteúdo completo poderá ser visualizado ao passar o mouse sobre a tag, por meio do tooltip.

---

**`p-tag-type`**

@optional

@description

Define o tipo da `p-tag`, conforme o enum **PoTagType**.

Valores válidos:
 - `success`: cor verde utilizada para simbolizar sucesso ou êxito.
 - `warning`: cor amarela que representa aviso ou advertência.
 - `danger`: cor vermelha para erro ou aviso crítico.
 - `info`: cor azul claro que caracteriza conteúdo informativo.
 - `neutral`: cor cinza claro para uso geral.

@default `success`

---

**`p-tag-icon`**

@optional

@description

Define o ícone exibido ao lado do label da `p-tag`.

É possível usar qualquer um dos ícones da [Biblioteca de ícones PO UI](https://po-ui.io/icons), conforme exemplo:
```
<po-widget p-tag-icon="an an-user"></po-widget>
```
Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, desde que a biblioteca
esteja carregada no projeto:
```
<po-widget p-tag-icon="fa fa-podcast"></po-widget>
```

Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
```
<po-widget [p-tag-icon]="template"></po-widget>

<ng-template #template>
  <i class="fa fa-podcast" style="font-size: inherit;"></i>
</ng-template>
```
> Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.

---

**`p-tag-position`**

@Input p-tag-position

@optional

@description
Define o posicionamento da `po-tag` no cabeçalho do Widget:
- `right`: posicionada no canto superior direito do cabeçalho.
- `top`: posicionada à esquerda, acima do título (quando houver).
- `bottom`: posicionada à esquerda, abaixo do título (quando houver).

@default `right`

---

**`p-actions`**

@optional

@description

Lista de ações exibidas no header do componente.
As propriedades das ações seguem a interface `PoPopupAction`.

---

**`p-size`**

@optional

@description

Define o tamanho dos botões do componente:
- `small`: altura de 32px (disponível apenas para acessibilidade AA).
- `medium`: altura de 44px.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

---

**`p-avatar`**

@Input p-avatar

@optional

@description

Define o avatar a ser exibido à esquerda no Widget.

---

**`p-click`**

@optional

@description

Evento disparado quando o usuário clicar no componente.
> Quando este evento está em uso, uma sombra (shadow) é aplicada automaticamente ao componente.

---

**`p-on-disabled`**

@optional

@description

Evento disparado quando a propriedade `p-disabled` for alterada.

---

**`p-primary-action`**

@optional

@description

Evento disparado ao clicar na ação `p-primary-label`.

---

**`p-secondary-action`**

@optional

@description

Evento disparado ao clicar na ação `p-secondary-label`.

---

**`p-setting`**

@optional

@description
Evento disparado ao clicar em **Configurações** incluído no menu de ações do header.

---

**`p-title-action`**

@optional

@description
Evento disparado ao clicar no título definido em `p-title`.

---

**`p-background`**

@optional

@description

Define uma imagem de fundo.
> Se a imagem escolhida intervir na legibilidade do texto contido no `p-widget`,
pode-se utilizar a propriedade `p-primary` em conjunto para que os textos fiquem na cor branca.

---

**`p-disabled`**

@optional

@description

Desabilita o componente.

@default `false`

---

**`p-height`**

@optional

@description

Define a altura do componente.
> Caso não seja informado valor, a propriedade irá assumir o tamanho do conteúdo.

---

**`p-help`**

@optional

@description

Link de ajuda incluído no menu de ações do header.

---

**`p-no-shadow`**

@optional

@description

Desabilita a sombra do componente quando o mesmo for clicável.
> A sombra é exibida por padrão apenas quando o evento `p-click` está definido.

@default `true`

---

**`p-primary`**

@optional

@description

Opção para que o `po-widget` fique em destaque.

@default `false`

---

**`p-primary-label`**

@optional

@description

Define o label e exibe a ação primária no footer do componente.

---

**`p-title`**

@optional

@description

Título do componente.

> Quando o conteúdo exceder o espaço disponível, o texto será truncado com reticências.  O conteúdo completo poderá
ser visualizado ao passar o mouse sobre a tag, por meio do tooltip.

@docsExtends PoWidgetBaseComponent

@example

<example name="po-widget-basic" title="PO Widget Basic">
 <file name="sample-po-widget-basic/sample-po-widget-basic.component.html"> </file>
 <file name="sample-po-widget-basic/sample-po-widget-basic.component.ts"> </file>
</example>

<example name="po-widget-labs" title="PO Widget Labs">
 <file name="sample-po-widget-labs/sample-po-widget-labs.component.html"> </file>
 <file name="sample-po-widget-labs/sample-po-widget-labs.component.ts"> </file>
</example>

<example name="po-widget-finance-dashboard" title="PO Widget - Finance dashboard">
 <file name="sample-po-widget-finance-dashboard/sample-po-widget-finance-dashboard.component.html"> </file>
 <file name="sample-po-widget-finance-dashboard/sample-po-widget-finance-dashboard.component.ts"> </file>
</example>

<example name="po-widget-card" title="PO Widget - Card">
 <file name="sample-po-widget-card/sample-po-widget-card.component.html"> </file>
 <file name="sample-po-widget-card/sample-po-widget-card.component.ts"> </file>
</example>
