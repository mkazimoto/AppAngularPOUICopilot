# po-menu-panel

@description

Este é um componente de menu lateral composto apenas por ícones e com um nível, utilizado para navegação
em páginas internas, externas da aplicação ou aciona uma ação.

O componente `po-menu-panel` recebe uma lista de objetos do tipo `MenuPanelItem` com as informações dos
itens de menu como textos, links para redirecionamento, ações e ícones.

---

Lista dos itens do `po-menu-panel`. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio.

---

@optional

@description

Caminho para a logomarca localizada na parte superior do menu.

> **Importante**
> Caso seja indefinida será aplicada a imagem default do PO UI.

---

Define o texto alternativo para a logomarca.

> **Importante**
> Caso esta propriedade não seja definida o texto padrão será "Logomarca início".

@default `Logomarca início`

@docsExtends PoMenuPanelBaseComponent

@description

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

<example name="po-menu-panel-basic" title="PO Menu Panel Basic">
  <file name="sample-po-menu-panel-basic/sample-po-menu-panel-basic.component.html"> </file>
  <file name="sample-po-menu-panel-basic/sample-po-menu-panel-basic.component.ts"> </file>
</example>

<example name="po-menu-panel-labs" title="PO Menu Panel Labs">
  <file name="sample-po-menu-panel-labs/sample-po-menu-panel-labs.component.html"> </file>
  <file name="sample-po-menu-panel-labs/sample-po-menu-panel-labs.component.ts"> </file>
</example>

<example name="po-menu-panel-customer" title="PO Menu Panel - Customers">
  <file name="sample-po-menu-panel-customer/sample-po-menu-panel-customer.component.html"> </file>
  <file name="sample-po-menu-panel-customer/sample-po-menu-panel-customer.component.ts"> </file>
</example>
