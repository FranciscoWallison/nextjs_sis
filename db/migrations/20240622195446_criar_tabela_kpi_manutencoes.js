exports.up = function (knex) {
  return knex.schema.createTable("kpi_manutencoes", function (table) {
    table.increments("id").primary();
    table.string("mes");
    table.integer("ano");
    table.float("mtbf"); // Mean Time Between Failures
    table.float("mttr"); // Mean Time to Repair
    table.float("disponibilidade"); // Disponibilidade
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("kpi_manutencoes");
};
