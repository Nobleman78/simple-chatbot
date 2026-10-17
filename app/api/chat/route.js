/**
 * POST /api/chat — Main Chat Endpoint
 * Handles all child messages, mode detection, response generation, and XP tracking.
 */
import { NextResponse } from 'next/server';
import { getSession, updateSession, getRecentMessages, addMessage } from '../../lib/session-store';
import { detectMode } from '../../lib/engine/mode-detector';
import { generateResponse } from '../../lib/engine/response-generator';
import { checkLevelUp } from '../../lib/engine/level-manager';
import { getSupabaseAdmin } from '../../lib/supabase';
const VALID_MOODS = new Set(['happy', 'excited', 'okay', 'tired', 'sad']);
export async function POST(request) {
    try {
        const body = await request.json();
        const { childId = 'default-child', sessionId = 'default-session', childName, childAge, childAvatar, message, isAnswer = false, selectedAnswer, mood, } = body;
        if (typeof childId !== 'string' ||
            !childId.trim() ||
            childId.length > 100 ||
            typeof sessionId !== 'string' ||
            !sessionId.trim() ||
            sessionId.length > 100) {
            return NextResponse.json({ error: 'A valid child and session are required' }, { status: 400 });
        }
        if (!message && !isAnswer) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }
        if (typeof isAnswer !== 'boolean') {
            return NextResponse.json({ error: 'isAnswer must be a boolean' }, { status: 400 });
        }
        const childMessage = isAnswer ? selectedAnswer : message;
        if (typeof childMessage !== 'string' || childMessage.length > 1000) {
            return NextResponse.json({ error: 'Message must be 1000 characters or fewer' }, { status: 400 });
        }
        if (mood !== undefined && (typeof mood !== 'string' || !VALID_MOODS.has(mood))) {
            return NextResponse.json({ error: 'Mood is not supported' }, { status: 400 });
        }
        // Get current session
        let session = getSession(childId, sessionId);
        // Handle mood setting
        if (mood) {
            session = updateSession(childId, sessionId, { mood });
        }
        // Store the child's message
        if (message) {
            addMessage(childId, sessionId, {
                role: 'child',
                text: message,
                timestamp: new Date().toISOString(),
            });
        }
        // Get recent messages for context
        const recentMessages = getRecentMessages(childId, sessionId);
        // Detect mode
        const mode = detectMode(recentMessages, session);
        // Generate response
        const response = generateResponse(mode, childMessage, session, isAnswer, selectedAnswer);
        // Update session state
        const updates = {
            detected_mode: mode,
            message_count: session.message_count + 1,
            active_quiz: response.activeQuiz !== undefined ? response.activeQuiz : session.active_quiz,
        };
        if (response.xpGained !== 0) {
            updates.xp = Math.max(0, session.xp + response.xpGained);
        }
        if (response.isAnswerEvaluated || isAnswer || selectedAnswer) {
            if (response.isCorrect) {
                // Correct answer
                updates.consecutive_correct = session.consecutive_correct + 1;
                updates.consecutive_wrong = 0;
            }
            else {
                // Wrong answer
                updates.consecutive_wrong = session.consecutive_wrong + 1;
                updates.consecutive_correct = 0;
            }
        }
        // Advance lesson index when moving to next lesson (only on correct answer or fresh lesson)
        if (response.lesson && (!response.isAnswerEvaluated || response.isCorrect)) {
            const lessonIdx = session.lesson_index;
            updates.lesson_index = lessonIdx + 1;
            updates.current_topic = response.lesson.topic;
            updates.current_subtopic = response.lesson.subtopic;
        }
        session = updateSession(childId, sessionId, updates);
        // Check for level up
        const levelCheck = checkLevelUp(session);
        if (levelCheck.shouldLevelUp) {
            session = updateSession(childId, sessionId, {
                current_level: levelCheck.newLevel,
                lesson_index: 0,
                consecutive_correct: 0,
                consecutive_wrong: 0,
            });
            response.reply += `\n\n${levelCheck.message}`;
            response.levelUp = true;
        }
        // Store bot response
        addMessage(childId, sessionId, {
            role: 'bot',
            text: response.reply,
            timestamp: new Date().toISOString(),
        });
        const supabase = getSupabaseAdmin();
        if (supabase) {
            try {
                // 1. Persist/update child profile in `children` table (Architecture Plan 2.1)
                await supabase
                    .from('children')
                    .upsert({
                    id: childId,
                    name: typeof childName === 'string' && childName.trim() ? childName.trim() : 'Friend',
                    age: typeof childAge === 'number' ? Math.min(Math.max(childAge, 2), 7) : 5,
                    avatar: typeof childAvatar === 'string' ? childAvatar : 'bear',
                    current_level: session.current_level,
                    xp: session.xp,
                    updated_at: new Date().toISOString(),
                });
                // 2. Persist chat turn in `conversations` table (Architecture Plan 2.3)
                const turnTimestamp = Date.now();
                const { error: persistenceError } = await supabase
                    .from('conversations')
                    .insert([
                    {
                        child_id: childId,
                        session_id: sessionId,
                        role: 'child',
                        message: childMessage,
                        detected_mode: mode,
                        mood: session.mood,
                        created_at: new Date(turnTimestamp).toISOString(),
                    },
                    {
                        child_id: childId,
                        session_id: sessionId,
                        role: 'bot',
                        message: response.reply,
                        detected_mode: mode,
                        mood: session.mood,
                        created_at: new Date(turnTimestamp + 1).toISOString(),
                        metadata: {
                            xpGained: response.xpGained,
                            isQuiz: response.isQuiz,
                            options: response.options,
                            levelUp: response.levelUp,
                        },
                    },
                ]);
                if (persistenceError) {
                    console.warn('Supabase persistence notice:', persistenceError.message);
                }
                // 3. Persist learning progress in `progress` table (Architecture Plan 2.2)
                if (response.isAnswerEvaluated || isAnswer) {
                    const isCorrect = response.isCorrect ?? false;
                    await supabase
                        .from('progress')
                        .insert({
                        child_id: childId,
                        level: session.current_level,
                        topic: session.current_topic,
                        subtopic: session.current_subtopic,
                        score: isCorrect ? 100 : 0,
                        attempts: 1,
                        completed: isCorrect,
                        completed_at: isCorrect ? new Date().toISOString() : null,
                    });
                }
            }
            catch (err) {
                console.warn('Supabase write error:', err);
            }
        }
        return NextResponse.json({
            reply: response.reply,
            mode: response.mode,
            xpGained: response.xpGained,
            levelUp: response.levelUp,
            isQuiz: response.isQuiz,
            options: response.options,
            correctAnswer: response.correctAnswer,
            session: {
                level: session.current_level,
                xp: session.xp,
                topic: session.current_topic,
                consecutiveCorrect: session.consecutive_correct,
                consecutiveWrong: session.consecutive_wrong,
                mood: session.mood,
                lessonIndex: session.lesson_index,
            },
        });
    }
    catch (error) {
        console.error('Chat API error:', error);
        const isSupabaseConfigurationError = error instanceof Error && error.message.startsWith('Supabase is not configured.');
        return NextResponse.json({
            error: isSupabaseConfigurationError
                ? error.message
                : 'Buddy could not save this conversation. Please try again.',
        }, { status: isSupabaseConfigurationError ? 503 : 500 });
    }
}
