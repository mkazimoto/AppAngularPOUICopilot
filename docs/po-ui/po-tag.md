# po-tag

@description

Este componente permite exibir um valor em forma de um marcador colorido, sendo possível definir uma legenda e realizar customizações
na cor, iconografia e tipo.

Além disso, é possível definir uma ação que será executada tanto ao *click* quanto através das teclas *enter/space* enquanto navega
utilizando a tecla *tab*.

Seu uso é recomendado para informações que necessitem de destaque em forma de marcação.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                            | Descrição                                             | Valor Padrão                                    |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values**                     |                                                       |                                                 |
| `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                      |
| `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-sm)`                           |
| `--line-height`                        | Tamanho da label                                      | `var(---line-height-sm)`                        |
| `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-pill)`                     |
| `--gap`                                | Espaçamento entre o label e o value                   | `var(--spacing-xs)`                             |
| **Neutral**                            |                                                       |                                                 |
| `--color-neutral`                      | Cor principal no estado neutral                       | `var(--color-neutral-light-10)`                 |
| `--text-color-positive`                | Cor do texto no estado neutral                        | `var(--color-neutral-dark-80)`                  |
| **Positive**                           |                                                       |                                                 |
| `--color-positive`                     | Cor principal no estado positive                      | `var(--color-feedback-positive-lightest)`       |
| `--text-color-positive`                | Cor do texto no estado positive                       | `var(--color-feedback-positive-dark)`           |
| **Negative**                           |                                                       |                                                 |
| `--color-negative`                     | Cor principal no estado danger                        | `var(--color-feedback-negative-lightest)`       |
| `--text-color-negative`                | Cor do texto no estado danger                         | `var(--color-feedback-negative-darker)`         |
| **Warning**                            |                                                       |                                                 |
| `--color-tag-warning`                  | Cor principal no estado warning                       | `var(--color-feedback-warning-lightest)`        |
| `--text-color-warning`                 | Cor do texto no estado warning                        | `var(--color-feedback-warning-darkest)`         |
| **Info**                               |                                                       |                                                 |
| `--color-info`                         | Cor principal no estado info                          | `var(--color-feedback-info-lightest)`           |
| `--text-color-info`                    | Cor do texto no estado info                           | `var(--color-feedback-info-dark)`               |
| **Removable**                          |                                                       |                                                 |
| `--color`                              | Cor principal quando removable                        | `var(--color-brand-01-lightest)`                |
| `--border-color`                       | Cor de borda quando removable &nbsp;                  | `var(--color-brand-01-lighter)`                 |
| `--color-icon`                         | Cor do ícone quando removable &nbsp;                  | `var(--color-action-default)`                   |
| `--text-color`                         | Cor do texto quando removable &nbsp;                  | `var(--color-neutral-dark-80)`                  |
| `--color-hover`                        | Cor do hover no estado removable &nbsp;               | `var(--color-brand-01-lighter)`                 |
| **Focused**                            |                                                       |                                                 |
| `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                     |
| **Disabled**                           |                                                       |                                                 |
| `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-neutral-light-20)`                 |
| `--border-color-disabled`              | Cor da borda no estado disabled &nbsp;                | `var(--color-action-disabled)`                  |
| `--color-icon-disabled`                | Cor do icone no estado disabled &nbsp;                | `var(--color-action-disabled)`                  |
| `--text-color-disabled`                | Cor do texto no estado disabled &nbsp;                | `var(--color-neutral-mid-60)`                   |

---

**`p-label`**

@optional

@description

Define uma legenda que será exibida acima ou ao lado da *tag*, de acordo com a `p-orientation`.

---

**`p-removable`**

@optional

@description

Habilita a opção de remover a tag

@default `false`

---

**`p-disabled`**

@optional

@description

Desabilita o `po-tag` e não permite que o usuário interaja com o mesmo.
> A propriedade `p-disabled` somente terá efeito caso a propriedade `p-removable` esteja definida como `true`.

@default `false`

---

**`p-value`**

Texto da tag.

---

**`p-click`**

@optional

@description

Ação que será executada ao clicar sobre o `po-tag` e que receberá como parâmetro um objeto contendo o seu valor e tipo.

O evento de click só funciona se a tag não for removível.

---

**`p-close`**

@optional

@description

Ação que sera executada quando clicar sobre o ícone de remover no `po-tag`

---

**`p-color`**

@optional

@description

Determina a cor da tag. As maneiras de customizar as cores são:
- Hexadeximal, por exemplo `#c64840`;
- RGB, como `rgb(0, 0, 165)`;
- O nome da cor, por exemplo `blue`;
- Usando uma das cores do tema do PO:
Valores válidos:
  - <span class="dot po-color-01"></span> `color-01`
  - <span class="dot po-color-02"></span> `color-02`
  - <span class="dot po-color-03"></span> `color-03`
  - <span class="dot po-color-04"></span> `color-04`
  - <span class="dot po-color-05"></span> `color-05`
  - <span class="dot po-color-06"></span> `color-06`
  - <span class="dot po-color-07"></span> `color-07`
  - <span class="dot po-color-08"></span> `color-08`
  - <span class="dot po-color-09"></span> `color-09`
  - <span class="dot po-color-10"></span> `color-10`
  - <span class="dot po-color-11"></span> `color-11`
  - <span class="dot po-color-12"></span> `color-12`

