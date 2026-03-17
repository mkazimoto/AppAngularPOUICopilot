# po-button

@description

O `po-button` permite que o usuário execute ações predefinidas pelo desenvolvedor.

Através dos tipos, é possível identificar a importância de cada ação.

#### Boas práticas

- Evite `labels` extensos que quebram o layout do `po-button`, use `labels` diretos, curtos e intuitivos.
- Utilize apenas um `po-button` configurado como `primary` por página.
- Para ações irreversíveis use sempre a propriedade `p-danger`.

#### Acessibilidade tratada no componente

Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:

- Quando em foco, o botão é ativado usando as teclas de Espaço e Enter do teclado. [W3C WAI-ARIA 3.5 Button - Keyboard Interaction](https://www.w3.org/WAI/ARIA/apg/#keyboard-interaction-3)
- A área do foco precisar ter uma espessura de pelo menos 2 pixels CSS e o foco não pode ficar escondido por outros elementos da tela. [WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                              | Descrição                                             | Valor Padrão                                      |
|------------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| `--font-family`                          | Família tipográfica usada                             | `var(--font-family-theme)`                        |
| `--font-size`                            | Tamanho da fonte                                      | `var(--font-size-default)`                        |
| `--font-weight`                          | Peso da fonte                                         | `var(--font-weight-bold)`                         |
| `--line-height`                          | Tamanho da label                                      | `var(--line-height-none)`                         |
| `--border-radius`                        | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                         |
| `--border-width`                         | Contém o valor da largura dos cantos do elemento&nbsp;| `var(--border-width-md)`                          |
| `--padding`                              | Preenchimento                                         | `0 1em`                                           |                                                                        | ---                                             |
| **Danger**                               |                                                       |                                                   |
| `--text-color-danger`                    | Cor do texto no estado danger                         | `var(--color-neutral-light-00)`                   |
| `--color-button-danger`                  | Cor do botão no estado danger                         | `var(--color-feedback-negative-dark)`             |
| `--color-danger-hover`                   | Cor de hover no estado danger                         | `var(--color-feedback-negative-darker)`           |
| `--color-danger-pressed`                 | Cor pressionada no estado danger                      | `var(--color-feedback-negative-darkest)`          |
| `--background-danger-hover`              | Cor de background de hover no estado danger           | `var(--color-feedback-negative-lighter)`          |
| `--border-color-danger-hover`            | Cor da borda de hover no estado danger                | `var(--color-feedback-negative-darkest)`          |
| `--background-danger-pressed`            | Cor de background pressionado no estado danger        | `var(--color-feedback-negative-light)`            |
| `--background-color-button-danger`&nbsp; | Cor de background do botão no estado danger           | `var(--color-transparent)`                        |
| **Default Values**                       |                                                       |                                                   |
| `--text-color`                           | Cor do texto                                          | `var(--color-neutral-light-00)`                   |
| `--color`                                | Cor principal do botão                                | `var(--color-action-default)`                     |
| `--background-color`                     | Cor de background                                     | `var(--color-transparent)`                        |
| `--border-color`                         | Cor da borda                                          | `var(--color-transparent)`                        |
| `--shadow`                               | Contém o valor da sombra do elemento                  | `var(--shadow-none)`                              |
| **Hover**                                |                                                       |                                                   |
| `--color-hover`                          | Cor principal no estado hover                         | `var(--color-action-hover)`                       |
| `--background-hover`                     | Cor de background no estado hover                     | `var(--color-brand-01-lighter)`                   |
| `--border-color-hover`                   | Cor da borda no estado hover                          | `var(--color-brand-01-darkest)`                   |
| **Focused**                              |                                                       |                                                   |
| `--outline-color-focused`                | Cor do outline do estado de focus                     | `var(--color-action-focus)`                       |
| **Pressed**                              |                                                       |                                                   |
| `--color-pressed`                        | Cor principal no estado de pressionado                | `var(--color-action-pressed)`                     |
| `--background-pressed`                   | Cor de background no estado de pressionado&nbsp;      | `var(--color-brand-01-light)`                     |
| **Disabled**                             |                                                       |                                                   |
| `--text-color-disabled`                  | Cor do texto no estado disabled                       | `var(--color-neutral-dark-70)`                    |
| `--color-disabled`                       | Cor principal no estado disabled                      | `var(--color-action-disabled)`                    |
| `--background-color-disabled`            | Cor de background no estado disabled                  | `var(--color-transparent)`                        |

---

@Input

@optional

@description
Ícone exibido ao lado esquerdo do label do botão.

É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons), conforme exemplo:
```
<po-button p-icon="an an-user" p-label="PO button"></po-button>
```
Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, desde que a biblioteca
esteja carregada no projeto:
```
<po-button p-icon="fa fa-podcast" p-label="PO button"></po-button>
```
Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
```
<po-button [p-icon]="template" p-label="button template ionic"></po-button>

<ng-template #template>
 <ion-icon style="font-size: inherit" name="heart"></ion-icon>
</ng-template>
```
> Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.

---

@Input

@optional

@description
Define o tipo do botão.

@default `PoButtonType.Button`

---

Ação que será executada quando o usuário clicar sobre o `po-button`.

---

@optional

@description

Exibe um ícone de carregamento à esquerda do _label_ do botão.

> Quando esta propriedade estiver habilitada, desabilitará o botão.

@default `false`

---

@optional

@description

Deve ser usado em ações irreversíveis que o usuário precisa ter cuidado ao executá-la, como a exclusão de um registro.

> A propriedade `p-kind="tertiary"` será inativada ao utilizar esta propriedade.

---

@optional

@description

Define o estilo visual do componente conforme valores especificados no enum `PoButtonKind`:
 - `primary`: destaca o botão, sendo recomendado para ações principais.
 - `secondary`: estilo padrão, ideal para ações secundárias.
 - `tertiary`: exibe o botão sem preenchimento no fundo, indicado para ações opcionais.

@default `secondary`

---

@optional

@description

Desabilita o `po-button` e não permite que o usuário interaja com o mesmo.

@default `false`

---

@Input

@optional

@description

Define um `aria-label` para o `po-button`.

Caso esta propriedade não seja informada será considerada a label do botão.

> Em caso de botões com apenas ícone a atribuição de valor à esta propriedade é muito importante para acessibilidade.

---

@optional

@description

Define o tamanho do componente:
- `small`: altura de 32px (disponível apenas para acessibilidade AA).
- `medium`: altura de 44px.
- `large`: altura de 56px.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

@docsExtends PoButtonBaseComponent

@example

<example name="po-button-basic" title="PO Button Basic">
 <file name="sample-po-button-basic/sample-po-button-basic.component.html"> </file>
 <file name="sample-po-button-basic/sample-po-button-basic.component.ts"> </file>
</example>

<example name="po-button-labs" title="PO Button Labs">
 <file name="sample-po-button-labs/sample-po-button-labs.component.html"> </file>
 <file name="sample-po-button-labs/sample-po-button-labs.component.ts"> </file>
</example>

<example name="po-button-social-network" title="PO Button Social Network">
 <file name="sample-po-button-social-network/sample-po-button-social-network.component.html"> </file>
 <file name="sample-po-button-social-network/sample-po-button-social-network.component.ts"> </file>
</example>

---

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoButtonComponent } from '@po-ui/ng-components';

...

@ViewChild(PoButtonComponent, { static: true }) button: PoButtonComponent;

focusButton() {
  this.button.focus();
}
```
