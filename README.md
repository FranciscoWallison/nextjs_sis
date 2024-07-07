## Começando

## Variáveis  de ambiente

Na maquina que irar rodar o projeto conforme as 'Project settings' do firebase:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

## Iniciando o projeto

Primeiro, execute o servidor de desenvolvimento:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Comandos de knex de migrate


````
MIGRATION

criar
npx knex migrate:make criar_tabela_usuarios --knexfile db/knexfile.js
npx knex migrate:make criar_tabela_manutencoes_programadas --knexfile=db/knexfile.js
npx knex migrate:make criar_tabela_cumprimento_manutencoes --knexfile=db/knexfile.js
npx knex migrate:make criar_tabela_backlog_ordens_servico --knexfile=db/knexfile.js
npx knex migrate:make criar_tabela_kpi_manutencoes --knexfile=db/knexfile.js
npx knex migrate:make criar_tabela_manutencoes --knexfile=db/knexfile.js

executar
npx knex migrate:latest --knexfile=db/knexfile.js



SEED

Cria 
npx knex seed:make seed_usuarios --knexfile db/knexfile.js
npx knex seed:make seed_manutencoes_programadas --knexfile=db/knexfile.js
npx knex seed:make seed_cumprimento_manutencoes --knexfile=db/knexfile.js
npx knex seed:make seed_backlog_ordens_servico --knexfile=db/knexfile.js
npx knex seed:make seed_kpi_manutencoes --knexfile=db/knexfile.js
npx knex seed:make seed_manutencoes --knexfile=db/knexfile.js

Executa
npx knex seed:run --knexfile=db/knexfile.js

````