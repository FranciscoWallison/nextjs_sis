exports.up = function(knex) {
    return knex.schema.createTable('manutencoes', function(table) {
      table.increments('id').primary();
      table.string('tipo_equipamento');
      table.string('equipamento');
      table.string('area');
      table.string('responsavel');
      table.string('mes');
      table.integer('ano');
      table.integer('quantidade');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('manutencoes');
  };
  