exports.up = function(knex) {
    return knex.schema.createTable('manutencoes_programadas', function(table) {
      table.increments('id').primary();
      table.string('categoria'); // Executadas, Pendentes, Concluídas
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('manutencoes_programadas');
  };