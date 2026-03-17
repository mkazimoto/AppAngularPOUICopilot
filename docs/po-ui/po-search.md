# po-search

@description

O componente search, também conhecido como barra de pesquisa, é utilizado para ajudar os usuários a localizar um determinado conteúdo.

Normalmente localizado no canto superior direito, junto com o ícone de lupa, uma vez que este ícone é amplamente reconhecido.

#### Boas práticas

Foram estruturados os padrões de usabilidade para auxiliar na utilização do componente e garantir uma boa experiência
aos usuários. Portanto, é de extrema importância que, ao utilizar este componente, as pessoas responsáveis por seu
desenvolvimento considerem os seguintes critérios:
- Utilize labels para apresentar resultados que estão sendo exibidos e apresente os resultados mais relevantes
primeiro.
- Exiba uma mensagem clara quando não forem encontrados resultados para busca e sempre que possível ofereça outras
sugestões de busca.
- Mantenha o texto original no campo de input, que facilita a ação do usuário caso queira fazer uma nova busca com
alguma modificação na pesquisa.
- Caso seja possível detectar um erro de digitação, mostre os resultados para a palavra "corrigida", isso evita a
frustração de não obter resultados e não força o usuário a realizar uma nova busca.
- Quando apropriado, destaque os termos da busca nos resultados.
- A entrada do campo de pesquisa deve caber em uma linha. Não use entradas de pesquisa de várias linhas.
- Recomenda-se ter apenas uma pesquisa por página. Se você precisar de várias pesquisas, rotule-as claramente para
indicar sua finalidade.
- Se possível, forneça sugestões de pesquisa, seja em um helptext ou sugestão de pesquisa que é um autocomplete. Isso
ajuda os usuários a encontrar o que estão procurando, especialmente se os itens pesquisáveis forem complexos.

#### Acessibilidade tratada no componente

 Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo
proprietário do conteúdo. São elas:
- Permitir a interação via teclado (2.1.1: Keyboard (A));
- Alteração entre os estados precisa ser indicada por mais de um elemento além da cor (1.4.1: Use of Color);

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                            | Descrição                                             | Valor Padrão                                      |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Default Values**                     |                                                       |                                                   |
| `--font-family`                        | Família tipográfica do campo                          | `var(--font-family-theme)`                        |
| `--font-size`                          | Tamanho da fonte do campo                             | `var(--font-size-default)`                        |
| `--text-color-placeholder`             | Cor do texto no placeholder                           | `var(--color-neutral-light-30)`                   |
| `--color`                              | Cor das bordas                                        | `var(--color-neutral-dark-70)`                    |
| `--border-radius`                      | Raio das bordas                                       | `var(--border-radius-md)`                         |
| `--background`                         | Cor de background                                     | `var(--color-neutral-light-05)`                   |
| `--text-color`                         | Cor do texto editável                                 | `var(--color-neutral-dark-90)`                    |
| `--color-clear`                        | Cor do ícone close                                    | `var(--color-action-default)`                     |
| `--color-controls`                     | Cor dos ícones de controle do mode location           | `var(--color-action-default)`                     |
| `--transition-property`                | Atributo da transição                                 | `all`                                             |
| `--transition-duration`                | Duração da transição                                  | `var(--duration-extra-fast)`                      |
| `--transition-timing`                  | Duração da transição com o tipo de transição          | `var(--timing-standart)`                          |
| **Icon**                               |                                                       |                                                   |
| `--color-icon-read`                    | Cor do ícone de busca no modo action                  | `var(--color-neutral-dark-70)`                    |
| `--color-icon`                         | Cor do ícone de busca no modo trigger                 | `var(--color-action-default)`                     |
| **Hover**                              |                                                       |                                                   |
| `--color-hover`                        | Cor das bordas no estado hover                        | `var(--color-action-hover)`                       |
| `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lightest)`                  |
| **Focused**                            |                                                       |                                                   |
| `--color-focused`                      | Cor das bordas no estado de focus                     | `var(--color-action-default)`                     |
| `--outline-color-focused`              | Cor do outline no estado de focus                     | `var(--color-action-focus)`                       |
| **Disabled**                           |                                                       |                                                   |
| `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-action-disabled)`                    |
| `--background-disabled`                | Cor de background no estado disabled                  | `var(--color-neutral-light-20)`                   |

