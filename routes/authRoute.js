const router = require("express").Router();
const controller = require("../controller/authController");

router.post("/signup", controller.fetchNewUserEmail);
router.post("/register", controller.registerUser);
router.post("/login", controller.login);
router.patch("/change-password", controller.changePassword);
router.post("/reset-password", controller.resetPassword);

module.exports = router; 
