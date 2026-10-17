"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BookOpen, Bot, ChartNoAxesColumn, Check, Flame, Frown, Gem, Hand, Laugh, Meh, Moon, RotateCcw, Send, Smile, Star, Trophy, UserRound, Volume2, VolumeX, X, } from "lucide-react";
const MOODS = [
    {
        key: "happy",
        label: "Happy",
        icon: Smile,
        color: "text-amber-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        bgHover: "hover:bg-amber-50 hover:border-amber-300",
    },
    {
        key: "excited",
        label: "Excited",
        icon: Laugh,
        color: "text-pink-500",
        bgColor: "bg-pink-50",
        borderColor: "border-pink-200",
        bgHover: "hover:bg-pink-50 hover:border-pink-300",
    },
    {
        key: "okay",
        label: "Okay",
        icon: Meh,
        color: "text-sky-500",
        bgColor: "bg-sky-50",
        borderColor: "border-sky-200",
        bgHover: "hover:bg-sky-50 hover:border-sky-300",
    },
    {
        key: "tired",
        label: "Tired",
        icon: Moon,
        color: "text-indigo-500",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
        bgHover: "hover:bg-indigo-50 hover:border-indigo-300",
    },
    {
        key: "sad",
        label: "Sad",
        icon: Frown,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        bgHover: "hover:bg-blue-50 hover:border-blue-300",
    },
];
export default function ChatPage() {
    const [profile, setProfile] = useState({
        id: "child-default",
        sessionId: "session-default",
        name: "Friend",
        age: 5,
    });
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [showMoodModal, setShowMoodModal] = useState(true);
    const [showDashboard, setShowDashboard] = useState(false);
    const [dashboard, setDashboard] = useState(null);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [dashboardError, setDashboardError] = useState("");
    const [showLevelUp, setShowLevelUp] = useState(null);
    const [xpGainedAnim, setXpGainedAnim] = useState(null);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [sessionInfo, setSessionInfo] = useState({
        level: 1,
        xp: 0,
        topic: "alphabet",
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        mood: "happy",
        lessonIndex: 0,
    });
    const messagesEndRef = useRef(null);
    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);
    // Load child profile from storage on mount
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem("buddyChild");
            if (stored) {
                const parsed = JSON.parse(stored);
                setProfile(parsed);
            }
        }
        catch (e) {
            console.warn("Could not load child profile:", e);
        }
    }, []);
    // Text to Speech
    const speak = (text) => {
        if (!voiceEnabled ||
            typeof window === "undefined" ||
            !("speechSynthesis" in window)) {
            return;
        }
        window.speechSynthesis.cancel();
        // Strip pictographs and formatting symbols for clearer speech.
        const cleanText = text
            .replace(/[*#_~]/g, "")
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, "");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.9; // Slightly slower for kids
        utterance.pitch = 1.1; // Friendly higher pitch
        window.speechSynthesis.speak(utterance);
    };
    // Trigger XP animation
    const triggerXpAnim = (amount) => {
        setXpGainedAnim(amount);
        setTimeout(() => {
            setXpGainedAnim(null);
        }, 1500);
    };
    const loadDashboard = async () => {
        setDashboardLoading(true);
        setDashboardError("");
        try {
            const params = new URLSearchParams({
                childId: profile.id,
                sessionId: profile.sessionId,
            });
            const response = await fetch(`/api/progress?${params.toString()}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Could not load the dashboard.");
            }
            setDashboard(data);
        }
        catch (error) {
            console.error("Failed to load dashboard:", error);
            setDashboardError(error instanceof Error
                ? error.message
                : "Could not load the dashboard.");
        }
        finally {
            setDashboardLoading(false);
        }
    };
    // Send a message or answer to backend
    const sendMessage = async (text, isAnswer = false, selectedOption, userMood) => {
        if (loading)
            return;
        const msgText = text || (isAnswer ? selectedOption : inputText.trim());
        if (!msgText && !isAnswer && !userMood)
            return;
        // Append child message if text was supplied and not already a button answer
        if (msgText && !isAnswer) {
            const userMsg = {
                id: `msg-${Date.now()}`,
                role: "child",
                text: msgText,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setMessages((prev) => [...prev, userMsg]);
            setInputText("");
        }
        setLoading(true);
        try {
            const payload = {
                childId: profile.id,
                sessionId: profile.sessionId,
                childName: profile.name,
                childAge: profile.age,
                message: isAnswer ? selectedOption : msgText,
                isAnswer,
                selectedAnswer: isAnswer ? selectedOption : undefined,
                mood: userMood,
            };
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const responseText = await res.text();
            let data;
            try {
                data = responseText ? JSON.parse(responseText) : null;
            }
            catch {
                throw new Error(`Chat server returned an invalid response (HTTP ${res.status}). Restart the development server and try again.`);
            }
            if (!data) {
                throw new Error(`Chat server returned an empty response (HTTP ${res.status}). Restart the development server and try again.`);
            }
            if (!res.ok) {
                throw new Error(data.error ||
                    "Buddy could not save this conversation. Please try again.");
            }
            if (data.reply) {
                const botMsg = {
                    id: `bot-${Date.now()}`,
                    role: "bot",
                    text: data.reply,
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    isQuiz: data.isQuiz,
                    options: data.options,
                };
                setMessages((prev) => [...prev, botMsg]);
                speak(data.reply);
            }
            if (typeof data.xpGained === "number" && data.xpGained !== 0) {
                triggerXpAnim(data.xpGained);
            }
            if (data.levelUp) {
                setShowLevelUp(data.session?.level || 2);
            }
            if (data.session) {
                setSessionInfo(data.session);
            }
        }
        catch (err) {
            console.error("Failed to send message:", err);
            setMessages((prev) => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    role: "bot",
                    text: err instanceof Error
                        ? err.message
                        : "Buddy could not save this conversation. Please try again.",
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
        }
        finally {
            setLoading(false);
        }
    };
    // Handle Mood Selection
    const handleSelectMood = (moodKey) => {
        setShowMoodModal(false);
        setSessionInfo((prev) => ({ ...prev, mood: moodKey }));
        sendMessage(`I am feeling ${moodKey}!`, false, undefined, moodKey);
    };
    // Handle Quiz Option Click
    const handleQuizAnswer = (msgIndex, option) => {
        setMessages((prev) => prev.map((m, idx) => idx === msgIndex
            ? {
                ...m,
                answered: true,
                selectedAnswer: option,
            }
            : m));
        sendMessage(undefined, true, option);
    };
    // Reset Progress
    const handleResetProgress = async () => {
        try {
            const response = await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    childId: profile.id,
                    sessionId: profile.sessionId,
                    reset: true,
                }),
            });
            if (!response.ok) {
                throw new Error("Could not reset progress.");
            }
            setSessionInfo({
                level: 1,
                xp: 0,
                topic: "alphabet",
                consecutiveCorrect: 0,
                consecutiveWrong: 0,
                mood: "happy",
                lessonIndex: 0,
            });
            setMessages([
                {
                    id: "reset-msg",
                    role: "bot",
                    text: "Let's start fresh! Ready for Level 1?",
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
            if (showDashboard) {
                await loadDashboard();
            }
            setShowDashboard(false);
        }
        catch (e) {
            console.error("Reset failed:", e);
            setDashboardError(e instanceof Error ? e.message : "Could not reset progress.");
        }
    };
    return (<div className="flex flex-col h-screen max-w-4xl mx-auto relative overflow-hidden font-body text-text-primary">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-linear-to-br from-[#E8F4FD] via-[#F0E6FF] to-[#FFF0F5]">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl animate-float"/>
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-secondary/15 blur-3xl animate-float [animation-delay:-10s]"/>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white/90 backdrop-blur-xl border-b border-black/5 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="no-underline" title="Back to Home">
            <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-2xl shadow-sm hover:scale-105 transition-transform">
              <Bot aria-hidden="true" className="w-6 h-6 text-white"/>
            </div>
          </Link>
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-text-primary leading-tight flex items-center gap-1.5">
              {profile.name}
            </h2>
            <div className="text-xs text-accent-green font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"/>
              Ready to learn!
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* XP Bar */}
          <div className="hidden sm:flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/15" title={`${sessionInfo.xp} Total XP`}>
            <Star aria-hidden="true" className="w-4 h-4 text-accent-yellow"/>
            <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-yellow to-accent-orange rounded-full transition-all duration-500" style={{
            width: `${Math.min(100, (sessionInfo.xp % 200) / 2)}%`,
        }}/>
            </div>
            <span className="font-display text-xs font-bold text-primary">
              {sessionInfo.xp} XP
            </span>
            {xpGainedAnim !== null && (<span className={`ml-1 text-xs font-extrabold ${xpGainedAnim > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                {xpGainedAnim > 0 ? `+${xpGainedAnim}` : `${xpGainedAnim}`}
              </span>)}
          </div>

          {/* Level Badge */}
          <div className="bg-linear-to-r from-accent-yellow to-accent-orange text-white px-3 py-1 rounded-full font-display text-xs sm:text-sm font-extrabold shadow-sm whitespace-nowrap">
            Level {sessionInfo.level}
          </div>

          {/* Current Mood Button */}
          {(() => {
            const currentMood = MOODS.find((m) => m.key === sessionInfo.mood) || MOODS[0];
            const MoodIcon = currentMood.icon;
            return (<button type="button" className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-full border-2 border-slate-200 bg-white flex items-center gap-1.5 cursor-pointer transition-all duration-150 hover:border-primary hover:bg-primary/10 hover:scale-105 active:scale-95 shadow-2xs" onClick={() => setShowMoodModal(true)} title={`Current Mood: ${currentMood.label} (click to change)`}>
                <MoodIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${currentMood.color}`}/>
                <span className="font-display text-xs font-bold text-text-secondary hidden sm:inline">
                  {currentMood.label}
                </span>
              </button>);
        })()}

          {/* Voice Toggle */}
          <button type="button" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center cursor-pointer transition-all duration-150 hover:border-primary hover:bg-primary/10 hover:scale-105 active:scale-95 shadow-2xs" onClick={() => setVoiceEnabled(!voiceEnabled)} title={voiceEnabled ? "Mute Voice" : "Enable Voice"} aria-label={voiceEnabled ? "Mute voice" : "Enable voice"}>
            {voiceEnabled ? (<Volume2 aria-hidden="true" className="w-5 h-5"/>) : (<VolumeX aria-hidden="true" className="w-5 h-5"/>)}
          </button>

          {/* Dashboard Toggle */}
          <button type="button" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center cursor-pointer transition-all duration-150 hover:border-primary hover:bg-primary/10 hover:scale-105 active:scale-95 shadow-2xs" onClick={() => {
            setShowDashboard(true);
            void loadDashboard();
        }} title="Learning Dashboard" aria-label="Learning Dashboard">
            <ChartNoAxesColumn aria-hidden="true" className="w-5 h-5"/>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 scroll-smooth">
        {messages.length === 0 && (<div className="text-center py-8 px-4 animate-slide-up">
            <Hand aria-hidden="true" className="w-12 h-12 mb-3 inline-block animate-bounce text-primary"/>
            <div className="font-display text-xl sm:text-2xl font-extrabold text-text-primary mb-1">
              Welcome, {profile.name}!
            </div>
            <div className="text-sm sm:text-base text-text-secondary font-semibold max-w-md mx-auto">
              Buddy is here to help you learn English with fun words, pictures,
              and games!
            </div>
          </div>)}

        {messages.map((msg, index) => {
            const isBot = msg.role === "bot";
            return (<div key={msg.id} className={`flex gap-2.5 max-w-[85%] animate-pop-in items-start ${isBot ? "self-start" : "self-end flex-row-reverse"}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 shadow-sm mt-1 ${isBot
                    ? "bg-gradient-to-br from-primary to-primary-light"
                    : "bg-gradient-to-br from-secondary to-accent-orange"}`}>
                {isBot ? (<Bot aria-hidden="true" className="w-5 h-5 text-white"/>) : (<UserRound aria-hidden="true" className="w-5 h-5 text-white"/>)}
              </div>

              <div className="max-w-[85%]">
                <div className={`p-3.5 sm:p-4 rounded-2xl font-semibold text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap relative ${isBot
                    ? "bg-white text-text-primary rounded-bl-xs shadow-sm border border-slate-100"
                    : "bg-gradient-to-br from-[#FF6B9D] to-[#FF8E53] text-white rounded-br-xs shadow-md shadow-[#FF6B9D]/20"}`}>
                  {msg.text}
                  {isBot && (<button type="button" onClick={() => speak(msg.text)} className="inline-flex bg-transparent border-none cursor-pointer ml-2 text-sm opacity-60 hover:opacity-100 transition-opacity align-middle" title="Read aloud">
                      <Volume2 aria-hidden="true" className="w-4 h-4"/>
                    </button>)}
                </div>

                {/* Quiz interactive options card */}
                {msg.isQuiz && msg.options && msg.options.length > 0 && (<div className="bg-white rounded-2xl p-4 sm:p-5 mt-3 shadow-md border-2 border-accent-cyan/30 animate-pop-in">
                    <div className="font-bold text-sm sm:text-base mb-2 text-primary">
                      Tap the right answer!
                    </div>
                    <div className="flex flex-col gap-2.5 mt-3">
                      {msg.options.map((opt, oIdx) => {
                        const isSelected = msg.selectedAnswer === opt;
                        return (<button key={oIdx} type="button" className={`w-full p-3 sm:p-3.5 border-2 rounded-xl font-display text-sm sm:text-base font-bold cursor-pointer transition-all duration-150 text-left flex items-center gap-3 active:scale-98 disabled:cursor-not-allowed disabled:opacity-75 ${isSelected
                                ? "border-accent-green bg-accent-green/15 text-emerald-800"
                                : "border-slate-200 bg-white text-text-primary hover:border-accent-cyan hover:bg-accent-cyan/10 hover:translate-x-1"}`} disabled={msg.answered || loading} onClick={() => handleQuizAnswer(index, opt)}>
                            <span className="w-7 h-7 rounded-full bg-[#F0F4FF] flex items-center justify-center font-bold text-xs shrink-0 text-primary">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>);
                    })}
                    </div>
                  </div>)}
              </div>
            </div>);
        })}

        {loading && (<div className="flex gap-2.5 max-w-[85%] self-start animate-pop-in items-start">
            <div className="px-4 py-2.5 rounded-2xl rounded-bl-xs bg-white text-text-primary shadow-sm border border-slate-100">
              <div className="flex gap-1.5 p-1 items-center">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-typing"/>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-typing [animation-delay:0.2s]"/>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-typing [animation-delay:0.4s]"/>
              </div>
            </div>
          </div>)}

        <div ref={messagesEndRef}/>
      </main>

      {/* Quick Prompts Bar */}
      {/* Input Area */}
      <footer className="p-3 sm:p-4 bg-white/95 backdrop-blur-xl border-t border-slate-200/80">
        <form className="flex gap-2 sm:gap-3 items-center max-w-4xl mx-auto" onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
        }}>
          <input type="text" className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 border-2 border-slate-200 rounded-full font-body text-sm sm:text-base font-semibold text-text-primary bg-white outline-none transition duration-150 placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary/15" placeholder={`Say something to Buddy, ${profile.name}...`} value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={loading}/>
          <button type="submit" className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-primary-light hover:from-[#5b51ff] hover:to-[#7a71ff] text-white flex items-center justify-center text-xl transition-all duration-150 shadow-md shadow-primary/30 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none shrink-0 cursor-pointer" disabled={!inputText.trim() || loading} aria-label="Send message">
            <Send aria-hidden="true" className="w-5 h-5"/>
          </button>
        </form>
      </footer>

      {/* Mood Picker Modal */}
      {showMoodModal && (<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => {
                if (messages.length > 0)
                    setShowMoodModal(false);
            }}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center animate-pop-in border border-white/50 relative" onClick={(e) => e.stopPropagation()}>
            {messages.length > 0 && (<button type="button" onClick={() => setShowMoodModal(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-transform hover:scale-105 cursor-pointer border-none" title="Close">
                <X aria-hidden="true" className="w-4 h-4"/>
              </button>)}
            <h2 className="font-display text-xl sm:text-2xl font-bold text-text-primary mb-1">
              How are you feeling today?
            </h2>
            <p className="text-sm text-text-secondary mb-5 font-semibold">
              Pick your mood so Buddy can chat with you!
            </p>
            <div className="grid grid-cols-5 gap-2 sm:gap-3 justify-center">
              {MOODS.map((m) => {
                const IconComponent = m.icon;
                const isSelected = sessionInfo.mood === m.key;
                return (<button key={m.key} type="button" className={`flex flex-col items-center gap-1.5 p-2.5 sm:p-3 border-2 rounded-2xl transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-md group hover:-translate-y-1 hover:scale-105 active:scale-95 ${isSelected
                        ? `${m.bgColor} ${m.borderColor} ring-2 ring-primary/30`
                        : `bg-white border-slate-200 ${m.bgHover}`}`} onClick={() => handleSelectMood(m.key)}>
                    <IconComponent className={`w-8 h-8 sm:w-9 sm:h-9 ${m.color} group-hover:scale-110 transition-transform`}/>
                    <span className="font-display text-xs font-bold text-text-secondary group-hover:text-text-primary">
                      {m.label}
                    </span>
                  </button>);
            })}
            </div>
          </div>
        </div>)}

      {/* XP Gained Popup Animation */}
      {xpGainedAnim !== null && (<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-accent-yellow to-accent-orange text-white px-6 py-3 rounded-2xl font-display text-2xl font-extrabold z-50 pointer-events-none shadow-2xl animate-xp-popup">
          +{xpGainedAnim} XP
        </div>)}

      {/* Level Up Overlay */}
      {showLevelUp !== null && (<div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-pop-in border border-slate-100">
            <Trophy aria-hidden="true" className="w-14 h-14 mb-3 inline-block animate-bounce text-accent-yellow"/>
            <h2 className="font-display text-3xl font-extrabold bg-gradient-to-r from-accent-yellow to-accent-orange bg-clip-text text-transparent mb-2">
              LEVEL UP!
            </h2>
            <p className="text-sm sm:text-base text-text-secondary font-semibold mb-6">
              You unlocked Level {showLevelUp}! You are a true superstar
              learner!
            </p>
            <button type="button" className="w-full py-3 px-6 bg-gradient-to-r from-primary to-primary-light hover:from-[#5b51ff] hover:to-[#7a71ff] text-white rounded-full font-display text-base font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer" onClick={() => setShowLevelUp(null)}>
              Keep Going!
            </button>
          </div>
        </div>)}

      {/*  Dashboard Drawer */}
      {showDashboard && (<>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in" onClick={() => setShowDashboard(false)}/>
          <aside className="fixed top-0 right-0 w-full sm:w-[420px] max-w-full h-full bg-white shadow-2xl z-50 overflow-y-auto flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h2 className="font-display text-xl font-bold text-text-primary flex items-center gap-2">
                <ChartNoAxesColumn aria-hidden="true" className="w-5 h-5 text-primary"/>
                Progress Dashboard
              </h2>
              <button type="button" className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-base font-bold text-slate-600 transition-transform hover:scale-105 cursor-pointer border-none" onClick={() => setShowDashboard(false)}>
                <X aria-hidden="true" className="w-4 h-4"/>
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 flex-1">
              {dashboardLoading && (<p className="font-bold text-center p-3 rounded-xl text-text-secondary bg-[#F0F4FF]">
                  Loading your progress...
                </p>)}
              {dashboardError && (<p className="font-bold text-center p-3 rounded-xl text-rose-700 bg-rose-50" role="alert">
                  {dashboardError}
                </p>)}
              {!dashboardLoading && dashboard && (<>
                  <div className="bg-[#F0F4FF] rounded-2xl p-4 flex items-center gap-3.5 border border-primary/10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br from-accent-yellow to-accent-orange">
                      <Star aria-hidden="true" className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                      <h3 className="font-display text-xs font-bold text-text-secondary uppercase tracking-wider">
                        Current Level
                      </h3>
                      <div className="font-display text-xl font-extrabold text-text-primary">
                        Level {dashboard.level}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F0F4FF] rounded-2xl p-4 flex items-center gap-3.5 border border-primary/10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br from-primary to-primary-light">
                      <Gem aria-hidden="true" className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                      <h3 className="font-display text-xs font-bold text-text-secondary uppercase tracking-wider">
                        Total XP Earned
                      </h3>
                      <div className="font-display text-xl font-extrabold text-text-primary">
                        {dashboard.xp} XP
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F0F4FF] rounded-2xl p-4 flex items-center gap-3.5 border border-primary/10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br from-accent-green to-accent-cyan">
                      <Flame aria-hidden="true" className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                      <h3 className="font-display text-xs font-bold text-text-secondary uppercase tracking-wider">
                        Correct Streak
                      </h3>
                      <div className="font-display text-xl font-extrabold text-text-primary">
                        {dashboard.consecutiveCorrect} in a row
                      </div>
                    </div>
                  </div>

                  <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs" aria-label="Lesson progress">
                    <div className="flex justify-between items-center text-sm font-bold text-text-primary mb-2">
                      <strong>Lesson progress</strong>
                      <span className="text-text-secondary">
                        {dashboard.completedLessons} / {dashboard.totalLessons}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden my-2" role="progressbar" aria-valuenow={dashboard.progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`${dashboard.progressPercent}% of lessons complete`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-cyan transition-all duration-500" style={{ width: `${dashboard.progressPercent}%` }}/>
                    </div>
                    <p className="text-xs font-semibold text-text-secondary mt-1 flex items-center gap-1.5 flex-wrap">
                      <span>Feeling</span>
                      {(() => {
                    const moodObj = MOODS.find((m) => m.key === dashboard.mood);
                    if (moodObj) {
                        const MoodIcon = moodObj.icon;
                        return (<span className={`inline-flex items-center gap-1 font-bold ${moodObj.color}`}>
                              <MoodIcon className="w-4 h-4"/>
                              {moodObj.label}
                            </span>);
                    }
                    return <span>{dashboard.mood}</span>;
                })()}
                      <span>· Current topic: {dashboard.currentTopic}.</span>
                    </p>
                  </section>

                  <div>
                    <h3 className="font-display text-sm font-bold text-text-primary mb-2.5">
                      Level Curriculum
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {dashboard.topics.map((topic) => (<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-display text-xs font-bold transition-all ${dashboard.completedTopics.includes(topic)
                        ? "bg-primary text-white shadow-xs"
                        : "bg-slate-100 text-text-secondary"}`} key={topic}>
                          {dashboard.completedTopics.includes(topic) ? (<Check aria-hidden="true" className="w-3.5 h-3.5"/>) : (<BookOpen aria-hidden="true" className="w-3.5 h-3.5"/>)}
                          {topic.charAt(0).toUpperCase() + topic.slice(1)}
                        </span>))}
                    </div>
                  </div>

                  <section>
                    <h3 className="font-display text-sm font-bold text-text-primary mb-2.5">
                      Recent conversation
                    </h3>
                    {dashboard.recentConversations.length > 0 ? (<ol className="flex flex-col gap-2.5 list-none p-0 m-0">
                        {dashboard.recentConversations.map((item) => (<li className={`p-3 rounded-xl border-l-4 bg-slate-50 flex flex-col gap-1 ${item.role === "child"
                            ? "border-secondary"
                            : "border-primary-light"}`} key={item.id}>
                            <div className="flex justify-between items-center text-xs text-text-secondary">
                              <strong className="text-text-primary">
                                {item.role === "child" ? profile.name : "Buddy"}
                              </strong>
                              <time dateTime={item.created_at}>
                                {new Date(item.created_at).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                              </time>
                            </div>
                            <p className="my-0.5 text-xs sm:text-sm text-text-primary whitespace-pre-wrap break-words">
                              {item.message}
                            </p>
                            <span className="text-[11px] text-text-muted flex items-center gap-1.5">
                              <span>
                                {item.detected_mode || "conversation"}
                              </span>
                              <span>·</span>
                              {(() => {
                            const moodObj = MOODS.find((m) => m.key === (item.mood || dashboard.mood));
                            if (moodObj) {
                                const MoodIcon = moodObj.icon;
                                return (<span className={`inline-flex items-center gap-1 font-semibold ${moodObj.color}`}>
                                      <MoodIcon className="w-3 h-3"/>
                                      {moodObj.label}
                                    </span>);
                            }
                            return (<span>{item.mood || dashboard.mood}</span>);
                        })()}
                            </span>
                          </li>))}
                      </ol>) : (<p className="font-bold text-center p-3 rounded-xl text-text-secondary bg-[#F0F4FF] text-xs">
                        Your conversation history will show up here.
                      </p>)}
                  </section>

                  <div className="mt-2">
                    <button type="button" onClick={handleResetProgress} className="w-full py-3 px-4 border-2 border-rose-200 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-colors cursor-pointer text-sm">
                      <RotateCcw aria-hidden="true" className="w-4 h-4"/>
                      Reset Progress
                    </button>
                  </div>
                </>)}
            </div>
          </aside>
        </>)}
    </div>);
}
