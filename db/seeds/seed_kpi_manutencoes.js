const { faker } = require("@faker-js/faker");

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
  const kpiManutencoes = [];

  // Cria registros falsos para cada mês e ano
  anos.forEach((ano) => {
    meses.forEach((mes) => {
      kpiManutencoes.push({
        mes,
        ano,
        mtbf: faker.number.float({ min: 10, max: 100, multipleOf: 0.01 }),
        mttr: faker.number.float({ min: 1, max: 10, multipleOf: 0.01 }),
        disponibilidade: faker.number.float({
          min: 90,
          max: 99.99,
          multipleOf: 0.01,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    });
  });

  // Remove todos os registros e insere os dados falsos
  return knex("kpi_manutencoes")
    .del()
    .then(() => {
      return knex("kpi_manutencoes").insert(kpiManutencoes);
    });
};
