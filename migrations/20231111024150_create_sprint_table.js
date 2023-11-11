/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("sprint", (table)=>{
    table.increments("id").primary();
    table.string("key").notNullable();
    table.integer("project_id")
    .unsigned()
    .references("project.id")
    .onUpdate("CASCADE")
    .onDelete("CASCADE");
    table.date("start_date");
    table.date("end_date"); 
    table.enu("status", ["Future","Active","Closed"]).defaultTo("Future");
    table.integer("user_id").unsigned().references("user.id");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("sprint");
};
