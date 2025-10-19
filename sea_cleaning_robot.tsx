import React, { useState, useCallback } from 'react';
import { Zap, RotateCw, ChevronUp, ChevronRight, ChevronDown, ChevronLeft, Hand, Trophy, RotateCcw } from 'lucide-react';

interface Waste {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  type: 'bottle' | 'tire' | 'can' | 'bag';
}

interface Robot {
  x: number;
  y: number;
  direction: 'up' | 'right' | 'down' | 'left';
}

interface Score {
  name: string;
  score: number;
  class: string;
}

const wasteEmojis = {
  bottle: '🍾',
  tire: '🛞',
  can: '🥫',
  bag: '🛍️',
};

export default function SeaCleaningRobot() {
  const GRID_SIZE = 6;
  const [robot, setRobot] = useState<Robot>({ x: 0, y: 0, direction: 'right' });
  const [waste, setWaste] = useState<Waste[]>(() => {
    const initialWaste: Waste[] = [];
    const types: ('bottle' | 'tire' | 'can' | 'bag')[] = ['bottle', 'tire', 'can', 'bag'];
    for (let i = 0; i < 8; i++) {
      initialWaste.push({
        id: i,
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        collected: false,
        type: types[i % 4],
      });
    }
    return initialWaste;
  });
  const [commands, setCommands] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [collected, setCollected] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [playerSurname, setPlayerSurname] = useState('');
  const [playerClass, setPlayerClass] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [topScores, setTopScores] = useState<Score[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[][]>([]);

  // LocalStorage'dan skorları yükle
  React.useEffect(() => {
    const savedScores = localStorage.getItem('topScores');
    if (savedScores) {
      setTopScores(JSON.parse(savedScores));
    } else {
      setTopScores([
        { name: 'Ahmet Yıldız', score: 8, class: '2-A' },
        { name: 'Zeynep Kara', score: 8, class: '2-B' },
        { name: 'Mehmet Demir', score: 7, class: '1-A' },
        { name: 'Ayşe Çelik', score: 7, class: '1-B' },
        { name: 'Ali Şahin', score: 6, class: '2-A' },
      ]);
    }
  }, []);

  // Skor tamamlandığında kaydet
  React.useEffect(() => {
    if (collected === waste.length && collected > 0 && playerName && playerSurname) {
      const newScore: Score = {
        name: `${playerName} ${playerSurname}`,
        score: collected,
        class: playerClass,
      };
      
      const updatedScores = [...topScores, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      setTopScores(updatedScores);
      localStorage.setItem('topScores', JSON.stringify(updatedScores));
    }
  }, [collected, waste.length, playerName, playerSurname, playerClass]);

  // Klavye kontrolü
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isExecuting || !gameStarted) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          addCommand('yukarı');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          addCommand('aşağı');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          addCommand('sağ');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          addCommand('sol');
          break;
        case ' ':
        case 'e':
        case 'E':
          e.preventDefault();
          addCommand('topla');
          break;
        case 'Enter':
          if (commands.length > 0) {
            executeCommands();
          }
          break;
        case 'Escape':
          clearCommands();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isExecuting, gameStarted, commands]);

  const moveRight = useCallback(() => {
    setRobot((prev) => ({
      ...prev,
      x: Math.min(prev.x + 1, GRID_SIZE - 1),
      direction: 'right',
    }));
  }, []);

  const moveLeft = useCallback(() => {
    setRobot((prev) => ({
      ...prev,
      x: Math.max(prev.x - 1, 0),
      direction: 'left',
    }));
  }, []);

  const moveUp = useCallback(() => {
    setRobot((prev) => ({
      ...prev,
      y: Math.max(prev.y - 1, 0),
      direction: 'up',
    }));
  }, []);

  const moveDown = useCallback(() => {
    setRobot((prev) => ({
      ...prev,
      y: Math.min(prev.y + 1, GRID_SIZE - 1),
      direction: 'down',
    }));
  }, []);

  const playMoveSound = useCallback(() => {
    try {
      const ctx = new (window as any).AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 400;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Audio not available
    }
  }, []);

  const playCollectSound = useCallback(() => {
    try {
      const ctx = new (window as any).AudioContext();
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, index) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.15);
        }, index * 100);
      });
    } catch (e) {
      // Audio not available
    }
  }, []);

  const collectWaste = useCallback(() => {
    setWaste((prev) => {
      const wasteAtPosition = prev.find(w => w.x === robot.x && w.y === robot.y && !w.collected);
      
      if (wasteAtPosition) {
        playCollectSound();
        setCollected(c => c + 1);
        return prev.map((w) => {
          if (w.id === wasteAtPosition.id) {
            return { ...w, collected: true };
          }
          return w;
        });
      }
      
      return prev;
    });
  }, [robot, playCollectSound]);

  const addCommand = (cmd: string) => {
    if (commands.length < 15) {
      setCommands([...commands, cmd]);
    }
  };

  const executeCommands = async () => {
    setIsExecuting(true);
    setCommandHistory(prev => [...prev, commands]);

    for (const cmd of commands) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (cmd === 'yukarı') {
        moveUp();
        playMoveSound();
      } else if (cmd === 'aşağı') {
        moveDown();
        playMoveSound();
      } else if (cmd === 'sağ') {
        moveRight();
        playMoveSound();
      } else if (cmd === 'sol') {
        moveLeft();
        playMoveSound();
      } else if (cmd === 'topla') {
        collectWaste();
      }
    }

    setIsExecuting(false);
  };

  const reset = () => {
    setRobot({ x: 0, y: 0, direction: 'right' });
    setCommands([]);
    setCollected(0);
    setWaste((prev) =>
      prev.map((w) => ({
        ...w,
        collected: false,
      }))
    );
  };

  const clearCommands = () => {
    setCommands([]);
    setCollected(0);
  };

  const getDirectionIcon = (dir: string) => {
    switch (dir) {
      case 'up':
        return <ChevronUp className="w-6 h-6" />;
      case 'right':
        return <ChevronRight className="w-6 h-6" />;
      case 'down':
        return <ChevronDown className="w-6 h-6" />;
      case 'left':
        return <ChevronLeft className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 p-8">
      <div className="max-w-6xl mx-auto">
        {!gameStarted && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-700 to-indigo-900 p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-cyan-400">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Oyuncu Bilgileri</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-bold mb-2">Adı:</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-blue-900 text-white border-2 border-cyan-300 focus:outline-none focus:border-yellow-300 placeholder-gray-400"
                    placeholder="Adını gir..."
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-2">Soyadı:</label>
                  <input
                    type="text"
                    value={playerSurname}
                    onChange={(e) => setPlayerSurname(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-blue-900 text-white border-2 border-cyan-300 focus:outline-none focus:border-yellow-300 placeholder-gray-400"
                    placeholder="Soyadını gir..."
                  />
                </div>
                <div>
                  <label className="block text-white font-bold mb-2">Sınıfı:</label>
                  <input
                    type="text"
                    value={playerClass}
                    onChange={(e) => setPlayerClass(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-blue-900 text-white border-2 border-cyan-300 focus:outline-none focus:border-yellow-300 placeholder-gray-400"
                    placeholder="Sınıfını gir (ör: 5-A)..."
                  />
                </div>
                <button
                  onClick={() => {
                    if (playerName && playerSurname && playerClass) {
                      setGameStarted(true);
                    }
                  }}
                  disabled={!playerName || !playerSurname || !playerClass}
                  className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 mt-6 text-lg"
                >
                  Başla 🚀
                </button>
              </div>
            </div>
          </div>
        )}

        {gameStarted && (
          <>
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="w-10 h-10 text-yellow-300 animate-pulse" />
                <div className="text-center">
                  <h1 className="text-5xl font-bold text-white drop-shadow-lg">Fırat'ı Koru</h1>
                  <h2 className="text-4xl font-bold text-cyan-300 drop-shadow-lg">Save the Euphrates</h2>
                </div>
                <Zap className="w-10 h-10 text-yellow-300 animate-pulse" />
              </div>
              <p className="text-cyan-200 text-lg">Robota komutlar vererek Fırat Nehri'ni temizleyelim! 🌊</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 flex justify-center">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-300 p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform">
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                      const x = i % GRID_SIZE;
                      const y = Math.floor(i / GRID_SIZE);
                      const isRobot = robot.x === x && robot.y === y;
                      const wasteHere = waste.find((w) => w.x === x && w.y === y && !w.collected);

                      return (
                        <div
                          key={i}
                          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg border-2 border-cyan-300 flex items-center justify-center relative overflow-hidden shadow-lg"
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-transparent animate-pulse" />

                          {isRobot && (
                            <div className="animate-bounce z-20 text-3xl" style={{ animationDuration: '0.6s' }}>
                              🤖
                            </div>
                          )}

                          {wasteHere && (
                            <div className="animate-spin z-10 text-2xl" style={{ animationDuration: '2s' }}>
                              {wasteEmojis[wasteHere.type]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-2xl shadow-xl text-white">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    Robot Durumu
                  </h2>
                  <div className="space-y-3 text-lg">
                    <div className="flex justify-between items-center bg-black/30 p-3 rounded-lg">
                      <span>Konum:</span>
                      <span className="font-bold text-cyan-300">({robot.x}, {robot.y})</span>
                    </div>
                    <div className="flex justify-between items-center bg-black/30 p-3 rounded-lg">
                      <span>Yön:</span>
                      <span className="text-2xl">{getDirectionIcon(robot.direction)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-black/30 p-3 rounded-lg">
                      <span>Toplanan:</span>
                      <span className="font-bold text-lime-300">{collected}/{waste.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-2xl font-bold text-white mb-4">Komutlar</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => addCommand('yukarı')}
                      disabled={isExecuting || commands.length >= 15}
                      className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ChevronUp className="w-5 h-5" />
                      Yukarı
                    </button>
                    <button
                      onClick={() => addCommand('aşağı')}
                      disabled={isExecuting || commands.length >= 15}
                      className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ChevronDown className="w-5 h-5" />
                      Aşağı
                    </button>
                    <button
                      onClick={() => addCommand('sağ')}
                      disabled={isExecuting || commands.length >= 15}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ChevronRight className="w-5 h-5" />
                      Sağa
                    </button>
                    <button
                      onClick={() => addCommand('sol')}
                      disabled={isExecuting || commands.length >= 15}
                      className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Sola
                    </button>
                    <button
                      onClick={() => addCommand('topla')}
                      disabled={isExecuting || commands.length >= 15}
                      className="col-span-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Hand className="w-5 h-5" />
                      Topla
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-6 rounded-2xl shadow-xl text-white max-h-48 overflow-y-auto">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <RotateCw className="w-5 h-5" />
                    Komut Sırası
                  </h3>
                  <div className="space-y-2">
                    {commands.length === 0 ? (
                      <p className="text-gray-200 italic">Komut ekleyin...</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {commands.map((cmd, i) => (
                          <span
                            key={i}
                            className="bg-black/40 px-3 py-1 rounded-full text-sm font-semibold animate-pulse"
                          >
                            {i + 1}. {cmd}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={executeCommands}
                  disabled={isExecuting || commands.length === 0}
                  className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 disabled:opacity-50 text-white font-bold py-4 text-lg rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  ▶ Çalıştır
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={clearCommands}
                    disabled={isExecuting}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-all"
                  >
                    Temizle
                  </button>
                  <button
                    onClick={reset}
                    disabled={isExecuting}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Sıfırla
                  </button>
                </div>

                {collected === waste.length && collected > 0 && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-lg text-center animate-bounce">
                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
                      <Trophy className="w-8 h-8" />
                      Tebrikler! 🎉
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-yellow-600 to-yellow-500 p-6 rounded-2xl shadow-xl text-white text-center border-4 border-yellow-300">
              <h3 className="text-2xl font-bold">👤 Oyuncu Profili</h3>
              <p className="text-lg mt-2">
                <span className="font-bold text-white">{playerName} {playerSurname}</span>
                <span className="mx-3">|</span>
                <span className="font-bold text-blue-900">Sınıf: {playerClass}</span>
              </p>
            </div>

            {commandHistory.length > 0 && (
              <div className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-xl text-white border-2 border-purple-300">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  📜 Komut Geçmişi
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {commandHistory.map((cmds, idx) => (
                    <div key={idx} className="bg-black/30 p-3 rounded-lg">
                      <span className="font-bold text-cyan-300">Deneme {idx + 1}: </span>
                      <span className="text-sm">{cmds.join(' → ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 p-8 rounded-2xl shadow-2xl border-4 border-lime-300 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
              <div className="relative z-10">
                <h3 className="text-4xl font-black text-white text-center mb-6 drop-shadow-lg animate-bounce">
                  🏆 SKOR TABLOSU 🏆
                </h3>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-black/40 backdrop-blur p-6 rounded-xl text-center transform hover:scale-110 transition-transform">
                    <p className="text-yellow-200 text-lg font-bold">Toplanan Atık</p>
                    <p className="text-5xl font-black text-lime-300 mt-3 animate-pulse">{collected}</p>
                    <p className="text-yellow-200 text-sm mt-2">/ {waste.length}</p>
                  </div>
                  <div className="bg-black/40 backdrop-blur p-6 rounded-xl text-center transform hover:scale-110 transition-transform">
                    <p className="text-yellow-200 text-lg font-bold">Komut Sayısı</p>
                    <p className="text-5xl font-black text-blue-300 mt-3 animate-pulse">{commands.length}</p>
                    <p className="text-yellow-200 text-sm mt-2">/ 15</p>
                  </div>
                  <div className="bg-black/40 backdrop-blur p-6 rounded-xl text-center transform hover:scale-110 transition-transform">
                    <p className="text-yellow-200 text-lg font-bold">Verimlilik</p>
                    <p className="text-5xl font-black text-orange-300 mt-3 animate-pulse">
                      {commands.length > 0 ? Math.round((collected / commands.length) * 100) : 0}%
                    </p>
                    <p className="text-yellow-200 text-sm mt-2">Başarı Oranı</p>
                  </div>
                </div>

                <div className="bg-black/50 backdrop-blur-md p-6 rounded-xl mt-6">
                  <h4 className="text-2xl font-bold text-white mb-4 text-center">🌟 EN İYİ 10 OYUNCU 🌟</h4>
                  <div className="space-y-2">
                    {topScores.map((score, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3 rounded-lg border-l-4 border-yellow-300 hover:bg-gradient-to-r hover:from-yellow-500/30 hover:to-orange-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black w-8 text-center">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </span>
                          <div>
                            <p className="font-bold text-white">{score.name}</p>
                            <p className="text-sm text-yellow-200">Sınıf: {score.class}</p>
                          </div>
                        </div>
                        <span className="text-3xl font-black text-lime-300">{score.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-indigo-900 to-purple-900 p-8 rounded-2xl shadow-2xl text-white border-2 border-purple-500">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-8 h-8 text-yellow-300" />
                Kazanımlar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                <div className="bg-black/30 p-4 rounded-lg backdrop-blur">✅ <span className="font-semibold">Algoritma Mantığı:</span> Adım adım komutlarla problemler çöz</div>
                <div className="bg-black/30 p-4 rounded-lg backdrop-blur">✅ <span className="font-semibold">Sıralama & Dizi:</span> Komut sırasının önemini öğren</div>
                <div className="bg-black/30 p-4 rounded-lg backdrop-blur">✅ <span className="font-semibold">Hesaplamalı Düşünme:</span> Problemi parçalara böl, çöz</div>
                <div className="bg-black/30 p-4 rounded-lg backdrop-blur">✅ <span className="font-semibold">Çevre Bilinci:</span> Fırat Nehri'ni korumak</div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-cyan-800 to-blue-900 p-6 rounded-2xl shadow-xl text-white border-2 border-cyan-400">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                ⌨️ Klavye Kısayolları
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-black/30 p-2 rounded">
                  <kbd className="bg-white/20 px-2 py-1 rounded">↑</kbd> / <kbd className="bg-white/20 px-2 py-1 rounded">W</kbd> : Yukarı
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <kbd className="bg-white/20 px-2 py-1 rounded">↓</kbd> / <kbd className="bg-white/20 px-2 py-1 rounded">S</kbd> : Aşağı
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <kbd className="bg-white/20 px-2 py-1 rounded">→</kbd> / <kbd className="bg-white/20 px-2 py-1 rounded">D</kbd> : Sağ
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <kbd className="bg-white/20 px-2 py-1 rounded">←</kbd> / <kbd className="bg-white/20 px-2 py-1 rounded">A</kbd> : Sol
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <kbd className="bg-white/20 px-2 py-1 rounded">Space</kbd> / <kbd className="bg-white/20 px-2 py-1 rounded">E</kbd> : Topla
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <kbd className="bg-white/20 px-2 py-1 rounded">Enter</kbd> : Çalıştır
                </div>
                <div className="bg-black/30 p-2 rounded">
                  <kbd className="bg-white/20 px-2 py-1 rounded">Esc</kbd> : Temizle
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}