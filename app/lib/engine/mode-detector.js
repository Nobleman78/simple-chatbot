import { matchesConversationRule } from '../constants';

/**
 * Mode Detector — Classifies child's current state using keyword matching,
 * message patterns, and session metrics. No LLM required.
 */
function containsAny(text, keywords) {
    return keywords.some(kw => text.includes(kw));
}
export function detectMode(recentMessages, sessionState) {
    const lastMsg = recentMessages.length > 0
        ? recentMessages[recentMessages.length - 1]?.text?.toLowerCase() || ''
        : '';
    const msgCount = sessionState.message_count;
    const consecutiveWrong = sessionState.consecutive_wrong;
    const consecutiveCorrect = sessionState.consecutive_correct;
    // 1. UPSET / FRUSTRATED
    const upsetPhrases = ['i cant', "i can't", 'too hard', 'i dont know', "i don't know", 'help me', 'stop', 'crying', 'i am sad', 'feel sad', 'feeling sad'];
    if (containsAny(lastMsg, upsetPhrases) || (!sessionState.active_quiz && containsAny(lastMsg, ['sad']))) {
        return 'upset';
    }
    if (matchesConversationRule(lastMsg)) {
        return 'conversation';
    }
    if (consecutiveWrong >= 3) {
        return 'upset';
    }
    // 2. BORED / DISENGAGED
    if (lastMsg.length <= 2 && msgCount > 5) {
        return 'bored';
    }
    if (containsAny(lastMsg, ['boring', 'bored', 'dont want', "don't want", 'no more', 'tired', 'sleepy'])) {
        return 'bored';
    }
    // 3. EXCITED / HAPPY
    if (containsAny(lastMsg, ['yay', 'wow', 'cool', 'awesome', 'i did it', 'more more', 'amazing', 'happy', 'excited', 'feeling good'])) {
        return 'excited';
    }
    if (consecutiveCorrect >= 3) {
        return 'excited';
    }
    // Default: LEARNING
    return 'learning';
}
