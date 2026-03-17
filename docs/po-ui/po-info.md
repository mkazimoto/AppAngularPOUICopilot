# po-info

**`p-label`**

Valor do rótulo a ser exibido.

---

**`p-url`**

Ao informar uma URL, o conteúdo será exibido na forma de um *link* e ao ser clicado será redirecionado para a URL informada.

> Caso informar `http://` será aberto uma nova aba.
Caso informar um caminho relativo, exemplo: `/customers`, será aberto na aba atual.

---

**`p-value`**

Valor do conteúdo a ser exibido.

---

**`p-label-size`**

@optional

@description

Quantidade de [colunas](/guides/grid-system) usadas para a exibição da `p-label` quando o componente for
utilizado na orientação horizontal.

Valores válidos:
 - `[1 .. 11]`

> A propriedade `p-value` recebe o número de colunas restantes, por exemplo, se definido 3 colunas a mesma assume 9 colunas.

---

**`p-orientation`**

@optional

@description

Define o layout de exibição.

> Quando definido na horizontal, pode-se utilizar a propriedade `p-label-size` para um maior controle das informações exibidas.

@default `vertical`

---

**`p-size`**

@optional

@description

Define o tamanho do componente entre `small` ou `medium`.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

@docsExtends PoInfoBaseComponent

@description

Este componente tem como objetivo renderizar valores na tela no estilo label na parte superior e
valor na parte inferior. Facilita a exibição de dados pois vem com layout padrão PO.

@example

<example name="po-info-basic" title="PO Info Basic">
 <file name="sample-po-info-basic/sample-po-info-basic.component.html"> </file>
 <file name="sample-po-info-basic/sample-po-info-basic.component.ts"> </file>
</example>

<example name="po-info-labs" title="PO Info Labs">
 <file name="sample-po-info-labs/sample-po-info-labs.component.html"> </file>
 <file name="sample-po-info-labs/sample-po-info-labs.component.ts"> </file>
</example>
