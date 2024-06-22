const { faker } = require("@faker-js/faker");

exports.seed = function (knex) {
  const fakeUsers = [];
  const desiredFakeUsers = 100;

  for (let i = 0; i < desiredFakeUsers; i++) {
    fakeUsers.push({
      nome: faker.internet.userName(),
      email: faker.internet.email(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  return knex("usuarios")
    .del()
    .then(() => {
      return knex("usuarios").insert(fakeUsers);
    });
};
