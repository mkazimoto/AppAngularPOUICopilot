# po-table

@description

Este componente de tabela é utilizado para exibição de dados com diferentes tipos como por exemplo textos, data, horas e números com
formato personalizado.

Também é possivel criar tabelas com ordenação de dados, linhas com detalhes, coluna para seleção de linhas, coluna com ações e também
carregamento por demanda através do botão **Carregar mais resultados**.

> As linhas de detalhes podem também ser customizadas através do [`p-table-row-template`](/documentation/po-table-row-template).

> As colunas podem ser customizadas através dos templates [`p-table-column-template`](/documentation/po-table-column-template)
e [`p-table-cell-template`](/documentation/po-table-cell-template).

O componente permite gerenciar a exibição das colunas dinamicamente. Esta funcionalidade pode ser acessada através do ícone de engrenagem
no canto superior direito do cabeçalho da tabela.

Caso a largura de todas as colunas forem definidas e o total ultrapassar o tamanho tabela, será exibido um *scroll* na horizontal para a
completa visualização dos dados.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                            | Descrição                                             | Valor Padrão                                      |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Default Values**                     |                                                       |                                                   |
| `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                        |
| `--background-color`                   | Cor de background                                     | `var(--color-neutral-light-00)`                   |
| `--color`                              | Cor principal da table                                | `var(--color-neutral-dark-95)`                    |
| `--background-striped-color`           | Cor do background quando striped                      | `var(--color-neutral-light-05)`                   |
| `--color-line`                         | Cor das linhas                                        | `var(--color-neutral-mid-40)`                     |
| **Hover**                              |                                                       |                                                   |
| `--color-hover`                        | Cor principal no estado hover                         | `var(--color-action-hover)`                       |
| `--background-color-hover`             | Cor de background no estado hover                     | `var(--color-brand-01-lighter)`                   |
| **Focused**                            |                                                       |                                                   |
| `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                       |
| **Disabled**                           |                                                       |                                                   |
| `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-neutral-mid-40)`                     |
| **Headline**                           |                                                       |                                                   |
| `--background-color-headline` &nbsp;   | Cor do cabeçalho                                      | `var(--color-neutral-light-10)`                   |
| `--font-weight-headline`               | Peso da fonte do cabeçalho                            | `var(--font-weight-bold)`                         |
| **Selected**                           |                                                       |                                                   |
| `--background-color-selected`&nbsp;    | Cor de background no estado de selecionado            | `var(--color-brand-01-lightest)`                  |
| **Actived**                            |                                                       |                                                   |
| `--color-actived`                      | Cor do texto no estado de selecionado                 | `var(--color-neutral-dark-90)`                    |
| `--background-color-actived`           | Cor de background no estado de selecionado            | `var(--color-brand-01-light)`                     |

---

**`p-hide-columns-manager`**

@optional

@description

Permite que o gerenciador de colunas, responsável pela definição de quais colunas serão exibidas, seja escondido.

@default `false`

---

**`p-hide-batch-actions`**

@optional

@description

Permite que as ações em lote, responsável por excluir e exibir a quantidade de itens, sejam escondidas.

@default `true`

---

**`p-text-wrap`**

@optional

@description

Habilita ou desabilita a quebra automática de texto. Quando ativada, o texto que excede
o espaço disponível é transferido para a próxima linha em pontos apropriados para uma
leitura clara.

> Incompatível com `virtual-scroll`, que requer altura fixa nas linhas.

@default `false`

---

**`p-hide-action-fixed-columns`**

@optional

@description

Permite que as ações para fixar uma coluna da tabela sejam escondidas.

@default `false`

---

**`p-hide-table-search`**

@optional

@description

Permite que o campo de pesquisa seja escondido.

@default `true`

---

**`p-auto-collapse`**

@optional

@description

Permite fechar um detalhe ou row template automaticamente, ao abrir outro item.

@default `false`

---

**`p-loading-show-more`**

@optional

@description

Permite que seja adicionado o estado de carregamento no botão "Carregar mais resultados".

@default `false`

---

**`p-sort`**

@optional

@description

