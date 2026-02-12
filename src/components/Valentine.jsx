import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

// const noMessages = [
//     "Oh? 👀 You clicked No already?",
//     "Wow. Bold choice. Very bold.",
//     "Are you *sure* sure? Because my heart disagrees.",
//     "Cutuuu… that button is starting to look suspicious 😏",
//     "Okay but imagine saying No to *this face* 🥺",
//     "This is getting awkward. Just say Yes already.",
//     "At this point the No button is just decoration 😂",
//     "Alright. Enough drama. You’re clearly meant to say Yes 💖"
// ];
const noMessages = [
    "Accha… itna attitude cutuu? 😏",
    "Arey, galat button hai ye… try again 💖",
    "Sach bolo… tum Yes hi bolne wali ho 😌",
    "Cutuu, mujhe pata hai tumhara answer kya hai 💞",
    "Itna bhi kya nakhra… bas Yes bol do na 🥺",
    "Dil already decide kar chuka hai ❤️",
    "The No button is just decoration now 😂",
    "Okay bas… ab officially tum meri ho 💖"
];


// function generateValentineMessage(name = "You") {
//     const openers = [
//         "I was going to write something simple, but my heart had other plans.",
//         "I tried to be logical… then I thought about you.",
//         "Some questions deserve special courage."
//     ];
//     const middles = [
//         `Every moment with ${name} feels warmer and more real.`,
//         `You make ordinary days unforgettable.`,
//         `Being around you feels like home.`
//     ];
//     const closers = [
//         "So here I am, hoping this makes you smile.",
//         "This isn’t just a question, it’s a feeling.",
//         "Just a heart being honest."
//     ];
//     const pick = a => a[Math.floor(Math.random() * a.length)];
//     return `${pick(openers)} ${pick(middles)} ${pick(closers)}`;
// }


function generateValentineMessage(name = "Cutuuu") {
    const nickname = "Cutuuu";

    const openers = [
        `I tried to be brave, but my heart already knew the answer… it’s always you, ${nickname}.`,
        `I  don’t know how to say this perfectly… but being with you just feels right, ${nickname}.`,
        `Every time I think of you, ${nickname}, my heart just smiles on its own.`
    ];

    const middles = [
        `You make my days lighter, my smile real, and my world softer.`,
        `With you, even the simplest moments feel special and warm.`,
        `You turn ordinary days into something I never want to end.`
    ];

    const closers = [
        `I just want to keep you close like this… always. 💖`,
        `So… can I keep you as mine, my ${nickname}? 💞`,
        `I don’t need anything else… just you and your smile. 💫`
    ];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return `${pick(openers)} ${pick(middles)} ${pick(closers)}`;
}


const themes = {
    pink: "from-pink-100 via-pink-200 to-rose-200",
    dark: "from-zinc-900 via-rose-900 to-black"
};

function FloatingHearts() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: 18 }).map((_, i) => (
                <span
                    key={i}
                    className="absolute animate-float text-pink-400"
                    style={{
                        left: `${Math.random() * 100}%`,
                        fontSize: `${12 + Math.random() * 24}px`,
                        animationDuration: `${8 + Math.random() * 10}s`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                >
          ❤️
        </span>
            ))}
        </div>
    );
}

