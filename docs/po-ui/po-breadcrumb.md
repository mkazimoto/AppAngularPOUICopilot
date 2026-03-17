# po-breadcrumb

@description

Este componente gera uma estrutura de navegação que apresenta ao usuário a localização
da URL atual, exibindo as antecessoras conforme é realizado a navegação na aplicação.

Quando não houver espaçamento suficiente para exibi-lás, o componente se encarrega também
de agrupar as URLs antecessoras, gerando assim um ícone que permite a visualização em cascata.

Caso um endereço seja especificado na propriedade `p-favorite-service`, o componente permite ao usuário
favoritar a URL.

Havendo necessidade de incluir parâmetros na requisição do serviço,
o componente dispõe da propriedade `p-params-service` que recebe um objeto contendo as informações.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                            | Descrição                                             | Valor Padrão                                      |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Default Values**                     |                                                       |                                                   |
| `--font-family`                        | Família tipográfica usada &nbsp;                      | `var(--font-family-theme)`                        |
| `--color`                              | Cor principal do icone de lista                       | `var(--color-action-default)`                     |
| `--color-icon`                         | Cor do icone ">"                                      | `var(--color-neutral-mid-60)`                     |
| `--color-current-page` &nbsp;          | Cor do pagina atual                                   | `var(--color-neutral-mid-60)`                     |

---

**`p-favorite-service`**

@optional

@description

Permite definir uma URL no componente `po-breadcrumb` para favoritar ou desfavoritar.
> Para utilizar esta propriedade, o último `PoBreadcrumbItem` da lista de items da propriedade `p-items` deve ter um link informado.

> A API deve estar preparada para retornar um objeto no formato `{ isFavorite: boolean }`.

Ao iniciar, o `po-breadcrumb` faz um GET na URL definida na propriedade `p-favorite-service` e deve retornar a propriedade
`{ isFavorite: boolean }` do último `PoBreadcrumbItem` definido na lista de itens da propriedade `p-items`.

Ao clicar em favoritar ou desfavoritar o `po-breadcrumb` faz um POST com o link e a propriedade `{ isFavorite: boolean }`
definidos no último item da propriedade `p-items`.

> Caso algum parâmetro seja definido na propriedade `p-params-service`, o mesmo será enviado para a API e retornará
após fazer um GET ou POST.

Exemplo de URL contendo o serviço de favoritar ou desfavoritar:

```
https://po-ui.io/sample/api/favorite
```

Ao fazer o GET o `po-breadcrumb` concatena o link com a URL de serviço. Exemplo:

```
GET http://<domain>/api/favorite?url=/example
```

```
GET http://po.com.br/sample/api/favorite?url=/example
```

```
POST
payload: { isFavorite: true, url: '/example' }
```

Caso possua parâmetros definidos na propriedade `p-params-service`:

```
POST
payload: { isFavorite: true, url: "/example", params: "{ id: 14, user: 'dev.po' }" }
```

Exemplos de retorno:

```
{ isFavorite: true, url: "/example" }
```

```
{ isFavorite: false, url: "/example" }
```

```
{ isFavorite: false, url: "/example", params: "{ id: 14, user: 'dev.po' }" }
```

---

**`p-params-service`**

@optional

@description

Objeto que possibilita o envio de parâmetros adicionais à requisição.

---

**`p-items`**

@description

Lista de itens do _breadcrumb_.

**Exemplo:**
```
{ label: 'Po Portal', link: 'portal' }
```

---

**`p-size`**

@optional

@description

Define o tamanho do componente entre `small` ou `medium`.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

@docsExtends PoBreadcrumbBaseComponent

@example

<example name="po-breadcrumb-basic" title="PO Breadcrumb Basic">
 <file name="sample-po-breadcrumb-basic/sample-po-breadcrumb-basic.component.html"> </file>
 <file name="sample-po-breadcrumb-basic/sample-po-breadcrumb-basic.component.ts"> </file>
</example>

<example name="po-breadcrumb-labs" title="PO Breadcrumb Labs">
 <file name="sample-po-breadcrumb-labs/sample-po-breadcrumb-labs.component.html"> </file>
 <file name="sample-po-breadcrumb-labs/sample-po-breadcrumb-labs.component.ts"> </file>
</example>
