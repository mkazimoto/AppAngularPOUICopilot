# po-calendar

@description

O `po-calendar` é um componente para seleção de datas que permite a navegação entre meses por meio das setas direcionais
e dos seletores de mês e ano exibidos no cabeçalho.

O componente é recomendado para casos de seleção de datas próximas ao tempo presente. Por padrão, apresenta os dados do
mês atual e apenas um mês por vez, podendo exibir uma data pré-estabelecida conforme o contexto.

Este componente pode receber os seguintes formatos de data:

| Formato                  | Exemplo                     |
|--------------------------|-----------------------------|
| `ISO 8601 (Data/Hora)`   | `2017-11-28T00:00:00-02:00` |
| `ISO 8601 (Data)`        | `2017-11-28`                |
| `JavaScript Date Object` | `new Date(2017, 10, 28)`    |
> O valor é tratado internamente como **yyyy-mm-dd**.

**Importante:**
- Datas fora do intervalo (`p-min-date` / `p-max-date`) aparecem desabilitadas sem alterar o *model*.

#### Boas práticas

- Evite datas distantes: O uso do calendário não é recomendado para datas muito distantes (como data de nascimento), pois
exige excesso de cliques. Nesses casos, prefira um campo de texto para digitação.
- Impeça seleções ilógicas: Utilize as propriedades de limite para impedir que o usuário selecione períodos inválidos (ex:
data de retorno anterior à de partida).
- Sinalize a disponibilidade: Para datas que não podem ser selecionadas devido a um contexto específico, mantenha-as
inativas por meio de opacidade e desabilite a opção de clique.
- Contexto claro: Certifique-se de que o mês e o ano estejam sempre visíveis no cabeçalho para orientar a pessoa usuária
durante a navegação.

#### Acessibilidade tratada no componente

Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo
proprietário do conteúdo. São elas:

