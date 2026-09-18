const crypto = require("crypto");

const sheetsService = require("./sheetsService");
const userService = require("./userService");
const skillService = require("./skillService");

async function addUserSkill({
    userId,
    skillId,
    type,
    level
}) {
    const user = await userService.getUserById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const skill = await skillService.getSkillById(skillId);

    if (!skill) {
        throw new Error("Skill not found");
    }

    if (!["OFFER", "WANT"].includes(type)) {
        throw new Error("Type must be OFFER or WANT");
    }

    const userSkills = await sheetsService.getRows(
        "UserSkills"
    );

    const exists = userSkills.some(
        item =>
            item.userId === userId &&
            item.skillId === skillId &&
            item.type === type
    );

    if (exists) {
        throw new Error("Skill already added");
    }

    const userSkill = {
        userSkillId: crypto.randomUUID(),
        userId,
        skillId,
        type,
        level,
        createdAt: new Date().toISOString()
    };

    await sheetsService.appendRow(
        "UserSkills",
        userSkill
    );

    return userSkill;
}

async function getUserSkills(userId) {
    const userSkills = await sheetsService.getRows(
        "UserSkills"
    );

    return userSkills.filter(
        item => item.userId === userId
    );
}

async function getOfferedSkills(userId) {
    const skills = await getUserSkills(userId);

    return skills.filter(
        skill => skill.type === "OFFER"
    );
}

async function getWantedSkills(userId) {
    const skills = await getUserSkills(userId);

    return skills.filter(
        skill => skill.type === "WANT"
    );
}

async function removeUserSkill(userSkillId) {
    return sheetsService.deleteRow(
        "UserSkills",
        "userSkillId",
        userSkillId
    );
}

module.exports = {
    addUserSkill,
    getUserSkills,
    getOfferedSkills,
    getWantedSkills,
    removeUserSkill
};