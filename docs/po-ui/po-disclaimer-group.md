# po-disclaimer-group

@description

O componente `po-disclaimer-group` é recomendado para manipular palavras-chave de filtros aplicados em uma pesquisa.

À partir de dois *disclaimers* com o botão **fechar** habilitado, o componente renderiza de forma automática um novo e destacado
*disclaimer* que possibilita **remover todos**, mas que também pode ser desabilitado.

Também é possível navegar entre os *disclaimers* através do teclado utilizando a tecla *tab* e, para remoção do *disclaimer* selecionado,
basta pressionar a tecla *enter*. Esta funcionalidade não se aplica caso a propriedade `hideClose` estiver habilitada.

> Veja a integração destas funcionalidade no componente [po-page-list](/documentation/po-page-list).

---

**`p-title`**

Título do grupo de *disclaimers*.

---

**`p-change`**

@optional

@description

Função que será disparada quando a lista de *disclaimers* for modificada.

---

**`p-remove`**

@optional

@description

Função que será disparada quando um *disclaimer* for removido da lista de *disclaimers* pelo usuário.

Recebe como parâmetro um objeto conforme a interface `PoDisclaimerGroupRemoveAction`.

---

**`p-remove-all`**

@optional

@description

Função que será disparada quando todos os *disclaimers* forem removidos da lista de *disclaimers* pelo usuário,
utilizando o botão "remover todos".

Recebe como parâmetro uma lista contendo todos os `disclaimers` removidos.

---

**`p-disclaimers`**

@description

Lista de *disclaimers*.

Para que a lista de *disclaimers* seja atualizada dinamicamente deve-se passar uma nova referência do array de `PoDisclaimer`.

Exemplo adicionando um *disclaimer* no array:

```
this.disclaimers = [...this.disclaimers, disclaimer];
```

ou

```
this.disclaimers = this.disclaimers.concat(disclaimer);
```

---

**`p-hide-remove-all`**

@optional

@description

Oculta o botão para remover todos os *disclaimers* do grupo.

> Por padrão, o mesmo é exibido à partir de dois ou mais *disclaimers* com a opção `hideClose` habilitada.

@default `false`

@docsExtends PoDisclaimerGroupBaseComponent

@example

<example name="po-disclaimer-group-basic" title="PO Disclaimer Group Basic">
  <file name="sample-po-disclaimer-group-basic/sample-po-disclaimer-group-basic.component.html"> </file>
  <file name="sample-po-disclaimer-group-basic/sample-po-disclaimer-group-basic.component.ts"> </file>
</example>

<example name="po-disclaimer-group-labs" title="PO Disclaimer Group Labs">
  <file name="sample-po-disclaimer-group-labs/sample-po-disclaimer-group-labs.component.html"> </file>
  <file name="sample-po-disclaimer-group-labs/sample-po-disclaimer-group-labs.component.ts"> </file>
</example>

<example name="po-disclaimer-group-sw-planets" title="PO Disclaimer Group - Star Wars Planets">
  <file name="sample-po-disclaimer-group-sw-planets/sample-po-disclaimer-group-sw-planets.component.html"> </file>
  <file name="sample-po-disclaimer-group-sw-planets/sample-po-disclaimer-group-sw-planets.component.ts"> </file>
  <file name="sample-po-disclaimer-group-sw-planets/sample-po-disclaimer-group-sw-planets.service.ts"> </file>
</example>
