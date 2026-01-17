<div align="center">

# AbacatePay ESLint Plugin 🥑

Evite o vazamento de **API keys da AbacatePay** diretamente no seu código com uma regra ESLint simples, segura e focada em boas práticas.

O [`@abacatepay/eslint-plugin`](https://www.npmjs.com/package/@abacatepay/eslint-plugin) detecta **chaves secretas hardcoded** e incentiva o uso correto de **variáveis de ambiente**, antes que o erro chegue ao repositório.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

</div>

---

<div align="center">

## Instalação

Use com o seu *package manager* favorito

</div>

```bash
bun add -d @abacatepay/eslint-plugin
# ou
pnpm add -d @abacatepay/eslint-plugin
# ou
npm install -d @abacatepay/eslint-plugin
```

<div align="center">

## Configuração (ESLint v9+ / Flat Config)

O plugin é projetado **exclusivamente para ESLint v9+** usando flat config.

</div>

```ts
import abacatepay from '@abacatepay/eslint-plugin';

export default [
    {
        plugins: {
            abacatepay,
        },
        rules: {
            'abacatepay/no-secret-key': 'error',
        },
    },
]
```

<div align="center">

## Regras

</div>

<div align="center">

`abacatepay/no-secret-key`

Impede o uso de chaves secretas da AbacatePay diretamente no código, independentemente do contexto (strings, templates, JSX, headers etc).

### Sugestões automáticas

Sempre que possível, a regra oferece sugestões seguras para substituir a chave hardcoded por uma variável de ambiente.

</div>

```bash
- "abc_prod_xxxxxxxxxxxxxxxxxxxxxxx"
+ process.env.ABACATEPAY_API_KEY
```

<div align="center">

A regra não aplica autofix destrutivo — apenas sugestões explícitas e seguras.

### Uso incorreto
</div>

```ts
import { AbacatePay } from '@abacatepay/sdk';

const abacate = AbacatePay("abc_dev_xxxxxxxxxxxxxxxxxxxxxxx");
```

```ts
import { REST } from '@abacatepay/rest';

const client = new REST({ secret: 'Bearer abc_prod_xxxxxxxxxxxxxxxxxxxxxxx' });

await client.get('/store/get');
```

```ts
<Component apiKey="abc_dev_xxxxxxxxxxxxxxxxxxxxxxx" />
```

<div align="center">

### Uso correto
</div>

```ts
const abacate = AbacatePay(process.env.ABACATEPAY_API_KEY);
```

```ts
const client = new REST({ secret: process.env.ABACATEPAY_API_KEY });
```

<p align="center">Feito com 🥑 pela equipe AbacatePay</br>
Open source, de verdade.</p>
