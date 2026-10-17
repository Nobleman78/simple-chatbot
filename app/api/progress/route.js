/**
 * GET /api/progress — Get child's progress
 * POST /api/progress — Update progress
 */
import { NextResponse } from 'next/server';
import { getSession, updateSession } from '../../lib/session-store';
import { getLevelInfo } from '../../lib/engine/level-manager';
import { LESSONS_BY_LEVEL, TOPICS_BY_LEVEL } from '../../lib/constants';
import { getSupabaseAdmin } from '../../lib/supabase';
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const childId = searchParams.get('childId') || 'default-child';
        const sessionId = searchParams.get('sessionId') || 'default-session';
        if (childId.length > 100 || sessionId.length > 100) {
            return NextResponse.json({ error: 'Child and session IDs must be 100 characters or fewer' }, { status: 400 });
        }
        const session = getSession(childId, sessionId);
        const levelInfo = getLevelInfo(session.current_level);
        const lessons = LESSONS_BY_LEVEL[session.current_level] || [];
        const totalLessons = lessons.length;
        const topics = TOPICS_BY_LEVEL[session.current_level] || [];
        const completedTopics = topics.filter((topic) => {
            const topicLessons = lessons
                .map((lesson, index) => ({ lesson, index }))
                .filter(({ lesson }) => lesson.topic === topic);
            return topicLessons.length > 0 && topicLessons.every(({ index }) => index < session.lesson_index);
        });
        let conversations = [];
        const supabase = getSupabaseAdmin();
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('conversations')
                    .select('id, role, message, detected_mode, mood, metadata, created_at')
                    .eq('child_id', childId)
                    .eq('session_id', sessionId)
                    .order('created_at', { ascending: false })
                    .limit(12);
                if (!error && data) {
                    conversations = data;
                }
                else if (error) {
                    console.warn('Supabase conversations query notice:', error.message);
                }
            }
            catch (err) {
                console.warn('Supabase fetch error:', err);
            }
        }
        return NextResponse.json({
            level: session.current_level,
            xp: session.xp,
            totalLessons,
            completedLessons: session.lesson_index,
            topics,
            completedTopics,
            currentTopic: session.current_topic,
            consecutiveCorrect: session.consecutive_correct,
            mood: session.mood,
            levelInfo,
            progressPercent: totalLessons > 0 ? Math.round((session.lesson_index / totalLessons) * 100) : 0,
            recentConversations: (conversations || []).reverse(),
        });
    }
    catch (error) {
        console.error('Progress API error:', error);
        const isSupabaseConfigurationError = error instanceof Error && error.message.startsWith('Supabase is not configured.');
        return NextResponse.json({
            error: isSupabaseConfigurationError
                ? error.message
                : 'Could not load progress. Please try again.',
        }, { status: isSupabaseConfigurationError ? 503 : 500 });
    }
}
export async function POST(request) {
    try {
        const body = await request.json();
        const { childId = 'default-child', sessionId = 'default-session', mood, reset } = body;
        if (reset) {
            const session = updateSession(childId, sessionId, {
                current_level: 1,
                current_topic: 'alphabet',
                current_subtopic: 'letter_A',
                lesson_index: 0,
                xp: 0,
                consecutive_correct: 0,
                consecutive_wrong: 0,
                message_count: 0,
                mood: 'happy',
            });
            return NextResponse.json({ success: true, session });
        }
        if (mood) {
            const session = updateSession(childId, sessionId, { mood });
            return NextResponse.json({ success: true, mood: session.mood });
        }
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    catch (error) {
        console.error('Progress API error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
