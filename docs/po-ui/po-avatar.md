# po-avatar

@description

O componente `po-avatar` é um container para imagens em miniatura, possui um formato redondo e cinco opções de
tamanho, pode ser utilizado para mostrar a foto do perfil de um usuário, entre outras possibilidades.

Além de poder ser utilizado separadamente, é possível usar o `po-avatar` juntamente com outros componentes e criar
layouts ricos e bem interessantes para os usuários, como por exemplo, uma lista de itens ou produtos.

---

Fonte da imagem que pode ser um caminho local (`./assets/images/logo-black-small.png`)
ou um servidor externo (`https://po-ui.io/assets/images/logo-black-small.png`).

---

@optional

@description

Indica como o navegador deve carregar a imagem.

Valores válidos:
 - `eager` (a imagem é carregada imediatamente, independente de estar visível ou não)
 - `lazy` (a imagem só é carregada quando estiver próxima de ser renderizada)

@default `eager`

---

@optional

@description

Tamanho de exibição do componente.

Valores válidos:
 - `xs` (24x24)
 - `sm` (32x32)
 - `md` (64x64)
 - `lg` (96x96)
 - `xl` (144x144)

@default `md`

@docsExtends PoAvatarBaseComponent

@example

<example name="po-avatar-basic" title="PO Avatar Basic" >
 <file name="sample-po-avatar-basic/sample-po-avatar-basic.component.html"> </file>
 <file name="sample-po-avatar-basic/sample-po-avatar-basic.component.ts"> </file>
</example>

<example name="po-avatar-labs" title="PO Avatar Labs" >
 <file name="sample-po-avatar-labs/sample-po-avatar-labs.component.html"> </file>
 <file name="sample-po-avatar-labs/sample-po-avatar-labs.component.ts"> </file>
</example>

<example name="po-avatar-business-card" title="PO Avatar - Business Card" >
 <file name="sample-po-avatar-business-card/sample-po-avatar-business-card.component.html"> </file>
 <file name="sample-po-avatar-business-card/sample-po-avatar-business-card.component.ts"> </file>
</example>
