const crypto = require("crypto");
const sheetsService = require("./sheetsService");

async function createSkill({ skillName, category }) {
    const skills = await sheetsService.getRows("Skills");

    const exists = skills.some(
        skill =>
            skill.skillName.toLowerCase() ===
            skillName.toLowerCase()
    );

    if (exists) {
        throw new Error("Skill already exists");
    }

    const skill = {
        skillId: crypto.randomUUID(),
        skillName,
        category,
        createdAt: new Date().toISOString()
    };

    await sheetsService.appendRow("Skills", skill);

    return skill;
}

async function getAllSkills() {
    return sheetsService.getRows("Skills");
}

async function getSkillById(skillId) {
    return sheetsService.findById(
        "Skills",
        "skillId",
        skillId
    );
}

async function updateSkill(skillId, updates) {
    return sheetsService.updateRow(
        "Skills",
        "skillId",
        skillId,
        {
            skillName: updates.skillName,
            category: updates.category
        }
    );
}

async function deleteSkill(skillId) {
    return sheetsService.deleteRow(
        "Skills",
        "skillId",
        skillId
    );
}

module.exports = {
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill
};