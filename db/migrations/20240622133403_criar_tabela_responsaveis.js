exports.up = function (knex) {
  return knex.schema.createTable("responsaveis", function (table) {
    table.increments("id").primary();
    table.string("nome");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("responsaveis");
};
