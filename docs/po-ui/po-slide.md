# po-slide

@description

Componente de slide para visualização e controle de elementos de forma cíclica. Exibe um conjunto de imagens ou dados que permitem
customizar sua visualização utilizando a diretiva **[p-slide-content-template](/documentation/po-slide-content-template)**.

#### Boas práticas:
- Utilizar imagens no slide, mesmo quando possui conteúdo personalizado.
- Evitar utilizar apenas um slide isolado, utilize pelo menos dois.
- Evitar utilizar mais de 5 slides, pois a ideia do componente é destacar apenas informações importantes.

---

@optional

@description

Define a exibição das setas de navegação.

@default `false`

---

@optional

@description
Altura do po-slide, caso seja slide com template customizado, não assume o valor `default`.

@default `336`

---

@optional

@description

Valor em milissegundos que define o tempo de troca dos slides, caso o valor seja menor que `1000` os slides não trocam automaticamente.

@default `4000`

---

@description

Array de imagens ou dados para o slide, pode ser de três formas:

- Array implementando objetos da interface `PoSlideItem`:
  ```
  [{ image: '/assets/image-1', action: 'imageClick.bind(this)'}, { image: '/assets/image-2' }]
  ```
- Array de `strings` com os caminhos das imagens:
  ```
  ['/assets/image-1', '/assets/image-2' ]
  ```
- Array com lista de itens (para utilizar template):
  ```
  [{ label: '1', img: '/assets/image-1' }, { label: '2', img: '/assets/image-1' }]
  ```

> As setas de navegação e o controle com círculos apenas serão renderizados caso possua mais de um slide.

@docsExtends PoSlideBaseComponent

@example
<example name="po-slide-basic" title="PO Slide Basic">
  <file name="sample-po-slide-basic/sample-po-slide-basic.component.html"> </file>
  <file name="sample-po-slide-basic/sample-po-slide-basic.component.ts"> </file>
</example>

<example name="po-slide-labs" title="PO Slide Labs">
  <file name="sample-po-slide-labs/sample-po-slide-labs.component.html"> </file>
  <file name="sample-po-slide-labs/sample-po-slide-labs.component.ts"> </file>
</example>

<example name="po-slide-useful-articles" title="PO Slide - Useful articles">
  <file name="sample-po-slide-useful-articles/sample-po-slide-useful-articles.component.html"> </file>
  <file name="sample-po-slide-useful-articles/sample-po-slide-useful-articles.component.ts"> </file>
</example>

<example name="po-slide-landscapes" title="PO Slide - Landscapes">
  <file name="sample-po-slide-landscapes/sample-po-slide-landscapes.component.html"> </file>
  <file name="sample-po-slide-landscapes/sample-po-slide-landscapes.component.ts"> </file>
</example>

<example name="po-slide-external-controls" title="PO Slide - External Controls">
 <file name="sample-po-slide-external-controls/sample-po-slide-external-controls.component.html"> </file>
 <file name="sample-po-slide-external-controls/sample-po-slide-external-controls.component.ts"> </file>
</example>

---

Método que retorna o index do slide atual

```
@ViewChild('slideComponent', { static: true }) slideComponent: PoSlideComponent;
 myFunction() {
   let currentIndex = this.slideComponent.getCurrentSlideIndex();
}

```

---

Método para chamar o próximo slide.

```
@ViewChild('slideComponent', { static: true }) slideComponent: PoSlideComponent;

myFunction() {
 this.slideComponent.next();
}
```

---

Método para chamar o slide anterior.

```
@ViewChild('slideComponent', { static: true }) slideComponent: PoSlideComponent;

myFunction() {
 this.slideComponent.previous();
}
```
