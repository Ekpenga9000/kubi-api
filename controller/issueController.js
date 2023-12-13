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

    try {
        // create the issue number

        const ticket_number = Number("" + projectId + Date.now()); 

        const newIssue = {
            project_id: projectId, 
            ticket_number, 
            summary, 
            type, 
            priority
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
                "ticket_number as ticketNumber",
                "summary",
                "type",
                "priority",
                "assignee"
            )
            .where("project_id", projectId);
        
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