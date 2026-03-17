# po-popover

@description

O componente `po-popover` é um container pequeno recomendado para incluir vários tipos de conteúdo como:
gráficos, textos, imagens e inputs. Ele abre sobreposto aos outros componentes.

Para mostrar apenas pequenos textos recomenda-se o uso da diretiva
[**po-tooltip**](https://po-ui.io/documentation/po-tooltip?view=doc).

Para conteúdos maiores recomenda-se o uso do [**po-modal**](https://po-ui.io/documentation/po-modal?view=doc).

Ele contém um título e também é possível escolher as posições do popover em relação ao componente pai,
as posições permitidas são: `right`, `right-top`, `right-bottom`, `top`, `top-left`, `top-right`,
`left`, `left-top`, `left-bottom`, `bottom`, `bottom-left` e `bottom-right`.

Também é possível escolher entre os dois eventos que podem abrir o *popover*.
Os eventos permitidos são: `click` e `hover`.

---

**`p-append-in-body`**

@optional

@description

Define que o popover será inserido no body da página em vez do elemento definido em `p-target`. Essa opção pode
ser necessária em cenários com containers que possuem scroll ou overflow escondido, garantindo o posicionamento
correto do conteúdo próximo ao elemento.

@default `false`

---

**`p-target`**

@description

ElementRef do componente de origem responsável por abrir o popover.
Para utilizar o po-popover deve-se colocar uma variável no componente que vai disparar o evento
de abertura, exemplo:

```
<po-button
  p-label="Open Popover">
</po-button>

<po-popover
  [p-target]="poButton"
  [p-title]="PO Popover">
</po-popover>
```

Também deve-se criar um ViewChild para cada popover, passando como referência o elemento do
HTML que irá disparar o evento. Exemplo:

```
@ViewChild(PoButtonComponent, {read: ElementRef}) poButton: PoButtonComponent;
```

Pode-se tambem informar diretamente o HTMLElement, para não ter que utilizar o ViewChild.
Para utilizar o po-popover deve-se colocar uma variável no componente que vai disparar o evento
de abertura, exemplo:

```
<button #target>
  Abrir popover
</button>

<po-popover
    [p-target]="target"
    p-trigger="click" >
</po-popover>
```

---

**`p-title`**

Título do popover.

---

**`p-close`**

Evento disparado ao fechar o popover.

---

**`p-open`**

Evento disparado ao abrir o popover.

---

**`p-hide-arrow`**

@optional

@description

Desabilita a seta do componente *popover*.

@default `false`

---

**`p-position`**

@optional

@description

Define a posição que o po-popover abrirá em relação ao componente alvo. Sugere-se que seja
usada a orientação "right" (direita), porém o mesmo é flexível e será rotacionado
automaticamente para se adequar a tela, caso necessário.

Posições válidas:
- `right`: Posiciona o po-popover no lado direito do componente alvo.
- `right-bottom`: Posiciona o po-popover no lado direito inferior do componente alvo.
- `right-top`: Posiciona o po-popover no lado direito superior do componente alvo.
- `bottom`: Posiciona o po-popover abaixo do componente alvo.
- `bottom-left`: Posiciona o po-popover abaixo e à esquerda do componente alvo.
- `bottom-right`: Posiciona o po-popover abaixo e à direita do componente alvo.
- `left`: Posiciona o po-popover no lado esquerdo do componente alvo.
- `left-top`: Posiciona o po-popover no lado esquerdo superior do componente alvo.
- `left-bottom`: Posiciona o po-popover no lado esquerdo inferior do componente alvo.
- `top`: Posiciona o po-popover acima do componente alvo.
- `top-right`: Posiciona o po-popover acima e à direita do componente alvo.
- `top-left`: Posiciona o po-popover acima e à esquerda do componente alvo.


@default right

---

**`p-trigger`**

@description

Define o evento que abrirá o po-popover.

Valores válidos:
 - `click`: Abre ao clicar no componente alvo.
 - `hover`: Abre ao passar o mouse sobre o componente alvo.
 - `function`: Abre através de funções públicas do componente.

@default click
@optional

---

**`p-custom-classes`**

@Input

@optional

@description
Permite a inclusão de classes CSS customizadas ao componente.

Exemplo: `p-custom-classes="minha-classe-1 minha-classe-2"`.

@docsExtends PoPopoverBaseComponent

@example

<example name="po-popover-basic" title="PO Popover Basic">
  <file name="sample-po-popover-basic/sample-po-popover-basic.component.html"> </file>
  <file name="sample-po-popover-basic/sample-po-popover-basic.component.ts"> </file>
</example>

<example name="po-popover-labs" title="PO Popover Labs">
  <file name="sample-po-popover-labs/sample-po-popover-labs.component.html"> </file>
  <file name="sample-po-popover-labs/sample-po-popover-labs.component.ts"> </file>
</example>

<example name="po-popover-credit-card" title="PO Popover - Credit Card">
  <file name="sample-po-popover-credit-card/sample-po-popover-credit-card.component.html"> </file>
  <file name="sample-po-popover-credit-card/sample-po-popover-credit-card.component.ts"> </file>
</example>
