# po-chart

**`t-id`**

@description

O `po-chart` é um componente para renderização de dados através de gráficos, com isso facilitando a compreensão e tornando a
visualização destes dados mais agradável.

Através de suas principais propriedades é possível definir atributos, tais como tipo de gráfico, altura, título, cores customizadas, opções para os eixos, entre outros.

O componente permite utilizar em conjunto séries do tipo linha e coluna.

Além disso, também é possível definir uma ação que será executada ao clicar em determinado elemento do gráfico
e outra que será executada ao passar o *mouse* sobre o elemento.

#### Guia de uso para Gráficos

> Veja nosso [guia de uso para gráficos](/guides/guide-charts) para auxiliar na construção do seu gráfico,
informando em qual caso utilizar, o que devemos evitar e boas práticas relacionada a cores.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                              | Descrição                                                               | Valor Padrão                                      |
|------------------------------------------|-------------------------------------------------------------------------|---------------------------------------------------|
| **Chart (po-chart)**                     |                                                                         |                                                   |
| `--background-color-grid`                | Cor de background dos gráficos                                          | `var(--color-neutral-light-00)`                   |
| `--color-description-chart`              | Cor da descrição dos gráficos                                           | `var(--color-neutral-dark-70)`                    |
| `--font-family-description-chart`        | Fonte da descrição dos gráficos                                         | `var(--font-family-theme)`                        |
| `--font-size-description-chart`          | Tamanho da fonte da descrição dos gráficos                              | `var(--font-size-sm)`                             |
| `--font-weight-description-chart`        | Peso da fonte da descrição dos gráficos                                 | `var(--font-weight-normal)`                       |
| **Header (po-chart .po-chart-header )**  |                                                                         |                                                   |
| `--background-color`                     | Cor de background do cabeçalho                                          | `var(--color-neutral-light-00)`                   |
| `--color`                                | Cor da fonte do cabeçalho                                               | `var(--color-neutral-dark-70)`                    |
| `--font-family`                          | Família tipográfica usada                                               | `var(--font-family-theme)`                        |
| `--font-size-title`                      | Tamanho da fonte                                                        | `var(--font-size-default)`                        |
| `--font-size-icons`                      | Tamanho dos ícones                                                      | `var(--font-size-md)`                             |
| `--font-weight`                          | Peso da fonte                                                           | `var(--font-weight-bold)`                         |
| **Chart (po-chart .po-chart)**           |                                                                         |                                                   |
| `--color-grid`                           | Cor da linha dos gráficos que possuem eixo                              | `var(--color-neutral-light-20)`                   |
| `--font-family-grid`                     | Família tipográfica usada nos valores dos eixos                         | `var(--font-family-theme)`                        |
| `--font-size-grid`                       | Tamanho da fonte usada nos valores dos eixos                            | `var(--font-size-xs)`                             |
| `--font-weight-grid`                     | Peso da fonte usada nos valores dos eixos                               | `var(--font-weight-normal)`                       |
| `--color-legend`                         | Cor da fonte da legenda                                                 | `var(--color-neutral-dark-70)`                    |
| `--border-radius-bar`                    | Tamanho da borda nos graficos `Bar` e `Column`                          | `var(--border-radius-none)`                       |
| `--border-color`                         | Cor da borda do gráfico nos Gráficos `Donut` e `Pie`                    | `var(--color-neutral-light-00)`                   |
| `--color-hightlight-value`               | Cor do valor de destaque nos Gráficos `Donut` e `Gauge`                 | `var(--color-neutral-dark-70)`                    |
| `--font-family-hightlight-value`         | Família tipográfica do valor de destaque nos Gráficos `Donut` e `Gauge` | `var(--font-family-theme)`                        |
| `--font-weight-hightlight-value`         | Peso da fonte do valor de destaque nos Gráficos `Donut` e `Gauge`       | `var(--font-weight-bold)`                         |
| `--color-base-gauge`                     | Cor da base do gráfico `Gauge`                                          | `var(--color-neutral-light-20)`                   |
| `--color-gauge-pointer-color`            | Cor do ponteiro do gráfico `Gauge`                                      | `var(--color-neutral-dark-70)`                    |
| `--color-chart-line-point-fill`          | Cor de dentro do círculo dos gráficos `Line` e `Area`                   | `var(--color-neutral-light-00)`                   |
| `--border-color-radar`                   | Cor do eixo da grid do gráfico `Radar`                                  | `var(--color-neutral-light-30)`                   |
| `--color-background-zebra`               | Cor das áreas alternadas (efeito zebrado) da grid do gráfico `Radar`    | `var(--color-neutral-light-10)`                   |
| `--color-background-line`                | Cor das áreas entre as faixas zebradas da grade do `Radar`              | `none`                                            |
| **Wrapper (.po-chart-container-gauge)**  |                                                                         |                                                   |
| `--background-color-container-gauge`     | Cor de background do container do gauge                                 | `var(--color-neutral-light-00)`                   |

