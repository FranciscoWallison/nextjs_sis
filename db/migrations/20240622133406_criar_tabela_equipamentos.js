exports.up = function(knex) {
  return knex.schema.createTable('equipamentos', function(table) {
    table.increments('id').primary();
    table.integer('id_tipo').unsigned().references('id').inTable('tipos_equipamentos');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('equipamentos');
};