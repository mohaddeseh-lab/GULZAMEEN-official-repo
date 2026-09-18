import React, { useState, useEffect, useRef } from 'react';
import { QUIZ_QUESTIONS, WORD_SCRAMBLE_ITEMS } from '../data/initialData';
import { Gamepad2, Award, RefreshCw, CheckCircle, XCircle, HelpCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, Trophy, Flag, Clock } from 'lucide-react';

export const GamesSection: React.FC = () => {
  const [activeGameTab, setActiveGameTab] = useState<'quiz' | 'scramble' | 'caravan'>('quiz');

  // --- QUIZ GAME STATE ---
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizTimer, setQuizTimer] = useState(10);

  const currentQuestion = QUIZ_QUESTIONS[quizIdx];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === currentQuestion.correctAnswer) {
      setQuizScore((prev) => prev + 20);
    }
  };

  const handleNextQuestion = () => {
    if (quizIdx + 1 < QUIZ_QUESTIONS.length) {
      setQuizIdx((prev) => prev + 1);
      setSelectedOption(null);
      setQuizTimer(10);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuizIdx(0);
    setQuizScore(0);
    setSelectedOption(null);
    setQuizFinished(false);
    setQuizTimer(10);
  };

  // 10-second Quiz Timer Effect
  useEffect(() => {
    if (activeGameTab !== 'quiz' || quizFinished || selectedOption !== null) return;

    if (quizTimer <= 0) {
      setSelectedOption(-1); // -1 indicates timed out
      return;
    }

    const interval = setInterval(() => {
      setQuizTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeGameTab, quizFinished, selectedOption, quizTimer]);

  // --- WORD SCRAMBLE STATE ---
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambleInput, setScrambleInput] = useState('');
  const [scrambleScore, setScrambleScore] = useState(0);
  const [scrambleFeedback, setScrambleFeedback] = useState<'correct' | 'incorrect' | 'timeout' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [scrambleFinished, setScrambleFinished] = useState(false);
  const [scrambleTimer, setScrambleTimer] = useState(10);

  const currentScramble = WORD_SCRAMBLE_ITEMS[scrambleIdx];

  const handleScrambleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scrambleFeedback === 'correct' || scrambleFeedback === 'timeout') return;

    if (scrambleInput.trim().toUpperCase() === currentScramble.word) {
      setScrambleFeedback('correct');
      setScrambleScore((prev) => prev + (showHint ? 15 : 25));
    } else {
      setScrambleFeedback('incorrect');
    }
  };

  const handleNextScramble = () => {
    if (scrambleIdx + 1 < WORD_SCRAMBLE_ITEMS.length) {
      setScrambleIdx((prev) => prev + 1);
      setScrambleInput('');
      setScrambleFeedback(null);
      setShowHint(false);
      setScrambleTimer(10);
    } else {
      setScrambleFinished(true);
    }
  };

  const restartScramble = () => {
    setScrambleIdx(0);
    setScrambleInput('');
    setScrambleScore(0);
    setScrambleFeedback(null);
    setShowHint(false);
    setScrambleFinished(false);
    setScrambleTimer(10);
  };

  // 10-second Word Scramble Timer Effect
  useEffect(() => {
    if (activeGameTab !== 'scramble' || scrambleFinished || scrambleFeedback === 'correct' || scrambleFeedback === 'timeout') return;

    if (scrambleTimer <= 0) {
      setScrambleFeedback('timeout');
      return;
    }

    const interval = setInterval(() => {
      setScrambleTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeGameTab, scrambleFinished, scrambleFeedback, scrambleTimer]);

  // --- CAMEL CARAVAN ADVENTURE GAME STATE (CANVAS) ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [caravanScore, setCaravanScore] = useState(0);
  const [artifactsCollected, setArtifactsCollected] = useState(0);
  const [caravanLives, setCaravanLives] = useState(3);
  const [caravanGameOver, setCaravanGameOver] = useState(false);
  const [caravanWon, setCaravanWon] = useState(false);
  const [caravanPlaying, setCaravanPlaying] = useState(false);

  // Caravan Game Logic Ref
  const gameLoopRef = useRef<number | null>(null);
  const gameStateRef = useRef({
    camel: { x: 50, y: 150, width: 34, height: 34, speed: 4 },
    artifacts: [] as { x: number; y: number; type: string; symbol: string; collected: boolean }[],
    sandstorms: [] as { x: number; y: number; radius: number; speedX: number; speedY: number }[],
    keys: { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false }
  });

  const initCaravanGame = () => {
    setCaravanScore(0);
    setArtifactsCollected(0);
    setCaravanLives(3);
    setCaravanGameOver(false);
    setCaravanWon(false);
    setCaravanPlaying(true);

    gameStateRef.current = {
      camel: { x: 50, y: 150, width: 34, height: 34, speed: 4 },
      artifacts: [
        { x: 180, y: 80, type: 'Suroz Lute', symbol: '🎻', collected: false },
        { x: 320, y: 220, type: 'Baloch Duch', symbol: '✨', collected: false },
        { x: 450, y: 100, type: 'Sajji Dish', symbol: '🍖', collected: false },
        { x: 580, y: 200, type: 'Golden Damboor', symbol: '🪕', collected: false },
        { x: 680, y: 90, type: 'Pashk Silk', symbol: '👑', collected: false }
      ],
      sandstorms: [
        { x: 250, y: 180, radius: 20, speedX: 1.5, speedY: 1.2 },
        { x: 400, y: 70, radius: 24, speedX: -1.2, speedY: 1.8 },
        { x: 550, y: 220, radius: 18, speedX: 2.0, speedY: -1.5 }
      ],
      keys: { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false }
    };
  };

  const moveCamel = (dir: 'up' | 'down' | 'left' | 'right') => {
    const camel = gameStateRef.current.camel;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (dir === 'up' && camel.y > 20) camel.y -= 15;
    if (dir === 'down' && camel.y < canvas.height - 40) camel.y += 15;
    if (dir === 'left' && camel.x > 20) camel.x -= 15;
    if (dir === 'right' && camel.x < canvas.width - 40) camel.x += 15;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!caravanPlaying) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') moveCamel('up');
        if (e.key === 'ArrowDown') moveCamel('down');
        if (e.key === 'ArrowLeft') moveCamel('left');
        if (e.key === 'ArrowRight') moveCamel('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [caravanPlaying]);

  useEffect(() => {
    if (!caravanPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Dunes Gradient
      const duneGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      duneGrad.addColorStop(0, '#2D1E18');
      duneGrad.addColorStop(0.5, '#3A2A22');
      duneGrad.addColorStop(1, '#1F1410');
      ctx.fillStyle = duneGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Decorative Sand Wave Curves
      ctx.strokeStyle = '#D4AF37';
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 100);
      ctx.quadraticCurveTo(200, 60, 400, 110);
      ctx.quadraticCurveTo(600, 160, 800, 90);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 220);
      ctx.quadraticCurveTo(250, 260, 500, 200);
      ctx.quadraticCurveTo(650, 170, 800, 240);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      const state = gameStateRef.current;
      const camel = state.camel;

      // Render Artifacts
      let uncollected = 0;
      state.artifacts.forEach((art) => {
        if (!art.collected) {
          uncollected++;
          // Draw Artifact Glow
          ctx.fillStyle = '#D4AF37';
          ctx.beginPath();
          ctx.arc(art.x, art.y, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(art.symbol, art.x, art.y);

          // Check Collision with Camel
          const dist = Math.hypot(camel.x - art.x, camel.y - art.y);
          if (dist < 28) {
            art.collected = true;
            setCaravanScore((prev) => prev + 100);
            setArtifactsCollected((prev) => prev + 1);
          }
        }
      });

      if (uncollected === 0) {
        setCaravanWon(true);
        setCaravanPlaying(false);
        return;
      }

      // Render Sandstorms & Move
      state.sandstorms.forEach((storm) => {
        storm.x += storm.speedX;
        storm.y += storm.speedY;

        if (storm.x < 30 || storm.x > canvas.width - 30) storm.speedX *= -1;
        if (storm.y < 30 || storm.y > canvas.height - 30) storm.speedY *= -1;

        // Draw Sandstorm Whirl
        ctx.fillStyle = '#C85A32';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(storm.x, storm.y, storm.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Collision Check with Camel
        const dist = Math.hypot(camel.x - storm.x, camel.y - storm.y);
        if (dist < storm.radius + 14) {
          // Hit Sandstorm!
          storm.x = Math.random() * (canvas.width - 100) + 50; // teleport storm away
          setCaravanLives((prev) => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setCaravanGameOver(true);
              setCaravanPlaying(false);
            }
            return newLives;
          });
        }
      });

      // Render Camel Icon facing from left to right
      ctx.save();
      ctx.translate(camel.x, camel.y);
      ctx.scale(-1, 1);
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐪', 0, 0);
      ctx.restore();

      // Render Finish Landmark Flag
      ctx.font = '22px sans-serif';
      ctx.fillText('🏁', canvas.width - 40, canvas.height / 2);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [caravanPlaying]);

  return (
    <section id="games" className="py-20 bg-[#F9F4EE] relative border-b-2 border-[#1A100C]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A100C] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Interactive Cultural Mini-Games</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A100C]">
            Heritage Arcade
          </h2>
          <p className="text-sm sm:text-base text-[#2B231F]/90">
            Test your knowledge of Balochi folklore, solve 10-second timed language scrambles, or lead a desert camel caravan across the dunes to preserve sacred relics.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-3 mb-10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveGameTab('quiz')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
              activeGameTab === 'quiz'
                ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#1A100C] shadow-md border border-[#FFF8DC]'
                : 'bg-[#1A100C] text-[#F9F4EE] hover:bg-[#281C16] border border-[#D4AF37]/20'
            }`}
          >
            <Award className={`w-4 h-4 ${activeGameTab === 'quiz' ? 'text-[#1A100C]' : 'text-[#C2593F]'}`} />
            1. Cultural Quiz (10s)
          </button>

          <button
            onClick={() => setActiveGameTab('scramble')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
              activeGameTab === 'scramble'
                ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#1A100C] shadow-md border border-[#FFF8DC]'
                : 'bg-[#1A100C] text-[#F9F4EE] hover:bg-[#281C16] border border-[#D4AF37]/20'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeGameTab === 'scramble' ? 'text-[#1A100C]' : 'text-[#C2593F]'}`} />
            2. Word Scramble (10s)
          </button>

          <button
            onClick={() => setActiveGameTab('caravan')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
              activeGameTab === 'caravan'
                ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#1A100C] shadow-md border border-[#FFF8DC]'
                : 'bg-[#1A100C] text-[#F9F4EE] hover:bg-[#281C16] border border-[#D4AF37]/20'
            }`}
          >
            <Flag className={`w-4 h-4 ${activeGameTab === 'caravan' ? 'text-[#1A100C]' : 'text-[#C2593F]'}`} />
            3. <span className="inline-block transform -scale-x-100">🐪</span> Camel Caravan Quest
          </button>
        </div>

        {/* GAME TAB 1: CULTURAL QUIZ */}
        {activeGameTab === 'quiz' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#1A100C]/15 shadow-md">
            {quizFinished ? (
              <div className="text-center py-8 space-y-4">
                <Trophy className="w-16 h-16 text-[#D4AF37] mx-auto animate-bounce" />
                <h3 className="font-serif text-2xl font-bold text-[#1A100C]">
                  Quiz Completed!
                </h3>
                <p className="text-lg text-[#C2593F] font-semibold">
                  Your Final Score: {quizScore} / {QUIZ_QUESTIONS.length * 20} Points
                </p>
                <p className="text-xs text-[#2B231F]/80 max-w-sm mx-auto">
                  {quizScore >= 80
                    ? 'Masterful! You possess deep wisdom regarding Balochi culture and history.'
                    : 'Great effort! Explore more stories in the Regional Explorer to boost your knowledge.'}
                </p>
                <button
                  onClick={restartQuiz}
                  className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1A100C] font-extrabold text-xs uppercase tracking-wider hover:shadow-md transition-all inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Quiz Again
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-[#1A100C] font-bold pb-3 border-b border-[#1A100C]/15">
                  <span>Question {quizIdx + 1} of {QUIZ_QUESTIONS.length}</span>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                      quizTimer <= 3 ? 'bg-rose-100 text-rose-700 border-rose-400 animate-pulse' : 'bg-[#F9F4EE] text-[#1A100C] border-[#1A100C]/15'
                    }`}>
                      <Clock className="w-3.5 h-3.5 text-[#C2593F]" />
                      <span>{quizTimer}s</span>
                    </div>
                    <span className="bg-[#F9F4EE] px-3 py-1 rounded border border-[#1A100C]/15">
                      Score: {quizScore} pts
                    </span>
                  </div>
                </div>

                {/* 10-second timer countdown bar */}
                <div className="w-full bg-[#1A100C]/10 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      quizTimer <= 3 ? 'bg-rose-500' : 'bg-[#D4AF37]'
                    }`}
                    style={{ width: `${(quizTimer / 10) * 100}%` }}
                  />
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A100C] leading-snug">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuestion.correctAnswer;
                    let btnStyle = 'bg-[#F9F4EE] text-[#2B231F] border-[#1A100C]/15 hover:border-[#C2593F]';

                    if (selectedOption !== null) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 font-bold';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedOption !== null}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {selectedOption !== null && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                        {selectedOption !== null && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>

                {selectedOption === -1 && (
                  <div className="p-3.5 rounded-xl bg-amber-100 border border-amber-500 text-amber-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-700 animate-spin" />
                      ⏰ Time's Up! 10 seconds expired for this question.
                    </span>
                  </div>
                )}

                {selectedOption !== null && (
                  <div className="p-4 rounded-xl bg-[#F9F4EE] border border-[#1A100C]/15 space-y-3 animate-in fade-in">
                    <p className="text-xs text-[#2B231F] leading-relaxed">
                      💡 <strong>Insight:</strong> {currentQuestion.explanation}
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1A100C] font-bold text-xs uppercase tracking-wider hover:shadow-md transition-all"
                      >
                        {quizIdx + 1 < QUIZ_QUESTIONS.length ? 'Next Question →' : 'Finish Quiz'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* GAME TAB 2: WORD SCRAMBLE */}
        {activeGameTab === 'scramble' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#1A100C]/15 shadow-md">
            {scrambleFinished ? (
              <div className="text-center py-8 space-y-4">
                <Trophy className="w-16 h-16 text-[#D4AF37] mx-auto animate-bounce" />
                <h3 className="font-serif text-2xl font-bold text-[#1A100C]">
                  Vocabulary Challenge Complete!
                </h3>
                <p className="text-lg text-[#C2593F] font-semibold">
                  Your Scramble Score: {scrambleScore} Points
                </p>
                <button
                  onClick={restartScramble}
                  className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1A100C] font-extrabold text-xs uppercase tracking-wider hover:shadow-md inline-flex items-center gap-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Play Scramble Again
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-[#1A100C] font-bold pb-3 border-b border-[#1A100C]/15">
                  <span>Word {scrambleIdx + 1} of {WORD_SCRAMBLE_ITEMS.length}</span>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                      scrambleTimer <= 3 ? 'bg-rose-100 text-rose-700 border-rose-400 animate-pulse' : 'bg-[#F9F4EE] text-[#1A100C] border-[#1A100C]/15'
                    }`}>
                      <Clock className="w-3.5 h-3.5 text-[#C2593F]" />
                      <span>{scrambleTimer}s</span>
                    </div>
                    <span className="bg-[#F9F4EE] px-3 py-1 rounded border border-[#1A100C]/15">
                      Score: {scrambleScore} pts
                    </span>
                  </div>
                </div>

                {/* 10-second timer countdown bar */}
                <div className="w-full bg-[#1A100C]/10 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      scrambleTimer <= 3 ? 'bg-rose-500' : 'bg-[#D4AF37]'
                    }`}
                    style={{ width: `${(scrambleTimer / 10) * 100}%` }}
                  />
                </div>

                <div className="text-center py-6 bg-[#F9F4EE] rounded-2xl border border-[#1A100C]/15">
                  <span className="text-xs uppercase tracking-widest text-[#C2593F] font-bold">
                    Unscramble the Cultural Term:
                  </span>
                  <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#1A100C] tracking-widest my-3">
                    {currentScramble.scrambled}
                  </div>
                  {showHint ? (
                    <p className="text-xs text-[#2B231F] bg-white px-4 py-2 rounded-lg inline-block border border-[#1A100C]/15">
                      💡 <strong>Hint:</strong> {currentScramble.hint}
                    </p>
                  ) : (
                    <button
                      onClick={() => setShowHint(true)}
                      className="text-xs text-[#C2593F] underline hover:text-[#9A3B1B] flex items-center gap-1 mx-auto font-bold"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Reveal Hint (-10 pts)
                    </button>
                  )}
                </div>

                <form onSubmit={handleScrambleSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scrambleInput}
                      onChange={(e) => setScrambleInput(e.target.value)}
                      placeholder="Type unscrambled word..."
                      disabled={scrambleFeedback === 'correct' || scrambleFeedback === 'timeout'}
                      className="flex-1 bg-white border border-[#1A100C]/20 rounded-xl px-4 py-3 text-sm text-[#1A100C] focus:border-[#C2593F] uppercase tracking-wider font-bold disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={scrambleFeedback === 'correct' || scrambleFeedback === 'timeout'}
                      className="px-6 py-3 rounded-xl bg-[#C2593F] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9A3B1B] transition-colors disabled:opacity-50"
                    >
                      Check Word
                    </button>
                  </div>
                </form>

                {scrambleFeedback === 'correct' && (
                  <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-500 text-emerald-900 text-xs space-y-2">
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Correct Answer!
                    </div>
                    <p>{currentScramble.meaning}</p>
                    <button
                      onClick={handleNextScramble}
                      className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase"
                    >
                      {scrambleIdx + 1 < WORD_SCRAMBLE_ITEMS.length ? 'Next Word →' : 'Complete Game'}
                    </button>
                  </div>
                )}

                {scrambleFeedback === 'timeout' && (
                  <div className="p-4 rounded-xl bg-amber-100 border border-amber-500 text-amber-900 text-xs space-y-2 animate-in fade-in">
                    <div className="font-bold text-sm flex items-center gap-1.5 text-amber-800">
                      <Clock className="w-4 h-4 text-amber-700 animate-spin" /> ⏰ Time's Up! (10s Expired)
                    </div>
                    <p>The correct answer was: <strong className="uppercase">{currentScramble.word}</strong> — {currentScramble.meaning}</p>
                    <button
                      onClick={handleNextScramble}
                      className="mt-2 px-4 py-2 rounded-lg bg-amber-800 text-white font-bold text-xs uppercase hover:bg-amber-900 transition-colors"
                    >
                      {scrambleIdx + 1 < WORD_SCRAMBLE_ITEMS.length ? 'Next Word →' : 'Complete Game'}
                    </button>
                  </div>
                )}

                {scrambleFeedback === 'incorrect' && (
                  <div className="p-3 rounded-xl bg-rose-100 border border-rose-500 text-rose-900 text-xs flex items-center justify-between">
                    <span>Incorrect guess. Check spelling and try again!</span>
                    <button onClick={() => setScrambleFeedback(null)} className="underline text-rose-800 font-bold">
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* GAME TAB 3: CAMEL CARAVAN ADVENTURE */}
        {activeGameTab === 'caravan' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 border border-[#1A100C]/15 shadow-md space-y-4">
            
            {/* Top Bar Stats */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1A100C]/15 text-xs font-bold text-[#1A100C]">
              <div className="flex items-center gap-4">
                <span><span className="inline-block transform -scale-x-100">🐪</span> Camel Caravan Quest</span>
                <span className="text-[#C2593F]">Score: {caravanScore}</span>
                <span className="text-[#9A3B1B]">Relics: {artifactsCollected} / 5</span>
              </div>
              <div className="flex items-center gap-1 text-rose-600">
                <span>Stamina/Lives:</span>
                {'❤️'.repeat(caravanLives)}
              </div>
            </div>

            {/* Canvas Stage or Start Screen */}
            <div className="relative w-full aspect-[16/8] max-h-[360px] bg-[#F9F4EE] rounded-xl overflow-hidden border border-[#1A100C]/15 flex items-center justify-center">
              {!caravanPlaying && !caravanGameOver && !caravanWon && (
                <div className="text-center p-6 space-y-3 z-20">
                  <div className="text-4xl"><span className="inline-block transform -scale-x-100">🐫</span> 🏜️</div>
                  <h3 className="font-serif text-2xl font-bold text-[#1A100C]">
                    Camel Caravan Desert Quest
                  </h3>
                  <p className="text-xs text-[#2B231F]/90 max-w-md mx-auto">
                    Navigate your camel caravan across golden dunes. Collect 5 sacred Balochi cultural artifacts (Suroz, Silk Duch, Sajji) while dodging reddish sandstorms!
                  </p>
                  <button
                    onClick={initCaravanGame}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C2593F] to-[#9A3B1B] text-white font-bold text-xs uppercase tracking-wider hover:shadow-md transition-all"
                  >
                    Start Caravan Journey
                  </button>
                </div>
              )}

              {caravanGameOver && (
                <div className="text-center p-6 space-y-3 z-20 bg-white/95 w-full h-full flex flex-col items-center justify-center">
                  <div className="text-4xl">🌪️ <span className="inline-block transform -scale-x-100">🐫</span></div>
                  <h3 className="font-serif text-2xl font-bold text-rose-600">
                    Caught in the Sandstorm!
                  </h3>
                  <p className="text-xs text-[#2B231F]">
                    Your caravan lost its way in the desert storm. Collected relics: {artifactsCollected}/5.
                  </p>
                  <button
                    onClick={initCaravanGame}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1A100C] font-bold text-xs uppercase"
                  >
                    Try Caravan Quest Again
                  </button>
                </div>
              )}

              {caravanWon && (
                <div className="text-center p-6 space-y-3 z-20 bg-white/95 w-full h-full flex flex-col items-center justify-center">
                  <Trophy className="w-12 h-12 text-[#D4AF37] mx-auto animate-bounce" />
                  <h3 className="font-serif text-2xl font-bold text-[#1A100C]">
                    Caravan Reached the Oasis!
                  </h3>
                  <p className="text-xs text-[#2B231F]">
                    You safely gathered all 5 cultural relics and preserved Balochi heritage! Score: {caravanScore}
                  </p>
                  <button
                    onClick={initCaravanGame}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1A100C] font-bold text-xs uppercase"
                  >
                    Play Again
                  </button>
                </div>
              )}

              <canvas
                ref={canvasRef}
                width={760}
                height={320}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Controls Bar for Touch/Click */}
            {caravanPlaying && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#2B231F]/80 font-medium">
                  Use Arrow Keys or buttons on right:
                </span>
                <div className="grid grid-cols-3 gap-1 w-32">
                  <div />
                  <button
                    onClick={() => moveCamel('up')}
                    className="p-2 rounded-lg bg-[#1A100C] text-[#D4AF37] flex items-center justify-center active:bg-[#C2593F] transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <div />
                  <button
                    onClick={() => moveCamel('left')}
                    className="p-2 rounded-lg bg-[#1A100C] text-[#D4AF37] flex items-center justify-center active:bg-[#C2593F] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveCamel('down')}
                    className="p-2 rounded-lg bg-[#1A100C] text-[#D4AF37] flex items-center justify-center active:bg-[#C2593F] transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveCamel('right')}
                    className="p-2 rounded-lg bg-[#1A100C] text-[#D4AF37] flex items-center justify-center active:bg-[#C2593F] transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
