# po-menu

@description

Este é um componente de menu lateral que é utilizado para navegação nas páginas de uma aplicação.

O componente po-menu recebe uma lista de objetos do tipo `MenuItem` com as informações dos itens de menu como
textos, links para redirecionamento, ações, até 4 níveis de menu e ícones para o primeiro nível de menu.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                            | Descrição                                             | Valor Padrão                                    |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values**                     |                                                       |                                                 |
| `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                       |
| `--border-color`                       | Cor da borda                                          | `var(--color-neutral-light-20)`                 |
| `--background-color`                   | Cor de background                                     | `Var(----color-neutral-light-05)`               |
| **Menu Footer**                        |                                                       |                                                 |
| `--color`                              | Cor principla do menu footer                          | `var(--color-action-default)`                   |
| `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                      |
| `--line-height`                        | Tamanho da label                                      | `var(--line-height-md)`                         |
| `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                     |
| `--font-weight-lvl0`                   | Peso da fonte                                         | `var(--font-weight-bold)`                       |
| **po-menu-item**                       |                                                       |                                                 |
| `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                      |
| `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                      |
| `--line-height`                        | Tamanho da label                                      | `var(--line-height-md)`                         |
| `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                       |
| `--color`                              | Cor principal do item                                 | `var(--color-action-default)`                   |
| `--background-color`                   | Cor do background                                     | `transparent`                                   |
| **Hover**                              |                                                       |                                                 |
| `--color-hover`                        | Cor principal no estado hover                         | `var(--color-brand-01-darkest)`                 |
| `--background-color-hover`             | Cor de background no estado hover                     | `var(--color-brand-01-lighter)`                 |
| **Focused**                            |                                                       |                                                 |
| `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                     |
| **Pressed**                            |                                                       |                                                 |
| `--background-color-pressed` &nbsp;    | Cor de background no estado de pressionado&nbsp;      | `var(--color-brand-01-light)`                   |
| **Actived**                            |                                                       |                                                 |
| `--background-color-actived`           | Cor de background no estado actived                   | `var(--color-brand-01-darkest)`                 |
| `--color-actived`                      | Cor principal no estado actived                       | `var(--color-brand-01-lighter)`                 |
| **Font**                               |                                                       |                                                 |
| `--font-weight-lvl0`                   | Peso da fonte bold                                    | `var(--font-weight-bold)`                       |
| `--font-weight-lvl1`                   | Peso da fonte                                         | `var(--font-weight-normal)`                     |

<br>

---

**`p-automatic-toggle`**

@optional

@description

Expande e Colapsa (retrai) o menu automaticamente.

@default `false`

---

**`p-collapsed`**

@optional

@description

Colapsa (retrai) o menu e caso receba o valor `false` expande o menu.

> Utilize esta propriedade para iniciar o menu colapsado.

> Ao utilizar os métodos [`colapse`](documentation/po-menu#colapseMethod), [`expand`](documentation/po-menu#expandMethod) e
[`toggle`](documentation/po-menu#toggleMethod) o valor desta propriedade não é alterado.

**Importante:**

> O menu será colapsado/expandido apenas se todos os itens de menu tiverem valor nas propriedades `icon` e `shortLabel`.

@default `false`

---

**`p-components-size`**

@optional

@description

Define o tamanho dos componentes de formulário no menu:
- `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
- `medium`: aplica a medida medium de cada componente.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

---

**`p-menus`**

Lista dos itens do menu. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio.

---

**`p-filter`**

@optional

@description

Habilita um campo para pesquisa no menu.
A pesquisa é realizada em todos os níveis do menu e busca apenas pelos itens que contém uma ação e/ou link definidos,
ou também, pode ser realizada através de um serviço definido na propriedade `p-service`.

> O campo de pesquisa é desabilitado se o menu estiver colapsado.

@default `false`

---

**`p-search-tree-items`**

@optional

@description

Quando ativado, a pesquisa também retornará itens agrupadores além dos itens que contêm uma ação e/ou link definidos.
Isso pode ser útil quando se deseja encontrar rapidamente categorias ou seções do menu.

> É necessário que a propriedade `p-filter` esteja habilitada.

@default `false`

---

**`p-service`**

@optional

@description

Nesta propriedade deve ser informada a URL do serviço em que será utilizado para realizar o filtro de itens do
menu quando realizar uma busca. Caso haja a necessidade de customização, pode ser informado um
serviço implementando a interface `PoMenuFilter`.

