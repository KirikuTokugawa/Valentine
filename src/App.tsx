import React, { useState, useEffect, useRef } from 'react';
import { Heart, Flame, X, Check, Lock, Unlock, Music, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';

// --- Types ---
type Theme = 'sweet' | 'spicy';

// --- Constants & Copy ---
const COPY = {
    sweet: {
        greeting: "Hey beautiful...",
        music: "Lover.mp3", // <--- ADD THIS LINE
        question: "Will you be my Valentine?",
        yesBtn: "Yes, definitely!",
        noBtn: "No thanks",
        successTitle: "Perfect! ❤️",
        successBody: "Review might keep me busy, but I really want to hang out with you.",
        noMessages: [
            "Sure ka?",
            "Sure ka na talaga?",
            "Pagisipan mo",
            "Bawal ngaaa",
            "Iiyak ako 😥",
            "Last chance!",
            "Grabe, ang tigas ng ulo mo"
        ]
    },
    spicy: {
        greeting: "Hey you...",
        music: "Earned-it.mp3", // <--- ADD THIS LINE
        question: "Feeling daring today?",
        yesBtn: "Yes, let's do it! 😏",
        noBtn: "Maybe later",
        successTitle: "Yes! I knew you’d say yes 😎",
        successBody: "I might be busy with review, but spending time with you sounds way more fun.",
        noMessages: [
            "Playing hard to get, huh?",
            "Don't be shy...",
            "You know you want to.",
            "A little nervous, are we?",
            "Oops, wrong button?",
            "Nice try!",
            "I can tell you're thinking about it 😉"
        ]
    }
};

// --- Helper Components ---

// Simple Confetti Particle
const Particle = ({ delay }: { delay: number }) => {
    const randomColor = ['bg-red-500', 'bg-pink-500', 'bg-purple-500', 'bg-yellow-400'][Math.floor(Math.random() * 4)];
    const randomLeft = Math.floor(Math.random() * 100) + '%';

    return (
        <div
            className={`absolute top-0 w-3 h-3 ${randomColor} rounded-full animate-confetti opacity-0`}
            style={{
                left: randomLeft,
                animationDelay: `${delay}ms`,
                transform: `rotate(${Math.random() * 360}deg)`
            }}
        />
    );
};

// Background Floating Hearts
const FloatingHeart = ({ delay, left, size, speed }: { delay: number, left: string, size: string, speed: number }) => (
    <div
        className={`absolute text-white/10 animate-float pointer-events-none select-none`}
        style={{
            left,
            animationDelay: `${delay}s`,
            fontSize: size,
            animationDuration: `${speed}s`
        }}
    >
        <Heart fill="currentColor" />
    </div>
);

export default function App() {
    const [theme, setTheme] = useState<Theme>('sweet');
    const [accepted, setAccepted] = useState(false);
    const [noCount, setNoCount] = useState(0);
    const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
    const [isHoveringNo, setIsHoveringNo] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    // Audio state (simulated visuals since we can't auto-play real audio easily without interaction)
    const [soundOn, setSoundOn] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);

    // --- 1. Audio Reference ---
    const audioRef = useRef<HTMLAudioElement>(null);

    // --- 2. Function to start music ---
    // This bypasses the browser "Autoplay" block
    const startMusic = () => {
        if (audioRef.current && soundOn) {
            audioRef.current.play().catch(() => {
                console.log("Waiting for user interaction to play audio...");
            });
        }
    };

    // Handle "No" button evasion
    const moveNoButton = () => {
        startMusic(); // <--- PASTE THIS LINE HERE
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        setNoBtnPos({ x, y });
        setNoCount(prev => prev + 1);
    };

    const handleNoHover = () => {
        setIsHoveringNo(true);
        moveNoButton();
    };

    const handleReset = () => {
        setAccepted(false);
        setNoCount(0);
        setNoBtnPos({ x: 0, y: 0 });
    };

    // Get current copy based on theme
    const text = COPY[theme];
    const currentNoText = text.noMessages[Math.min(noCount, text.noMessages.length - 1)];

    return (
        <div 
            onClick={startMusic}
            className="relative min-h-screen w-full bg-gradient-to-br from-rose-900 via-red-600 to-rose-900 overflow-hidden font-sans text-white selection:bg-pink-300 selection:text-red-900">

            {/* --- THE MISSING PIECE: ADD THIS LINE BELOW --- */}
            <audio ref={audioRef} src={theme === 'sweet' ? COPY.sweet.music : COPY.spicy.music} loop />

            {/* --- Global Styles for Custom Animations --- */}
            <style>{`
        @keyframes float {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          75% { transform: translateX(5px) rotate(5deg); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-float { animation: float linear infinite; }
        .animate-pulse-fast { animation: pulse-fast 1s ease-in-out infinite; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .animate-confetti { animation: confetti 2s ease-out forwards; }
      `}</style>

            {/* --- Background Elements --- */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <FloatingHeart
                        key={i}
                        delay={Math.random() * 10}
                        left={`${Math.random() * 100}%`}
                        size={`${Math.random() * 40 + 20}px`}
                        speed={Math.random() * 10 + 10}
                    />
                ))}
            </div>

            {/* --- Navigation / Header --- */}
            <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <Heart className="text-pink-300 w-5 h-5 fill-pink-300 animate-pulse-fast" />
                    <span className="font-bold tracking-wider text-sm">CITY.EXE</span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSoundOn(!soundOn)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>

                    {/* Theme Toggle */}
                    <div className="flex items-center bg-black/30 rounded-full p-1 cursor-pointer border border-white/10" onClick={() => setTheme(prev => prev === 'sweet' ? 'spicy' : 'sweet')}>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${theme === 'sweet' ? 'bg-pink-500 text-white shadow-lg' : 'text-white/50'}`}>
                            Sweet
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1 ${theme === 'spicy' ? 'bg-red-600 text-white shadow-lg' : 'text-white/50'}`}>
                            Spicy <Flame className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- Main Content Area --- */}
            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">

                {!accepted ? (
                    /* --- Proposal Card --- */
                    <div ref={containerRef} className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl transform transition-all hover:scale-[1.01] duration-500">
                        {/* Image / GIF Placeholder */}
                        <div className="w-full h-48 bg-gradient-to-t from-black/20 to-transparent rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500" />
                            {theme === 'sweet' ? (
                                <Heart className="w-24 h-24 text-pink-300 drop-shadow-glow animate-pulse-fast" fill="currentColor" />
                            ) : (
                                <div className="text-6xl animate-bounce">😈</div>
                            )}
                        </div>

                        <div className="text-center space-y-4">
                            <h2 className="text-pink-200 uppercase tracking-widest text-xs font-bold">{text.greeting}</h2>
                            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-lg">
                                {text.question}
                            </h1>

                            <p className={`text-sm text-white/70 h-6 transition-opacity duration-300 ${noCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                                {noCount > 0 ? (theme === 'spicy' ? "Trying to escape? Cute." : "Don't break my heart...") : ""}
                            </p>

                            <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-4 min-h-[120px]">
                                {/* YES BUTTON */}
                                <button
                                    onClick={() => setAccepted(true)}
                                    className={`
                    w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg shadow-xl transform transition-all duration-200 active:scale-95 hover:shadow-2xl hover:-translate-y-1
                    ${theme === 'sweet' ? 'bg-pink-500 hover:bg-pink-400' : 'bg-red-600 hover:bg-red-500'}
                  `}
                                >
                                    {text.yesBtn}
                                </button>

                                {/* NO BUTTON (The Runner) */}
                                <div
                                    className="relative w-full md:w-auto"
                                    style={{
                                        transform: `translate(${noBtnPos.x}px, ${noBtnPos.y}px)`,
                                        transition: 'all 0.2s ease-out'
                                    }}
                                >
                                    <button
                                        onMouseEnter={handleNoHover}
                                        onClick={moveNoButton}
                                        onTouchStart={moveNoButton} // For mobile fun
                                        className="w-full md:w-auto px-8 py-4 bg-gray-800/50 hover:bg-gray-800 backdrop-blur-md border border-white/10 rounded-xl font-medium text-white/80 transition-colors whitespace-nowrap"
                                    >
                                        {noCount === 0 ? text.noBtn : currentNoText}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms Link */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setShowTerms(true)}
                                className="text-xs text-white/30 hover:text-white/60 underline decoration-dotted transition-colors"
                            >
                                *Terms and conditions apply
                            </button>
                        </div>
                    </div>
                ) : (
                    /* --- Success Card --- */
                    <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        {/* Confetti Explosion */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(50)].map((_, i) => <Particle key={i} delay={i * 50} />)}
                        </div>

                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-pink-500 blur-3xl opacity-50 animate-pulse"></div>
                            {theme === 'sweet' ? (
                                <div className="relative bg-white text-pink-600 rounded-full p-6 shadow-2xl rotate-3">
                                    <Heart className="w-16 h-16 fill-current" />
                                </div>
                            ) : (
                                <div className="relative bg-red-600 text-white rounded-full p-6 shadow-2xl -rotate-3 border-4 border-black">
                                    <Flame className="w-16 h-16 fill-current" />
                                </div>
                            )}
                        </div>

                        <div className="bg-black/30 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                            <h1 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-white">
                                {text.successTitle}
                            </h1>
                            <p className="text-xl text-white/90 leading-relaxed mb-8">
                                {text.successBody}
                            </p>
                            <div className="flex justify-center gap-2">
                                <button className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-sm">
                                    Screenshot This 📸
                                </button>
                                <button onClick={handleReset} className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-sm text-white/50">
                                    Replay
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* --- Terms Modal --- */}
            {showTerms && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowTerms(false)}>
                    <div className="bg-white text-gray-900 max-w-sm w-full p-6 rounded-2xl shadow-2xl animate-shake" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                The Fine Print
                            </h3>
                            <button onClick={() => setShowTerms(false)}><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>1. By clicking "Yes", you agree to be my Valentine forever (or at least for 24 hours).</p>
                            <p>2. Refunds are not accepted.</p>
                            <p>3. Payment must be made in the form of {theme === 'sweet' ? 'hugs and kisses' : 'undivided attention and... other things'}.</p>
                        </div>
                        <button
                            onClick={() => setShowTerms(false)}
                            className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition"
                        >
                            I Accept My Fate
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}