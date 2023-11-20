const router = require("express").Router();
const userController = require("../controller/userController");

router.get("/:id", userController.getUserById);
router.patch("/", userController.updateUserDetails);
module.exports = router;