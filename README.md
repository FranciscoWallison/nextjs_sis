

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