---

**`p-title`**

Define o título do gráfico.

---

**`p-series`**

@description

Define os elementos do gráfico que serão criados dinamicamente.

---

**`p-value-gauge-multiple`**

@description

Define o valor do gráfico do tipo `Gauge` quando utliza as propriedades `From` `To`.

---

**`p-categories`**

@optional

@description

Define os valores utilizados na construção das categorias do gráfico.

Para gráficos dos tipos *bar*, *area*, *column* e *line*, representa os nomes das categorias exibidas no eixo.

Para gráficos do tipo *radar*, representa a configuração dos indicadores, formato (shape), áreas de divisão (splitArea)
e demais opções específicas do gráfico `Radar`.

> Caso nenhum valor seja informado, será utilizado um hífen como categoria
  correspondente para cada série.

> Gráficos do tipo bar dimensionam sua área considerando a largura do maior texto
  da categoria, sendo recomendável utilizar rótulos curtos para facilitar a leitura.

---

**`p-custom-actions`**

@optional

@description

Essa propriedade permite que o desenvolvedor adicione ações customizadas no popup do header, oferecendo mais flexibilidade e controle sobre as interações do componente.

---

**`p-options`**

@optional

@description

Objeto com as configurações usadas no `po-chart`.

É possível, por exemplo, definir as configurações de exibição das legendas,
configurar os eixos(*axis*) para os gráficos dos tipos `area`, `line`, `column`, `bar` e `radar` da seguinte forma:

```
 chartOptions: PoChartOptions = {
   legend: true,
   axis: {
     minRange: 0,
     maxRange: 100,
     gridLines: 5,
   },
 };
```

---

**`p-data-label`**

@optional

@description

Permite configurar as propriedades de exibição dos rótulos das séries no gráfico.

Essa configuração possibilita fixar os valores das séries diretamente no gráfico, alterando o comportamento visual:
- Os valores das séries permanecem visíveis, sem a necessidade de hover.
- O *tooltip* não será exibido.
- Os marcadores (*bullets*) terão seu estilo ajustado.
- As outras séries ficarão com opacidade reduzida ao passar o mouse sobre a série ativa.

> Disponível para gráficos do tipo `line` e `radar`.

#### Exemplo de utilização:
```typescript
dataLabel: PoChartDataLabel = {
  fixed: true,
};
```

---

**`p-height`**

@optional

@description

Define a altura do gráfico em px.

> No caso do tipo `Gauge`, o valor padrão é `300` e esse é seu valor minimo aceito. Nos outros tipos, o valor mínimo aceito nesta propriedade é 200.

@default `400`

---

**`p-type`**

@optional

@description

Define o tipo de gráfico.

É possível também combinar gráficos dos tipos linha e coluna. Para isso, opte pela declaração de `type` conforme a interface `PoChartSerie`.

> Note que, se houver declaração de tipo de gráfico tanto em `p-type` quanto em `PochartSerie.type`, o valor `{ type }` da primeira série anulará o valor definido em `p-type`.

Se não passado valor, o padrão será relativo à primeira série passada em `p-series`:
- Se `p-series = [{ data: [1,2,3] }]`: será `PoChartType.Column`.
- Se `p-series = [{ data: 1 }]`: será `PoChartType.Pie`.

> Veja os valores válidos no *enum* `PoChartType`.

---

**`p-literals`**

@optional

@description

Objeto com as literais usadas no `po-chart`.

Para utilizar basta passar a literal que deseja customizar:

```
 const customLiterals: PoChartLiterals = {
   downloadCSV: 'Obter CSV',
 };
```

