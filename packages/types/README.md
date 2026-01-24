<div align="center">

## AbacatePay API Types

O [@abacatepay/types](https://www.npmjs.com/package/@abacatepay/types) fornece **tipagens oficiais** e **helpers modernos** para trabalhar com a API da AbacatePay de forma **segura**, **previsível** e **alinhada** à documentação oficial.

O pacote é **TypeScript-first** e serve como base para integrações diretas via **fetch**, **SDKs** internos, **CLIs** e validações em **aplicações** backend.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

## Instalação

Use o *package manager* da sua preferência:

</div>

```bash
bun add @abacatepay/types
# ou
pnpm add @abacatepay/types
# ou
npm install @abacatepay/types
```

<div align="center">

## Versionamento dos Tipos

Antes de tudo, você deve especificar a versão da API que deseja usar, adicionando **/v*** na importação:

</div>

```ts
import { APICustomer } from '@abacatepay/types/v2';
```

<p align="center">Tipos e constantes globais não são versionados e devem ser importados diretamente sem a versão:</p>

```ts
import { version, API_BASE_URL, API_VERSION } from '@abacatepay/types';
```

## Como a AbacatePay API Types documenta

- Prefixo `API*`
Representa estruturas gerais da API (Objetos retornados, modelos internos etc.).

- Prefixo `Webhook*`
Representa payloads recebidos pelos eventos de webhook.
Documentação: https://docs.abacatepay.com/pages/webhooks

- Prefixo `REST<HTTPMethod>*`
Tipos usados em requisições diretas à API.
  - Sufixo Body → corpo enviado na requisição
  Ex.: `RESTPostCreateNewChargeBody`

  - Sufixo `QueryParams` → parâmetros de query
  Ex.: `RESTGetCheckQRCodePixStatusQueryParams`

  - Sufixo `Data` → dados retornados pela API
  Ex.: `RESTGetListCouponsData`

- O pacote **NÃO adiciona tipos além do que existe na documentação oficial**.
Cada tipo reflete exatamente o que está documentado aqui:
https://docs.abacatepay.com/pages/introduction

- Campos marcados com `@unstable`
São campos que não têm definição formal na documentação, mas cujo tipo foi inferido com base nos exemplos oficiais.
(Ex.: `WebhookWithdrawDoneEvent.billing.kind`)

<h2 align="center">Quickstart</h2>

<p align="center"><strong>Crie um novo cupom</strong></p>

```ts
import {
    Routes,
    type APICoupon,
    type RESTPostCreateCouponBody,
} from '@abacatepay/types/v2';
import { REST } from '@abacatepay/rest';

const client = new REST({ secret });

async function createCoupon(body: RESTPostCreateCouponBody) {
    const data = await client.post<APICoupon>(Routes.coupons.create, { body });

    return data;
}
```

<p align="center"><strong>Crie um servidor e escute eventos de Webhooks do Aabacate</strong></p>

```ts
import { WebhookEvent } from '@abacatepay/zod/v2';
import { WebhookEventType } from '@abacatepay/types/v2';

Bun.serve({
    routes: {
        async '/webhooks/abacate'(request) {
            const raw = await request.json();
            
            const { data, event } = WebhookEvent.parse(raw);

            switch (event) {
                case WebhookEventType.BillingPaid:
                    console.log(`Um novo pagamento de ${data.payment.amount} foi feito`);

                    break;
                case WebhookEventType.WithdrawDone:
                    console.log(`Um novo saque foi feito ${data.transaction.receiptUrl}`);

                    break;
                case WebhookEventType.WithdrawFailed:
                    console.log(`O saque com o ID ${data.transaction.id} falhou`);
            }

            return new Response('OK');
        },
    },
});
```

<p align="center">Feito com 🥑 pela equipe AbacatePay</br>
Open source, de verdade.</p>
