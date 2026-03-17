# po-gauge

@description

> ESSE COMPONENTE ESTÁ DEPRECIADO E SERÁ REMOVIDO NA v22.x.x. Indicamos a utilização do `po-chart` com `type` Gauge.

O componente `po-gauge` provê a representação de um valor através de um arco. É muito comum, por exemplo, para demonstrar o desempenho ou progresso de algo.
O `po-gauge` possui dois tipos de tratamentos:
- É possível demonstrar um dado percentual simples em conjunto com uma descrição resumida em seu interior;
- Para um demonstrativo mais elaborado, consegue-se definir alcances em cores, um breve texto descritivo e um ponteiro indicando o valor desejado.

#### Guia de uso para Gráficos

> Veja nosso [guia de uso para gráficos](/guides/guide-charts) para auxiliar na construção do seu gráfico,
informando em qual caso utilizar, o que devemos evitar e boas práticas relacionada a cores.

---

**`p-show-from-to-legend`**

@optional

@description

Define a exibição dos valores de `from` - `to` entre parênteses caso haja definição de `p-ranges`.

@default `false`

---

**`p-show-pointer`**

@optional

@description

Define a exibição do ponteiro caso haja definição de `p-ranges`.

@default `true`

---

**`p-options`**

@optional

@description

Objeto com as configurações usadas no `po-gauge`.

É possível, por exemplo, esconder as funcionalidades do header,
ou habilitar uma legenda com `From` `To` da seguinte forma:

```
 chartOptions: PoGaugeOptions = {
   showFromToLegend: true,
   header: {
     hideExpand: true,
   },
 };
```

---

**`p-description`**

@optional

@description

Define o texto que será exibido no gauge.
Há dois posicionamentos para ele:
- Se houver definição para `p-ranges`, o descritivo será exibido no topo do container, ficando acima do gauge;
- Na ausência de `p-ranges`, será incorporado dentro do arco do gauge, e abaixo de `p-value`.

> Para uma melhor experiência do usuário, é recomendado um descritivo breve e com poucas palavras.
> Indicamos a utilização da nova propriedade `descriptionChart` em `p-options`.

---

**`p-height`**

@optional

@description

Define a altura do gauge.

O valor mínimo aceito é 300px.

@default `300px`

---

**`p-ranges`**

@optional

@description

Definição para o alcance de cores. Ao adicionar pelo menos um item na lista,
incorpora-se o ponteiro que assinala o valor passado em `p-value`.
Se o valor de `p-value` for inferior ao mínimo valor definido em `PoGaugeRanges.from`, o domínio mínimo do gauge será `p-value`.
A mesma regra prevalece para valores máximos.

---

**`p-title`**

@optional

@description

Define o título do gauge.

---

**`p-value`**

@optional

@description

Valor referente ao valor da série. Seu comportamento segue a seguintes regras:

- Sem `p-ranges`: Os valores passados para `p-value` e `p-description` serão centralizados no interior do arco.
A base do valor será percentual tendo como base os alcances entre zero e 100%. Se passado um valor superior a 100,
A colorização do gauge será completa e o valor passado será exibido no interior do arco.
- Com `p-ranges`: A descrição será exibida acima do gauge e haverá um ponteiro marcando o valor passado em `p-value`.
Considerando que o alcance em `ranges` é aberto, então a escala de `p-value` será em relação ao menor/maior alcance
absoluto definido em `p-ranges`.
Se passado um `p-value` inferior em relação ao mínimo valor definido em `p-ranges`, o domínio mínimo do gauge partirá de `p-value`.
A mesma regra prevalece para valores máximos.

@docsExtends PoGaugeBaseComponent

@example

<example name="po-gauge-basic" title="PO Gauge Basic">
 <file name="sample-po-gauge-basic/sample-po-gauge-basic.component.html"> </file>
 <file name="sample-po-gauge-basic/sample-po-gauge-basic.component.ts"> </file>
</example>
<example name="po-gauge-labs" title="PO Gauge Labs">
 <file name="sample-po-gauge-labs/sample-po-gauge-labs.component.html"> </file>
 <file name="sample-po-gauge-labs/sample-po-gauge-labs.component.ts"> </file>
</example>
<example name="po-gauge-summary" title="PO Gauge Summary">
 <file name="sample-po-gauge-summary/sample-po-gauge-summary.component.html"> </file>
 <file name="sample-po-gauge-summary/sample-po-gauge-summary.component.ts"> </file>
</example>

@deprecated v22.x.x
Utilize o `po-chart` com `type="gauge"` como alternativa recomendada.

---

### Interface `PoGaugeCoordinates`

/**
@docsPrivate

@usedBy PoGaugeComponent

@description

Interface que define o objeto com as coordenadas do gauge.
/

- `color: string` — A cor do alcance. Aceita hexadecimais, string com nome da cor, RGB ou então uma das classes de cor do PO.
- `coordinates: string` — Definição de coordenadas.
- `radius: number` — O raio do circulo. Utilizado para posicionar o ponteiro no centro do gauge.
- `pointerDegrees: number` — O grau de angulação do ponteiro.

### Interface `PoGaugeOptions`

/**
@usedBy PoGaugeComponent

@description

*Interface* para configurações dos elementos do gráfico.
/

- `descriptionChart: string` — Define a descrição do gráfico exibido acima do gráfico.
- `header: PoChartHeaderOptions` — Define um objeto do tipo `PoChartHeaderOptions` para configurar a exibição de botões no cabeçalho do gráfico.
- `showContainerGauge: boolean` — Esconde a estilização do container em volta do gráfico.
- `showFromToLegend: boolean` — Exibe os valores das propriedades `from` e `to` no gráfico do  no texto da legenda entre parênteses.  > Válido para gráfico do tipo `Gauge`.
- `subtitleGauge: string` — Define um subtítulo para o Gauge. Indicamos um subtítulo pequeno, com uma quantidade máxima de 32 caracteres na altura padrão.
- `pointer: boolean` — Define a exibição do ponteiro.  > Válido para gráfico do tipo `Gauge`.

### Interface `PoGaugeRanges`

/**
@usedBy PoGaugeComponent

@description

Interface que define os alcances das cores do gauge.
/

- `from: number` — Alcance inicial da cor. O valor padrão é 0.
- `to: number` — Alcance final da cor. O valor padrão é 100.
- `label: string` — O texto para a legenda do alcance.  > Se desejar ocultar a legenda basta ignorar esta propriedade.
- `color: string` — Determina a cor do alcance. As maneiras de customizar o *preset* padrão de cores são: - Hexadeximal, por exemplo `#c64840`; - RGB, como `rgb(0, 0, 165)` - O nome da cor, por exemplo *blue*); - Usando uma das cores do tema do PO:    Valores válidos:    - <span class="dot po-color-01"></span> `color-01`    - <span class="dot po-color-02"></span> `color-02`    - <span class="dot po-color-03"></span> `color-03`    - <span class="dot po-color-04"></span> `color-04`    - <span class="dot po-color-05"></span> `color-05`    - <span class="dot po-color-06"></span> `color-06`    - <span class="dot po-color-07"></span> `color-07`    - <span class="dot po-color-08"></span> `color-08`    - <span class="dot po-color-09"></span> `color-09`    - <span class="dot po-color-10"></span> `color-10`    - <span class="dot po-color-11"></span> `color-11`    - <span class="dot po-color-12"></span> `color-12`

### Interface `PoGaugeSvgContainer`

/**
@docsPrivate

@usedBy PoGaugeComponent

@description

Interface que implementa as dimensões do container do SVG.
/

- `height: number` — Altura do container.
- `width: number` — Largura do container.
