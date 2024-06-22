const { faker } = require('@faker-js/faker');

exports.seed = function (knex) {
  // Define os meses e anos para os dados falsos
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const anos = [2022, 2023, 2024];
  const cumprimentoManutencoes = [];

  // Cria registros falsos para cada mês e ano
  anos.forEach((ano) => {
    meses.forEach((mes) => {
      cumprimentoManutencoes.push({
        mes,
        ano,
        executadas: faker.number.int({ min: 10, max: 100 }),
        pendentes: faker.number.int({ min: 5, max: 50 }),
        concluidas: faker.number.int({ min: 10, max: 100 }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    });
  });

  // Remove todos os registros e insere os dados falsos
  return knex("cumprimento_manutencoes")
    .del()
    .then(() => {
      return knex("cumprimento_manutencoes").insert(cumprimentoManutencoes);
    });
};