Caso utilizada uma URL, o serviço deve retornar os dados conforme o
[Guia de implementação de APIs](https://po-ui.io/guides/api) do PO UI.

Quando utilizada uma URL de serviço, será realizado um *GET* na URL informada, passando o valor digitado
no parâmetro `search`, veja exemplo:

> O filtro no serviço será realizado caso contenha no mínimo três caracteres no campo de busca, por exemplo `tot`.

```
<po-menu p-service="/api/v1/fnd/menu">
</po-menu>

Requisição: GET /api/v1/fnd/menu?search=contas
```

> É necessário que propriedade `p-filter` esteja habilitada.

---

**`p-params`**

@optional

@description

Deve ser informado um objeto que deseja-se utilizar na requisição de filtro dos itens de menu.

Caso utilizado um serviço customizado, implementando a interface `PoMenuFilter`, o valor desta propriedade
será passado como parâmetro, na função `getFilteredData`.

Quando utilizada uma URL de serviço, será realizado um *GET* na URL informada, passando os valores informados
nesta propriedade em conjunto com o parâmetro `search`, veja exemplo:

```
<po-menu p-service="/api/v1/fnd/menu" [p-params]="{ company: 1, user: 297767512 }">
</po-menu>

Requisição: GET /api/v1/fnd/menu?search=contas&company=1&user=297767512
```

---

**`p-logo`**

@optional

@description

Caminho para a logomarca, que será exibida quando o componente estiver expandido, localizada na parte superior.

> **Importante:**
- Caso esta propriedade estiver indefinida ou inválida o espaço para logomarca será removido.
- Como boa prática, indica-se utilizar imagens com até `24px` de altura e `224px` de largura,
caso ultrapassar esses valores a imagem será readequada no espaço disponível.

---

**`p-logo-alt`**

@optional

@description

Define o texto alternativo para a logomarca.

> **Importante**
> Caso esta propriedade não seja definida o texto padrão será "Logomarca início".

@default `Logomarca início`

---

**`p-short-logo`**

@optional

@description

Caminho para a logomarca, que será exibida quando o componente estiver colapsado, localizada na parte superior.

> **Importante:**
- Caso esta propriedade estiver indefinida ou inválida passa a assumir o valor informado na propriedade `p-logo` e na ausência desta o
espaço para logomarca será removido.
- Como boa prática, indica-se utilizar imagens com até `48px` de altura e `48px` de largura,
caso ultrapassar esses valores a imagem será readequada no espaço disponível.
- Caso não informar um valor, esta propriedade passa a assumir o valor informado na propriedade `p-logo`.

---

**`p-logo-link`**

@optional

@description
Define o link para a rota ao clicar no logo do menu.

- Se o valor for uma string, define a rota para o link informado.
- Se for `false`, o logo não terá link associado.
- Se for `true`, o logo terá a rota padrão `./`.

@default `true`

@docsExtends PoMenuBaseComponent

@description

Aparece completo em telas com largura maior que 1200px, caso contrário o menu é escondido e chamado por meio de um botão.

O menu também pode ser colapsado. Essa opção é habilitada quando todos os itens de primeiro nível possuírem ícones e textos curtos.
Se colapsado, somente os itens de primeiro nível serão exibidos e, caso o item selecionado possua sub-níveis,
então o menu alternará novamente para o estado aberto.

Existe a possibilidade de customizar a logomarca, que é exibida na parte superior do componente.

E para adicionar um conteúdo personalizado entre a logomarca e o campo de filtro,
basta adicionar este conteúdo com a diretiva [**p-menu-header-template**](/documentation/po-menu-header-template).

Caso utilizar o filtro de menus, é possível realizar buscas em serviço, apenas informando a URL do serviço ou a instância de
um serviço customizado implementando a interface `PoMenuFilter`.

Para o menu funcionar corretamente é necessário importar o `RouterModule` e `Routes` do módulo principal de
 sua aplicação:

```
import { RouterModule, Routes } from '@angular/router';

...

@NgModule({
  imports: [
    RouterModule,
    Routes,
    ...
    PoModule,
    ...
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Além disso é necessário criar um módulo configurando as rotas da aplicação.

```
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { HelloWorldComponent } from './hello-world/hello-world.component';

const routes: Routes = [
  {path: 'hello-world', component: HelloWorldComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

@example

<example name="po-menu-basic" title="PO Menu Basic">
  <file name="sample-po-menu-basic/sample-po-menu-basic.component.html"> </file>
  <file name="sample-po-menu-basic/sample-po-menu-basic.component.ts"> </file>
</example>

<example name="po-menu-labs" title="PO Menu Labs">
  <file name="sample-po-menu-labs/sample-po-menu-labs.component.html"> </file>
  <file name="sample-po-menu-labs/sample-po-menu-labs.component.ts"> </file>
</example>

<example name="po-menu-human-resources" title="PO Menu - Human Resources">
  <file name="sample-po-menu-human-resources/sample-po-menu-human-resources.component.html"> </file>
  <file name="sample-po-menu-human-resources/sample-po-menu-human-resources.component.ts"> </file>
  <file name="sample-po-menu-human-resources/sample-po-menu-human-resources.service.ts"> </file>
</example>

---

<a id="colapseMethod"></a>

Método para colapsar (retrair) o menu.

---

<a id="expandMethod"></a>

Método para expandir (aumentar) o menu.

---

<a id="toggleMethod"></a>
Método que colapsa e expande o menu alternadamente.

> Os métodos apenas vão colapsar/expandir o menu se:
 - Todos os itens de menu tiverem valor nas propriedades `icon` e `shortLabel`.