E para carregar a literal customizada, basta apenas passar o objeto para o componente.

```
<po-chart
  [p-literals]="customLiterals">
</po-chart>
```

> O objeto padrão de literais será traduzido de acordo com o idioma do
[`PoI18nService`](/documentation/po-i18n) ou do browser.

---

**`p-series-click`**

@optional

@description

Evento executado quando o usuário clicar sobre um elemento do gráfico.

O evento emitirá o seguinte parâmetro:
- *donut* e *pie*: um objeto contendo a categoria e valor da série.
- *radar*: um objeto contendo o nome da série e os valores.
- *area*, *line*, *column* e *bar*: um objeto contendo o nome da série, valor e categoria do eixo do gráfico.

---

**`p-series-hover`**

@optional

@description

Evento executado quando o usuário passar o *mouse* sobre um elemento do gráfico.

O evento emitirá o seguinte parâmetro de acordo com o tipo de gráfico:
- *donut* e *pie*: um objeto contendo a categoria e valor da série.
- *radar*: um objeto contendo o nome da série e os valores.
- *area*, *line*, *column* e *bar*: um objeto contendo a categoria, valor da série e categoria do eixo do gráfico.

@docsExtends PoChartBaseComponent

@example

<example name="po-chart-basic" title="PO Chart Basic">
 <file name="sample-po-chart-basic/sample-po-chart-basic.component.html"> </file>
 <file name="sample-po-chart-basic/sample-po-chart-basic.component.ts"> </file>
</example>

<example name="po-chart-labs" title="PO Chart Labs">
 <file name="sample-po-chart-labs/sample-po-chart-labs.component.html"> </file>
 <file name="sample-po-chart-labs/sample-po-chart-labs.component.ts"> </file>
</example>

<example name="po-chart-coffee-ranking" title="PO Chart - Coffee Ranking">
 <file name="sample-po-chart-coffee-ranking/sample-po-chart-coffee-ranking.component.html"> </file>
 <file name="sample-po-chart-coffee-ranking/sample-po-chart-coffee-ranking.component.ts"> </file>
</example>

<example name="po-chart-stacked" title="PO Chart - Stacked">
 <file name="sample-po-chart-stacked/sample-po-chart-stacked.component.html"> </file>
 <file name="sample-po-chart-stacked/sample-po-chart-stacked.component.ts"> </file>
</example>

<example name="po-chart-summary" title="PO Chart - Summary">
 <file name="sample-po-chart-summary/sample-po-chart-summary.component.html"> </file>
 <file name="sample-po-chart-summary/sample-po-chart-summary.component.ts"> </file>
</example>

<example name="po-chart-world-exports" title="PO Chart - World Exports">
 <file name="sample-po-chart-world-exports/sample-po-chart-world-exports.component.html"> </file>
 <file name="sample-po-chart-world-exports/sample-po-chart-world-exports.component.ts"> </file>
</example>

<example name="po-chart-technology-skill" title="PO Chart - Radar">
 <file name="sample-po-chart-technology-skill/sample-po-chart-technology-skill.component.html"> </file>
 <file name="sample-po-chart-technology-skill/sample-po-chart-technology-skill.component.ts"> </file>
</example>

---

### Enum `PoChartLabelFormat`