export default function Valentine() {
    const zoneRef = useRef(null);
    const noBtnRef = useRef(null);
    const canvasRef = useRef(null);

    const [step, setStep] = useState("intro");
    const [theme, setTheme] = useState("pink");
    const [yesScale, setYesScale] = useState(1);
    const [noStage, setNoStage] = useState(0);
    const [typedMessage, setTypedMessage] = useState("");
    const [bubbleVisible, setBubbleVisible] = useState(false);
    const [bubbleIndex, setBubbleIndex] = useState(0);
    const [noMsgPos, setNoMsgPos] = useState({ x: 0, y: 0 });
    const typeIndexRef = useRef(0);


    const name = "Cutuu";
    const fullMessage = generateValentineMessage(name);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const dpr = Math.max(1, window.devicePixelRatio || 1);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);
    useEffect(() => {
    if (!noBtnRef.current) return;
    const rect = noBtnRef.current.getBoundingClientRect();
    setNoMsgPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 8
    });
}, [step]);

    useEffect(() => {
        if (!bubbleVisible) return;

        const showTime = 1000;
        const hideTime = 300;

        const interval = setInterval(() => {
            setBubbleVisible(false);

            setTimeout(() => {
                setBubbleIndex(i => (i + 1) % noMessages.length);
                setBubbleVisible(true);
            }, hideTime);

        }, showTime + hideTime);

        return () => clearInterval(interval);
    }, [bubbleVisible]);
//     useEffect(() => {
//     if (step !== "celebration") return;

//     let i = 0;
//     setTypedMessage("");

//     const interval = setInterval(() => {
//         setTypedMessage(prev => prev + fullMessage.charAt(i));
//         i++;

//         if (i >= fullMessage.length) {
//             clearInterval(interval);
//         }
//     }, 60);   // slow romantic speed

