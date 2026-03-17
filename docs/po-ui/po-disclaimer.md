# po-disclaimer

@docsPrivate

@description

O componente po-disclaimer é responsável por representar tags.
Seu uso é recomendado em buscas e em campos onde é necessário representar objetos selecionados,
como por exemplo, no po-multi-select.

---

**`p-label`**

Label que aparecerá dentro do po-disclaimer.
Quando não for definido um label será apresentada a propriedade p-value.

---

**`p-value`**

Valor do po-disclaimer.

---

**`p-property`**

Nome da propriedade vinculada à este po-disclaimer.

---

**`p-close-action`**

@optional

@description

Evento disparado ao fechar o disclaimer.
Para este evento será passado como parâmetro um objeto com value, label e property.

---

**`p-hide-close`**

@description

Esta propriedade esconde o botão para fechamento do po-disclaimer, ao utilizar esta propriedade
sem passar valor a mesma é setada como false, onde o botão de fechamento está visível.

@default false

---

**`p-type`**

@description

Tipo do po-disclaimer. Pode ser 'default' ou 'danger'.

@default default
@optional

@docsPrivate

@docsExtends PoDisclaimerBaseComponent

@examplePrivate

<example-private name="po-disclaimer" title="PO Disclaimer">
  <file name="sample-po-disclaimer.component.html"> </file>
  <file name="sample-po-disclaimer.component.ts"> </file>
</example-private>