Habilita em todas as colunas a opção de ordenação de dados. Caso a coluna seja do tipo 'data' ou 'dateTime' a
mesma deve respeitar os tipos de entrada definidos para que sejam ordenadas.

@default `false`

---

**`p-show-more-disabled`**

@description

Se verdadeiro, torna habilitado o botão "Carregar mais resultados".

@default `false`

---

**`p-striped`**

@description

Habilita ou desabilita o estilo listrado da tabela (`striped`).
> Recomendado para tabelas com maior número de dados, facilitando a sua visualização na tabela.

@default `false`

---

**`p-hide-select-all`**

@description

Esconde o *checkbox* para seleção de todas as linhas.

> Sempre receberá *true* caso a seleção de apenas uma linha esteja ativa.

@default `false`

---

**`p-single-select`**

@description

Define que somente uma linha da tabela pode ser selecionada.

> Esta definição não se aplica aos itens filhos, os mesmos possuem comportamento independente do item pai.

---

**`p-selectable-entire-line`**

@description

Permite selecionar um item da tabela clicando na linha.

> Caso haja necessidade de selecionar o item apenas via radio ou checkbox, deve-se definir esta propriedade como `false`.

@default `true`

---

**`p-actions-right`**

@optional

@description

Define que a coluna de ações ficará no lado direito da tabela.

@default `false`

---

**`p-max-columns`**

@optional

@description

Define uma quantidade máxima de colunas que serão exibidas na tabela.

Quando chegar no valor informado, as colunas que não estiverem selecionadas ficarão
desabilitadas e caso houver mais colunas visíveis do que o permitido, as excedentes
serão ignoradas por ordem de posição.

---

**`p-filter-type`**

@optional

@description

Define o modo de pesquisa utilizado no campo de busca, quando habilitado.
Valores definidos no enum: PoSearchFilterMode
> Obs: A pesquisa é realizada exclusivamente nos dados locais, ou seja, aqueles que foram
> renderizados na tabela.

@default `startsWith`

---

**`p-all-selected`**

@optional

@description
Evento executado quando todas as linhas são selecionadas por meio do *checkbox* que seleciona todas as linhas.

---

**`p-all-unselected`**

@optional

@description
Evento executado quando a seleção das linhas é desmarcada por meio do *checkbox* que seleciona todas as linhas.

---

**`p-collapsed`**

@optional

@description

Evento executado ao colapsar uma linha do `po-table`.

> Como parâmetro o componente envia o item colapsado.

---

**`p-expanded`**

@optional

@description

Evento executado ao expandir uma linha do `po-table`.

> Como parâmetro o componente envia o item expandido.

---

**`p-delete-items`**

@optional

@description

Evento executado após o método de exclusão ser finalizado.

```
<po-table
 (p-delete-items)="items = $event"
>
</po-table>
```


> Como parâmetro o componente envia a lista atualizada, sem os itens excluídos.

---

**`p-selected`**

@optional

@description

Evento executado ao selecionar uma linha do `po-table`.

---

**`p-show-more`**

@optional

@description

Recebe uma ação de clique para o botão "Carregar mais resultados", caso nenhuma ação for definida o mesmo
não é visível.

Recebe um objeto `{ column, type }` onde:

- column (`PoTableColumn`): objeto da coluna que está ordenada.
- type (`PoTableColumnSortType`): tipo da ordenação.

---

**`p-sort-by`**

@optional

@description

Evento executado ao ordenar colunas da tabela.

Recebe um objeto `{ column, type }` onde:

- column (`PoTableColumn`): objeto da coluna que foi clicada/ordenada.
- type (`PoTableColumnSortType`): tipo da ordenação.

---

**`p-unselected`**

@optional

@description
Evento executado ao desmarcar a seleção de uma linha do `po-table`.

---

**`p-change-visible-columns`**

@optional

@description
Evento disparado ao fechar o page slide do gerenciador de colunas após alterar as colunas visíveis.

O componente envia como parâmetro um array de string com as colunas visíveis atualizadas.
Por exemplo: ["idCard", "name", "hireStatus", "age"].

---

**`p-restore-column-manager`**

