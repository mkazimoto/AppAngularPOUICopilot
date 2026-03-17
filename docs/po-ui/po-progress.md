# po-progress

@description

Componente de barra de progresso que possibilita exibir visualmente o progresso/carregamento de uma tarefa.

Este componente pode ser utilizado no *upload* de arquivos, uma atualização no sistema ou o processamento de uma imagem.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade                            | Descrição                                             | Valor Padrão                                    |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values**                     |                                                       |                                                 |
| `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                      |
| `--text-color`                         | Cor do texto                                          | `var(--color-neutral-dark-90)`                  |
| **Error**                              |                                                       |                                                 |
| `--text-color-error`                   | Cor do texto no estado error                          | `var(--color-feedback-negative-dark)`           |
| `--color-icon-error`                   | Cor do ícone no estado error                          | `var(--color-feedback-negative-dark)`           |
| **po-progress-bar**                    |                                                       |                                                 |
| `--background-color-tray`              | Cor do background                                     | `var(--color-brand-01-lightest)`                |
| `--background-color-indicator`         | Cor do background do indicador                        | `var(--color-action-default)`                   |

---

**`p-disabled-cancel`**

@optional

@description

Desabilita botão de cancelamento na parte inferior da barra de progresso.

> Se nenhuma função for passada para o evento `(p-cancel)` ou a barra de progresso estiver com o status `PoProgressStatus.Success`,
o ícone de cancelamento não será exibido.

@default `false`

---

**`p-info`**

@optional

@description

Informação adicional que aparecerá abaixo da barra de progresso ao lado direito.

---

**`p-info-icon`**

@optional

@description

Ícone que aparecerá ao lado do texto da propriedade `p-info`.

Exemplo: `an an-check`.

---

**`p-status`**

@optional

@description

Status da barra de progresso que indicará visualmente ao usuário
o andamento, por exemplo, se a mesma foi concluída com sucesso.

@default `PoProgressStatus.Default`

---

**`p-text`**

@optional

@description

Texto principal que aparecerá abaixo da barra de progresso no lado esquerdo.

---

**`p-custom-action`**

@optional

@description

Permite definir uma ação personalizada no componente `po-progress`, exibindo um botão no canto inferior direito
da barra de progresso. A ação deve implementar a interface **PoProgressAction**, possibilitando configurar:

- **`label`**: Texto exibido no botão (opcional).
- **`icon`**: Ícone exibido no botão (opcional).
- **`type`**: Tipo do botão (`default` ou `danger`) para indicar a intenção da ação (opcional).
- **`disabled`**: Indica se o botão deve estar desabilitado (opcional).
- **`visible`**: Determina se o botão será exibido. Pode ser um valor booleano ou uma função que retorna um booleano (opcional).

@example
**Exemplo de uso:**
```html
<po-progress
 [p-value]="50"
 [p-custom-action]="customAction"
 (p-custom-action-click)="onCustomActionClick()"
></po-progress>
```

```typescript
customAction: PoProgressAction = {
  label: 'Baixar',
  icon: 'an an-download',
  type: 'default',
  visible: () => true
};

onCustomActionClick() {
  console.log('Custom action triggered!');
}
```

**Cenários comuns:**
1. **Download de Arquivos**: Exibir um botão para realizar o download de um arquivo associado à barra de progresso.
2. **Cancelamento Personalizado**: Adicionar uma ação para interromper ou reverter uma operação em andamento.

---

**`p-custom-action-click`**

@optional

@description

Evento emitido quando o botão definido em `p-custom-action` é clicado. Este evento retorna informações
relacionadas à barra de progresso ou ao arquivo/processo associado, permitindo executar ações específicas.

@example
**Exemplo de uso:**

```html
<po-progress
 [p-value]="50"
 [p-custom-action]="customAction"
 (p-custom-action-click)="onCustomActionClick()"
></po-progress>
```

```typescript
customAction: PoProgressAction = {
  label: 'Cancelar',
  icon: 'an an-x',
  type: 'danger',
  visible: true
};

onCustomActionClick() {
  console.log('Custom action triggered!');
}
```

**Cenários comuns:**
1. **Botão de Download**: Disparar o download do arquivo associado à barra de progresso.
2. **Ação Condicional**: Realizar uma validação ou chamada de API antes de prosseguir com a ação.

---

**`p-cancel`**

@optional

@description

Evento que será disparado ao clicar no ícone de cancelamento ("x") na parte inferior da barra de progresso.

Ao ser disparado, a função receberá como parâmetro o status atual da barra de progresso.

> Se nenhuma função for passada para o evento ou a barra de progresso estiver com o status `PoProgressStatus.Success`,
o ícone de cancelamento não será exibido.

---

**`p-retry`**

@optional

@description

Evento que será disparado ao clicar no ícone de tentar novamente na parte inferior da barra de progresso.

> o ícone será exibido apenas se informar uma função neste evento e o status da barra de progresso for
`PoProgressStatus.Error`.

---

**`p-indeterminate`**

@optional

@description

Habilita o modo indeterminado na barra de progresso, que mostra uma animação fixa sem um valor estabelecido.

Esta opção pode ser utilizada quando não souber quanto tempo levará para que um processo seja concluído.

> Caso esta propriedade e a `p-value` seja habilitada, a propriedade `p-value` será ignorada.

@default `false`

---

**`p-value`**

@optional

@description

Valor que representará o progresso.

> Os valores aceitos são números inteiros de `0` à `100`.

@default `0`

---

**`p-size`**

@optional

@description

Define a expessura da barra de progresso.

Valores válidos:
 - medium
 - large

@default `large`

---

**`p-size-actions`**

@optional

@description

Define o tamanho das ações no componente com excessão da barra de progresso que pode ser ajustada através da propriedade `p-size`:
- `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
- `medium`: aplica a medida medium de cada componente.

> Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).

@default `medium`

---

**`p-show-percentage`**

@optional

@description

Ativa a exibição da porcentagem atual da barra de progresso.

@default `false`

@docsExtends PoProgressBaseComponent

@example
<example name="po-progress-basic" title="PO Progress Basic">
  <file name="sample-po-progress-basic/sample-po-progress-basic.component.html"> </file>
  <file name="sample-po-progress-basic/sample-po-progress-basic.component.ts"> </file>
</example>

<example name="po-progress-labs" title="PO Progress Labs">
  <file name="sample-po-progress-labs/sample-po-progress-labs.component.html"> </file>
  <file name="sample-po-progress-labs/sample-po-progress-labs.component.ts"> </file>
</example>

<example name="po-progress-publication" title="PO Progress - Publication">
  <file name="sample-po-progress-publication/sample-po-progress-publication.component.html"> </file>
  <file name="sample-po-progress-publication/sample-po-progress-publication.component.ts"> </file>
</example>