//     return () => clearInterval(interval);
// }, [step]);
    useEffect(() => {
        if (step !== "celebration") return;

        setTypedMessage("");
        typeIndexRef.current = 0;

        const interval = setInterval(() => {
            const i = typeIndexRef.current;

            setTypedMessage(fullMessage.slice(0, i + 1));

            typeIndexRef.current = i + 1;

            if (i >= fullMessage.length) {
                clearInterval(interval);
            }
        }, 60);   // speed

        return () => clearInterval(interval);
    }, [step]);



    const fireConfetti = () => {
        confetti({
            particleCount: 260,
            spread: 150,
            startVelocity: 60,
            origin: { x: 0.5, y: 0.5 }
        });
    };
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const moveNo = (x, y) => {
        if (!zoneRef.current || !noBtnRef.current) return;

        const zone = zoneRef.current.getBoundingClientRect();
        const btn = noBtnRef.current.getBoundingClientRect();

        let dx = btn.left + btn.width / 2 - x;
        let dy = btn.top + btn.height / 2 - y;
        const mag = Math.hypot(dx, dy) || 1;
        dx /= mag;
        dy /= mag;

        let left = btn.left - zone.left + dx * 160;
        let top = btn.top - zone.top + dy * 160;

        noBtnRef.current.style.left =
            clamp(left, 0, zone.width - btn.width) + "px";
        noBtnRef.current.style.top =
            clamp(top, 0, zone.height - btn.height) + "px";

        setYesScale(s => Math.min(2.3, s + 0.12));
        const rect = noBtnRef.current.getBoundingClientRect();
        setNoMsgPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 8
        });

    };

    return (
        <div className={`min-h-screen bg-gradient-to-br ${themes[theme]} transition-colors duration-700`}>
            <FloatingHearts />
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
            {step === "question" && (
                <div
                    style={{
                    position: "fixed",
                    left: noMsgPos.x,
                    top: noMsgPos.y,
                    transform: "translate(-50%, -120%)",
                    pointerEvents: "none",
                    zIndex: 40
                    }}
                    className="transition-all duration-300 ease-out"
                >
                    <div
                    className={`
                        px-4 py-2 rounded-full shadow-md text-sm font-semibold
                        bg-white/90 backdrop-blur text-pink-600
                        transition-all duration-300
                        ${bubbleVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                    `}
                    >
                    {noMessages[bubbleIndex]}
                    </div>
                </div>
                )}

            <div className="fixed top-4 right-4 z-20 flex gap-2">
                {Object.keys(themes).map(t => (
                    <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`w-8 h-8 rounded-full border-2 ${
                            theme === t ? "border-white scale-110" : "border-white/40"
                        } transition`}
                        style={{ background: t === "pink" ? "#fb7185" : "#18181b" }}
                    />
                ))}
            </div>
            <div className="min-h-screen flex items-center justify-center">
                <main className="relative z-10 w-[92vw] max-w-xl rounded-3xl p-8 text-center shadow-2xl bg-white/80 backdrop-blur-xl">

                    {step === "intro" && (
                        <div className="animate-pop">
                            <h1 className="text-4xl font-extrabold mb-6">Cutuu 💕</h1>
                            <p className="mb-8 opacity-80">I have something important to ask you…</p>
                            <button
                                onClick={() => setStep("question")}
                                className="px-10 py-4 bg-pink-500 text-white rounded-full text-xl font-bold hover:scale-105 transition"
                            >
                                Continue →
                            </button>
                        </div>
                    )}

                    {step === "question" && (
                        <>
                            <h1 className="text-4xl font-extrabold mb-8">
                                Will you be my Valentine? 💖
                            </h1>
                            {noStage > 0 && (
                                <p className="uppercase tracking-widest text-xs text-gray-400 mb-2">
                                    Chapter {noStage}: Acceptance is loading…
                                </p>
                            )}

                            


                            <section
                                ref={zoneRef}
                                onPointerMove={e => {
                                    const b = noBtnRef.current.getBoundingClientRect();
                                    const d = Math.hypot(
                                        b.left + b.width / 2 - e.clientX,
                                        b.top + b.height / 2 - e.clientY
                                    );
                                    // if (d < 140) moveNo(e.clientX, e.clientY);
                                    if (d < 140) {
                                        moveNo(e.clientX, e.clientY);

                                        if (!bubbleVisible) {
                                            setBubbleVisible(true);
                                        }
                                    }

                                }}

                            

                                className="relative mx-auto w-full max-w-md h-40 touch-none"
                            >
                                <button
                                    onClick={() => {
                                        fireConfetti();
                                        setStep("celebration");
                                    }}
                                    style={{
                                        transform: `translateY(-50%) scale(${yesScale})`,
                                        boxShadow: yesScale > 1.6 ? "0 0 40px rgba(236,72,153,.9)" : undefined
                                    }}
                                    className="absolute left-[18%] top-1/2 bg-pink-500
                                            hover:bg-pink-600 text-white px-8 py-4 rounded-full
                                            font-bold shadow-lg transition animate-glow"
                                >
                                    Yes 💘
                                </button>


                                <button
                                    ref={noBtnRef}
                                    onClick={() => {
                                        setNoStage(s => {
                                            const next = Math.min(noMessages.length - 1, s + 1);
                                            if (next === noMessages.length - 1) {
                                                setTimeout(() => {
                                                    fireConfetti();
                                                    setStep("celebration");
                                                }, 600);
                                            }
                                            return next;
                                        });
                                        setYesScale(s => Math.min(3.2, s + 0.3));
                                    }}

                                    className={`absolute left-[62%] top-1/2 -translate-y-1/2 
                                    px-8 py-4 rounded-full font-bold shadow-lg select-none
                                    transition-all duration-300
                                    ${noStage > 4 ? "opacity-60 rotate-6" : ""}
                                    ${noStage > 6 ? "scale-75 blur-[1px]" : ""}
                                    bg-gray-200`}
                                >
                                    No 😐
                                </button>

                            </section>
                        </>
                    )}

                    {step === "celebration" && (
                        <div className="animate-pop">
                            <h2 className="text-5xl font-extrabold text-pink-600 animate-glow mb-6">
                                Ahaaaaa Finallyyyy 💖🎉
                            </h2>
                            <p className="max-w-md mx-auto opacity-90 leading-relaxed text-lg">
                                {typedMessage}<span className="animate-pulse">|</span>
                            </p>

                            <img
                                className="mx-auto mt-4 max-w-xs"
                                src="https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif"
                                alt="Fireworks"
                            />
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
