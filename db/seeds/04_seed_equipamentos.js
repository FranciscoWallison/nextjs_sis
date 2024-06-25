exports.seed = function(knex) {
  const equipamentos = [
    { id_tipo: 1 },
    { id_tipo: 2 },
    { id_tipo: 3 }
  ];

  return knex('equipamentos').del()
    .then(function () {
      return knex('equipamentos').insert(equipamentos);
    });
};