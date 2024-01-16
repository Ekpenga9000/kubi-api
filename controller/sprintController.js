const db = require("knex")(require("../knexfile"));
const { validateToken } = require("../service/jwtService"); 

const createSprint = async (req, res) => {
    //Retrieve the id of the customer
    const { authorization } = req.headers; 

    if (!authorization) {
        return res.status(400).json({ "message": "This is an invalid request." }); 
    }
    
    const userId = validateToken(authorization, "id"); 

    if (!userId) {
        return res.status(400).json({ "message": "This is an invalid request." }); 
    }
    
    const { projectId } = req.params; 

    if (!projectId) {
        return res.status(400).json({ "message": "This is an invalid request." }); 
    }

    try {

        const user = await db("user")
            .select("id")
            .where("id", userId)
            .first(); 
        
        if (!user.id) {
            return res.status(400).json({ "message": "This is an invalid request." });  
        } 
        
        const projectDeets = await db("project")
            .select(
                "project.project_number as projectkey",
                "team.role as permission"
            )
            .join("team", "project.project_team", "team.id")
            .where("team.member", user.id)
            .andWhere("project.id", projectId)
            .first();
        
            if (projectDeets.permission !== "admin") {
                return res.status(403).json({"message":"You don't have the permission to carry out this action."})
            }
            
            const sprintArr = await db("sprint")
            .select("id", "name")
            .where("project_id", projectId);
    
        const name = `${projectDeets.projectkey} Sprint ${sprintArr.length + 1}`; 
        
        const newSprint = {
            project_id: projectId, 
            name, 
            creator_id:user.id
        }

        // Insert the sprint into the database and return the id of the sprint;
        const sprint = await db("sprint")
            .insert(newSprint)
            .returning("id");

        return res.status(201).json({ sprint });     

    } catch (err) {
        console.log(err);
        return res.status(500).json({"message":"Unable to carryout your request at the moment."})
    }
}

const fetchAllSprintByProjectId = async (req, res) => {
    const { authorization } = req.headers; 

    if (!authorization) {
        return res.status(400).json({ "message": "This is an invalid request." }); 
    }

    const userId = validateToken(authorization, "id"); 

    if (!userId) {
        return res.status(400).json({ "message": "This is an invalid request." }); 
    }

    const { projectId } = req.params; 

    try {

        const sprints = await db("sprint")
            .select("id", "name")
            .where("project_id", projectId); 
        
        return res.status(200).json({ sprints }); 
        
    } catch (err) {
        console.log(err);
    }

}

module.exports = {
    createSprint,
    fetchAllSprintByProjectId
}