- Para uma melhor acessibilidade no uso do componente é recomendável utilizar cores com um melhor contraste em relação ao background;
- O componente ajusta automaticamente a cor do texto para garantir legibilidade, escolhendo dinamicamente entre texto claro ou escuro conforme o contraste necessário.

> **Atenção:** A propriedade `p-type` sobrepõe esta definição.

---

**`p-text-color`**

@optional

@description

Determina a cor do texto da tag. As maneiras de customizar as cores são:
- Hexadeximal, por exemplo `#c64840`;
- RGB, como `rgb(0, 0, 165)`;
- O nome da cor, por exemplo `blue`;
- Usando uma das cores do tema do PO:
Valores válidos:
  - <span class="dot po-color-01"></span> `color-01`
  - <span class="dot po-color-02"></span> `color-02`
  - <span class="dot po-color-03"></span> `color-03`
  - <span class="dot po-color-04"></span> `color-04`
  - <span class="dot po-color-05"></span> `color-05`
  - <span class="dot po-color-06"></span> `color-06`
  - <span class="dot po-color-07"></span> `color-07`
  - <span class="dot po-color-08"></span> `color-08`
  - <span class="dot po-color-09"></span> `color-09`
  - <span class="dot po-color-10"></span> `color-10`
  - <span class="dot po-color-11"></span> `color-11`
  - <span class="dot po-color-12"></span> `color-12`

- Para uma melhor acessibilidade no uso do componente é recomendável utilizar cores com um melhor contraste em relação ao background.

> **Atenção:** A propriedade `p-type` sobrepõe esta definição.

---

**`p-icon`**

@optional

@description

Define ou ativa um ícone que será exibido ao lado do valor da *tag*.

Quando `p-type` estiver definida, basta informar um valor igual a `true` para que o ícone seja exibido conforme descrições abaixo:
- <span class="an an-check"></span> - `success`
- <span class="an an-warning-circle"></span> - `warning`
- <span class="an an-x"></span> - `danger`
- <span class="an an-info"></span> - `info`

Também É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons). conforme exemplo abaixo:
```
<po-tag p-icon="an an-user" p-value="PO Tag"></po-tag>
```
como também utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
```
<po-tag p-icon="fa fa-podcast" p-value="PO Tag"></po-button>
```
Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
```
<po-tag [p-icon]="template" p-value="Tag template ionic"></po-button>

<ng-template #template>
 <ion-icon style="font-size: inherit" name="heart"></ion-icon>
</ng-template>
```
> Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.

@default `false`

---

**`p-orientation`**

@optional

@description

Define o *layout* de exibição.

@default `vertical`

---

**`p-type`**

@optional

@description

Define o tipo da *tag*.

Valores válidos:
 - `success`: cor verde utilizada para simbolizar sucesso ou êxito.
 - `warning`: cor amarela que representa aviso ou advertência.
 - `danger`: cor vermelha para erro ou aviso crítico.
 - `info`: cor azul claro que caracteriza conteúdo informativo.
 - `neutral`: cor cinza claro para uso geral.

> Quando esta propriedade for definida, irá sobrepor a definição de `p-color` e `p-icon` somente será exibido caso seja `true`.

@default `info`

---

**`p-literals`**

@optional

@description

Objeto com as literais usadas no `po-tag`.


Para utilizar, basta passar a literal customizada:

```
 const customLiterals: PoTagLiterals = {
   remove: 'Remover itens'
 };
```

E para carregar as literais customizadas, basta apenas passar o objeto para o componente:

```
<po-tag
  [p-literals]="customLiterals">
</po-tag>
```

> O objeto padrão de literais será traduzido de acordo com o idioma do
[`PoI18nService`](/documentation/po-i18n) ou do browser.

@docsExtends PoTagBaseComponent

@example

<example name="po-tag-basic" title="PO Tag Basic">
 <file name="sample-po-tag-basic/sample-po-tag-basic.component.html"> </file>
 <file name="sample-po-tag-basic/sample-po-tag-basic.component.ts"> </file>
</example>

<example name="po-tag-labs" title="PO Tag Labs">
 <file name="sample-po-tag-labs/sample-po-tag-labs.component.html"> </file>
 <file name="sample-po-tag-labs/sample-po-tag-labs.component.ts"> </file>
</example>

<example name="po-tag-bank-account" title="PO Tag - Bank Account">
 <file name="sample-po-tag-bank-account/sample-po-tag-bank-account.component.html"> </file>
 <file name="sample-po-tag-bank-account/sample-po-tag-bank-account.component.ts"> </file>
</example>