/**
@usedBy PoChartComponent

@description

*Enum* `PoChartLabelFormat` para especificação dos tipos de formatação do eixo de valor no gráfico.
/

- `Number = 'number'` — Os valores serão exibidos no formato numérico com duas casas decimais. Equivalente ao formato `'1.2-2'` da [DecimalPipe](https://angular.io/api/common/DecimalPipe).

### Enum `PoChartType`

/**
@usedBy PoChartComponent

@description

*Enum* `PoChartType` para especificação dos tipos de gráficos.
/

- `Area = 'area'` — Tipo de gráfico que exibe os dados de modo quantitativo, utilizando linhas contínuas demarcadas por pontos para cada valor de série definido. Similar ao gráfico de linha, diferencia-se pela área localizada abaixo da linha das séries, que é preenchida com cores para um destaque explícita da evolução e mudança dos dados.
- `Donut = 'donut'` — Exibe os dados em formato de rosca, dividindo em partes proporcionais.
- `Pie = 'pie'` — Exibe os dados em formato circular, dividindo proporcionalmente em fatias.
- `Line = 'line'` — Gráfico que mostra os dados de modo linear e contínuo. É útil, por exemplo, para fazer comparações de tendência durante determinado período. Pode ser utilizado em conjunto com gráficos dos tipos `column` e `area`, definindo-se o tipo através da propriedade `PoChartSerie.type`.
- `Column = 'column'` — Gráfico que exibe os dados em forma de barras verticais e sua extensão varia de acordo com seus valores. É comumente usado como comparativo entre diversas séries. As séries são exibidas lado-a-lado, com um pequeno espaço entre elas.
- `Bar = 'bar'` — Gráfico que exibe os dados em forma de barras horizontais e sua extensão varia de acordo com seus valores. É comumente usado como comparativo de séries e categorias.
- `Gauge = 'gauge'` — Gráfico que provê a representação de um valor através de um arco. Possui dois tipos de tratamentos: - É possível demonstrar um dado percentual simples em conjunto com uma descrição resumida em seu interior; - Para um demonstrativo mais elaborado, consegue-se definir alcances em cores, um breve texto descritivo e um ponteiro indicando o valor desejado.
- `Radar = 'radar'` — Tipo de gráfico utilizado para visualizar e comparar o desempenho de diferentes itens em múltiplas categorias.



---

### Interface `PoChartAxisOptions`

/**
@usedBy PoChartComponent

@description

*Interface* que define os eixos do grid.
/

- `gridLines: number` — Define a quantidade de linhas exibidas no grid. Para os gráficos dos tipos `Area`, `Line` e `Column`, as linhas modificadas serão as horizontais (eixo X). Já para gráficos do tipo `Bar`, tratará as linhas verticais (eixo Y).  A propriedade contém as seguintes diretrizes para seu correto funcionamento: - Quantidade padrão de linhas: '5'; - Quantidade mínima permitida: '2';
- `maxRange: number` — Define o alcance de valor máximo exibido no eixo Y. Caso não seja definido valor, o valor de alcance máximo exibido será o maior existente entre as séries.  > Esta definição não deve refletir na plotagem das séries. Os valores máximos e mínimos encontrados nas séries serão as bases para seus alcance.
- `minRange: number` — Define o alcance mínimo exibido no eixo Y. Caso não seja definido valor, o valor-base de alcance mínimo será o menor encontrado entre as séries. Se houver valores negativos nas séries, o menor deles será a base mínima.  > Esta definição não deve refletir na plotagem das séries. Os valores máximos e mínimos encontrados nas séries serão as bases para seus alcance.
- `labelType: PoChartLabelFormat` — Define o tipo do label e a formatação exibida no eixo de valor.
- `paddingBottom: number` — Permite aumentar ou diminuir o espaço inferior do gráfico.
- `paddingLeft: number` — Permite aumentar ou diminuir o espaço esquerdo do gráfico.
- `paddingRight: number` — Permite aumentar ou diminuir o espaço direito do gráfico.
- `rotateLegend: number` — Define o ângulo de rotação da legenda do gráfico. Aceita valores entre -90 e 90 graus, onde: - Valores negativos giram a legenda para a esquerda. - Valores positivos giram a legenda para a direita.  Se não for definido, a legenda será exibida sem rotação.
- `showXAxis: boolean` — Exibe a linha do eixo X
- `showYAxis: boolean` — Exibe a linha do eixo Y
- `showAxisDetails: boolean` — Exibe a linha de detalhes que acompanha o mouse

### Interface `PoChartHeaderOptions`

/**
@usedBy PoChartComponent

@description

*Interface* para configuração das ações disponíveis no cabeçalho.
/

- `hideExpand: boolean` — Define se o botão responsável por expandir o gráfico deve ser ocultado.
- `hideTableDetails: boolean` — Define se o botão responsável por exibir os detalhes do gráfico em formato de tabela deve ser ocultado.
- `hideExportCsv: boolean` — Define se a opção de exportação do gráfico em formato CSV deve ser ocultada.
- `hideExportImage: boolean` — Define se a opção de exportação do gráfico nos formatos JPG e PNG deve ser ocultada.

### Interface `PoChartIndicatorOptions`

/**
@usedBy PoChartComponent

@description

Interface para configurações dos indicadores do gráfico `radar`.
/

- `color: string` — Cor do texto do indicator. Recomendamos avaliar o contraste da cor definida para garantir melhor acessibilidade.  > Nome da cor, hexadecimal ou RGB.
- `name: string` — Nome do indicator.
- `max: number` — Valor máximo do indicator.  A propriedade `max` não impede que a série contenha valores superiores ao máximo definido. Caso isso ocorra, os valores poderão extrapolar os limites do gráfico.
- `min: number` — Valor mínimo do indicator, com valor padrão de 0.  A propriedade `min` não impede que a série contenha valores inferiores ao mínimo definido. Caso isso ocorra, os valores serão apresentados ao centro do gráfico.



### Interface `PoChartLiterals`

/**
@usedBy PoChartComponent

@description

Interface para definição dos literais usadas no `po-chart`.
/

- `downloadCSV: string` — Texto exibido para a ação de download de dados em formato CSV.
- `exportCSV: string` — Texto do botão para exportar o gráfico em CSV.
- `exportJPG: string` — Texto do botão para exportar o gráfico como imagem JPG.
- `exportPNG: string` — Texto do botão para exportar o gráfico como imagem PNG.
- `value: string` — Texto da primeira coluna da tabela quando o gráfico é do tipo `Gauge`.
- `item: string` — Texto dos títulos das colunas `Gauge` e não possui label.
- `serie: string` — Texto da primeira coluna da tabela em todos os gráficos com exceção do `Bar` e `Gauge`.
- `category: string` — Texto da primeira coluna da tabela no gráfico do tipo `Bar`.

### Interface `PoChartOptions`

/**
@usedBy PoChartComponent

@description

*Interface* para configurações dos elementos do gráfico.
/

- `axis: PoChartAxisOptions` — Define um objeto do tipo `PoChartAxisOptions` para configuração dos eixos.
- `header: PoChartHeaderOptions` — Define um objeto do tipo `PoChartHeaderOptions` para configurar a exibição de botões no cabeçalho do gráfico.
- `dataZoom: boolean` — Permite aplicar zoom ao gráfico com o scroll do mouse;
- `fillPoints: boolean` — Define se os pontos do gráfico serão preenchidos. Quando true, os pontos são totalmente coloridos. Quando false, apenas a borda dos pontos será exibida, mantendo o interior transparente.  > Esta propriedade é utilizável para os gráficos dos tipos `Area`, `Line` e `Radar`. > Para o tipo `Radar`, o valor padrão é `true`.
- `areaStyle: boolean` — Define se as séries terão sua área preenchida.  > Esta propriedade tem precedência sobre a definição de `areaStyle` em cada série, `fillpoints` não funciona quando `areaStyle` está definido como `true`.
- `firstColumnName: string` — Valor que permite customizar o nome da `TH` da primeira coluna da tabela descritiva.
- `innerRadius: number` — Define o diâmetro, em valor percentual entre `0` e `100`, da área central para gráficos do tipo `donut`. Se passado um percentual que torne a espessura do gráfico menor do que `40px`, os textos internos do gráficos serão ocultados para que não haja quebra de layout.
- `borderRadius: number` — Define borda entre os itens do gráfico. Válido para os gráficos `Donut`, `Pie`. > Valores válidos entre 0 e 100,
- `textCenterGraph: string` — Aplica texto centralizado customizado nos gráficos de `Donut`.
- `legend: boolean` — Define a exibição da legenda do gráfico. Valor padrão é `true`
- `legendPosition: 'left' | 'center' | 'right'` — Define o alinhamento horizontal da legenda.  > Propriedade inválida para o gráfico do tipo `Gauge`.
- `legendVerticalPosition: 'top' | 'bottom'` — Define a posição vertical da legenda no gráfico. > Quando utilizada com o valor `top`, recomenda-se configurar também a propriedade `bottomDataZoom` caso o `dataZoom` esteja habilitado, para evitar sobreposição entre os elementos. > Propriedade inválida para o gráfico do tipo `Gauge`.
- `bottomDataZoom: boolean | number` — Define a distância inferior do componente DataZoom.  Esta propriedade aceita os seguintes valores:  - `false` (padrão): não aplica ajustes.  - `true`: aplica um valor automático com base no posicionamento da legenda:   - `8` pixels quando o DataZoom estiver habilitado e não houver legenda, ou quando a legenda estiver posicionada no topo.   - `32` pixels quando o DataZoom estiver habilitado e a legenda estiver posicionada na parte inferior.  - `number`: aplica o valor numérico informado como distância inferior. Este valor tem prioridade sobre a configuração booleana.  > Esta configuração é considerada apenas quando o DataZoom estiver habilitado (`dataZoom: true`).
- `rendererOption: 'canvas' | 'svg'` — Define como o gráfico será renderizado.  > Recomenda-se não modificar o valor da propriedade `rendererOption` após a inicialização da aplicação, uma vez que tal alteração pode ocasionar comportamentos inconsistentes na renderização do gráfico.
- `roseType: boolean` — Transforma os gráficos do tipo `Donut` ou `Pie` num gráfico de área polar.  > Válido para os gráficos `Donut` e `Pie`.
- `showFromToLegend: boolean` — Exibe os valores das propriedades `from` e `to` no gráfico do  no texto da legenda entre parênteses.  > Válido para gráfico do tipo `Gauge`.
- `pointer: boolean` — Define a exibição do ponteiro.  > Válido para gráfico do tipo `Gauge`.
- `descriptionChart: string` — Define a descrição do gráfico exibido acima do gráfico.
- `stacked: boolean` — Agrupa todas as séries numa única coluna ou barra por categoria. Essa propriedade sobrescreve a propriedade `stackGroupName` da interface `PoChartSerie`  > Válido para gráfico do tipo `Column` e `Bar`.  > Essa propriedade habilita a propriedade `p-data-label` por padrão, podendo ser desabilitada passando `[p-data-label]={ fixed: false }`.
- `subtitleGauge: string` — Define um subtítulo para o Gauge. Indicamos um subtítulo pequeno, com uma quantidade máxima de 32 caracteres na altura padrão.  > Válido para gráfico do tipo `Gauge`.
- `showContainerGauge: boolean` — Esconde a estilização do container em volta do gráfico.  > Válido para gráfico do tipo `Gauge`.

### Interface `PoChartRadarOptions`

/**
@usedBy PoChartComponent

@description

*Interface* para configurações do gráfico `radar`.
/

- `indicator: Array<PoChartIndicatorOptions>` — Define as configurações dos indicadores do gráfico, como nome, cor, valor mínimo e valor máximo.
- `shape: 'polygon' | 'circle'` — Define o formato da grid, podendo ser exibida como polígono ou círculo.
- `splitArea: boolean` — Define o efeito zebrado na grid.

### Interface `PoChartDataLabel`

/**
@usedBy PoChartComponent

@description

Interface que define as propriedades de exibição dos rótulos das séries no `po-chart`.

/

- `fixed: boolean` — Indica se o texto associado aos pontos da série deve permanecer fixo na exibição do gráfico.  - Quando definido como `true`:   - O *tooltip* não será exibido.   - As outras séries ficarão com opacidade reduzida ao passar o mouse sobre a série ativa.  > Disponível para os tipo de gráfico `PoChartType.Line`, `PoChartType.Area`, `PoChartType.Column`, `PoChartType.Bar e PoChartType.Radar`.

### Interface `PoChartSerie`

/**
@usedBy PoChartComponent

@description

Interface das series dinâmicas do `po-chart` que possibilita desenhar gráficos dos tipos `area`, `bar`, `column`, `line`, `donut`, `pie` e `radar`
/

- `color: string` — Determina a cor da série. As maneiras de customizar o *preset* padrão de cores são: * Hexadecimal, por exemplo `#c64840`; * RGB, por exemplo `rgb(0, 0, 165)` * O nome da cor, por exemplo `blue`; * Variáveis CSS, por exemplo `var(--color-01)`; * Usando uma das cores do tema do PO:   Valores válidos:     - <span class="dot po-color-01"></span> `color-01`     - <span class="dot po-color-02"></span> `color-02`     - <span class="dot po-color-03"></span> `color-03`     - <span class="dot po-color-04"></span> `color-04`     - <span class="dot po-color-05"></span> `color-05`     - <span class="dot po-color-06"></span> `color-06`     - <span class="dot po-color-07"></span> `color-07`     - <span class="dot po-color-08"></span> `color-08`     - <span class="dot po-color-09"></span> `color-09`     - <span class="dot po-color-10"></span> `color-10`     - <span class="dot po-color-11"></span> `color-11`     - <span class="dot po-color-12"></span> `color-12` - A partir da 13° série o valor da cor será preta caso não seja enviada uma cor customizada.
- `data: number | Array<number>` — Define a lista de valores para a série. Os tipos esperados são de acordo com o tipo de gráfico: - Para gráficos dos tipos `donut` e `pie`, espera-se *number*; - Para gráficos dos tipos `area`, `bar`, `column`, `line` e `radar`, espera-se um *array* de `data`.  > Se passado valor `null` em determinado item da lista, a iteração irá ignorá-lo.
- `areaStyle: boolean` — Define se a série terá sua área preenchida.  > Propriedade válida para gráficos do tipo `Radar`, `fillpoints` não funciona quando `areaStyle` está definido como `true`.
- `label: string` — Rótulo referência da série.
- `tooltip: string | ((params: any) => string)` — Define o texto que será exibido na tooltip ao passar o mouse por cima das séries do *chart*.  Formatos aceitos:  - **string**: pode conter marcadores dinâmicos e HTML simples.  - Marcadores disponíveis:   - `{name}` → Nome do item/categoria.   - `{seriesName}` → Nome da série.   - `{value}` → Valor correspondente.  - **function**: função que recebe o objeto `params` e deve retornar uma *string* com o conteúdo da tooltip.  > É possível utilizar marcação HTML simples (`<b>`, `<i>`, `<br>`, `<hr>`, etc.) que será interpretada via `innerHTML`.  > Formatação customizada (será convertido internamente para HTML): - `\n` → quebra de linha (`<br>`). - `**texto**` → negrito (`<b>`). - `__texto__` → itálico (`<i>`).  > Caso não seja informado um valor para o *tooltip*, será exibido da seguinte forma: - `donut`, `label`: valor proporcional ao total em porcentagem. - `radar`: nome da série, o nome do indicator e os valores correspondentes. - `area`, `bar`, `column`, `line` e `pie`: `label`: `data`.  ### Exemplos:  **Usando string com placeholders:** ```ts tooltip: 'Ano: {name}<br>Série: {seriesName}<br>Valor: <b>{value}</b>' ```  **Usando função de callback:** ```ts tooltip = (params) => {   return `Ano: ${params.name}<br><i>Valor:</i> ${params.value}`; } ```
- `type: PoChartType` — Define em qual tipo de gráfico que será exibida a série. É possível combinar séries dos tipos `column` e `line` no mesmo gráfico. Para isso, basta criar as séries com as configurações: - Serie A: `{ type: ChartType.Column, data: ... }`; - Série B: `{ type: ChartType.Line, data: ... }`.  Se tanto `p-type` quanto `{ type }` forem ignorados, o padrão gerado pelo componente será: - `column`: se `data` receber `Array<number>`; - `pie`: se `data` for *number*.  > Se utilizada a propriedade `p-type`, dispensa-se a definição desta propriedade. Porém, se houver declaração para ambas, o valor `{type}` da primeira série sobrescreverá o valor definido em `p-type`.  > O componente só exibirá as séries que tiverem o mesmo `type` definido, exceto para mesclagem para tipos `column` e `line`.
- `from: number` — Alcance inicial da cor.  > Propriedade válida para gráfico do tipo `Gauge`.
- `to: number` — Alcance final da cor.  > Propriedade válida para gráfico do tipo `Gauge`.
- `stackGroupName: string` — Agrupa as séries em barras ou colunas que receberem o mesmo `stackGroupName`. Exemplo: - Serie A: `{ data: 500, stackGroupName: 'group1' ... }`; - Série B: `{ data: 200, stackGroupName: 'group1' ... }`. - Série C: `{ data: 100, stackGroupName: 'group2' ... }`. - Série D: `{ data: 400, stackGroupName: 'group2' ... }`.  Nesse caso será criado duas barras ou colunas com duas series agrupadas em cada uma por categoria. > Válido para gráfico do tipo `Column` e `Bar`. Essa propriedade é ignorada caso a propriedade `stacked` da interface `PoChartOptions` esteja como `true`.  > Essa propriedade habilita a propriedade `p-data-label` por padrão, podendo ser desabilitada passando `[p-data-label]={ fixed: false }`.
