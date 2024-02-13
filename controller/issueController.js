const db = require("knex")(require("../knexfile"));
const { validateToken } = require("../service/jwtService");


const createIssue = async (req, res) => {
    // validate form body
    const { projectId, summary, type, priority } = req.body; 

    if (!projectId || !summary || !type || !priority) {
        return res.status(400).send("Please ensure that all fields are filled.")
    }

    const { authorization } = req.headers; 

    if (!authorization) {
        return res.status(401).send("Invalid request.");
    }

    const userId = validateToken(authorization, "id"); 

    if (!userId) {
        return res.status(401).send("Invalid request.");
    }

    try {
        // We are going to get the project key

        const project = await db("project")
            .select("id",
                "project_number"
            )
            .where("id", projectId)
            .first();
        
        const issue = await db("issue")
            .select("ticket_number")
            .where("project_id", projectId)
            .orderBy("ticket_number", 'desc')
            .first();
        
        const { project_number } = project; 
        const ticket = issue ? Number(issue.ticket_number) + 1: 1; 

        const newIssue = {
            project_id: projectId, 
            project_key: project_number, 
            ticket_number:ticket, 
            summary, 
            type, 
            priority,
            creator:userId
        }
    
        await db("issue").insert(newIssue); 

        return res.status(201).send("New issue has been created.");
    } catch (err) {
        console.log(err); 
        return res.status(500).send(err);
    }
   
}
const fetchIssuesByProjectId = async (req, res) => {

    const { authorization } = req.headers; 

    if (!authorization) {
        return res.status(401).send("User is not authorized."); 
    }

    const userId = validateToken(authorization, "id");

    if (!userId) {
        return res.status(401).send("You are not authorized");
    }

    try {
        const { projectId } = req.params; 

        const data = await db("issue")
            .select("id",
                db.raw("CONCAT(project_key,'-',ticket_number) as ticketNumber"),
                "summary",
                "type",
                "priority",
                "assignee"
            )
            .where("project_id", projectId)
            .andWhere("inSprint", "false");
        
        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err)
    }

}

module.exports = {
    createIssue, 
    fetchIssuesByProjectId
}