const { faker } = require('@faker-js/faker');

exports.seed = function (knex) {
  const relacionamentoManutencao = [];
  for (let i = 0; i < 10; i++) {
    relacionamentoManutencao.push({
      id_manutencao: faker.number.int({ min: 1, max: 10 }),
      id_area: faker.number.int({ min: 1, max: 3 }),
      id_responsavel: faker.number.int({ min: 1, max: 3 }),
      id_item: faker.number.int({ min: 1, max: 3 }),
      quantidade: faker.number.int({ min: 1, max: 10 }),
      mttr: faker.number.float({ min: 1, max: 100 }),
      atividade: faker.lorem.sentence(),
      observacao: faker.lorem.sentence(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  return knex("relacionamento_manutencao")
    .del()
    .then(function () {
      return knex("relacionamento_manutencao").insert(relacionamentoManutencao);
    });
};
