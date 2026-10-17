/**
 * Response Generator — Template-based response system.
 * Combines mode detection with lesson content, SEL, and robust XP gamification.
 */
import { RESPONSE_TEMPLATES, CONVERSATION_RULES, LESSONS_BY_LEVEL, SEL_CONTENT, XP_REWARDS, matchesConversationRule, } from '../constants';
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function findConversationReply(text) {
    const lower = text.toLowerCase();
    for (const rule of CONVERSATION_RULES) {
        if (rule.match.length === 0)
            continue;
        if (rule.match.some((m) => lower.includes(m))) {
            return rule.reply;
        }
    }
    return CONVERSATION_RULES[CONVERSATION_RULES.length - 1].reply;
}
function getSelMessage(session) {
    if (session.consecutive_wrong >= 3) {
        return pickRandom(SEL_CONTENT.comfort);
    }
    if (session.consecutive_correct >= 5 || session.consecutive_correct === 3) {
        return pickRandom(SEL_CONTENT.celebration);
    }
    if (session.message_count > 0 && session.message_count % 10 === 0) {
        return pickRandom(SEL_CONTENT.check_in);
    }
    return undefined;
}
export function generateResponse(mode, userMessage, session, isAnswerToQuiz = false, selectedAnswer) {
    const level = session.current_level;
    const lessons = LESSONS_BY_LEVEL[level] || [];
    let xpGained = 0;
    const levelUp = false;
    let reply = '';
    let lesson = null;
    let isQuiz = false;
    let correctAnswer;
    let options;
    let activeQuiz = null;
    const selMessage = getSelMessage(session);
   
    // 1. Answer Evaluation (Handles option clicks & typed quiz answers)

    const pendingQuiz = session.active_quiz;
    const submittedAnswer = (selectedAnswer || userMessage || '').trim();
    // If there is an active quiz, evaluate child's input as the answer
    const isAnswering = isAnswerToQuiz ||
        Boolean(pendingQuiz &&
            submittedAnswer.length > 0 &&
            !matchesConversationRule(submittedAnswer) &&
            !['stop', 'exit', 'bye', 'quit'].includes(submittedAnswer.toLowerCase()));
    if (isAnswering && pendingQuiz) {
        const normalizedSubmittedAnswer = submittedAnswer.toLowerCase();
        const ansNorm = pendingQuiz.answer.toLowerCase().trim();
        const isCorrect = normalizedSubmittedAnswer === ansNorm ||
            (ansNorm.length === 1 && normalizedSubmittedAnswer.startsWith(ansNorm)) ||
            (normalizedSubmittedAnswer.length === 1 && ansNorm.startsWith(normalizedSubmittedAnswer));
        if (isCorrect) {
            xpGained = XP_REWARDS.correct_answer; // +10 XP
            const currentStreak = session.consecutive_correct + 1;
            if (currentStreak >= 5) {
                xpGained += XP_REWARDS.streak_bonus_5; // +80 XP streak bonus!
            }
            else if (currentStreak >= 3) {
                xpGained += XP_REWARDS.streak_bonus_3; // +30 XP streak bonus!
            }
            const nextLesson = lessons[session.lesson_index];
            if (!nextLesson) {
                xpGained += XP_REWARDS.complete_topic;
            }
            reply = `Correct! Awesome job! "${pendingQuiz.answer}" is right! (+${xpGained} XP!)`;
            // Move to next lesson in curriculum ONLY when correct!
            if (nextLesson) {
                lesson = nextLesson;
                if (nextLesson.lesson_type === 'teach') {
                    const tc = nextLesson.content;
                    reply += `\n\nLet's learn: **${tc.word}**\n"${tc.example_sentence}"\n${tc.fun_fact}\n\nCan you type **${tc.word}**?`;
                    isQuiz = true;
                    correctAnswer = tc.word;
                    options = [tc.word];
                    activeQuiz = {
                        id: nextLesson.id,
                        question: `Can you type "${tc.word}"?`,
                        answer: tc.word,
                        options: [tc.word],
                    };
                }
                else {
                    const qc = nextLesson.content;
                    reply += `\n\nNext question: ${qc.question}`;
                    isQuiz = true;
                    correctAnswer = qc.answer;
                    options = qc.options;
                    activeQuiz = {
                        id: nextLesson.id,
                        question: qc.question,
                        answer: qc.answer,
                        options: qc.options,
                    };
                }
            }
            else {
                reply += "\n\nYou have completed all the lessons in this curriculum. We will be back with another curriculum.";
                activeQuiz = null;
            }
        }
        else {
            // Wrong answer: Let's try again! Keep the quiz active!
            xpGained = 0;
            reply = ` Wrong! You typed "${submittedAnswer}". Let's try again! Can you type "${pendingQuiz.answer}"?`;
            isQuiz = true;
            correctAnswer = pendingQuiz.answer;
            options = pendingQuiz.options;
            activeQuiz = pendingQuiz; 
            lesson = null;
        }
        return {
            reply,
            mode,
            xpGained,
            levelUp,
            lesson,
            isQuiz,
            correctAnswer,
            options,
            selMessage,
            activeQuiz,
            isAnswerEvaluated: true,
            isCorrect,
        };
    }

    if (session.lesson_index >= lessons.length && !pendingQuiz) {
        return {
            reply: findConversationReply(userMessage),
            mode,
            xpGained,
            levelUp,
            lesson,
            isQuiz,
            correctAnswer,
            options,
            selMessage,
            activeQuiz: null,
        };
    }

    switch (mode) {
        case 'upset': {
            const template = RESPONSE_TEMPLATES.upset;
            reply = pickRandom(template.responses);
            // Give a gentle, easy question
            const easyQuizzes = lessons.filter((l) => l.lesson_type === 'quiz');
            if (easyQuizzes.length > 0) {
                const quiz = easyQuizzes[0];
                const qc = quiz.content;
                reply += `\n\n Let's try this easy one together:\n${qc.question}`;
                lesson = quiz;
                isQuiz = true;
                correctAnswer = qc.answer;
                options = qc.options;
                activeQuiz = {
                    id: quiz.id,
                    question: qc.question,
                    answer: qc.answer,
                    options: qc.options,
                };
            }
            break;
        }
        case 'bored': {
            const template = RESPONSE_TEMPLATES.bored;
            reply = pickRandom(template.responses);
            const quizzes = lessons.filter((l) => l.lesson_type === 'quiz');
            if (quizzes.length > 0) {
                const quiz = pickRandom(quizzes);
                const qc = quiz.content;
                reply += `\n\nFun Challenge: ${qc.question}`;
                lesson = quiz;
                isQuiz = true;
                correctAnswer = qc.answer;
                options = qc.options;
                activeQuiz = {
                    id: quiz.id,
                    question: qc.question,
                    answer: qc.answer,
                    options: qc.options,
                };
            }
            break;
        }
        case 'excited': {
            const template = RESPONSE_TEMPLATES.excited;
            reply = pickRandom(template.responses);
            const currLesson = lessons[session.lesson_index];
            if (currLesson) {
                lesson = currLesson;
                if (currLesson.lesson_type === 'teach') {
                    const tc = currLesson.content;
                    reply += `\n\nLet's learn: **${tc.word}**\n"${tc.example_sentence}"\n${tc.fun_fact}\n\nCan you type **${tc.word}**?`;
                    isQuiz = true;
                    correctAnswer = tc.word;
                    options = [tc.word];
                    activeQuiz = {
                        id: currLesson.id,
                        question: `Can you type "${tc.word}"?`,
                        answer: tc.word,
                        options: [tc.word],
                    };
                }
                else {
                    const qc = currLesson.content;
                    reply += `\n\n Quiz Time: ${qc.question}`;
                    isQuiz = true;
                    correctAnswer = qc.answer;
                    options = qc.options;
                    activeQuiz = {
                        id: currLesson.id,
                        question: qc.question,
                        answer: qc.answer,
                        options: qc.options,
                    };
                }
            }
            break;
        }
        case 'conversation': {
            reply = findConversationReply(userMessage);
            // Encourage returning to lesson
            const currLesson = lessons[session.lesson_index];
            if (currLesson && currLesson.lesson_type === 'quiz') {
                const qc = currLesson.content;
                reply += `\n\nWant to answer this? ${qc.question}`;
                isQuiz = true;
                correctAnswer = qc.answer;
                options = qc.options;
                activeQuiz = {
                    id: currLesson.id,
                    question: qc.question,
                    answer: qc.answer,
                    options: qc.options,
                };
            }
            break;
        }
        case 'learning':
        default: {
            const currLesson = lessons[session.lesson_index];
            if (currLesson) {
                lesson = currLesson;
                if (currLesson.lesson_type === 'teach') {
                    const tc = currLesson.content;
                    reply = `Let's learn: **${tc.word}**\n"${tc.example_sentence}"\n\n${tc.fun_fact}\n\nCan you type **${tc.word}**?`;
                    isQuiz = true;
                    correctAnswer = tc.word;
                    options = [tc.word];
                    activeQuiz = {
                        id: currLesson.id,
                        question: `Can you type "${tc.word}"?`,
                        answer: tc.word,
                        options: [tc.word],
                    };
                }
                else {
                    const qc = currLesson.content;
                    reply = `Quiz time! ${qc.question}`;
                    isQuiz = true;
                    correctAnswer = qc.answer;
                    options = qc.options;
                    activeQuiz = {
                        id: currLesson.id,
                        question: qc.question,
                        answer: qc.answer,
                        options: qc.options,
                    };
                    if (qc.hint) {
                        reply += `\nHint: ${qc.hint}`;
                    }
                }
            }
            else {
                reply = "You have completed all the lessons in this curriculum. We will be back with another curriculum.";
            }
            break;
        }
    }
    if (selMessage && mode !== 'upset') {
        reply += `\n\n${selMessage}`;
    }
    return {
        reply,
        mode,
        xpGained,
        levelUp,
        lesson,
        isQuiz,
        correctAnswer,
        options,
        selMessage,
        activeQuiz,
    };
}
