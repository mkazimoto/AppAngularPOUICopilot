# po-logo

**`p-class`**

Define uma classe para o elemento `img` do componente.

> **Importante**
> A classe deve ser definida apenas quando houver necessidade de ajustar o componente dentro de outro componente.

---

**`p-link`**

Define se o componente terá o elemento âncora para uma rota específica.

> Caso seja definido como false, o componente apenas renderizará o elemento `img`.
> Caso seja definido como true, a rota será `./`.
> Caso seja definido como string, a rota será a string passada.

@default `true`

---

**`p-logo`**

Definie o caminho para a imagem, que será exibida como logomarca.

---

**`p-logo-alt`**

Define o texto alternativo para a logomarca.

> **Importante**
> Caso esta propriedade não seja definida o texto padrão será "Logomarca início".
