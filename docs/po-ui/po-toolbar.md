# po-toolbar

@description

O componente `po-toolbar` é um cabeçalho para o título da aplicação e informações de usuário e notificações quando houver necessidade.

---

@optional

@description

Define uma lista de ações que serão exibidas ao clicar no ícone declarado em `p-actions-icon`.

---

@optional

@description

Define um [ícone](https://po-ui.io/icons) para a propriedade `p-actions`.

É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons). conforme exemplo abaixo:
```
<po-toolbar p-actions-icon="an an-user" [p-actions]="actions"></po-toolbar>
```
Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
```
<po-toolbar p-actions-icon="far fa-comment-alt" [p-actions]="actions"></po-toolbar>
```
Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
```
<po-toolbar [p-actions-icon]="template" [p-actions]="actions"></po-toolbar>

<ng-template #template>
 <ion-icon style="font-size: inherit" name="heart"></ion-icon>
</ng-template>
```
> Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.

> Caso não haja ações definidas em `p-actions`, o ícone não será exibido.

@default `an-dots-three`

---

Define o objeto que será o cabeçalho da lista de ações com as informações do perfil.

---

Define uma lista de ações que serão exibidas ao clicar no ícone do perfil.

---

@optional

@description

Lista de ações da notificação.

@docsExtends PoToolbarBaseComponent

@example

<example name="po-toolbar-basic" title="PO Toolbar Basic">
 <file name="sample-po-toolbar-basic/sample-po-toolbar-basic.component.html"> </file>
 <file name="sample-po-toolbar-basic/sample-po-toolbar-basic.component.ts"> </file>
</example>

<example name="po-toolbar-labs" title="PO Toolbar Labs">
 <file name="sample-po-toolbar-labs/sample-po-toolbar-labs.component.html"> </file>
 <file name="sample-po-toolbar-labs/sample-po-toolbar-labs.component.ts"> </file>
</example>

<example name="po-toolbar-logged" title="PO Toolbar - Logged">
 <file name="sample-po-toolbar-logged/sample-po-toolbar-logged.component.html"> </file>
 <file name="sample-po-toolbar-logged/sample-po-toolbar-logged.component.ts"> </file>
</example>
