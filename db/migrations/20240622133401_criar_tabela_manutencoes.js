exports.up = function(knex) {
  return knex.schema.createTable('manutencoes', function(table) {
    table.increments('id').primary();
    table.string('categoria');
    table.date('data_abertura');
    table.date('data_finalizacao');
    table.decimal('estimativa', 10, 2);
    table.text('descricao_motivo');
    table.boolean('parado');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('manutencoes');
};