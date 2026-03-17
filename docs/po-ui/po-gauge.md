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

@optional

@description

Define a exibição dos valores de `from` - `to` entre parênteses caso haja definição de `p-ranges`.

@default `false`

---

@optional

@description

Define a exibição do ponteiro caso haja definição de `p-ranges`.

@default `true`

---

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

@optional

@description

Define o texto que será exibido no gauge.
Há dois posicionamentos para ele:
- Se houver definição para `p-ranges`, o descritivo será exibido no topo do container, ficando acima do gauge;
- Na ausência de `p-ranges`, será incorporado dentro do arco do gauge, e abaixo de `p-value`.

> Para uma melhor experiência do usuário, é recomendado um descritivo breve e com poucas palavras.
> Indicamos a utilização da nova propriedade `descriptionChart` em `p-options`.

---

@optional

@description

Define a altura do gauge.

O valor mínimo aceito é 300px.

@default `300px`

---

@optional

@description

Definição para o alcance de cores. Ao adicionar pelo menos um item na lista,
incorpora-se o ponteiro que assinala o valor passado em `p-value`.
Se o valor de `p-value` for inferior ao mínimo valor definido em `PoGaugeRanges.from`, o domínio mínimo do gauge será `p-value`.
A mesma regra prevalece para valores máximos.

---

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