---

@optional

@description

Define um aria-label para o po-search.

> Devido o componente não possuir uma label assim como outros campos de texto, o `aria-label` é utilizado para
acessibilidade.

---

@optional

@description

Desabilita o po-search e não permite que o usuário interaja com o mesmo.

@default `false`

---

@optional

@description
Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento.

> Incompatível com a propriedade `p-search-type` do tipo `locate`.

@default `false`

---

@description

Define os nomes das propriedades do objeto que serão utilizados para busca em `p-items`. Cada valor definido no
array será considerado durante a apresentação e filtragem dos itens.
Exemplo de uso:
```typescript
const filterKeys: Array<string> = ['name', 'gender', 'planet', 'father'];
```

> Esta propriedade é ignorada quando utilizado com `p-filter-select` e incompatível com a propriedade
`p-search-type` do tipo `locate`.

---

@description

Habilita um seletor de filtros à esquerda do campo, permitindo a aplicação de filtros agrupados na busca ou sobre
os itens fornecidos em `p-items`. Automaticamente adiciona a opção **Todos**, com um mapeamento de todas as opções passadas.

Exemplo de uso:
```typescript
const filterSelect = [
  { label: 'personal', value: ['name', 'email', 'nickname'] },
  { label: 'address', value: ['country', 'state', 'city', 'street'] },
  { label: 'family', value: ['father', 'mother', 'dependents'] }
];
```

> Ao ser habilitada, a propriedade `p-filter-keys` será ignorada. Esta propriedade é incompatível com a propriedade
`p-search-type` do tipo `locate`.

---

@optional

@description

Define o modo de pesquisa utilizado no campo de busca. Os valores permitidos são definidos pelo enum
**PoSearchFilterMode**.

> Incompatível com a propriedade `p-search-type` do tipo `locate`.

@default `startsWith`

---

@optional

@description

Permite customizar o ícone de busca que acompanha o campo.

