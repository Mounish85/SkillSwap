const express = require("express");

const userSkillController = require("../controllers/userSkillController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get user's skills
router.get(
    "/:userId",
    authMiddleware,
    userSkillController.getUserSkills
);

// Get offered skills
router.get(
    "/:userId/offered",
    authMiddleware,
    userSkillController.getOfferedSkills
);

// Get wanted skills
router.get(
    "/:userId/wanted",
    authMiddleware,
    userSkillController.getWantedSkills
);

// Add skill to user
router.post(
    "/:userId",
    authMiddleware,
    userSkillController.addUserSkill
);

// Remove user skill
router.delete(
    "/:userSkillId",
    authMiddleware,
    userSkillController.removeUserSkill
);

module.exports = router;