@optional

@description
Evento disparado ao clicar no botão de restaurar padrão no gerenciador de colunas.

O componente envia como parâmetro um array de string com as colunas configuradas inicialmente.
Por exemplo: ["idCard", "name", "hireStatus", "age"].

---

**`p-components-size`**

@optional

@description

Define o tamanho dos componentes de formulário no table:
- `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
- `medium`: aplica a medida medium de cada componente.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

---

**`p-items`**

@description

Lista de itens da tabela.
> Se falso, será inicializado como um *array* vazio.

---

**`p-columns`**

@optional

@description

Lista das colunas da tabela, deve receber um *array* de objetos que implementam a interface `PoTableColumn`.
Por padrão receberá como valor a primeira coluna da lista de itens da tabela.
> Caso não encontre valor, a mensagem 'Nenhuma definição de colunas' será exibida.

---

**`p-container`**

@optional

@description

Adiciona um contorno arredondado ao `po-table`, as opções são:
- `border`: com bordas/linhas.
- `shadow`: com sombras.

@default `border`

---

**`p-param-delete-api`**

@optional

@description

Adiciona o parâmetro a ser enviado para a requisição de DELETE.

É necessário a utilização da propriedade `p-service-delete` em conjunto.

@default `id`

---

**`p-height`**

@optional

@description

Define a altura da tabela em *pixels* e fixa o cabeçalho.

Ao utilizar essa propriedade será inserido o `virtual-scroll` na tabela melhorando a performance.

---

**`p-hide-detail`**

@optional

@description

Habilita a visualização da lista de detalhes de cada linha da coluna.

@default `false`

---

**`p-literals`**

@optional

@description

Objeto com as literais usadas no `po-table`.

Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:

```
 const customLiterals: PoTableLiterals = {
   noColumns: 'Nenhuma definição de colunas',
   noData: 'Nenhum dado encontrado',
   noVisibleColumn: 'Nenhuma coluna visível',
   noItem: 'Nenhum item selecionado',
   oneItem: '1 item selecionado',
   multipleItems: 'itens selecionados',
   loadingData: 'Carregando',
   loadMoreData: 'Carregar mais resultados',
   seeCompleteSubtitle: 'Ver legenda completa',
   completeSubtitle: 'Legenda completa',
   columnsManager: 'Gerenciador de colunas',
   bodyDelete: 'Deseja realmente excluir esse item?',
   cancel: 'Cancelar',
   delete: 'Excluir',
   deleteSuccessful: 'Itens removidos com sucesso',
   deleteApiError: 'Ocorreu um erro inesperado, tente novamente mais tarde!',
 };
```

Ou passando apenas as literais que deseja customizar:

```
 const customLiterals: PoTableLiterals = {
   noData: 'Sem dados'
 };
```

E para carregar as literais customizadas, basta apenas passar o objeto para o componente.

```
<po-table
  [p-literals]="customLiterals">
