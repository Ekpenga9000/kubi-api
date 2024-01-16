const router = require("express").Router(); 
const sprintController = require("../controller/sprintController"); 

router.post("/:projectId", sprintController.createSprint);

module.exports = router; 