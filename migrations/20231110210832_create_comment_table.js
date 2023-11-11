/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

/**
 * comment_id (Primary Key)
issue_id (Foreign Key referencing Issues table)
user_id (Foreign Key referencing Users table)
comment_text
created_date
 */
exports.up = function(knex) {
  return knex.schema.createTable("issue_comment", (table)=>{
    table.increments("id").primary(); 
    table.integer("user_id")
    .unsigned()
    .references("user.id"); 
    table.integer("issue_id").unsigned()
    .references("issue.id")
    .onUpdate("CASCADE")
    .onDelete("CASCADE");
    table.text("comment").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("issue_comment");
};
