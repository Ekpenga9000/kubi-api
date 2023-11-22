const db = require("knex")(require("../knexfile")); 
const {validateToken} = require("../service/jwtService");


// TO DO

// Get the project
    //- How to get project that would be linked to the individual. 
    // - Get the projet where the creator id == the user or
    // - The user automatically gets added into a team when creating a project. 
    // - The user id would be queried from the team table that would be joined to the project's table and based on the roles, the user can edit the project. 



//Create a project 
    // - This is would create

// Edit that project and give a soft delete the project.

const fetchProjectsById = async(req, res) =>{
    //this is to fetch the projects based on the team that has the user id. 

    // join the team table and the project table.
    // Get all the project where from team where the user id === user id. 
    const {authorization} = req.headers; 

    if(!authorization){
        return res.status(400).json({"message":"Unauthorized Request."});
    }

    const userId = validateToken(authorization, "id");
     try{
        const projects = await db("project")
        .join("team", "project.project_team", "team.id")
        .where("team.member", userId); 
        
        return res.status(200).json({projects});
     }catch(err){
        console.log(err);
        return res.status(500).json({"error":"Internal Server Error"});
     }
}

module.exports = {
    fetchProjectsById
}