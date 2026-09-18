const express = require("express");

const skillController = require("../controllers/skillController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all skills
router.get(
    "/",
    skillController.getAllSkills
);

// Get skill by ID
router.get(
    "/:skillId",
    skillController.getSkillById
);

// Admin only
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    skillController.createSkill
);

router.put(
    "/:skillId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    skillController.updateSkill
);

router.delete(
    "/:skillId",
    authMiddleware,
    roleMiddleware("ADMIN"),
    skillController.deleteSkill
);

module.exports = router;