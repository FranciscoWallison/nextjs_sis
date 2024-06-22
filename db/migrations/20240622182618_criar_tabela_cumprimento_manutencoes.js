exports.up = function (knex) {
  return knex.schema.createTable("cumprimento_manutencoes", function (table) {
    table.increments("id").primary();
    table.string("mes");
    table.integer("ano");
    table.integer("executadas").defaultTo(0);
    table.integer("pendentes").defaultTo(0);
    table.integer("concluidas").defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("cumprimento_manutencoes");
};
