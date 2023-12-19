const router = require("express").Router();
const projectController = require("../controller/projectController");

router.post("/", projectController.createProject);
router.get("/", projectController.fetchProjectsByUserId);
router.get("/:projectId", projectController.fetchProjectById);
router.get("/details/:projectId", projectController.fetchProjectDetailsById);

module.exports = router;