# po-tabs

@description

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                            | Descrição                                                                       | Valor Padrão                                      |
|----------------------------------------|---------------------------------------------------------------------------------|---------------------------------------------------|
| **Default Values**                     |                                                                                 |                                                   |
| `--background`                         | Cor de background                                                               | `var(--color-transparent)`                        |
| `--background-item-default`            | Cor de background do item padrão                                                | `var(--color-transparent)`                        |
| `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;                             | `var(--border-radius-md)`                         |
| `--color`                              | Cor da fonte padrão                                                             | `var(--color-action-default)`                     |
| `--color-baseline`                     | Cor para box-shadow                                                             | `var(--color-neutral-light-20)`                   |
| `--font-family`                        | Família tipográfica usada                                                       | `var(--font-family-theme)`                        |
| `--font-size`                          | Tamanho da fonte                                                                | `var(--font-size-default)`                        |
| `--font-weight`                        | Peso da fonte                                                                   | `var(--font-weight-bold)`                         |
| `--margin-tabs-container-left`         | Margem lateral esquerda do componente quando usado dentro de um `page-default`  | `var(--spacing-md)`                               |
| `--margin-tabs-container-right`        | Margem lateral direita do componente quando usado dentro de um `page-default`   | `-16px`                                           |
| `--padding-tabs-header`                | Padding do valor lateral das abas                                               | `var(--spacing-sm)`                               |
| `--margin-tabs-first-child`            | Margem lateral da primeira aba                                                  | `var(--spacing-md)`                               |
| `--margin-tabs-last-child`             | Margem lateral da ultima aba                                                    | `var(--spacing-md)`                               |
| **Disabled**                           |                                                                                 |                                                   |
| `--color-disabled`                     | Cor da fonte no estado disabilitado                                             | `var(--color-action-disabled)`                    |
| `--background-item-disabled`&nbsp;     | Cor de background do item desabilitado                                          | `var(--color-neutral-light-10)`                   |
| **Focused**                            |                                                                                 |                                                   |
| `--outline-color-focused`              | Cor do outline do estado de focus                                               | `var(--color-action-focus)`                       |
| **Hover**                              |                                                                                 |                                                   |
| `--color-hover`                        | Cor principal no estado hover                                                   | `var(--color-brand-01-darkest)`                   |
| `--background-item-hover`              | Cor de background no estado de hover                                            | `var(--color-brand-01-lightest)`                  |
| **Selected**                           |                                                                                 |                                                   |
| `--background-item-selected`           | Cor de background do item selecionado                                           | `var(--color-brand-01-lightest)`                  |

<br>

---

**`p-size`**

@optional

@description

Define o tamanho do componente:
- `small`: altura dos tabs como 32px (disponível apenas para acessibilidade AA).
- `medium`: altura dos tabs como 44px.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

@docsExtends PoTabsBaseComponent

@description

O componente `po-tabs` é responsável por agrupar [abas](/documentation/po-tab) dispostas numa linha horizontal,
ideal para facilitar a organização de conteúdos.

O componente exibirá as abas enquanto houver espaço na tela, caso a aba ultrapasse o limite da tela a mesma será agrupada em um dropdown.

> As abas que estiverem agrupadas serão dispostas numa cascata suspensa que será exibida ao clicar no botão.

É possível realizar a navegação entre as abas através da tecla SETAS(direita e esquerda) do teclado.
Caso uma aba estiver desabilitada, não receberá foco de navegação.

#### Boas práticas

- Evite utilizar um `po-tabs` dentro de outro `po-tabs`;
- Evite utilizar uma quantidade excessiva de abas, pois irá gerar um *scroll* muito longo no `dropdown`;
- Evite `labels` extensos para as `tabs` pois podem quebrar seu *layout*, use `labels` diretas, curtas e intuitivas.


@example

<example name="po-tabs-basic" title="PO Tabs Basic">
 <file name="sample-po-tabs-basic/sample-po-tabs-basic.component.html"> </file>
 <file name="sample-po-tabs-basic/sample-po-tabs-basic.component.ts"> </file>
</example>

<example name="po-tabs-labs" title="PO Tabs Labs">
 <file name="sample-po-tabs-labs/sample-po-tabs-labs.component.html"> </file>
 <file name="sample-po-tabs-labs/sample-po-tabs-labs.component.ts"> </file>
</example>

<example name="po-tabs-travel" title="PO Tabs - Travel">
 <file name="sample-po-tabs-travel/sample-po-tabs-travel.component.html"> </file>
 <file name="sample-po-tabs-travel/sample-po-tabs-travel.component.ts"> </file>
</example>

<example name="po-tabs-business-conf" title="PO Tabs - Business Conference">
 <file name="sample-po-tabs-business-conf/sample-po-tabs-business-conf.component.html"> </file>
 <file name="sample-po-tabs-business-conf/sample-po-tabs-business-conf.component.ts"> </file>
</example>

---

Função que atribui o número de tabs fora do dropdown.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoTabsComponent } from '@po-ui/ng-components';

...

@ViewChild('poTab', { static: true }) poTab: PoTabsComponent;

changeQuantityTabs() {
  this.poTab.setQuantityTabsButton(1); //Número de tabs
}
```
