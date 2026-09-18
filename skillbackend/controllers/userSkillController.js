const userSkillService = require("../services/userSkillService");

async function addUserSkill(req, res) {
    try {
        const userId = req.params.userId;

        if (
            req.user.userId !== userId &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const {
            skillId,
            type,
            level
        } = req.body;

        if (!skillId || !type || !level) {
            return res.status(400).json({
                message: "Skill, type and level are required"
            });
        }

        const userSkill =
            await userSkillService.addUserSkill({
                userId,
                skillId,
                type,
                level
            });

        res.status(201).json({
            message: "Skill added successfully",
            userSkill
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function getUserSkills(req, res) {
    try {
        const userSkills =
            await userSkillService.getUserSkills(
                req.params.userId
            );

        res.status(200).json({
            skills: userSkills
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getOfferedSkills(req, res) {
    try {
        const skills =
            await userSkillService.getOfferedSkills(
                req.params.userId
            );

        res.status(200).json({
            skills
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getWantedSkills(req, res) {
    try {
        const skills =
            await userSkillService.getWantedSkills(
                req.params.userId
            );

        res.status(200).json({
            skills
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function removeUserSkill(req, res) {
    try {
        const userSkills =
            await userSkillService.getUserSkills(
                req.user.userId
            );

        const userSkill = userSkills.find(
            item =>
                item.userSkillId ===
                req.params.userSkillId
        );

        if (!userSkill) {
            return res.status(404).json({
                message: "User skill not found"
            });
        }

        await userSkillService.removeUserSkill(
            req.params.userSkillId
        );

        res.status(200).json({
            message: "Skill removed successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {
    addUserSkill,
    getUserSkills,
    getOfferedSkills,
    getWantedSkills,
    removeUserSkill
};