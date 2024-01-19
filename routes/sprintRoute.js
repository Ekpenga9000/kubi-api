const router = require("express").Router(); 
const sprintController = require("../controller/sprintController"); 

router.post("/:projectId", sprintController.createSprint);
router.get("/:projectId/sprint/:sprintId", sprintController.fetchSprintById);
router.get("/:projectId/latest", sprintController.fetchLatestSprint);

module.exports = router; 