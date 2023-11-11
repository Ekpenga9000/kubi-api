/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("project", (table)=>{
      table.increments("id").primary();
      table.string("project_number").notNullable().unique(); 
      table.string("name").notNullable();
      table.text("description");
      table.enu("status", ["Active", "Deferred","Closed"]).defaultTo("Active"); 
      table.date("startDate").notNullable();
      table.date("endDate").notNullable(); 
      table
      .integer("project_creator")
      .unsigned()
      .references("user.id");
      table
      .integer("project_lead")
      .unsigned()
      .references("user.id");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")); 
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("project");
};
