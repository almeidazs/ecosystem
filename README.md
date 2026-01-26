<div align="center">

# Ecossistema AbacatePay 🥑

Monorepo oficial contendo **todas as bibliotecas open source do ecossistema AbacatePay**, publicadas sob o escopo [`@abacatepay`](https://www.npmjs.com/org/abacatepay) no NPM.

Cada pacote é versionado, testado e publicado **de forma independente**, com histórico próprio de releases.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

## Packages

Todos os pacotes vivem em `packages/*` e são publicados como `@abacatepay/<nome>`.

</div>

- [`@abacatepay/sdk`](https://www.npmjs.com/package/@abacatepay/sdk) - Um SDK ergonômico para a integração com a API da AbacatePay.
- [`@abacatepay/rest`](https://www.npmjs.com/package/@abacatepay/rest) — Client REST completo e tipado para a API da AbacatePay.
- [`@abacatepay/types`](https://www.npmjs.com/package/@abacatepay/types) - Tipagens e helpers completos da API da AbacatePay (Com versionamento).
- [`@abacatepay/elysia`](https://www.npmjs.com/package/@abacatepay/elysia) - Integração oficial para webhooks da AbacatePay dentro do Elysia.
- [`@abacatepay/supabase`](https://www.npmjs.com/package/@abacatepay/supabase) - Integração oficial para webhooks da AbacatePay dentro do Supabase.
- [`@abacatepay/hono`](https://www.npmjs.com/package/@abacatepay/hono) - Integração oficial para webhooks da AbacatePay dentro do Hono.
- [`@abacatepay/fastify`](https://www.npmjs.com/package/@abacatepay/fastify) - Integração oficial para webhooks da AbacatePay dentro do Fastify.
- [`@abacatepay/express`](https://www.npmjs.com/package/@abacatepay/express) - Integração oficial para webhooks da AbacatePay dentro do Express.
- [`@abacatepay/adapters`](https://www.npmjs.com/package/@abacatepay/adapters) - Adaptadores de Checkouts e Webhooks para a AbacatePay.
- [`@abacatepay/typebox`](https://www.npmjs.com/package/@abacatepay/typebox) - Schemas oficiais da API AbacatePay em TypeBox, com validação runtime, e suporte a OpenAPI.
- [`@abacatepay/zod`](https://www.npmjs.com/package/@abacatepay/zod) - Schemas oficiais da API AbacatePay em Zod, com validação runtime, e suporte a OpenAPI.
- [`@abacatepay/eslint-plugin`](https://www.npmjs.com/package/@abacatepay/eslint-plugin) - Um plugin ESLint para regras relacionada a AbacatePay.

<div align="center">

## Publicação & Versionamento

</div>

- Utilizamos monorepo com workspaces (Bun)
- Cada pacote possui:
  - versionamento próprio
  - changelog individual
  - release independente
- O fluxo de releases é automatizado via CI

<div align="center">

Inicialmente criado e principalmente mantido por [almeida](https://github.com/almeidazs) e [albq](https://github.com/albuquerquesz).

Feito com 🥑 pela equipe AbacatePay</br>
Open source, de verdade.

</div>
