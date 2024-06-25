exports.up = function(knex) {
  return knex.schema.createTable('relacionamento_manutencao', function(table) {
    table.increments('id').primary();
    table.integer('id_manutencao').unsigned().references('id').inTable('manutencoes');
    table.integer('id_area').unsigned().references('id').inTable('areas');
    table.integer('id_responsavel').unsigned().references('id').inTable('responsaveis');
    table.integer('id_item').unsigned().references('id').inTable('equipamentos');
    table.integer('quantidade');
    table.decimal('mttr', 10, 2);
    table.text('atividade');
    table.text('observacao');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('relacionamento_manutencao');
};