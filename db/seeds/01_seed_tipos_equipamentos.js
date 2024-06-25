exports.seed = function(knex) {
  const tiposEquipamentos = [
    { nome: 'Tipo 1' },
    { nome: 'Tipo 2' },
    { nome: 'Tipo 3' }
  ];

  return knex('tipos_equipamentos').del()
    .then(function () {
      return knex('tipos_equipamentos').insert(tiposEquipamentos);
    });
};