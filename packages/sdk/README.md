<div align="center">

# AbacatePay SDK

SDK oficial da **AbacatePay** para integrar pagamentos via **PIX** de forma simples, segura e totalmente tipada.

O [`@abacatepay/sdk`](https://www.npmjs.com/package/@abacatepay/sdk) é um **wrapper versionado de alto nível** sobre a API da AbacatePay, focado em **DX**, **TypeScript first** e **boas práticas de segurança**.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

Você pode ver documentação completa do SDK [aqui](https://docs.abacatepay.com/pages/sdk/node).

## Instalação

Use com o seu *package manager* favorito

</div>

```bash
bun add @abacatepay/sdk
# ou
pnpm add @abacatepay/sdk
# ou
npm install @abacatepay/sdk
```

<div align="center">

## Uso básico
</div>

```ts
import { AbacatePay } from '@abacatepay/sdk';

const abacate = AbacatePay({ secret });
```

<div align="center">

Nunca utilize sua API key diretamente no código.
**Sempre use variáveis de ambiente**.

### Criando uma cobrança

</div>

```ts
const TEN_REAIS_IN_CENTS = 1_000;

const checkout = await abacate.checkouts.create({
    items: [
        {
            id: 'item_123',
            amount: TEN_REAIS_IN_CENTS,
        },
    ],
});
```

<div align="center">

### Procure por alguns clientes

</div>

```ts
const customers = await abacate.customers.list({
    limit: 25,
});
```

<div align="center">

## Versionamento

Você também pode usar facilmente a v1 da *AbacatePay* sem nenhum problema ou boilerplate, apenas passe `/v1` como sufixo da importação

</div>

```ts
import { AbacatePay } from '@abacatepay/sdk/v1'

const client = AbacatePay({ secret });
```

<div align="center">

Você terá acesso a *todos os recursos* da v1, sem boilerplate, sem magia, apenas o SDK.
</div>

```ts
const data = await abacate.withdraw.create({
    method: 'PIX',
    externalId: 'trx_abc123',
    ...
});

console.log(data.receiptUrl);
```

<div align="center">

## Tratamento de erros

Erros da API são normalizados e previsíveis com base no pacote [`@abacatepay/rest`](https://www.npmjs.com/package/@abacatepay/rest).

</div>

```ts
try {
    await abacate.subscriptions.create({ ... });
} catch (error) {
    if (error instanceof HTTPError) {
        console.error(`An HTTP ocurred in route ${error.route} (Status ${error.status})`);
    }
}
```

<div align="center">

Feito com 🥑 pela equipe AbacatePay</br>
Open source, de verdade.

</div>
