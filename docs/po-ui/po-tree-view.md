# po-tree-view

@description

O componente fornece um modelo de visualização em árvore, possibilitando a visualização das informações de maneira
hierárquica, desta forma sendo possível utilizar até 4 níveis.

Nele é possível navegar entre os itens através da tecla *tab*, permitindo expandir ou colapsar o item em foco
por meio das teclas *enter* e *space*.

Além da navegação, o componente possibilita também a seleção dos itens do primeiro ao último nível, tanto de forma parcial como completa.

O componente também possui eventos disparados ao marcar/desmarcar e expandir/colapsar os itens.

---

**`p-collapsed`**

@optional

@description

Ação que será disparada ao colapsar um item.

> Como parâmetro o componente envia o item colapsado.

---

**`p-expanded`**

@optional

@description

Ação que será disparada ao expandir um item.

> Como parâmetro o componente envia o item expandido.

---

**`p-selected`**

@optional

@description

Ação que será disparada ao selecionar um item.

> Como parâmetro o componente envia o item selecionado.

---

**`p-unselected`**

@optional

@description

Ação que será disparada ao desfazer a seleção de um item.

> Como parâmetro o componente envia o item que foi desmarcado.

---

**`p-components-size`**

@optional

@description

Define o tamanho dos componentes de formulário:
- `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
- `medium`: aplica a medida medium de cada componente.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

---

**`p-items`**

Lista de itens do tipo `PoTreeViewItem` que será renderizada pelo componente.

---

**`p-selectable`**

@optional

@description

Habilita uma caixa de seleção para selecionar e/ou desmarcar um item da lista.

@default false

---

**`p-single-select`**

@optional

@description

Habilita a seleção para item único atráves de po-radio.

@default false

---

**`p-max-level`**

@optional

@description

Define o máximo de níveis para o tree-view.

> O valor padrão é 4

@default 4

@docsExtends PoTreeViewBaseComponent

@example

<example name="po-tree-view-basic" title="PO Tree View Basic">
 <file name="sample-po-tree-view-basic/sample-po-tree-view-basic.component.html"> </file>
 <file name="sample-po-tree-view-basic/sample-po-tree-view-basic.component.ts"> </file>
</example>

<example name="po-tree-view-labs" title="PO Tree View Labs">
 <file name="sample-po-tree-view-labs/sample-po-tree-view-labs.component.html"> </file>
 <file name="sample-po-tree-view-labs/sample-po-tree-view-labs.component.ts"> </file>
</example>

<example name="po-tree-view-folder-structure" title="PO Tree View - Folder Structure">
 <file name="sample-po-tree-view-folder-structure/sample-po-tree-view-folder-structure.component.html"> </file>
 <file name="sample-po-tree-view-folder-structure/sample-po-tree-view-folder-structure.component.ts"> </file>
</example>

<example name="po-tree-view-supermarket" title="PO Tree View - Supermarket">
 <file name="sample-po-tree-view-supermarket/sample-po-tree-view-supermarket.component.html"> </file>
 <file name="sample-po-tree-view-supermarket/sample-po-tree-view-supermarket.component.ts"> </file>
</example>
