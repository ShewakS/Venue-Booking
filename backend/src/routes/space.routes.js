const express = require("express");
const spaceController = require("../controllers/space.controller");

const router = express.Router();

router.get("/", spaceController.getSpaces);
router.get("/:id", spaceController.getSpaceById);
router.post("/", spaceController.createSpace);
router.put("/:id", spaceController.updateSpace);
router.delete("/:id", spaceController.deleteSpace);

module.exports = router;
