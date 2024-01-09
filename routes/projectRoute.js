const router = require("express").Router();
const projectController = require("../controller/projectController");

router.post("/", projectController.createProject);
router.get("/", projectController.fetchProjectsByUserId);
router.get("/archived", projectController.fetchArchivedProjectsById);
router.get("/status/:status", projectController.fetchFilteredProjectsByUserId);
router.get("/:projectId", projectController.fetchProjectById);
router.get("/details/:projectId", projectController.fetchProjectDetailsById);
router.delete("/:id", projectController.deleteProjectById); 
router.patch("/", projectController.archiveProjectById);

module.exports = router;