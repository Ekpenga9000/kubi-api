/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/**
 * attachment_id (Primary Key)
issue_id (Foreign Key referencing Issues table)
user_id (Foreign Key referencing Users table)
file_name
file_path
uploaded_date
 * 
 */
exports.up = function(knex) {
  return knex.schema.createTable("attachment", (table)=>{
    table.increments("id").primary();
    table.integer("issue_id").unsigned()
    .references("issue.id");
    table.integer("user_id").unsigned()
    .references("user.id"); 
    table.text("file_name").notNullable();
    table.text("file_path").notNullable();
    table.timestamp("uploaded_date").defaultTo(knex.fn.now());
    table.timestamp("created_at").defaultTo(knex.fn.now()); 
    table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("attachment"); 
};
