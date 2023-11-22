/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable("user", (table) =>{
    table.increments("id").primary();
    table.string("firstname").notNullable();
    table.string("lastname").notNullable(); 
    table.string("email").notNullable().unique();
    table.text("profile_pic");
    table.string("password_hash").notNullable();
    table.enu("status", ["active", "inactive","deleted"]).defaultTo("active");  
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.schema.dropTable("user");
};
