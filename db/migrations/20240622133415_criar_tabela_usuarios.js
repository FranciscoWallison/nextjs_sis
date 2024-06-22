exports.up = function(knex) {
    return knex.schema.createTable('usuarios', function(table) {
      table.increments('id').primary();
      table.string('nome');
      table.string('email');
      table.timestamps();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('usuarios');
  };
  