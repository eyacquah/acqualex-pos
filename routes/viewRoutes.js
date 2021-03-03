const express = require("express");

const viewsController = require("../controllers/viewsController");
// const authController = require("../controllers/authController");

const router = express.Router();

router.use(viewsController.getLoginTemplate);
// router.use(authController.protect);

router.get("/", viewsController.getIndex);

module.exports = router;
