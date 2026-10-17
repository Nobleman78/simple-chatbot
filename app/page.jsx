"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LandingPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [age, setAge] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleStart = () => {
        if (!name.trim() || !age)
            return;
        setIsLoading(true);
        // Store child info in sessionStorage
        const childData = {
            name: name.trim(),
            age,
            id: `child-${Date.now()}`,
            sessionId: `session-${Date.now()}`,
        };
        sessionStorage.setItem("buddyChild", JSON.stringify(childData));
        router.push("/chat");
    };
    return (<>

      <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#E8F4FD] via-[#F0E6FF] to-[#FFF0F5]">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl animate-float"/>
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-secondary/15 blur-3xl animate-float [animation-delay:-10s]"/>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-10 max-w-[480px] w-full shadow-2xl border border-white/60 text-center animate-slide-up">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 leading-tight">
            Hi! I&apos;m Buddy!
          </h1>
          <p className="text-base sm:text-lg text-text-secondary mb-6 font-semibold">
            Your fun English learning friend!
          </p>

          {/* Name Input */}
          <div className="mb-5 text-left">
            <label className="block font-display font-bold text-text-primary mb-2 text-sm sm:text-base" htmlFor="child-name">
              What&apos;s your name?
            </label>
            <input id="child-name" type="text" className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl font-body text-base font-semibold text-text-primary bg-white transition duration-150 outline-none placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary/15" placeholder="Type your name here..." value={name} onChange={(e) => setName(e.target.value)} maxLength={20} autoComplete="off"/>
          </div>

          {/* Age Selector */}
          <div className="mb-5 text-left">
            <label className="block font-display font-bold text-text-primary mb-2 text-sm sm:text-base">
              How old are you?
            </label>
            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
              {[2, 3, 4, 5, 6, 7].map((a) => (<button key={a} className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border-2 font-display text-lg font-bold cursor-pointer transition-all duration-150 flex items-center justify-center ${age === a
                ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(108,99,255,0.4)] scale-110"
                : "bg-white text-text-primary border-slate-200 hover:border-primary hover:-translate-y-0.5 hover:shadow-sm"}`} onClick={() => setAge(a)} type="button">
                  {a}
                </button>))}
            </div>
          </div>

          {/* Start Button */}
          <button className="w-full py-3.5 px-6 bg-gradient-to-r from-primary to-primary-light hover:from-[#5b51ff] hover:to-[#7a71ff] text-white font-display text-lg font-bold rounded-2xl shadow-[0_4px_16px_rgba(108,99,255,0.35)] hover:shadow-[0_8px_24px_rgba(108,99,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer" onClick={handleStart} disabled={!name.trim() || !age || isLoading} type="button">
            {isLoading ? "Loading... " : "Let's Start Learning! "}
          </button>
        </div>
      </div>
    </>);
}
