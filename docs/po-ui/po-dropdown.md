# po-dropdown

@description

O componente `po-dropdown` pode ser utilizado como um agrupador de ações e / ou opções.

> Caso não haja configuração de rotas em sua aplicação, se faz necessário importar o `RouterModule`
no módulo principal para o correto funcionamento deste componente:

```
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    ...
    RouterModule.forRoot([]),
    PoModule
  ],
  declarations: [
    AppComponent
  ],
  exports: [],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
```
> Para maiores dúvidas referente à configuração de rotas, acesse em nosso portal /Guias /Começando
[/Configurando as rotas do po-menu](/guides/getting-started).

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                            | Descrição                                             | Valor Padrão                                     |
|----------------------------------------|-------------------------------------------------------|--------------------------------------------------|
| **Default Values**                     |                                                       |                                                  |
| `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                       |
| `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                       |
| `--font-weight`                        | Peso da fonte                                         | `var(--font-weight-bold)`                        |
| `--line-height`                        | Tamanho da label                                      | `var(--line-height-none)`                        |
| `--color`                              | Cor principal do dropdown                             | `var(--color-action-default)`                    |
| `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                        |
| `--border-width`                       | Contém o valor da largura dos cantos do elemento&nbsp;| `var(--border-width-md)`                         |
| `--padding`                            | Preenchimento                                         | `0 1em`                                          |
| **Hover**                              |                                                       |                                                  |
| `--color-hover`                        | Cor principal no estado hover                         | `var(--color-brand-01-darkest)`                  |
| `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lighter)`                  |
| **Focused**                            |                                                       |                                                  |
| `--outline-color-focused` &nbsp;       | Cor do outline do estado de focus                     | `var(--color-action-focus)`                      |
| **Pressed**                            |                                                       |                                                  |
| `--background-pressed` &nbsp;          | Cor de background no estado de pressionado&nbsp;      | `var(--color-brand-01-light)`                    |
| **Disabled**                           |                                                       |                                                  |
| `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-action-disabled)`                   |

---

**`p-label`**

Adiciona um rótulo ao `dropdown`.

---

**`p-actions`**

Lista de ações que serão exibidas no componente.

---

**`p-disabled`**

@optional

@description

Desabilita o campo.

@default `false`

---

**`p-size`**

@optional

@description

Define o tamanho do componente:
- `small`: altura do button como 32px (disponível apenas para acessibilidade AA).
- `medium`: altura do button como 44px.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

@docsExtends PoDropdownBaseComponent

@example

<example name="po-dropdown-basic" title="PO Dropdown Basic" >
 <file name="sample-po-dropdown-basic/sample-po-dropdown-basic.component.html"> </file>
 <file name="sample-po-dropdown-basic/sample-po-dropdown-basic.component.ts"> </file>
</example>

<example name="po-dropdown-subitems" title="PO Dropdown Subitems" >
 <file name="sample-po-dropdown-subitems/sample-po-dropdown-subitems.component.html"> </file>
 <file name="sample-po-dropdown-subitems/sample-po-dropdown-subitems.component.ts"> </file>
</example>

<example name="po-dropdown-labs" title="PO Dropdown Labs" >
 <file name="sample-po-dropdown-labs/sample-po-dropdown-labs.component.html"> </file>
 <file name="sample-po-dropdown-labs/sample-po-dropdown-labs.component.ts"> </file>
</example>

<example name="po-dropdown-social-network" title="PO Dropdown - Social Network" >
 <file name="sample-po-dropdown-social-network/sample-po-dropdown-social-network.component.html"> </file>
 <file name="sample-po-dropdown-social-network/sample-po-dropdown-social-network.component.ts"> </file>
</example>
