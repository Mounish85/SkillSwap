const skillService = require("../services/skillService");

async function createSkill(req, res) {
    try {
        const { skillName, category } = req.body;

        if (!skillName || !category) {
            return res.status(400).json({
                message: "Skill name and category are required"
            });
        }

        const skill = await skillService.createSkill({
            skillName,
            category
        });

        res.status(201).json({
            message: "Skill created successfully",
            skill
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function getAllSkills(req, res) {
    try {
        const skills = await skillService.getAllSkills();

        res.status(200).json({
            skills
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getSkillById(req, res) {
    try {
        const skill = await skillService.getSkillById(
            req.params.skillId
        );

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        res.status(200).json({
            skill
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function updateSkill(req, res) {
    try {
        const skill = await skillService.updateSkill(
            req.params.skillId,
            req.body
        );

        res.status(200).json({
            message: "Skill updated successfully",
            skill
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

async function deleteSkill(req, res) {
    try {
        await skillService.deleteSkill(
            req.params.skillId
        );

        res.status(200).json({
            message: "Skill deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill
};