exports.seed = function(knex) {
  const areas = [
    { nome: 'Área 1' },
    { nome: 'Área 2' },
    { nome: 'Área 3' }
  ];

  return knex('areas').del()
    .then(function () {
      return knex('areas').insert(areas);
    });
};