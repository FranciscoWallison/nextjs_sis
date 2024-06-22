const { faker } = require('@faker-js/faker');

exports.seed = function(knex) {
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const anos = [2022, 2023, 2024];
  const tiposEquipamento = ["Tipo A", "Tipo B", "Tipo C"];
  const equipamentos = ["Equipamento 1", "Equipamento 2", "Equipamento 3"];
  const areas = ["Área 1", "Área 2", "Área 3"];
  const responsaveis = ["Responsável 1", "Responsável 2", "Responsável 3"];
  const manutencoes = [];

  anos.forEach((ano) => {
    meses.forEach((mes) => {
      tiposEquipamento.forEach((tipoEquipamento) => {
        equipamentos.forEach((equipamento) => {
          areas.forEach((area) => {
            responsaveis.forEach((responsavel) => {
              manutencoes.push({
                tipo_equipamento: tipoEquipamento,
                equipamento,
                area,
                responsavel,
                mes,
                ano,
                quantidade: faker.number.int({ min: 1, max: 100 }),
                created_at: new Date(),
                updated_at: new Date(),
              });
            });
          });
        });
      });
    });
  });

  return knex('manutencoes').del()
    .then(() => {
      return knex('manutencoes').insert(manutencoes);
    });
};
