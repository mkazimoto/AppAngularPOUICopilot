# po-badge

@description

Utilizado para exibir a quantidade de notificações.

---

@description

Define um `aria-label` para o `po-badge`

---

@optional

@description

Determina a cor do `po-badge`. As maneiras de customizar as cores são:
- Hexadeximal, por exemplo `#c64840`;
- RGB, como `rgb(0, 0, 165)`;
- O nome da cor, por exemplo `blue`;
- Usando uma das cores do tema do PO:
Valores válidos:
  - <span class="dot po-color-01"></span> `color-01`
  - <span class="dot po-color-02"></span> `color-02`
  - <span class="dot po-color-03"></span> `color-03`
  - <span class="dot po-color-04"></span> `color-04`
  - <span class="dot po-color-05"></span> `color-05`
  - <span class="dot po-color-06"></span> `color-06`
  - <span class="dot po-color-07"></span> `color-07`
  - <span class="dot po-color-08"></span> `color-08`
  - <span class="dot po-color-09"></span> `color-09`
  - <span class="dot po-color-10"></span> `color-10`
  - <span class="dot po-color-11"></span> `color-11`
  - <span class="dot po-color-12"></span> `color-12`

@default `color-07`

---

@optional

@description
Ícone exibido no `po-badge`.

Para exibir icone do status atual declare a propriedade `p-icon`. conforme exemplo abaixo:
```
<po-badge [p-icon]="true"></po-badge>
```
É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons). conforme exemplo abaixo:
```
<po-badge p-icon="an an-user"></po-badge>
```
Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
```
<po-badge p-icon="fa fa-podcast"></po-badge>
```
Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
```
<po-badge [p-icon]="template"></po-badge>

<ng-template #template>
 <ion-icon style="font-size: inherit" name="heart"></ion-icon>
</ng-template>
```

---

@description

Define o estado do `po-badge`

Valores válidos:
- `positive`: Define a cor do `po-badge` com a cor de feedback positivo.;
- `negative`: Define a cor do `po-badge` com a cor de feedback negative.;
- `warning`: Define a cor do `po-badge` com a cor de feedback warning.;
- `disabled`: Define a cor do `po-badge` com a cor de feedback disabled;

---

@description

Define o tamanho do `po-badge`

Valores válidos:
- `small`: o `po-badge` fica do tamanho padrão, com 8px de altura.;
- `medium`: o `po-badge` fica do tamanho padrão, com 16px de altura.;
- `large`: o `po-badge` fica do tamanho padrão, com 24px de altura.;

@default `medium`

---

@description

Exibe uma borda para o `po-badge`

> Pode personalizar cor da bordar com a propriedade `p-color-border`

---

@description

Número exibido no componente, caso o mesmo seja maior que 9 o valor exibido será 9+.

@docsExtends PoBadgeBaseComponent

@example

<example name="po-badge-basic" title="PO Badge Basic">
 <file name="sample-po-badge-basic/sample-po-badge-basic.component.html"> </file>
 <file name="sample-po-badge-basic/sample-po-badge-basic.component.ts"> </file>
</example>

<example name="po-badge-labs" title="PO Badge Labs">
 <file name="sample-po-badge-labs/sample-po-badge-labs.component.html"> </file>
 <file name="sample-po-badge-labs/sample-po-badge-labs.component.ts"> </file>
</example>

<example name="po-badge-message" title="PO Badge Message">
 <file name="sample-po-badge-message/sample-po-badge-message.component.html"> </file>
 <file name="sample-po-badge-message/sample-po-badge-message.component.css"> </file>
 <file name="sample-po-badge-message/sample-po-badge-message.component.ts"> </file>
</example>