</po-table>
```

> O objeto padrão de literais será traduzido de acordo com o idioma do
[`PoI18nService`](/documentation/po-i18n) ou do browser.

---

**`p-loading`**

@optional

@description

Bloqueia a interação do usuário com os dados da _table_.

@default `false`

---

**`p-actions`**

@optional

@description

Define uma lista de ações.

Quando houver apenas uma ação definida ela será exibida diretamente na coluna, caso contrário, o componente
se encarrega de agrupá-las exibindo o ícone [**an an-dots-three**](https://po-ui.io/icons) que listará as ações ao ser clicado.

**A coluna de ações não será exibida quando:**
 - a lista conter valores inválidos ou indefinidos.
 - tenha uma única ação e a mesma não for visível.

---

**`p-selectable`**

@optional

@description

Permite a seleção de linhas na tabela e, caso a propriedade `p-single-select` esteja definida será possível
selecionar apenas uma única linha.

**Importante:**
 - As linhas de detalhe definidas em `PoTableDetail` possuem comportamento independente da linha mestre;
 - Cada linha possui por padrão a propriedade dinâmica `$selected`, na qual é possível validar se a linha
está selecionada, por exemplo: `item.$selected` ou `item['$selected']`.

@default `false`

---

**`p-infinite-scroll`**

@optional

@description

Se verdadeiro, ativa a funcionalidade de scroll infinito para a tabela e o botão "Carregar Mais" deixará de ser exibido. Ao chegar no fim da tabela
executará a função `p-show-more`.

**Regras de utilização:**
 - O scroll infinito só funciona para tabelas que utilizam a propriedade `p-height` e que possuem o scroll já na carga inicial dos dados.

@default `false`

---

**`p-infinite-scroll-distance`**

@optional

@description

Define o percentual necessário para disparar o evento `p-show-more`, que é responsável por carregar mais dados na tabela. Caso o valor informado seja maior que 100 ou menor
que 0, o valor padrão será 100%

**Exemplos:**
 - p-infinite-scroll-distance = 80: Quando atingir 80%  do scroll da tabela, o `p-show-more` será disparado.

---

**`p-service-api`**

@optional

@description

URL da API responsável por retornar os registros.

Ao realizar a busca de mais registros via paginação (Carregar mais resultados), será enviado os parâmetros `page` e `pageSize`, conforme abaixo:

```
url + ?page=1&pageSize=10
```

Caso utilizar ordenação, a coluna ordenada será enviada através do parâmetro `order`, por exemplo:
- Coluna decrescente:
  ```
   url + ?page=1&pageSize=10&order=-name
  ```

- Coluna ascendente:
  ```
   url + ?page=1&pageSize=10&order=name
  ```

> Esta URL deve retornar e receber os dados no padrão de [API do PO UI](https://po-ui.io/guides/api).

---

**`p-service-delete`**

@optional

@description

URL da API responsável por excluir os registros.

Ao selecionar o botão de excluir itens, essa url será executada utilizando o parâmetro enviado na propriedade `p-param-delete-api`.
Caso ela não seja utilizada, o parâmetro padrão a ser enviado será `id`.

> Esta URL deve retornar e receber os dados no padrão de [API do PO UI](https://po-ui.io/guides/api).

---

**`p-spacing`**

@optional

@description

Define o espaçamento interno das células, impactando diretamente na altura das linhas do table. Os valores
permitidos são definidos pelo enum **PoTableColumnSpacing**.

> Em nível de acessibilidade **AA**, caso o valor de `p-spacing` não seja definido, o valor padrão será `extraSmall`
> nos seguintes cenários:
> - Quando o valor de `p-components-size` for `small`;
> - Quando o valor padrão dos componentes for configurado como `small` no
> [serviço de tema](https://po-ui.io/documentation/po-theme).

@default `medium`

---

**`p-filtered-columns`**

@optional

@description

Define as colunas que serão filtradas no campo de pesquisa.
Aceita um array de strings, representando as colunas específicas que serão consideradas na filtragem.

---

**`p-draggable`**

@optional

@description

Habilita o modo drag and drop para as colunas da tabela.

@default `false`

---

**`p-virtual-scroll`**

@optional

@description

Habilita o `virtual-scroll` na tabela para melhorar a performance com grandes volumes de dados.
Requer altura (`p-height`) para funcionar corretamente.

> Incompatível com `p-text-wrap` e `master-detail`, pois o `virtual-scroll` exige altura fixa nas linhas.

@default `true`

@docsExtends PoTableBaseComponent

@example

<example name="po-table-basic" title="PO Table Basic">
 <file name="sample-po-table-basic/sample-po-table-basic.component.ts"> </file>
 <file name="sample-po-table-basic/sample-po-table-basic.component.html"> </file>
</example>

<example name="po-table-labs" title="PO Table Labs">
 <file name="sample-po-table-labs/sample-po-table-labs.component.ts"> </file>
 <file name="sample-po-table-labs/sample-po-table-labs.component.html"> </file>
 <file name="sample-po-table-labs/sample-po-table-labs.service.ts"> </file>
</example>

<example name="po-table-with-api" title="PO Table using API">
 <file name="sample-po-table-with-api/sample-po-table-with-api.component.ts"> </file>
 <file name="sample-po-table-with-api/sample-po-table-with-api.component.html"> </file>
</example>

<example name="po-table-transport" title="PO Table - Transport">
 <file name="sample-po-table-transport/sample-po-table-transport.component.ts"> </file>
 <file name="sample-po-table-transport/sample-po-table-transport.component.html"> </file>
 <file name="sample-po-table-transport/sample-po-table-transport.service.ts"> </file>
</example>

<example name="po-table-airfare" title="PO Table - Airfare">
 <file name="sample-po-table-airfare/sample-po-table-airfare.component.ts"> </file>
 <file name="sample-po-table-airfare/sample-po-table-airfare.component.html"> </file>
 <file name="sample-po-table-airfare/sample-po-table-airfare.service.ts"> </file>
</example>

<example name="po-table-components" title="PO Table - Po Field Components">
 <file name="sample-po-table-components/sample-po-table-components.component.ts"> </file>
 <file name="sample-po-table-components/sample-po-table-components.enum.ts"> </file>
 <file name="sample-po-table-components/sample-po-table-components.component.html"> </file>
 <file name="sample-po-table-components/sample-po-table-components.service.ts"> </file>
 <file name="sample-po-table-components/sample-po-table-components.component.css"> </file>
</example>

<example name="po-table-heroes" title="PO Table - Heroes">
 <file name="sample-po-table-heroes/sample-po-table-heroes.component.ts"> </file>
 <file name="sample-po-table-heroes/sample-po-table-heroes.component.html"> </file>
 <file name="sample-po-table-heroes/sample-po-table-heroes.service.ts"> </file>
</example>

<example name="po-table-draggable" title="PO Table Drag and Drop">
 <file name="sample-po-table-draggable/sample-po-table-draggable.component.html"> </file>
 <file name="sample-po-table-draggable/sample-po-table-draggable.component.ts"> </file>
</example>

---

Método responsável por realizar busca no serviço de dados podendo informar filtros e com o retorno, atualiza a tabela.

Caso não seja informado parâmetro, nada será adicionado ao GET, conforme abaixo:
```
url + ?page=1&pageSize=10
```
> Obs: os parâmetros `page` e `pageSize` sempre serão chamados independente de ser enviados outros parâmetros.

Caso sejam informados os parâmetros `{ name: 'JOHN', age: '23' }`, todos serão adicionados ao GET, conforme abaixo:
```
url + ?page=1&pageSize=10&name=JOHN&age=23
```

@param { { key: value } } queryParams Formato do objeto a ser enviado.
> Pode ser utilizada qualquer string como key, e qualquer string ou number como value.

---

Método que colapsa uma linha com detalhe quando executada.

@param { number } rowIndex Índice da linha que será colapsada.
> Ao reordenar os dados da tabela, o valor contido neste índice será alterado conforme a ordenação.

---

Método que expande uma linha com detalhe quando executada.

@param { number } rowIndex Índice da linha que será expandida.
> Ao reordenar os dados da tabela, o valor contido neste índice será alterado conforme a ordenação.

---

Retorna as linhas do `po-table` que estão selecionadas.

---

Retorna as linhas do `po-table` que não estão selecionadas.

---

Método responsável pela exclusão de itens em lote.
Caso a tabela esteja executando a propriedade `p-service-delete`, será necessário excluir 1 item por vez.

Ao utilizar `p-service-delete` mas sem a propriedade `p-service-api`, será responsabilidade do usuário o tratamento
após a requisição DELETE ser executada.

Caso a tabela utilize `p-height` e esteja sem serviço, é necessário a reatribuição dos itens utilizando o evento `(p-delete-items)`, por exemplo:

```
<po-table
 (p-delete-items)="items = $event"
>
</po-table>
```

---

Método que remove um item da tabela.

@param { number | { key: value } } item Índice da linha ou o item que será removido.
> Ao remover o item, a linha que o representa será excluída da tabela.

---

Método que atualiza um item da tabela.

@param { number | { key: value } } item Índice da linha ou o item que será atualizado.
@param { { key: value } } updatedItem Item que foi atualizado.
> Ao atualizar o item, a informação será alterada na tabela.
