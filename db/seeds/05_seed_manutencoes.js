const { faker } = require('@faker-js/faker');

exports.seed = function(knex) {
  const manutencoes = [];
  for (let i = 0; i < 10; i++) {
    manutencoes.push({
      categoria: faker.helpers.arrayElement(['Executadas', 'Pendentes', 'Concluídas']),
      data_abertura: faker.date.past().toISOString().split('T')[0],
      data_finalizacao: faker.date.future().toISOString().split('T')[0],
      estimativa: faker.commerce.price(),
      descricao_motivo: faker.lorem.sentence(),
      parado: faker.datatype.boolean(),
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  return knex('manutencoes').del()
    .then(function () {
      return knex('manutencoes').insert(manutencoes);
    });
};
