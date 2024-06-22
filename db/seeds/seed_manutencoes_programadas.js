const { faker } = require('@faker-js/faker');

exports.seed = function(knex) {
  // Define as categorias
  const categorias = ['Executadas', 'Pendentes', 'Concluídas'];
  const manutencoes = [];

  // Cria registros falsos para cada categoria
  for (let i = 0; i < 100; i++) {
    const categoria = faker.helpers.arrayElement(categorias);
    manutencoes.push({
      categoria,
      created_at: new Date(),
      updated_at: new Date()
    });
  }

  // Remove todos os registros e insere os dados falsos
  return knex('manutencoes_programadas').del()
    .then(() => {
      return knex('manutencoes_programadas').insert(manutencoes);
    });
};
