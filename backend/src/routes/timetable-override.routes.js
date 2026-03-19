const express = require("express");
const timetableOverrideController = require("../controllers/timetable-override.controller");

const router = express.Router();

router.get("/", timetableOverrideController.getOverrides);
router.post("/", timetableOverrideController.createOverride);
router.delete("/:id", timetableOverrideController.deleteOverride);

module.exports = router;
