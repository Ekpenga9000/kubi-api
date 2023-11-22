/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable("team", (table)=>{
    table.increments("id").primary();
    table.string("name").notNullable(); //This would be programmatically filled with a random word and date generator. 
    table.integer("creator")
    .unsigned()
    .references("user.id");
    table.integer("member").unsigned().notNullable().references("user.id");
    table.enu("role", ["admin", "member"]).defaultTo("member");
    table.enu("member_status", ["active", "removed"]).defaultTo("active");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("team");
};
