/**
 * Level Manager — Handles XP, level-up logic, and progression.
 */
import { LEVEL_UP_RULES, LESSONS_BY_LEVEL } from '../constants';
export function checkLevelUp(session) {
    const currentLevel = session.current_level;
    const rules = LEVEL_UP_RULES[currentLevel];
    if (!rules) {
        return { shouldLevelUp: false, newLevel: currentLevel };
    }
    const totalLessons = LESSONS_BY_LEVEL[currentLevel]?.length || 0;
    const completedLessons = session.lesson_index;
    const completionRatio = totalLessons > 0 ? completedLessons / totalLessons : 0;
    // Level up only after the curriculum is complete and its final quiz is answered.
    if (session.xp >= rules.minXP && completionRatio >= 1 && !session.active_quiz) {
        const newLevel = Math.min(currentLevel + 1, 3);
        return {
            shouldLevelUp: true,
            newLevel,
            message: `LEVEL UP! You're now Level ${newLevel}!\nYou've earned ${session.xp} XP! Amazing job!`,
        };
    }
    return { shouldLevelUp: false, newLevel: currentLevel };
}
export function getLevelInfo(level) {
    const lessons = LESSONS_BY_LEVEL[level] || [];
    const topics = [...new Set(lessons.map(l => l.topic))];
    const rules = LEVEL_UP_RULES[level];
    return {
        level,
        totalLessons: lessons.length,
        topics,
        topicCount: topics.length,
        xpRequired: rules?.minXP || 0,
        isMaxLevel: !rules,
    };
}
