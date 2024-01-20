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
        await db("sprint")
            .insert(newSprint); 
        return res.status(201).send("New sprint created");     

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

const fetchSprintById = async (req, res) => { 
    //Retrieve the id of the customer
    const { authorization } = req.headers;
    
    const userId = validateToken(authorization, "id");

    if(!userId) {
        return res.status(400).json({"message":"This is an invalid request."})
    }

    const { sprintId, projectId } = req.params;

    if(!sprintId || !projectId) {
        return res.status(400).json({"message":"This is an invalid request."})
    }
    try {

        const data = await db("sprint")
            .select("id", "name")
            .where("id", sprintId)
            .andWhere("project_id", projectId)
            .first(); 
        
        if(!data.id) {
            return res.status(404).json({"message":"No sprint found."})
        }
        
        return res.status(200).json(data); 

    } catch (err) {
        console.log(err);
    }
}

const fetchLatestSprint = async (req, res) => {

    const { authorization } = req.headers; 

    if (!authorization) {
        return res.status(400).json({ "message": "This is not a valid request." });
    }

    const userId = validateToken(authorization, "id"); 

    if (!userId) {
        return res.status(401).json({ "message": "Unauthorized user" });
    }

    const { projectId } = req.params; 

    if (!projectId) {
        return res.status(400).json({ "message": "This is an invalid request" });
    }

    try {

        const data = await db("sprint")
            .select("id", "name")
            .where("project_id", projectId)
            .andWhere("status", "pending")
            .orderBy("created_at", "desc")
            .first(); 

        return res.status(200).json(data);
        
    } catch (error) {
        console.log(error); 
        return res.status(500).send("Unable to carryout your request at the moment.")
    } 
}

const fetchAllActiveSprintsByProjectId = async (req, res) => {
    const { authorization } = req.headers; 

    if (!authorization) {
        return res.status(400).json({ "message": "This is not a valid request." });
    }

    const userId = validateToken(authorization, "id"); 

    if (!userId) {
        return res.status(401).json({ "message": "Unauthorized user" });
    }

    const { projectId } = req.params; 

    if (!projectId) {
        return res.status(400).json({ "message": "This is an invalid request" });
    }

    try {

        const data = await db("sprint")
            .select("id", "name")
            .where("project_id", projectId)
            .andWhere("status", "active");

        return res.status(200).json(data);
        
    } catch (error) {
        console.log(error); 
        return res.status(500).send("Unable to carryout your request at the moment.")
    } 
}

const deleteSprint = async (req, res) => {
    const { authorization } = req.headers; 

    if (!authorization) {
        return res.status(400).json({ "message": "Invalid request" }); 
    }
    const userId = validateToken(authorization, "id"); 

    if (!userId) {
        return res.status(401).json({ "message": "Unauthorized request" });
    }

    const { sprintId, projectId } = req.params; 

    if (!projectId || !sprintId) {
        return res.status(400).json({ "message": "Invalid request" }); 
    }

    try {
        const user = await db("sprint")
            .select("team.role as permission")
            .join("project", "sprint.project_id", "project.id")
            .join("team", "project.project_team", "team.id")
            .where("sprint.id", sprintId)
            .andWhere("project.id", projectId)
            .first(); 
        
        if (!user) {
            return res.status(404).send("No sprint with the id was found.");
        }

        if (user.permission !== "admin") {
            return res.status(403).send("User has insufficient permission."); 
        }

        await db.transaction(async (trx) => {
            await trx("sprint").where("id", sprintId).del(); 
        })
        
        return res.status(204).send("Sprint has been deleted.");

    } catch (err) {
        console.log(err); 
        return res.status(500).send("Unable to carryout your request at the moment.");
    }

}

module.exports = {
    createSprint,
    fetchAllSprintByProjectId, 
    fetchSprintById,
    fetchLatestSprint, 
    fetchAllActiveSprintsByProjectId,
    deleteSprint
}