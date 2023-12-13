const router = require("express").Router();
const issueController = require("../controller/issueController");

router.get("/projectId", issueController.fetchIssuesByProjectId);
router.post("/", issueController.createIssue);

module.exports = router;