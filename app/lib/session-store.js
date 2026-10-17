/**
 * In production, swap this out for Upstash Redis or similar.
 */
const sessions = new Map();
const messages = new Map();
function getSessionKey(childId, sessionId) {
    return `${childId}:${sessionId}`;
}
export function getSession(childId, sessionId) {
    const key = getSessionKey(childId, sessionId);
    if (!sessions.has(key)) {
        sessions.set(key, {
            current_level: 1,
            current_topic: 'alphabet',
            current_subtopic: 'letter_A',
            detected_mode: 'learning',
            message_count: 0,
            last_activity: new Date().toISOString(),
            sel_last_shown: '',
            consecutive_correct: 0,
            consecutive_wrong: 0,
            xp: 0,
            mood: 'happy',
            lesson_index: 0,
            active_quiz: null,
        });
    }
    return sessions.get(key);
}
export function updateSession(childId, sessionId, updates) {
    const session = getSession(childId, sessionId);
    const updated = { ...session, ...updates, last_activity: new Date().toISOString() };
    sessions.set(getSessionKey(childId, sessionId), updated);
    return updated;
}
export function getRecentMessages(childId, sessionId) {
    const key = getSessionKey(childId, sessionId);
    return messages.get(key) || [];
}
export function addMessage(childId, sessionId, msg) {
    const key = getSessionKey(childId, sessionId);
    const msgs = messages.get(key) || [];
    msgs.push(msg);
    // Keep only last 20 messages
    if (msgs.length > 20) {
        msgs.splice(0, msgs.length - 20);
    }
    messages.set(key, msgs);
}
