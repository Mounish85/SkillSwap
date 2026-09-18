const sheetsService = require("./sheetsService");

async function findMatches(userId) {
    const userSkills = await sheetsService.getRows(
        "UserSkills"
    );

    const users = await sheetsService.getRows("Users");

    const currentUserSkills = userSkills.filter(
        skill => skill.userId === userId
    );

    const offered = currentUserSkills
        .filter(skill => skill.type === "OFFER")
        .map(skill => skill.skillId);

    const wanted = currentUserSkills
        .filter(skill => skill.type === "WANT")
        .map(skill => skill.skillId);

    const candidateUserIds = [
        ...new Set(
            userSkills
                .filter(skill => skill.userId !== userId)
                .map(skill => skill.userId)
        )
    ];

    const matches = [];

    for (const candidateId of candidateUserIds) {
        const candidateSkills = userSkills.filter(
            skill => skill.userId === candidateId
        );

        const candidateOffers = candidateSkills
            .filter(skill => skill.type === "OFFER")
            .map(skill => skill.skillId);

        const candidateWants = candidateSkills
            .filter(skill => skill.type === "WANT")
            .map(skill => skill.skillId);

        const offerMatches = wanted.filter(
            skillId => candidateOffers.includes(skillId)
        );

        const wantMatches = offered.filter(
            skillId => candidateWants.includes(skillId)
        );

        if (
            offerMatches.length === 0 &&
            wantMatches.length === 0
        ) {
            continue;
        }

        const offerScore =
            wanted.length > 0
                ? (offerMatches.length / wanted.length) * 50
                : 0;

        const wantScore =
            offered.length > 0
                ? (wantMatches.length / offered.length) * 50
                : 0;

        const compatibility = Math.round(
            offerScore + wantScore
        );

        const user = users.find(
            user => user.userId === candidateId
        );

        if (user) {
            matches.push({
                userId: candidateId,
                name: user.name,
                matchedOfferedSkills: offerMatches,
                matchedWantedSkills: wantMatches,
                compatibility
            });
        }
    }

    return matches.sort(
        (a, b) => b.compatibility - a.compatibility
    );
}

module.exports = {
    findMatches
};