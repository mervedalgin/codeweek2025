import React, { useState, useCallback } from 'react';
import { Zap, ChevronUp, ChevronRight, ChevronDown, ChevronLeft, Hand, Trophy, RotateCcw } from 'lucide-react';
import 'flag-icons/css/flag-icons.min.css';
import toast, { Toaster } from 'react-hot-toast';

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
  tire: '🍌',
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
  const [gameStarted, setGameStarted] = useState(true);
  const [topScores, setTopScores] = useState<Score[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[][]>([]);
  const [language, setLanguage] = useState<'tr' | 'en' | 'ar'>('tr');
  const [isPlayerSaved, setIsPlayerSaved] = useState(false);

  const translations = {
    tr: {
      title: 'Fırat\'ı Koru',
      subtitle: 'Save the Euphrates',
      description: 'Robota komutlar vererek Fırat Nehri\'ni temizleyelim!',
      up: 'Yukarı',
      down: 'Aşağı',
      right: 'Sağ',
      left: 'Sol',
      collect: 'Topla',
      run: 'Çalıştır',
      clear: 'Temizle',
      reset: 'Sıfırla',
      player: 'Oyuncu',
      name: 'Ad',
      surname: 'Soyad',
      class: 'Sınıf',
      save: 'Kaydet',
      newPlayer: 'Yeni Oyuncu',
      commandOrder: 'Komut Sırası',
      addCommand: 'Komut ekleyin...',
      robotStatus: 'Robot Durumu',
      position: 'Konum',
      collected: 'Toplanan',
      commands: 'Komutlar',
      congratulations: 'Tebrikler!',
      commandHistory: 'Komut Geçmişi',
      attempt: 'Deneme',
      scoreBoard: 'SKOR TABLOSU',
      collectedWaste: 'Toplanan Atık',
      commandCount: 'Komut Sayısı',
      efficiency: 'Verimlilik',
      successRate: 'Başarı Oranı',
      topPlayers: 'EN İYİ 10 OYUNCU',
      learningOutcomes: 'Öğrenme Kazanımları',
      algorithmLogic: 'Algoritma Mantığı',
      algorithmDesc: 'Adım adım komutlarla problemleri çözmeyi öğren',
      sortingArrays: 'Sıralama & Dizi Yapıları',
      sortingDesc: 'Komut sırasının önemini ve dizileri keşfet',
      computationalThinking: 'Hesaplamalı Düşünme',
      computationalDesc: 'Büyük problemleri küçük parçalara böl ve çöz',
      environmentalAwareness: 'Çevre Bilinci',
      environmentalDesc: 'Fırat Nehri\'ni koruma ve doğa sevgisi',
      problemSolving: 'Problem Çözme',
      problemSolvingDesc: 'Yaratıcı çözümler üret ve stratejiler geliştir',
      keyboardShortcuts: 'Klavye Kısayolları',
      fillAllFields: 'Lütfen tüm bilgileri doldurun!',
      playerSaved: 'Oyuncu bilgileri kaydedildi',
      playerNotSaved: '🤖 Eyyy dostum! Robotu harekete geçirmek için önce kim olduğunu yaz! 😊',
      addCommandFirst: 'Önce komut ekleyin!',
      howToPlay: 'Nasıl Oynanır?',
      howToPlayStep1: '1️⃣ Komut Ekle',
      howToPlayStep1Desc: 'Yukarı, Aşağı, Sağ, Sol ve Topla butonlarına tıklayarak komut sırasına ekleyin',
      howToPlayStep2: '2️⃣ Çalıştır',
      howToPlayStep2Desc: 'Yeşil "Çalıştır" butonuna basarak robotun komutları uygulamasını izleyin',
      howToPlayStep3: '3️⃣ Atık Topla',
      howToPlayStep3Desc: 'Robotu atıkların bulunduğu karelere götürün ve "Topla" komutu ile temizleyin',
      howToPlayStep4: '4️⃣ Tamamla',
      howToPlayStep4Desc: '8 atığı da toplayarak Fırat Nehri\'ni temizleyin ve skorunuzu kaydedin!',
      about: 'Hakkında',
      aboutContent: 'Fırat\'ı Koru - Save the Euphrates, çocukların teknoloji ve çevre bilincini birleştirerek, 21. yüzyıl becerilerini geliştirmelerine yardımcı olur. Avrupa Kod Haftası\'nın "Mavi Yeşil Vatan" teması çerçevesinde, bu proje hem eğitici hem de ilham verici bir deneyim sunmaktadır.',
      aboutFooter: '🌊💚 Fırat Nehri\'mizi birlikte koruyalım! 💚🌊',
      aboutCreator: 'Mehmet Dalğın - Dumlupınar İlkokulu',
    },
    en: {
      title: 'Save the Euphrates',
      subtitle: 'Fırat\'ı Koru',
      description: 'Clean the Euphrates River by commanding the robot!',
      up: 'Up',
      down: 'Down',
      right: 'Right',
      left: 'Left',
      collect: 'Collect',
      run: 'Run',
      clear: 'Clear',
      reset: 'Reset',
      player: 'Player',
      name: 'Name',
      surname: 'Surname',
      class: 'Class',
      save: 'Save',
      newPlayer: 'New Player',
      commandOrder: 'Command Queue',
      addCommand: 'Add commands...',
      robotStatus: 'Robot Status',
      position: 'Position',
      collected: 'Collected',
      commands: 'Commands',
      congratulations: 'Congratulations!',
      commandHistory: 'Command History',
      attempt: 'Attempt',
      scoreBoard: 'SCOREBOARD',
      collectedWaste: 'Collected Waste',
      commandCount: 'Command Count',
      efficiency: 'Efficiency',
      successRate: 'Success Rate',
      topPlayers: 'TOP 10 PLAYERS',
      learningOutcomes: 'Learning Outcomes',
      algorithmLogic: 'Algorithm Logic',
      algorithmDesc: 'Learn to solve problems with step-by-step commands',
      sortingArrays: 'Sorting & Array Structures',
      sortingDesc: 'Discover the importance of command order and arrays',
      computationalThinking: 'Computational Thinking',
      computationalDesc: 'Break down big problems into smaller pieces and solve',
      environmentalAwareness: 'Environmental Awareness',
      environmentalDesc: 'Protecting the Euphrates River and love for nature',
      problemSolving: 'Problem Solving',
      problemSolvingDesc: 'Create creative solutions and develop strategies',
      keyboardShortcuts: 'Keyboard Shortcuts',
      fillAllFields: 'Please fill all fields!',
      playerSaved: 'Player information saved',
      playerNotSaved: '🤖 Hey buddy! Tell me who you are first before you move the robot! 😊',
      addCommandFirst: 'Add commands first!',
      howToPlay: 'How to Play?',
      howToPlayStep1: '1️⃣ Add Commands',
      howToPlayStep1Desc: 'Click Up, Down, Right, Left and Collect buttons to add to command queue',
      howToPlayStep2: '2️⃣ Execute',
      howToPlayStep2Desc: 'Press green "Run" button to watch the robot execute your commands',
      howToPlayStep3: '3️⃣ Collect Waste',
      howToPlayStep3Desc: 'Move robot to squares with waste and clean with "Collect" command',
      howToPlayStep4: '4️⃣ Complete',
      howToPlayStep4Desc: 'Collect all 8 waste items to clean the Euphrates River and save your score!',
      about: 'About',
      aboutContent: 'Save the Euphrates helps children develop 21st century skills by combining technology and environmental awareness. Within the framework of the EU Code Week\'s "Blue Green Homeland" theme, this project offers both an educational and inspiring experience.',
      aboutFooter: '🌊💚 Let\'s protect our Euphrates River together! 💚🌊',
      aboutCreator: 'Mehmet Dalğın - Dumlupınar Primary School',
    },
    ar: {
      title: 'احمِ الفرات',
      subtitle: 'Save the Euphrates',
      description: 'لنظف نهر الفرات من خلال إعطاء الأوامر للروبوت!',
      up: 'أعلى',
      down: 'أسفل',
      right: 'يمين',
      left: 'يسار',
      collect: 'جمع',
      run: 'تشغيل',
      clear: 'مسح',
      reset: 'إعادة',
      player: 'لاعب',
      name: 'الاسم',
      surname: 'اللقب',
      class: 'الصف',
      save: 'حفظ',
      newPlayer: 'لاعب جديد',
      commandOrder: 'قائمة الأوامر',
      addCommand: 'أضف الأوامر...',
      robotStatus: 'حالة الروبوت',
      position: 'الموقع',
      collected: 'تم جمعه',
      commands: 'الأوامر',
      congratulations: 'تهانينا!',
      commandHistory: 'سجل الأوامر',
      attempt: 'محاولة',
      scoreBoard: 'لوحة النتائج',
      collectedWaste: 'النفايات المجمعة',
      commandCount: 'عدد الأوامر',
      efficiency: 'الكفاءة',
      successRate: 'معدل النجاح',
      topPlayers: 'أفضل 10 لاعبين',
      learningOutcomes: 'نتائج التعلم',
      algorithmLogic: 'منطق الخوارزمية',
      algorithmDesc: 'تعلم حل المشاكل بالأوامر خطوة بخطوة',
      sortingArrays: 'الفرز وهياكل المصفوفات',
      sortingDesc: 'اكتشف أهمية ترتيب الأوامر والمصفوفات',
      computationalThinking: 'التفكير الحسابي',
      computationalDesc: 'قسم المشاكل الكبيرة إلى أجزاء صغيرة وحلها',
      environmentalAwareness: 'الوعي البيئي',
      environmentalDesc: 'حماية نهر الفرات وحب الطبيعة',
      problemSolving: 'حل المشاكل',
      problemSolvingDesc: 'إنشاء حلول إبداعية وتطوير استراتيجيات',
      keyboardShortcuts: 'اختصارات لوحة المفاتيح',
      fillAllFields: 'يرجى ملء جميع الحقول!',
      playerSaved: 'تم حفظ معلومات اللاعب',
      playerNotSaved: '🤖 يا صديقي! اكتب من أنت أولاً قبل تحريك الروبوت! 😊',
      addCommandFirst: 'أضف الأوامر أولاً!',
      howToPlay: 'كيف تلعب؟',
      howToPlayStep1: '1️⃣ أضف الأوامر',
      howToPlayStep1Desc: 'انقر على أزرار أعلى، أسفل، يمين، يسار وجمع لإضافتها إلى قائمة الأوامر',
      howToPlayStep2: '2️⃣ نفذ',
      howToPlayStep2Desc: 'اضغط على زر "تشغيل" الأخضر لمشاهدة الروبوت ينفذ أوامرك',
      howToPlayStep3: '3️⃣ جمع النفايات',
      howToPlayStep3Desc: 'حرك الروبوت إلى المربعات التي تحتوي على نفايات ونظفها بأمر "جمع"',
      howToPlayStep4: '4️⃣ أكمل',
      howToPlayStep4Desc: 'اجمع جميع النفايات الـ8 لتنظيف نهر الفرات واحفظ نتيجتك!',
      about: 'حول',
      aboutContent: 'احمِ الفرات يساعد الأطفال على تطوير مهارات القرن الحادي والعشرين من خلال الجمع بين التكنولوجيا والوعي البيئي. ضمن إطار موضوع أسبوع الكود الأوروبي "الوطن الأزرق الأخضر"، يقدم هذا المشروع تجربة تعليمية وملهمة.',
      aboutFooter: '🌊💚 لنحمي نهر الفرات معاً! 💚🌊',
      aboutCreator: 'محمد دالغين - مدرسة دوملوبينار الابتدائية',
    }
  };

  const t = translations[language];

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
      // Input elementine focus varsa klavye kontrolünü devre dışı bırak
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }
      
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
    setRobot((currentRobot) => {
      setWaste((prev) => {
        const wasteAtPosition = prev.find(w => w.x === currentRobot.x && w.y === currentRobot.y && !w.collected);
        
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
      return currentRobot;
    });
  }, [playCollectSound]);

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

  const startNewGame = () => {
    // Robotu sıfırla
    setRobot({ x: 0, y: 0, direction: 'right' });
    setCommands([]);
    setCollected(0);
    setCommandHistory([]);
    
    // Yeni rastgele atıklar oluştur
    const newWaste: Waste[] = [];
    const types: ('bottle' | 'tire' | 'can' | 'bag')[] = ['bottle', 'tire', 'can', 'bag'];
    for (let i = 0; i < 8; i++) {
      newWaste.push({
        id: i,
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        collected: false,
        type: types[i % 4],
      });
    }
    setWaste(newWaste);
  };

  const clearCommands = () => {
    setCommands([]);
    setCollected(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 p-2 md:p-4 lg:p-8 relative overflow-hidden">
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl font-bold text-cyan-300 whitespace-nowrap"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            CODEWEEK
          </div>
        ))}
      </div>

      {/* Language Selector */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-50">
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-lg rounded-md md:rounded-lg p-0.5 shadow-xl border border-white/30 transition-all duration-300">
          <div className="bg-black/30 backdrop-blur-md rounded-sm md:rounded-md p-1.5 md:p-2 flex gap-1.5 md:gap-2">
            <button
              onClick={() => setLanguage('tr')}
              className={`group relative transition-all duration-300 transform active:scale-95 ${
                language === 'tr' ? 'scale-105' : 'opacity-70'
              }`}
              title="Türkçe"
            >
              <span className={`fi fi-tr fis text-2xl md:text-3xl lg:text-4xl rounded-sm md:rounded-md overflow-hidden border transition-all duration-300 ${
                language === 'tr' 
                  ? 'border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)] brightness-125' 
                  : 'border-white/20 grayscale hover:grayscale-0'
              }`}></span>
              {language === 'tr' && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
              )}
            </button>
            
            <button
              onClick={() => setLanguage('en')}
              className={`group relative transition-all duration-300 transform active:scale-95 ${
                language === 'en' ? 'scale-105' : 'opacity-70'
              }`}
              title="English"
            >
              <span className={`fi fi-gb fis text-2xl md:text-3xl lg:text-4xl rounded-sm md:rounded-md overflow-hidden border transition-all duration-300 ${
                language === 'en' 
                  ? 'border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)] brightness-125' 
                  : 'border-white/20 grayscale'
              }`}></span>
              {language === 'en' && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 md:w-8 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></div>
              )}
            </button>
            
            <button
              onClick={() => setLanguage('ar')}
              className={`group relative transition-all duration-300 transform active:scale-95 ${
                language === 'ar' ? 'scale-105' : 'opacity-70'
              }`}
              title="العربية"
            >
              <span className={`fi fi-sa fis text-2xl md:text-3xl lg:text-4xl rounded-sm md:rounded-md overflow-hidden border transition-all duration-300 ${
                language === 'ar' 
                  ? 'border-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)] brightness-125' 
                  : 'border-white/20 grayscale'
              }`}></span>
              {language === 'ar' && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 md:w-8 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
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
            <div className="text-center mb-4 md:mb-6 animate-fade-in px-2">
              <div className="flex items-center justify-center gap-2 md:gap-4 mb-2">
                <span className="text-3xl md:text-5xl lg:text-6xl animate-bounce" style={{ animationDuration: '2s' }}>🌊</span>
                <div className="text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    CODEWEEK
                  </h1>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-300 drop-shadow-lg mt-1">
                    {t.title} 🤖
                  </h2>
                  <p className="text-sm md:text-lg lg:text-xl text-blue-200 italic mt-1">{t.subtitle}</p>
                </div>
                <span className="text-3xl md:text-5xl lg:text-6xl animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>🌊</span>
              </div>
              <p className="text-sm md:text-base lg:text-lg text-cyan-200 font-semibold" dir={language === 'ar' ? 'rtl' : 'ltr'}>{t.description} 💧</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start justify-center mb-4 md:mb-6 px-2">
              {/* Komut Sırası - Sol taraf */}
              <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl text-white w-full lg:w-64">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  📋 {t.commandOrder}
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {commands.length === 0 ? (
                    <p className="text-gray-200 italic text-sm">{t.addCommand}</p>
                  ) : (
                    <div className="space-y-2">
                      {commands.map((cmd, i) => {
                        const translatedCmd = cmd === 'yukarı' ? t.up : 
                                            cmd === 'aşağı' ? t.down : 
                                            cmd === 'sağ' ? t.right : 
                                            cmd === 'sol' ? t.left : 
                                            cmd === 'topla' ? t.collect : cmd;
                        return (
                          <div
                            key={i}
                            className="bg-black/40 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between"
                          >
                            <span>{i + 1}. {translatedCmd}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Grid - Orta */}
              <div className="flex justify-center w-full lg:w-auto">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-300 p-2 md:p-4 lg:p-6 rounded-xl md:rounded-2xl shadow-2xl">
                  <div className="grid gap-1 md:gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                      const x = i % GRID_SIZE;
                      const y = Math.floor(i / GRID_SIZE);
                      const isRobot = robot.x === x && robot.y === y;
                      const wasteHere = waste.find((w) => w.x === x && w.y === y && !w.collected);

                      return (
                        <div
                          key={i}
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md md:rounded-lg border border-cyan-300 md:border-2 flex items-center justify-center relative overflow-hidden shadow-lg"
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-transparent animate-pulse" />

                          {isRobot && (
                            <div className="animate-bounce z-20 text-xl sm:text-2xl md:text-3xl" style={{ animationDuration: '0.6s' }}>
                              🤖
                            </div>
                          )}

                          {wasteHere && (
                            <div className="animate-spin z-10 text-lg sm:text-xl md:text-2xl" style={{ animationDuration: '2s' }}>
                              {wasteEmojis[wasteHere.type]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Komutlar ve Durum - Orta */}
              <div className="flex flex-col gap-3 md:gap-4 w-full lg:w-auto">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl text-white">
                  <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {t.robotStatus}
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg">
                      <span>{t.position}:</span>
                      <span className="font-bold text-cyan-300">({robot.x}, {robot.y})</span>
                    </div>
                    <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg">
                      <span>{t.collected}:</span>
                      <span className="font-bold text-lime-300">{collected}/{waste.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{t.commands}</h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-2">
                    <button
                      onClick={() => addCommand('yukarı')}
                      disabled={isExecuting || commands.length >= 15}
                      className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 md:py-2 px-2 md:px-3 rounded-lg transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1 text-xs touch-manipulation"
                    >
                      <ChevronUp className="w-5 h-5 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{t.up}</span>
                    </button>
                    <button
                      onClick={() => addCommand('aşağı')}
                      disabled={isExecuting || commands.length >= 15}
                      className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold py-3 md:py-2 px-2 md:px-3 rounded-lg transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1 text-xs touch-manipulation"
                    >
                      <ChevronDown className="w-5 h-5 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{t.down}</span>
                    </button>
                    <button
                      onClick={() => addCommand('sağ')}
                      disabled={isExecuting || commands.length >= 15}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 md:py-2 px-2 md:px-3 rounded-lg transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1 text-xs touch-manipulation"
                    >
                      <ChevronRight className="w-5 h-5 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{t.right}</span>
                    </button>
                    <button
                      onClick={() => addCommand('sol')}
                      disabled={isExecuting || commands.length >= 15}
                      className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-3 md:py-2 px-2 md:px-3 rounded-lg transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1 text-xs touch-manipulation"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">{t.left}</span>
                    </button>
                    <button
                      onClick={() => addCommand('topla')}
                      disabled={isExecuting || commands.length >= 15}
                      className="col-span-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-3 md:py-2 px-3 rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm md:text-sm touch-manipulation"
                    >
                      <Hand className="w-5 h-5 md:w-4 md:h-4" />
                      {t.collect}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isExecuting) return;
                    
                    if (commands.length === 0) {
                      toast.error(t.addCommandFirst, {
                        icon: '⚠️',
                      });
                      return;
                    }
                    
                    if (!isPlayerSaved) {
                      toast(t.playerNotSaved, {
                        icon: '🤖',
                        duration: 4000,
                        style: {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                        },
                      });
                      return;
                    }
                    
                    executeCommands();
                  }}
                  disabled={isExecuting}
                  className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 disabled:opacity-50 text-white font-bold py-3 text-base rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  ▶ {t.run}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={clearCommands}
                    disabled={isExecuting}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-bold py-2 px-3 rounded-lg transition-all text-sm"
                  >
                    {t.clear}
                  </button>
                  <button
                    onClick={reset}
                    disabled={isExecuting}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1 text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t.reset}
                  </button>
                </div>

                {collected === waste.length && collected > 0 && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-lg text-center animate-bounce">
                    <div className="flex items-center justify-center gap-2 text-xl font-bold text-white">
                      <Trophy className="w-6 h-6" />
                      {t.congratulations} 🎉
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 p-4 rounded-xl shadow-xl text-white border-2 border-yellow-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{
                animation: 'shimmer 2s infinite',
                backgroundSize: '200% 100%'
              }}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 flex-wrap mb-3" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <span className="text-xl font-bold">👤 {t.player}:</span>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="bg-white/20 border-2 border-white/40 rounded-lg px-3 py-1 text-white placeholder-white/60 focus:outline-none focus:border-white w-32"
                    placeholder={t.name}
                  />
                  <input
                    type="text"
                    value={playerSurname}
                    onChange={(e) => setPlayerSurname(e.target.value)}
                    className="bg-white/20 border-2 border-white/40 rounded-lg px-3 py-1 text-white placeholder-white/60 focus:outline-none focus:border-white w-32"
                    placeholder={t.surname}
                  />
                  <span className="text-xl font-bold">{t.class}:</span>
                  <input
                    type="text"
                    value={playerClass}
                    onChange={(e) => setPlayerClass(e.target.value)}
                    className="bg-white/20 border-2 border-white/40 rounded-lg px-3 py-1 text-white placeholder-white/60 focus:outline-none focus:border-white w-24"
                    placeholder={t.class}
                  />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      if (playerName.trim() && playerSurname.trim() && playerClass.trim()) {
                        setIsPlayerSaved(true);
                        toast.success(t.playerSaved, {
                          icon: '✅',
                        });
                      } else {
                        toast.error(t.fillAllFields, {
                          icon: '⚠️',
                        });
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    💾 {t.save}
                  </button>
                  <button
                    onClick={() => {
                      setPlayerName('');
                      setPlayerSurname('');
                      setPlayerClass('');
                      setIsPlayerSaved(false);
                      startNewGame();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    👤 {t.newPlayer}
                  </button>
                  <button
                    onClick={reset}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t.reset}
                  </button>
                </div>
              </div>
            </div>

            {commandHistory.length > 0 && (
              <div className="mt-4 bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-xl shadow-xl text-white border-2 border-purple-300">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  📜 {t.commandHistory}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {commandHistory.map((cmds, idx) => {
                    const translatedCmds = cmds.map(cmd => 
                      cmd === 'yukarı' ? t.up : 
                      cmd === 'aşağı' ? t.down : 
                      cmd === 'sağ' ? t.right : 
                      cmd === 'sol' ? t.left : 
                      cmd === 'topla' ? t.collect : cmd
                    );
                    return (
                      <div key={idx} className="bg-black/30 p-2 rounded-lg text-sm">
                        <span className="font-bold text-cyan-300">#{idx + 1}: </span>
                        <span className="text-xs">{translatedCmds.join(' → ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 p-4 rounded-xl shadow-xl border-2 border-lime-300 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white text-center mb-4 drop-shadow-lg">
                  🏆 {t.scoreBoard} 🏆
                </h3>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-black/40 backdrop-blur p-3 rounded-lg text-center">
                    <p className="text-yellow-200 text-sm font-bold">{t.collectedWaste}</p>
                    <p className="text-3xl font-black text-lime-300 mt-1">{collected}/{waste.length}</p>
                  </div>
                  <div className="bg-black/40 backdrop-blur p-3 rounded-lg text-center">
                    <p className="text-yellow-200 text-sm font-bold">{t.commandCount}</p>
                    <p className="text-3xl font-black text-blue-300 mt-1">{commands.length}/15</p>
                  </div>
                  <div className="bg-black/40 backdrop-blur p-3 rounded-lg text-center">
                    <p className="text-yellow-200 text-sm font-bold">{t.efficiency}</p>
                    <p className="text-3xl font-black text-orange-300 mt-1">
                      {commands.length > 0 ? Math.round((collected / commands.length) * 100) : 0}%
                    </p>
                  </div>
                </div>

                <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl">
                  <h4 className="text-lg font-bold text-white mb-3 text-center">🌟 {t.topPlayers} 🌟</h4>
                  <div className="space-y-2">
                    {topScores.map((score, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-2 rounded-lg border-l-4 border-yellow-300 text-sm transform transition-all hover:scale-105"
                        style={{
                          animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 min-w-[60px]">
                            <span className="text-xl font-black text-cyan-300 bg-black/50 px-2 py-1 rounded-full min-w-[32px] text-center">
                              {index + 1}
                            </span>
                            <span className="text-xl">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{score.name}</p>
                            <p className="text-xs text-yellow-200">{score.class}</p>
                          </div>
                        </div>
                        <span className="text-2xl font-black text-lime-300 animate-pulse">{score.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-xl shadow-xl text-white border-2 border-purple-500">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-300" />
                  🎯 {t.learningOutcomes}
                </h2>
                <div className="space-y-3">
                  <div className="bg-black/30 p-3 rounded-lg backdrop-blur hover:bg-black/40 transition-all">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🧠</span>
                      <div>
                        <h3 className="font-bold text-lg text-cyan-300">{t.algorithmLogic}</h3>
                        <p className="text-sm text-gray-300">{t.algorithmDesc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg backdrop-blur hover:bg-black/40 transition-all">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <h3 className="font-bold text-lg text-cyan-300">{t.sortingArrays}</h3>
                        <p className="text-sm text-gray-300">{t.sortingDesc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg backdrop-blur hover:bg-black/40 transition-all">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <h3 className="font-bold text-lg text-cyan-300">{t.computationalThinking}</h3>
                        <p className="text-sm text-gray-300">{t.computationalDesc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg backdrop-blur hover:bg-black/40 transition-all">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🌍</span>
                      <div>
                        <h3 className="font-bold text-lg text-cyan-300">{t.environmentalAwareness}</h3>
                        <p className="text-sm text-gray-300">{t.environmentalDesc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg backdrop-blur hover:bg-black/40 transition-all">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎮</span>
                      <div>
                        <h3 className="font-bold text-lg text-cyan-300">{t.problemSolving}</h3>
                        <p className="text-sm text-gray-300">{t.problemSolvingDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-800 to-purple-900 p-6 rounded-xl shadow-xl text-white border-2 border-pink-400">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  🎮 {t.howToPlay}
                </h3>
                <div className="space-y-3">
                  <div className="bg-black/30 p-3 rounded-lg backdrop-blur hover:bg-black/40 transition-all">
                    <h4 className="font-bold text-lg text-yellow-300 mb-1">{t.howToPlayStep1}</h4>
                    <p className="text-sm text-gray-200">{t.howToPlayStep1Desc}</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg backdrop-blur hover:bg-black/40 transition-all">
                    <h4 className="font-bold text-lg text-green-300 mb-1">{t.howToPlayStep2}</h4>
                    <p className="text-sm text-gray-200">{t.howToPlayStep2Desc}</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg backdrop-blur hover:bg-black/40 transition-all">
                    <h4 className="font-bold text-lg text-blue-300 mb-1">{t.howToPlayStep3}</h4>
                    <p className="text-sm text-gray-200">{t.howToPlayStep3Desc}</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg backdrop-blur hover:bg-black/40 transition-all">
                    <h4 className="font-bold text-lg text-orange-300 mb-1">{t.howToPlayStep4}</h4>
                    <p className="text-sm text-gray-200">{t.howToPlayStep4Desc}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-800 to-blue-900 p-4 rounded-xl shadow-xl text-white border-2 border-cyan-400">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  ⌨️ {t.keyboardShortcuts}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/30 p-1 rounded text-center">↑ / W: {t.up}</div>
                  <div className="bg-black/30 p-1 rounded text-center">↓ / S: {t.down}</div>
                  <div className="bg-black/30 p-1 rounded text-center">→ / D: {t.right}</div>
                  <div className="bg-black/30 p-1 rounded text-center">← / A: {t.left}</div>
                  <div className="bg-black/30 p-1 rounded text-center">Space: {t.collect}</div>
                  <div className="bg-black/30 p-1 rounded text-center">Enter: {t.run}</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-4 rounded-xl shadow-xl text-white border-2 border-purple-400">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  ℹ️ {t.about}
                </h3>
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-gray-100">
                    {t.aboutContent}
                  </p>
                  <div className="bg-black/30 p-3 rounded-lg backdrop-blur">
                    <p className="text-center font-bold text-sm text-cyan-300">
                      {t.aboutFooter}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-2 rounded-lg border border-yellow-400/50">
                    <a 
                      href="https://birecikdumlupinar.meb.k12.tr/tema/index.php" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-center text-sm font-semibold text-yellow-200 hover:text-yellow-100 transition-colors underline"
                    >
                      {t.aboutCreator}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}