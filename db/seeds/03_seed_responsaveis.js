exports.seed = function(knex) {
  const responsaveis = [
    { nome: 'Responsável 1' },
    { nome: 'Responsável 2' },
    { nome: 'Responsável 3' }
  ];

  return knex('responsaveis').del()
    .then(function () {
      return knex('responsaveis').insert(responsaveis);
    });
};