- Navegação por teclado: O componente permite interação via tecla Tab entre os controles do cabeçalho e navegação no grid
de dias por meio das setas direcionais.
- Foco visual: A área de foco possui espessura de pelo menos 2 pixels CSS e não é sobreposta por outros elementos da tela,
garantindo visibilidade para usuários que utilizam teclado. [WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                      | Descrição                                            | Valor Padrão                      |
|----------------------------------|------------------------------------------------------|-----------------------------------|
| **Default Values**               |                                                      |                                   |
| `--background`                   | Cor de fundo                                         | `var(--color-neutral-light-00)`   |
| `--border-color`                 | Cor da borda                                         | `var(--color-neutral-light-20)`   |
| `--border-radius`                | Raio da borda                                        | `var(--border-radius-md)`         |
| `--border-width`                 | Largura da borda                                     | `var(--border-width-sm)`          |
| `--shadow`                       | Contém o valor da sombra do elemento                 | `var(--shadow-md)`                |
| **Weekly cells**                 |                                                      |                                   |
| `--text-color-weekly`            | Cor da fonte utilizada nas células semanais          | `var(--color-neutral-dark-90)`    |
| `--font-family`                  | Fonte utilizada nas células semanais                 | `var(--font-family-text)`         |
| `--font-size`                    | Tamanho da fonte utilizada nas células semanais      | `var(--font-size-sm)`             |
| `--font-weight-weekly`           | Peso da fonte utilizada nas células semanais         | `var(--font-weight-bold)`         |
| **Days cells**                   |                                                      |                                   |
| `--font-weight-days`             | Peso da fonte utilizada nas células de dias          | `var(--font-weight-normal)`       |
| `--text-color`                   | Cor da fonte utilizada nas células de dias           | `var(--color-neutral-dark-90)`    |
| `--border-radius-days`           | Raio da borda                                        | `var(--border-radius-md)`         |
| `--border-width-days`            | Largura da borda                                     | `var(--border-width-sm)`          |
| `--day-cell-transition-duration` | Duração da transição                                 | `var(--duration-extra-fast)`      |
| `--day-cell-transition-property` | Atributo da transição                                | `all`                             |
| `--day-cell-transition-timing`   | Duração da transição com o tipo de transição         | `var(--timing-standart)`          |
| **Today**                        |                                                      |                                   |
| `--font-weight-today`            | Peso da fonte utilizada na célula de hoje            | `var(--font-weight-bold)`         |
| `--text-color-today`             | Cor da fonte utilizada na célula de hoje             | `var(--color-action-default)`     |
| **Focused**                      |                                                      |                                   |
| `--outline-color-focused`        | Cor do outline do estado de focus                    | `var(--color-action-focus)`       |
| **Hover**                        |                                                      |                                   |
| `--color-hover`                  | Cor de fundo das células ao passar o mouse           | `var(--color-neutral-light-00)`   |
| `--text-color-hover`             | Cor da fonte utilizada nas células ao passar o mouse | `var(--color-action-hover)`       |
| **Interval**                     |                                                      |                                   |
| `--color-interval`               | Cor de fundo das células de intervalo                | `var(--color-brand-01-lighter)`   |
| `--text-color-interval`          | Cor da fonte utilizada nas células de intervalo      | `var(--color-action-default)`     |
| **Next Month**                   |                                                      |                                   |
| `--text-color-next`              | Cor da fonte utilizada nas células do próximo mês    | `var(--color-action-default)`     |
| **Disabled**                     |                                                      |                                   |
| `--border-disabled`              | Cor da borda das células desabilitadas               | `var(--color-action-disabled)`    |
| `--text-color-disabled`          | Cor da fonte utilizada nas células desabilitadas     | `var(--color-action-disabled)`    |
| **Selected**                     |                                                      |                                   |
| `--color-selected`               | Cor de fundo das células selecionadas                | `var(--color-neutral-light-00)`   |
| `--text-color-selected`          | Cor da fonte utilizada nas células selecionadas      | `var(--color-action-default)`     |

---

**`p-change`**

@optional

@description

Evento disparado ao alterar o valor do model.
Em modo padrão, retorna uma `string` no formato ISO 8601 (`yyyy-mm-dd`).
Em modo *range*, retorna um objeto contendo as datas de início (`start`) e fim (`end`).

---

**`p-change-month-year`**

@description

Evento disparado ao alterar o mês ou o ano no cabeçalho do calendário.
Retorna um objeto contendo os valores numéricos:
- `month`: Mês selecionado (variando de 1 a 12).
- `year`: Ano selecionado.

---

**`p-close`**

Evento disparado ao fechar o calendário, seja por seleção de data ou por clique fora do componente.

---

**`p-locale`**

@optional

@description

Idioma do componente.

> O locale padrão será recuperado com base no [`PoI18nService`](/documentation/po-i18n) ou *browser*.

---

**`p-max-date`**

@optional

@description

Define a data máxima permitida para seleção. As datas posteriores ao limite definido permanecem visíveis, mas ficam
desabilitadas para clique.

Aceita os seguintes formatos:

- **Data e hora combinados (E8601DZw): yyyy-mm-ddThh:mm:ss+|-hh:mm**
  ```
  this.date = '2017-11-28T00:00:00-02:00';
  ```

- **Data (E8601DAw.): yyyy-mm-dd**
  ```
  this.date = '2017-11-28';
  ```

- **JavaScript Date Object:**
  ```
  this.date = new Date(2017, 10, 28);
  ```

---

**`p-min-date`**

@optional

@description

Define a data mínima para seleção. As datas anteriores ao limite permanecem visíveis, mas desabilitadas para clique.

Aceita os seguintes formatos:

- **Data e hora combinados (E8601DZw): yyyy-mm-ddThh:mm:ss+|-hh:mm**
  ```
  this.date = '2017-11-28T00:00:00-02:00';
  ```

- **Data (E8601DAw.): yyyy-mm-dd**
  ```
  this.date = '2017-11-28';
  ```

- **JavaScript Date Object:**
  ```
  this.date = new Date(2017, 10, 28);
  ```

---

**`p-mode`**

@optional

@description

Define o modo de exibição do calendário.
Caso não seja informado, o componente operará no modo padrão de seleção única.
Para permitir a seleção de um intervalo de datas, deve ser utilizado o valor `PoCalendarMode.Range`.

---

**`p-size`**

@optional

@description

Define o tamanho do componente.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

@docsExtends PoCalendarBaseComponent

@example

<example name="po-calendar-basic" title="PO Calendar Basic" >
 <file name="sample-po-calendar-basic/sample-po-calendar-basic.component.html"> </file>
 <file name="sample-po-calendar-basic/sample-po-calendar-basic.component.ts"> </file>
</example>

<example name="po-calendar-labs" title="PO Calendar Labs" >
 <file name="sample-po-calendar-labs/sample-po-calendar-labs.component.html"> </file>
 <file name="sample-po-calendar-labs/sample-po-calendar-labs.component.ts"> </file>
</example>

<example name="po-calendar-ticket-sales" title="PO Calendar - Ticket Sales" >
 <file name="sample-po-calendar-ticket-sales/sample-po-calendar-ticket-sales.component.html"> </file>
 <file name="sample-po-calendar-ticket-sales/sample-po-calendar-ticket-sales.component.ts"> </file>
</example>
