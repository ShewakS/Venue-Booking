const express = require("express");
const authController = require("../controllers/auth.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", requireAuth, authController.me);

// Admin approval endpoints
router.get("/pending-users", requireAuth, authController.getPendingUsers);
router.patch("/approve/:userId", requireAuth, authController.approveUser);
router.delete("/reject/:userId", requireAuth, authController.rejectUser);

module.exports = router;
