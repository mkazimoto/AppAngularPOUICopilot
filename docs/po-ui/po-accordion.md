# po-accordion

@description

Componente utilizado para agrupar visualmente uma lista de conteúdos, mostrando-os individualmente
ao clicar no título de cada item.

Para utilizá-lo, é necessário envolver cada item no componente [`po-accordion-item`](/documentation/po-accordion-item),
como no exemplo abaixo:

```
<po-accordion #accordion [p-show-manager-accordion]="true">
  <po-accordion-item p-label="PO Accordion 1">
     Accordion 1
  </po-accordion-item>

  <po-accordion-item p-label="PO Accordion 2">
     Accordion 2
  </po-accordion-item>
</po-accordion>
```

e no typescript pode-se utilizar o `@ViewChild`:

```
 @ViewChild(PoAccordionComponent, { static: true }) accordion: PoAccordionComponent;

 ngAfterContentInit() {
   // ou utilizar o método collapseAllItems();
   this.accordion.expandAllItems();
 }
```

O componente já faz o controle de abertura e fechamento dos itens automaticamente.

Caso houver a necessidade de abrir algum dos `po-accordion-item` via Typescript
acesse a [documentação do PoAccordionItem](/documentation/po-accordion-item).

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                            | Descrição                                             | Valor Padrão                                      |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Default Values**                     |                                                       |                                                   |
| `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                        |
| `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                        |
| `--color`                              | Cor principal do accordion                            | `var(--color-action-default)`                     |
| `--background-color`                   | Cor de background                                     | `var(--color-neutral-light-00)`                   |
| `--font-weight`                        | Peso da fonte                                         | `var(--font-weight-bold)`                         |
| **Hover**                              |                                                       |                                                   |
| `--color-hover`                        | Cor principal no estado hover                         | `var(--color-action-hover)`                       |
| `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lightest)`                  |
| **Focused**                            |                                                       |                                                   |
| `--color-focused`                      | Cor principal no estado de focus                      | `var(--color-action-focus)`                       |
| `--outline-color-focused` &nbsp;       | Cor do outline do estado de focus                     | `var(--color-action-focus)`                       |
| **Disabled**                           |                                                       |                                                   |
| `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-neutral-mid-60)`                     |
| `--background-disabled` &nbsp;         | Cor de background no estado disabled                  | `var(--color-neutral-light-10)`                   |
| **po-accordion-manager**               |                                                       |                                                   |
| `--background-color`                   | Cor de background                                     | `var(--color-neutral-mid-60)`                     |
| `--color`                              | Cor principal do accordion manager                    | `var(--color-neutral-light-10)`                   |
| `--font-family`                        | Família tipográfica usada                             | `var(--color-neutral-light-10)`                   |
| `--font-size`                          | Tamanho da fonte                                      | `var(--color-neutral-light-10)`                   |
| `--font-weight`                        | Peso da fonte                                         | `var(--color-neutral-light-10)`                   |
| **Pressed**                            |                                                       |                                                   |
| `--background-pressed` &nbsp;          | Cor de background no estado de pressionado&nbsp;      | `var(--color-brand-01-lighter)`                   |
| `--color-pressed`                      | Cor principal no estado de pressionado                | `var(--color-action-pressed)`                     |

---

@optional

@description

Objeto com as literais usadas no `po-accordion`.

Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:

```
 const customLiterals: PoAccordionLiterals = {
   closeAllItems: 'Fechar todos os itens',
   expandAllItems: 'Expandir todos os itens'
 };
```

Ou passando apenas as literais que deseja customizar:

```
 const customLiterals: PoAccordionLiterals = {
   expandAllItems: 'Expandir todos os itens'
 };
```

E para carregar as literais customizadas, basta apenas passar o objeto para o componente.

```
<po-accordion
  [p-literals]="customLiterals">
</po-accordion>
```

> O objeto padrão de literais será traduzido de acordo com o idioma do
[`PoI18nService`](/documentation/po-i18n) ou do browser.

---

@optional

@description

Exibe o Gerenciador de Accordion.

@default `false`

---

@optional

@description

Permite expandir mais de um `<po-accordion-item></po-accordion-item>` ao mesmo tempo.
Sempre habilitada caso a propriedade `p-show-manager-accordion` esteja como `true`.

@default `false`

---

@optional

@description

Define o tamanho do componente:
- `small`: altura de 32px (disponível apenas para acessibilidade AA).
- `medium`: altura de 44px.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

---

@optional

@description

Evento disparado ao expandir o gerenciador de accordion, seja manualmente ou programaticamente.

---

@optional

@description

Evento disparado ao retrair o gerenciador de accordion, seja manualmente ou programaticamente.

@docsExtends PoAccordionBaseComponent

@example

<example name="po-accordion-basic" title="PO Accordion Basic" >
 <file name="sample-po-accordion-basic/sample-po-accordion-basic.component.html"> </file>
 <file name="sample-po-accordion-basic/sample-po-accordion-basic.component.ts"> </file>
</example>

<example name="po-accordion-labs" title="PO Accordion Labs" >
 <file name="sample-po-accordion-labs/sample-po-accordion-labs.component.html"> </file>
 <file name="sample-po-accordion-labs/sample-po-accordion-labs.component.ts"> </file>
</example>

<example name="po-accordion-faq" title="PO Accordion - FAQs" >
 <file name="sample-po-accordion-faq/sample-po-accordion-faq.component.html"> </file>
 <file name="sample-po-accordion-faq/sample-po-accordion-faq.component.ts"> </file>
</example>

---

Método para colapsar todos os itens.
Só pode ser utilizado quando a propriedade `p-show-manager-accordion` estiver como `true`.

---

Método para expandir todos os itens.
Só pode ser utilizado quando a propriedade `p-show-manager-accordion` estiver como `true`.
