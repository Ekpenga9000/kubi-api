const db = require("knex")(require("../knexfile")); 
const knex = require("knex");
const {validateToken} = require("../service/jwtService");

/* Utility functions */

const createProjectNumber = (str) =>{
    const name = str.split(" ");
    const firstLetters = name.map((word) => word[0].toUpperCase());
    return firstLetters.join("");
}

const fetchProjectById = async (req, res) => {
    const { authorization } = req.headers
    
    if (!authorization) {
        return res.status(400).json({ "message": "Bad request" });
    }

    const userId = validateToken(authorization, "id");

    if (!userId) {
        return res.status(401).json({"message":"Unauthorized Request."});
    }

    const { projectId } = req.params;
    
    try{
        const data = await db("project")
            .select(
                "project.id as id",
                "project.name as name",
                "project.status as status",
                "project.project_number as projectNumber",
                "project.description as description",
                "team.role as permission"
            )
            // You would be required to use an alias for double calls on similar relationships. 
            .join("team", "project.project_team", "team.id")
            .join("user as user_team", "team.member", "user_team.id")
            .where("team.member", userId)
            .andWhere("project.id", projectId)
            .andWhere("project.archived", false)
            .first();   
        
        // You would be required to use an alias for double calls on similar relationships.
         
        if (!data) {
            return res.status(404).json({ "message": "No project was found" });
        }
       return res.status(200).json(data);
    }catch(err){
       console.log(err);
       return res.status(500).json({"error":"Internal Server Error"});
    }
}


const fetchProjectDetailsById = async (req, res) => {
    //Authenticate the user
    const { authorization } = req.headers
    
    if (!authorization) {
        return res.status(400).json({ "message": "Bad request" });
    }

    const userId = validateToken(authorization, "id");

    if (!userId) {
        return res.status(401).json({"message":"Unauthorized Request."});
    }

    const { projectId } = req.params;
    try{
        const data = await db("project")
            .select(
                "project.id as project_id",
                "project.name as name",
                "project.status as status",
                "project.project_number as project_number",
                "project.type as type",
                "project.created_at as created_at",
                "project.description as description",  
                 db.raw("CONCAT(user_creator.firstname, ' ', user_creator.lastname) as project_creator"),
                "user_lead.id as lead_id",
                db.raw("CONCAT(user_lead.firstname, ' ', user_lead.lastname) as project_lead"),
                 "project.start_date as startDate",
                 "project.end_date as endDate",
                "team.name as team_name",
                "team.id as team_id"
            )
            // You would be required to use an alias for double calls on similar relationships. 
            .join("user as user_creator", "project.project_creator", "user_creator.id")
            .join("user as user_lead", "project.project_lead", "user_lead.id")
            .join("team", "project.project_team", "team.id")
            .join("user as user_team", "team.member", "user_team.id")
            .where("team.member", userId)
            .andWhere("project.id", projectId)
            .first();   
        
        // You would be required to use an alias for double calls on similar relationships.
         
        if (!data) {
            return res.status(404).json({ "message": "No project was found" });
        }
       return res.status(200).json(data);
    }catch(err){
       console.log(err);
       return res.status(500).json({"error":"Internal Server Error"});
    }
}
const fetchProjectsByUserId = async (req, res) => {

    const {authorization} = req.headers; 

    if(!authorization){
        return res.status(400).json({"message":"Bad Request."});
    }

    const userId = validateToken(authorization, "id");

    if(!userId){
     return res.status(401).json({"message":"Unauthorized request."});
    }

     try{
         const projects = await db("project")
             .select(
                 "project.id as id",
                 "project.name as name",
                 "project.status as status",
                 "project.project_number as project_number",
                 "project.type as type",
                 "project.created_at as created_at",
                 db.raw("CONCAT(user_creator.firstname, ' ', user_creator.lastname) as project_creator"),
                 "user_lead.id as lead_id",
                 db.raw("CONCAT(user_lead.firstname, ' ', user_lead.lastname) as project_lead"),
                 "team.role as permission"
             )
             // You would be required to use an alias for double calls on similar relationships. 
             .join("user as user_creator", "project.project_creator", "user_creator.id")
             .join("user as user_lead", "project.project_lead", "user_lead.id")
             .join("team", "project.project_team", "team.id")
             .join("user as user_team", "team.member", "user_team.id")
             .where("team.member", userId)
             .orderBy("project.created_at", "desc");
         
         // You would be required to use an alias for double calls on similar relationships.
        
        return res.status(200).json({projects});
     }catch(err){
        console.log(err);
        return res.status(500).json({"error":"Internal Server Error"});
     }
}

