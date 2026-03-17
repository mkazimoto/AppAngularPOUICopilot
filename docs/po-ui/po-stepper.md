# po-stepper

@description

O `po-stepper` permite que um processo seja dividido em passos para que o usuário o realize
mais facilmente.

Existem duas formas de utilização:

1 - Usando o componente [**po-step**](/documentation/po-step) para renderizar e descrever os passos.

2 - Através da propriedade `p-steps` para descrever os passos do processo, sendo responsabilidade do desenvolvedor o controle
de renderização do que será exibido a cada *step* ativo.

Através de suas propriedades, é possível definir se sua orientação será horizontal ou vertical,
além da possibilidade de aumentar o tamanho dos *steps*.

Também é possível navegar entre os *steps* através do teclado utilizando a tecla *tab* e, para ativar o *step* em foco basta
pressionar a tecla *enter*. Além disso, é possível ativar a exibição de ícones no lugar de números nos *steps* através da
propriedade [`p-step-icons`](/documentation/po-stepper#stepIconsProperty).

#### Utilizando os métodos do componente:

Para acessar os métodos do componente é necessário ter a referência do mesmo.

Por exemplo, utilizando um [**ViewChild**](https://angular.io/api/core/ViewChild):

```
@ViewChild(PoStepperComponent) poStepperComponent: PoStepperComponent;
```

E para acessar o método:

```
poStepperComponent.next();
```

#### Boas práticas

- Evite `labels` extensos que quebram o layout do `po-stepper`, use `labels` diretos, curtos e intuitivos.
- Utilize apenas um `po-stepper` por página.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                              | Descrição                                             | Valor Padrão                                      |
|------------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Label**                                |                                                       |                                                   |
| `--font-family`                          | Família tipográfica usada                             | `var(--font-family-theme)`                        |
| `--font-size`                            | Tamanho da fonte                                      | `var(--font-size-default)`                        |
| `--font-weight`                          | Peso da fonte                                         | `var(--font-weight-normal)`                       |
| **Step - Done**                          |                                                       |                                                   |
| `--text-color`                           | Cor do texto no step concluído                        | `var(--color-neutral-dark-70)`                    |
| `--color-icon-done`                      | Cor do ícone no step concluído                        | `var(--color-neutral-dark-70)`                    |
| `--background-done`                      | Cor de fundo no step concluído                        | `var(--color-neutral-light-00)`                   |
| **Line - Done**                          |                                                       |                                                   |
| `--color-line-done`                      | Cor da linha no step concluído                        | `var(--color-neutral-mid-40)`                     |
| **Step - Current**                       |                                                       |                                                   |
| `--color-icon-current`                   | Cor do ícone no step atual                            | `var(--color-neutral-light-00)`                   |
| `--background-current`                   | Cor de fundo no step atual                            | `var(--color-action-default)`                     |
| `--font-weight-current`                  | Peso da fonte no step atual                           | `var(--font-weight-bold)`                         |
| **Step - Next**                          |                                                       |                                                   |
| `--font-size-circle`                     | Tamanho da fonte no círculo do próximo step           | `var(--font-size-sm)`                             |
| `--color-next`                           | Cor do ícone no próximo step                          | `var(--color-action-disabled)`                    |
| `--text-color-next`                      | Cor do texto no próximo step                          | `var(--color-neutral-light-30)`                   |
| **Focused**                              |                                                       |                                                   |
| `--outline-color-focused`                | Cor do outline do estado de focus                     | `var(--color-action-focus)`                       |

---

**`p-step-icons`**

@optional

@description

<a id="stepIconsProperty"></a>

Habilita a exibição de ícone ao invés de número no centro do círculo dos *steps*.

@default `false`

---

**`p-step-size`**

@optional

@description

Define o tamanho dos *steps* em *pixels*, possibilitando um maior destaque.

O valor informado deve ser entre `24` e `64`.

> Valores que não se enquadrarem a esta regra serão ignorados, mantendo-se o valor *default*.

@default `24`

---

**`p-change-step`**

Ação que será executada quando o usuário mudar o passo do `po-stepper`.

---

**`p-align-center`**

@optional

@description

Define o alinhamento dos *steps* e *labels* no *stepper*, dependendo da orientação.

- Quando `true`, ficam centralizados em ambas as orientações (horizontal e vertical).
- Quando `false`, ficam alinhados à esquerda na orientação horizontal e ao topo na orientação vertical.

@default `true`

---

**`p-orientation`**

@optional

@description

Define a orientação de exibição do `po-stepper`.

> Veja os valores válidos no *enum* [PoStepperOrientation](documentation/po-stepper#stepperOrientation).

@default `PoStepperOrientation.Horizontal`

---

**`p-step`**

@optional

@description

Controla o passo atual do `po-stepper`.

> Ao utilizar esta propriedade e também utilizar o componente [**po-step**](/documentation/po-step),
o valor desta propriedade será ignorada permanecendo a definição do [**po-step**](/documentation/po-step).

@default `1`

---

**`p-steps`**

@optional

@description

Lista dos itens do stepper. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio.

> Ao utilizar esta propriedade e também utilizar o componente [**po-step**](/documentation/po-step),
o valor desta propriedade será ignorada permanecendo a definição do [**po-step**](/documentation/po-step).

---

**`p-sequential`**

@optional

@description

Define se o `po-stepper` será sequencial ou aleatório.

> Ao utilizar o componente [**po-step**](/documentation/po-step), o valor desta propriedade sempre será verdadeiro.

@default `true`

---

**`p-step-icon-done`**

@optional

@description
Permite definir o ícone do step no status concluído.
Esta propriedade permite usar ícones da [Biblioteca de ícones](https://po-ui.io/icons)
```
<po-stepper p-step-icon-done="an an-check-circle">
   ...
</po-stepper>
```
Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
```
<po-stepper [p-step-icon-done]="doneIcon">
   ...
</po-stepper>

<ng-template #doneIcon>
   <i class="an an-check-fat"></i>
</ng-template>
```
> Deve-se usar `font-size: inherit` para ajustar ícones que não se ajustam automaticamente.

@default `po-icon-ok`

---

**`p-step-icon-active`**

@optional

@description
Permite definir o ícone do step no status ativo.
Esta propriedade permite usar ícones da [Biblioteca de ícones](https://po-ui.io/icons).
```
<po-stepper p-step-icon-active="an an-pencil-simple-line">
   ...
</po-stepper>
```
Para customizar o ícone através do `TemplateRef`, veja a documentação da propriedade `p-step-icon-done`.

> Deve-se usar `font-size: inherit` para ajustar ícones que não se ajustam automaticamente.

@default `po-icon-edit`

---

**`p-disable-click`**

@optional

@description

Desabilita o clique nos steps.

@default `false`

@docsExtends PoStepperBaseComponent

@example

<example name="po-stepper-basic" title="PO Stepper Basic">
 <file name="sample-po-stepper-basic/sample-po-stepper-basic.component.html"> </file>
 <file name="sample-po-stepper-basic/sample-po-stepper-basic.component.ts"> </file>
</example>

<example name="po-stepper-labs" title="PO Stepper Labs">
 <file name="sample-po-stepper-labs/sample-po-stepper-labs.component.html"> </file>
 <file name="sample-po-stepper-labs/sample-po-stepper-labs.component.ts"> </file>
</example>

<example name="po-stepper-sales" title="PO Stepper - Sales">
 <file name="sample-po-stepper-sales/sample-po-stepper-sales.component.html"> </file>
 <file name="sample-po-stepper-sales/sample-po-stepper-sales.component.ts"> </file>
</example>

<example name="po-stepper-active" title="PO Stepper - Active">
 <file name="sample-po-stepper-active/sample-po-stepper-active.component.html"> </file>
 <file name="sample-po-stepper-active/sample-po-stepper-active.component.ts"> </file>
 <file name="sample-po-stepper-active/sample-po-stepper-active.service.ts"> </file>
</example>

<example name="po-stepper-steps" title="PO Stepper - Steps">
 <file name="sample-po-stepper-steps/sample-po-stepper-steps.component.html"> </file>
 <file name="sample-po-stepper-steps/sample-po-stepper-steps.component.ts"> </file>
</example>

---

Altera o status do *step* para ativo.

> Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).

@param {number} index Índice do `po-step` que se deseja ativar.

---

Ativa o primeiro *step*.

> Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).

---

Ativa o próximo *step*.

> Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).

---

Ativa o *step* anterior.

> Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).