É possível usar qualquer um dos ícones da [Biblioteca de ícones PO UI](https://po-ui.io/icons), conforme exemplo:
```
<po-search p-icon="an an-user"></po-search>
```
Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, desde que a biblioteca
esteja carregada no projeto:
```
<po-search p-icon="fa fa-podcast"></po-search>
```

Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
```
<po-search [p-icon]="template"></po-search>

<ng-template #template>
  <i class="fa fa-podcast" style="font-size: inherit;"></i>
</ng-template>
```

---

@optional

@description

Lista de itens que serão utilizados para pesquisa.

> Incompatível com a propriedade `p-search-type` do tipo `locate`.

---

@optional

@description

Objeto com as literais usadas no `po-search`, permitindo personalizar os textos exibidos no componente.

Para utilizar basta passar a literal que deseja customizar:

```
 const customLiterals: PoSearchLiterals = {
   search: 'Pesquisar',
   clean: 'Limpar',
 };
```

E para carregar a literal customizada, basta apenas passar o objeto para o componente.

```
<po-search
  [p-literals]="customLiterals">
</po-search>
```

> O objeto padrão de literais será traduzido de acordo com o idioma do [`PoI18nService`](/documentation/po-i18n) ou
do browser.

---

@optional

@description

Define os valores do contador exibido ao usar a propriedade `p-search-type` do tipo `locate`, indicando a posição
atual e o total de ocorrências encontradas.
Exemplo de uso:
```ts
locateSummary: PoSearchLocateSummary = { currentIndex: 0, total: 5 };
```

> Compatível com a propriedade `p-search-type` do tipo `locate`.

---

@optional

@description
Nome e identificador do campo.

---

@optional

@description

Define a propriedade nativa `autocomplete` do campo como `off`.

@default `false`

---

@optional

@description

Determina a forma de realizar a pesquisa no componente. Valores aceitos:
- `action`: Realiza a busca a cada caractere digitado.
- `trigger`: Realiza a busca ao pressionar `enter` ou clicar no ícone de busca.
- `locate`: Modo manual. Exibe botões e contador, mas não executa buscas — controle é do desenvolvedor.
- `execute`: Executa uma ação ou realiza um redirecionamento ao selecionar um item no `listbox`.
   Para este tipo, é necessário informar as propriedades `action` ou `url` nos itens definidos em `p-items`.

@default `action`

---

@optional

@description

Exibe uma lista (auto-complete) com as opções definidas em `p-filter-keys` ou `p-filter-select` enquanto realiza
uma busca, respeitando o `p-filter-type` como modo de pesquisa.

> Incompatível com a propriedade `p-search-type` do tipo `locate`.

@default `false`

---

@optional

@description

Define o tamanho do componente:
- `small`: altura do input como 32px (disponível apenas para acessibilidade AA).
- `medium`: altura do input como 44px.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

---

@optional

@description

Define os nomes das propriedades do objeto que serão exibidos como rótulos (labels) no `listbox` quando a propriedade
`p-show-listbox` estiver habilitada.

Deve ser informado um array de strings contendo até **3 propriedades**.

Exemplo de uso:
```ts
keysLabel: Array<string> = ['nome', 'email', 'country'];
```

---

@optional

@description

Evento disparado ao sair do campo.

---

@optional

@description

Evento disparado ao alterar valor do model.

---

@optional

@description

Pode ser informada uma função que será disparada quando houver alterações nos filtros.

> Incompatível com a propriedade `p-search-type` do tipo `locate`.

---

@optional

@description

Pode ser informada uma função que será disparada quando houver alterações no input.

> Incompatível com a propriedade `p-search-type` do tipo `locate`.

---

@optional

@description

Evento emitido quando o campo de entrada (input) recebe foco.

---

@optional

@description
Evento disparado quando uma tecla é pressionada enquanto o foco está no componente.
Retorna um objeto `KeyboardEvent` com informações sobre a tecla.

---

@optional

@description

Pode ser informada uma função que será disparada quando houver click no listbox.

> Incompatível com a propriedade `p-search-type` do tipo `locate`.

---

@optional

@description

Evento disparado ao clicar no controle "Próximo resultado".

> Compatível com a propriedade `p-search-type` do tipo `locate`.

---

@optional

@description

Evento disparado ao clicar no controle "Resultado anterior".

> Compatível com a propriedade `p-search-type` do tipo `locate`.

---

@optional

@description

Evento disparado ao clicar no botão de ação exibido no rodapé do `listbox`.
O texto exibido pode ser configurado por meio do literal `footerActionListbox`.

@docsExtends PoSearchBaseComponent

@example

<example name="po-search-basic" title="PO Search Basic">
 <file name="sample-po-search-basic/sample-po-search-basic.component.html"> </file>
 <file name="sample-po-search-basic/sample-po-search-basic.component.ts"> </file>
</example>

<example name="po-search-labs" title="PO Search Labs">
 <file name="sample-po-search-labs/sample-po-search-labs.component.html"> </file>
 <file name="sample-po-search-labs/sample-po-search-labs.component.ts"> </file>
 <file name="sample-po-search-labs/sample-po-search-labs.service.ts"> </file>
</example>

<example name="po-search-find-people" title="PO Search Find People">
 <file name="sample-po-search-find-people/sample-po-search-find-people.component.html"> </file>
 <file name="sample-po-search-find-people/sample-po-search-find-people.component.ts"> </file>
 <file name="sample-po-search-find-people/sample-po-search-find-people.service.ts"> </file>
</example>

<example name="po-search-listbox" title="PO Search With Listbox">
 <file name="sample-po-search-listbox/sample-po-search-listbox.component.html"> </file>
 <file name="sample-po-search-listbox/sample-po-search-listbox.component.ts"> </file>
 <file name="sample-po-search-listbox/sample-po-search-listbox.service.ts"> </file>
</example>

<example name="po-search-filter-select" title="PO Search With Filter Select + Listbox">
 <file name="sample-po-search-filter-select/sample-po-search-filter-select.component.html"> </file>
 <file name="sample-po-search-filter-select/sample-po-search-filter-select.component.ts"> </file>
</example>

<example name="po-search-execute" title="PO Search Form Fields with Execute">
 <file name="sample-po-search-execute/sample-po-search-execute.component.html"> </file>
 <file name="sample-po-search-execute/sample-po-search-execute.component.ts"> </file>
</example>

<example name="po-search-fields-locate" title="PO Search Form Fields with Locate">
 <file name="sample-po-search-fields-locate/sample-po-search-fields-locate.component.html"> </file>
 <file name="sample-po-search-fields-locate/sample-po-search-fields-locate.component.ts"> </file>
</example>
