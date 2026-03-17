# po-list-view

@description

Componente de lista que recebe um array de objetos e renderiza de forma dinâmica os dados de
acordo com a necessidade de cada tela e deve ser utilizado em conjunto com as diretivas de *templates*
 **[p-list-view-content-template](/documentation/po-list-view-content-template)** e
**[p-list-view-detail-template](/documentation/po-list-view-detail-template)**.

O componente disponibiliza uma área específica para exibição informações adicionais,
através da diretiva **[p-list-view-detail-template](/documentation/po-list-view-detail-template)**.

---

Recebe uma propriedade que será utilizada para recuperar o valor do objeto que será usado como link para o título.

---

Recebe uma propriedade que será utilizada para recuperar o valor do objeto que será exibido como o título de cada item.

---

@optional

@description

Recebe uma ação, que será executada quando clicar no botão "Carregar mais resultados".

> Caso nenhuma ação for definida o mesmo não ficará visível.

---

@optional

@description

Ação que será executada ao clicar no título.

Ao ser disparado, o método inserido na ação irá receber como parâmetro o item da lista clicado.

---

@optional

@description

Ação que será executada ao clicar no botão exibir detalhes.

Ao ser disparado, o método passa como parâmetros os detalhes que serão exibidos.

---

@optional

@description

Lista de ações que serão exibidas no componente.

---

@optional

@description

Define o tamanho dos componentes de formulário no template:
- `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
- `medium`: aplica a medida medium de cada componente.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

---

@optional

@description

Define a altura do `po-list-view` em *pixels*.

---

@description

Esconde o *checkbox* para seleção de todos os itens.

@default `false`

---

@optional

@description

Objeto com as literais usadas no `po-list-view`.

Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:

```
 const customLiterals: PoListViewLiterals = {
   hideDetail: 'Ocultar detalhes completamente',
   loadMoreData: 'Mais dados',
   showDetail: 'Mostrar mais detalhes',
   selectAll: 'Selecionar todos os itens'
 };
```

Ou passando apenas as literais que deseja customizar:

```
 const customLiterals: PoListViewLiterals = {
   showDetail: 'Mostrar mais detalhes'
 };
```

E para carregar as literais customizadas, basta apenas passar o objeto para o componente.

```
<po-list-view
  [p-literals]="customLiterals">
</po-list-view>
```

> O objeto padrão de literais será traduzido de acordo com o idioma do
[`PoI18nService`](/documentation/po-i18n) ou do browser.

---

@optional

@description

Habilita um *checkbox* para cada item da lista. Todos os items possuem a propriedade dinâmica `$selected` para identificar se o
item está selecionado, por exemplo:

```
 item.$selected

 // ou

 item['$selected']
```

@default `false`

---

@optional

@description

Indica que o botão `Carregar Mais Resultados` será desabilitado.

@docsExtends PoListViewBaseComponent

@example

<example name="po-list-view-basic" title="PO List View Basic">
 <file name="sample-po-list-view-basic/sample-po-list-view-basic.component.html"> </file>
 <file name="sample-po-list-view-basic/sample-po-list-view-basic.component.ts"> </file>
</example>

<example name="po-list-view-labs" title="PO List View Labs">
 <file name="sample-po-list-view-labs/sample-po-list-view-labs.component.html"> </file>
 <file name="sample-po-list-view-labs/sample-po-list-view-labs.component.ts"> </file>
</example>

<example name="po-list-view-hiring-processes" title="PO List View - Hiring Processes">
 <file name="sample-po-list-view-hiring-processes/sample-po-list-view-hiring-processes.component.html"> </file>
 <file name="sample-po-list-view-hiring-processes/sample-po-list-view-hiring-processes.component.ts"> </file>
 <file name="sample-po-list-view-hiring-processes/sample-po-list-view-hiring-processes.service.ts"> </file>
</example>
