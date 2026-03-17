# po-context-tabs

@docsExtends PoTabsBaseComponent

@description

O componente `po-context-tabs` é responsável por agrupar [abas](/documentation/po-tab) dispostas numa linha horizontal,
ideal para facilitar a organização de conteúdos.

O componente exibirá as abas enquanto houver espaço na tela, caso a aba ultrapasse o limite da tela a mesma será agrupada em um dropdown.

> As abas que estiverem agrupadas serão dispostas numa cascata suspensa que será exibida ao clicar no botão.

É possível realizar a navegação entre as abas através da tecla SETAS(direita e esquerda) do teclado.
Caso uma aba estiver desabilitada, não receberá foco de navegação.

#### Boas práticas

- Evite utilizar um `po-context-tabs` dentro de outro `po-context-tabs`;
- Evite utilizar uma quantidade excessiva de abas, pois irá gerar um *scroll* muito longo no `dropdown`;
- Evite `labels` extensos para as `tabs` pois podem quebrar seu *layout*, use `labels` diretas, curtas e intuitivas.


@example

<example name="po-context-tabs-basic" title="PO Context Tabs Basic">
 <file name="sample-po-context-tabs-basic/sample-po-context-tabs-basic.component.html"> </file>
 <file name="sample-po-context-tabs-basic/sample-po-context-tabs-basic.component.ts"> </file>
</example>

<example name="po-context-tabs-labs" title="PO Context Tabs Labs">
 <file name="sample-po-context-tabs-labs/sample-po-context-tabs-labs.component.html"> </file>
 <file name="sample-po-context-tabs-labs/sample-po-context-tabs-labs.component.ts"> </file>
</example>

<example name="po-context-tabs-travel" title="PO Context Tabs - Travel">
 <file name="sample-po-context-tabs-travel/sample-po-context-tabs-travel.component.html"> </file>
 <file name="sample-po-context-tabs-travel/sample-po-context-tabs-travel.component.ts"> </file>
</example>

<example name="po-context-tabs-business-conf" title="PO Context Tabs - Business Conference">
 <file name="sample-po-context-tabs-business-conf/sample-po-context-tabs-business-conf.component.html"> </file>
 <file name="sample-po-context-tabs-business-conf/sample-po-context-tabs-business-conf.component.ts"> </file>
</example>

---

Função que atribui o número de tabs fora do dropdown.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoContextTabsComponent } from '@po-ui/ng-components';

...

@ViewChild('poContextTabs', { static: true }) poContextTabs: PoContextTabsComponent;

changeQuantityTabs() {
  this.poContextTabs.setQuantityTabsButton(1); //Número de context-tabs
}
```
