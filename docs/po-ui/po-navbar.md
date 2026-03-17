# po-navbar

@description

O componente `po-navbar` é um cabeçalho fixo que permite apresentar uma lista de links para facilitar a navegação pelas
páginas da aplicação. Também possui ícones com ações.

Quando utilizado em uma resolução menor que `768px`, o componente utilizará o menu corrente da aplicação para
incluir seus itens.

Ao utilizar Navbar com Menu e ambos tiverem logo, será mantido o logo do Navbar.

---

@deprecated v23.x.x

@optional

@description

Define uma lista de ações apresentadas em ícones no lado direito do `po-navbar`.

---

@deprecated v23.x.x

@optional

@description

Define uma lista de items do `po-navbar`.

---

@deprecated v23.x.x

@optional

@description

Objeto com a literal usada na propriedade `p-literals`.

Para customizar a literal, basta declarar um objeto do tipo `PoNavbarLiterals` conforme exemplo abaixo:

```
 const customLiterals: PoNavbarLiterals = {
   navbarLinks: 'Itens de navegação'
 };
```

E para carregar as literais customizadas, basta apenas passar o objeto para o componente.

```
<po-navbar
  [p-literals]="customLiterals">
</po-navbar>
```

> O objeto padrão de literais será traduzido de acordo com o idioma do
[`PoI18nService`](/documentation/po-i18n) ou do browser.

---

@deprecated v23.x.x

@optional

@description

Define a logo apresentada `po-navbar`.

---

@deprecated v23.x.x

@optional

@description

Define o texto alternativo para a logomarca.

> **Importante**
> Caso esta propriedade não seja definida o texto padrão será "Logomarca início".

@default `Logomarca início`

---

@deprecated v23.x.x

@optional

@description

Aplica uma sombra na parte inferior do `po-navbar`.

@default `false`

@deprecated v23.x.x use `po-header`

@docsExtends PoNavbarBaseComponent
