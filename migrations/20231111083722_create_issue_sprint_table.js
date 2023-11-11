/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("issue_sprint", (table) =>{
    table.increments("id").primary();
    table.integer("issue_id").unsigned().references("issue.id"); 
    table.integer("sprint_id").unsigned().references("sprint.id"); 
    table.enu("status", ["Future","Active","Closed"]).defaultTo("Future");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("issue_sprint");
};
