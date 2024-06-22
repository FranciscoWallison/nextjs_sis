exports.up = function(knex) {
    return knex.schema.createTable('backlog_ordens_servico', function(table) {
      table.increments('id').primary();
      table.string('mes');
      table.integer('ano');
      table.integer('pendentes').defaultTo(0);
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('backlog_ordens_servico');
  };
  