const createProject = async(req, res) =>{
    // Create the project 
    const {authorization} = req.headers; 

    if(!authorization){
        return res.status(401).json({"message":"Unauthorized request"});
    }
    
    const { name, description, type, status, start_date, end_date, team_id, project_number } = req.body

if(!name.trim() || !type.trim() || !status.trim() || !start_date.trim() || !end_date.trim()){
        return res.status(400).json({"message":"Invalid project creation request."})
    }

    const userId = validateToken(authorization, "id"); 


    try{
        const user = await db("user").where("id", userId).first(); 
    
        if(Object.keys(user) === 0){
            return res.status(400).json({"message": "Bad Request."});
        }
     
        let project_team; 

        if(!team_id){
            const timestamp = Date.now(); 
            const name = `${user.firstname} ${timestamp}`
            const creator = userId; 
            const member = userId;
            const role = 'admin'; 

            const newTeam = {
                name, 
                creator,
                member, 
                role
            }

            const [id] = await db("team")
                        .insert(newTeam); 
            project_team = id; 
        }else{
            project_team = team_id; 
        }

        if (!project_number.trim()) {
            project_number = createProjectNumber(name);             
        }
        
        const project_lead = userId; 
        const project_creator = userId; 


        const newProject = {
            project_number, 
            name,
            description, 
            type, 
            status, 
            start_date, 
            end_date, 
            project_lead, 
            project_team,
            project_creator
        }

        await db("project").insert(newProject); 

        return res.status(201).json({"message":"Project created!"})
        

    }catch(err){
        console.log(err);
        return res.status(500).json({"message":"Internal Server Error. "});
    }

    // Return the project
}

const fetchArchivedProjectsById = async (req, res) => {
    const { authorization } = req.headers
    
    if (!authorization) {
        return res.status(400).json({ "message": "Bad request" });
    }

    const userId = validateToken(authorization, "id");

    if (!userId) {
        return res.status(401).json({"message":"Unauthorized Request."});
    }

    const { projectId } = req.params;
    
    try{
        const data = await db("project")
            .select(
                "project.id as id",
                "project.name as name",
                "project.status as status",
                "project.project_number as projectNumber",
                "project.description as description",
                "team.role as permission"
            )
            // You would be required to use an alias for double calls on similar relationships. 
            .join("team", "project.project_team", "team.id")
            .join("user as user_team", "team.member", "user_team.id")
            .where("team.member", userId)
            .andWhere("project.id", projectId)
            .andWhere("project.archived", true)
            .first();   
        
        // You would be required to use an alias for double calls on similar relationships.
         
        if (!data) {
            return res.status(404).json({ "message": "No project was found" });
        }
       return res.status(200).json(data);
    }catch(err){
       console.log(err);
       return res.status(500).json({"error":"Internal Server Error"});
    }
}

const archiveProjectById = async (req, res) => {
    const { authorization } = req.headers; 

    if (!authorization) {
        return res.status(401).json({ "message": "Invalid request" }); 
    }

    const { id } = req.body;
    
    if (!id) {
        return res.status(400).json({ "message": "Bad request" }); 
    }

    const userId = validateToken(authorization, "id");

    try {
        const userProject = await db("project")
            .select("project.id as projectId",
                "project.archived as archived",
                "team.role as permission"
            )
            .join("team", "project.project_team", "team.id")
            .where("team.member", userId)
            .andWhere("project.id", id)
            .first();

        //We are checking for the following:

        //The User has permission
        if (userProject.permission !== "admin") {
            return res.status(403).json({ "message": "Insufficient priviledges to carryout request." });
        }

        //The project id exists
        if (!userProject.projectId) {
            return res.status(404).json({ "message": "Project with id not found." });
        }

        //The project is not archived;
        if (userProject.archived) {
            return res.status(204).json({ "message": "Project is already archived" });
        }

        await db("project")
            .where("id", id)
            .update("archived", true); 
        
        return res.status(200).json({ message: 'Entity updated successfully' });
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "Unable to carryout your request at this time." });

    }
}

const deleteProjectById = async (req, res) => {
    
    const { authorization } = req.headers; 

    if (!authorization) {
        return res.status(401).json({ "message": "Invalid request" });
    }

    const { id } = req.params; 
    if (!id) {
        return res.status(400).json({ "message": "Invalid request" });
    }

    try {
        const userId = validateToken(authorization, "id"); 

        const user = await db("project")
            .select("project.id as projectId",
                "team.role as permission"
            )
            .join("team", "project.project_team", "team.id")
            .where("team.member", userId)
            .andWhere("project.id", id)
            .first();
        
        const { permission } = user; 

        if (permission !== "admin") {
            return res.status(403).json({ "message": "Insufficient permissions" }); 
        }

        await db.transaction(async (trx) => {
            await trx("project").where("id", id).del();
        })

        return res.status(204).send("Project has been deleted.");
        
    } catch (err) {
        console.log(err); 
        return res.status(500).json({"message": "Unable to carryout your request at this time."})
    }
}

module.exports = {
    archiveProjectById,
    fetchProjectsByUserId, 
    createProject,
    fetchProjectById,
    fetchProjectDetailsById,
    deleteProjectById,
    fetchArchivedProjectsById
}