/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("issue", (table)=>{
    table.increments("id").primary(); 
    table.integer("project_id").unsigned()
    .references("project.id")
    .onUpdate("CASCADE")
    .onDelete("CASCADE");
    table.string("ticket_number").notNullable();
    table.string("summary").notNullable();
    table.text("description");
    table.enu("type", ["Epic", "Bug","Task"]).defaultTo("Task");
    table.enu("priority",["High", "Medium", "Low"]).defaultTo("Medium");
    table.enu("status", ["Open", "In Progress", "In Review", "Done"]).defaultTo("Open");
    table.integer("creator").unsigned()
    .references("user.id"); 
    table.integer("assignee").unsigned()
    .references("user.id");
    table.string("story_point"); 
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("issue");
};
