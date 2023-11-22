/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user').del()
  await knex('user').insert([
    {id: 1, 
      firstname: 'Omogbare',
      lastname:"Ekpenga",
      email:"lekpenga@brainstation.io", 
      profile_pic:"images/sample.png", 
      password_hash:"$2a$10$MRAyVUJdFmREAPoM9Eb2Ne72EhMPGMPtRTJzM62lMK8Q4p./1keM6",
      status:"active",
      created_at:"2023-11-12 20:36:33",
      updated_at:"2023-11-22 10:30:49"
    },
    
  ]);
};
