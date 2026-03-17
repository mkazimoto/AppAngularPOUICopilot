# po-icon

@docsPrivate

@usedBy PoButton

@description

Permite a exibição de ícones.

---

Define o ícone a ser exibido.

É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons). conforme exemplo abaixo:
```
<po-button p-icon="an an-user" p-label="PO button"></po-button>
```
Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
```
<po-button p-icon="fa fa-podcast" p-label="PO button"></po-button>
```
Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
```
<po-button [p-icon]="template" p-label="button template ionic"></po-button>

<ng-template #template>
 <ion-icon style="font-size: inherit" name="heart"></ion-icon>
</ng-template>
```
> Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.
