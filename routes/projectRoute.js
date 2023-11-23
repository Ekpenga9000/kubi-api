const router = require("express").Router();
const projectController = require("../controller/projectController");

router.post("/", projectController.createProject);
router.get("/", projectController.fetchProjectsById);

module.exports = router;