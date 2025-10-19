# 🌊 Fırat'ı Koru - Save the Euphrates 🤖

## 📋 Proje Özeti / Project Summary

**Fırat'ı Koru**, çocukların teknoloji ve çevre bilincini birleştirerek 21. yüzyıl becerilerini geliştirmelerine yardımcı olan etkileşimli bir eğitim oyunudur. Avrupa Kod Haftası'nın "Mavi Yeşil Vatan" teması çerçevesinde hazırlanmıştır.

**Save the Euphrates** is an interactive educational game that helps children develop 21st-century skills by combining technology and environmental awareness. Created within the framework of EU Code Week's "Blue Green Homeland" theme.

---

## 🎯 Proje Amacı / Project Purpose

Bu proje, öğrencilere:
- 🧠 **Algoritma mantığı** öğretir
- 💡 **Hesaplamalı düşünme** becerisi kazandırır
- 📊 **Sıralama ve dizi yapıları** kavramlarını tanıtır
- 🌍 **Çevre bilinci** aşılar
- 🎮 **Problem çözme** yeteneklerini geliştirir

This project teaches students:
- 🧠 **Algorithm logic**
- 💡 **Computational thinking** skills
- 📊 **Sorting and array structures** concepts
- 🌍 **Environmental awareness**
- 🎮 **Problem-solving** abilities

---

## 🚀 Teknolojiler / Technologies

### Frontend Framework
- **React 19.1.1** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite 7.1.14** - Next-generation frontend tooling

### Styling
- **Tailwind CSS 3.4.15** - Utility-first CSS framework
- **PostCSS** - CSS transformations
- **Autoprefixer** - Vendor prefix automation

### UI/UX Libraries
- **lucide-react** - Beautiful icon library
- **flag-icons** - International flag display
- **react-hot-toast** - Modern notification system

### Build Tools
- **TypeScript 5.9.3** - Static type checking
- **ESLint 9.36.0** - Code quality enforcement
- **Rolldown Vite** - Fast bundler

---

## 📦 Proje Yapısı / Project Structure

```
sea-robot/
├── src/
│   ├── SeaCleaningRobot.tsx    # Ana oyun bileşeni / Main game component
│   ├── App.tsx                  # Uygulama giriş noktası / App entry
│   ├── main.tsx                 # React DOM mount
│   ├── App.css                  # Global styles
│   ├── index.css                # Tailwind imports
│   └── assets/                  # Statik dosyalar / Static assets
│
├── public/                      # Public assets
├── index.html                   # HTML giriş / HTML entry
├── package.json                 # Dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript config
└── README.md                   # Project documentation
```

---

## 🎮 Oyun Özellikleri / Game Features

### 1. 🗺️ Grid Sistemi / Grid System
- 6x6 boyutunda oyun alanı
- Rastgele yerleştirilen 8 atık
- Robot başlangıç pozisyonu (0,0)

### 2. 🤖 Robot Kontrolü / Robot Control
**Komutlar / Commands:**
- ⬆️ Yukarı / Up (W, ↑)
- ⬇️ Aşağı / Down (S, ↓)
- ➡️ Sağ / Right (D, →)
- ⬅️ Sol / Left (A, ←)
- ✋ Topla / Collect (Space, E)
- ▶️ Çalıştır / Run (Enter)

**Maksimum Komut Sayısı:** 15 komut

### 3. 🎨 Atık Türleri / Waste Types
- 🍾 Şişe / Bottle
- 🍌 Lastik / Tire (banana emoji used)
- 🥫 Kutu / Can
- 🛍️ Çanta / Bag

### 4. 🌍 Çoklu Dil Desteği / Multi-Language Support
- 🇹🇷 **Türkçe** - Ana dil / Primary language
- 🇬🇧 **English** - İngilizce
- 🇸🇦 **العربية** - Arapça (RTL desteği / RTL support)

### 5. 👤 Oyuncu Sistemi / Player System
- Oyuncu adı, soyadı ve sınıf bilgisi
- LocalStorage ile skorların saklanması
- En iyi 10 oyuncu sıralaması
- Oyuncu doğrulama sistemi

### 6. 🏆 Skor Sistemi / Scoring System
- Toplanan atık sayısı
- Kullanılan komut sayısı
- Verimlilik hesaplama (toplanan/komut)
- Başarı oranı gösterimi

### 7. 📊 Eğitim İçeriği / Educational Content
- **Öğrenme Kazanımları:** 5 temel beceri alanı
- **Nasıl Oynanır:** 4 adımlık rehber
- **Klavye Kısayolları:** Hızlı erişim için
- **Hakkında:** Proje bilgileri

### 8. 🎵 Ses Efektleri / Sound Effects
- Hareket sesi (400Hz sinüs dalgası)
- Toplama sesi (Do-Mi-Sol akordu: 523Hz, 659Hz, 784Hz)
- Web Audio API kullanımı

### 9. 🎨 Görsel Tasarım / Visual Design
- Gradient renk geçişleri
- Animasyonlu arka plan
- Hover efektleri
- Responsive tasarım
- Parıltı ve glow efektleri

### 10. 🔔 Bildirim Sistemi / Notification System
- Modern toast bildirimleri
- Başarı, hata ve bilgi mesajları
- Özel emoji ikonları
- Gradient arka planlar

---

## 💻 Kurulum / Installation

### Gereksinimler / Requirements
- Node.js 18+ 
- npm veya yarn

### Adımlar / Steps

```bash
# 1. Projeyi klonlayın / Clone the project
git clone <repository-url>

# 2. Proje dizinine gidin / Navigate to project
cd sea-robot

# 3. Bağımlılıkları yükleyin / Install dependencies
npm install

# 4. Geliştirme sunucusunu başlatın / Start dev server
npm run dev

# 5. Tarayıcıda açın / Open in browser
# http://localhost:5173
```

### Build Komutları / Build Commands

```bash
# Geliştirme modu / Development mode
npm run dev

# Production build
npm run build

# Build önizleme / Preview build
npm run preview

# Linting
npm run lint
```

---

## 🎓 Eğitsel Kazanımlar / Educational Outcomes

### 1. 🧠 Algoritma Mantığı
Öğrenciler adım adım düşünmeyi ve problemleri çözmek için sıralı komutlar oluşturmayı öğrenirler.

### 2. 📊 Sıralama ve Diziler
Komutların sıralaması ve doğru dizilişinin önemi vurgulanır.

### 3. 💡 Hesaplamalı Düşünme
Büyük problemleri küçük parçalara ayırma ve çözme becerisi gelişir.

### 4. 🌍 Çevre Bilinci
Fırat Nehri'nin ve doğanın korunması konusunda farkındalık oluşur.

### 5. 🎮 Problem Çözme
Yaratıcı düşünme ve strateji geliştirme becerileri pekişir.

---

## 🎨 Tasarım Özellikleri / Design Features

### Renk Paleti / Color Palette
```css
/* Primary Colors */
--blue-gradient: from-blue-900 via-blue-800 to-cyan-900
--purple-gradient: from-purple-600 to-pink-600
--green-gradient: from-green-500 to-emerald-600

/* Accent Colors */
--cyan: #06b6d4
--lime: #84cc16
--orange: #f97316
--yellow: #facc15
```

### Animasyonlar / Animations
- **Bounce:** Robot ve başarı mesajları
- **Spin:** Atık öğeleri
- **Float:** Arka plan metinleri
- **Pulse:** Vurgu efektleri
- **Shimmer:** Parlama efektleri
- **Scale:** Hover etkileşimleri

### Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

---

## 🔧 Teknik Detaylar / Technical Details

### State Management
```typescript
// Ana durumlar / Main states
const [robot, setRobot] = useState<Robot>({ x: 0, y: 0, direction: 'right' });
const [waste, setWaste] = useState<Waste[]>([]);
const [commands, setCommands] = useState<string[]>([]);
const [collected, setCollected] = useState(0);
const [language, setLanguage] = useState<'tr' | 'en' | 'ar'>('tr');
const [isPlayerSaved, setIsPlayerSaved] = useState(false);
```

### Type Definitions
```typescript
interface Robot {
  x: number;
  y: number;
  direction: 'up' | 'right' | 'down' | 'left';
}

interface Waste {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  type: 'bottle' | 'tire' | 'can' | 'bag';
}

interface Score {
  name: string;
  score: number;
  class: string;
}
```

### LocalStorage Structure
```json
{
  "topScores": [
    {
      "name": "Ali Yılmaz",
      "score": 8,
      "class": "4-B"
    }
  ]
}
```

---

## 🎯 Oyun Akışı / Game Flow

### 1. Başlangıç / Start
```
Oyuncu bilgileri girişi
↓
Bilgilerin kaydedilmesi
↓
Oyun başlar
```

### 2. Oyun Döngüsü / Game Loop
```
Komut ekleme (max 15)
↓
Komut sırasını gözden geçirme
↓
Çalıştır butonuna basma
↓
Robot komutları sırayla uygular
↓
Atıklar toplandıkça skor artar
↓
Tüm atıklar toplandığında başarı!
```

### 3. Skor Kaydetme / Score Saving
```
Oyun tamamlandı
↓
Skor hesaplanır
↓
LocalStorage'a kaydedilir
↓
En iyi 10 listesi güncellenir
```

---

## 🌐 Çoklu Dil Sistemi / Multi-Language System

### Çeviri Yapısı / Translation Structure
```typescript
const translations = {
  tr: { /* Türkçe */ },
  en: { /* English */ },
  ar: { /* العربية */ }
};

const t = translations[language];
```

### Desteklenen Alanlar / Supported Areas
- UI etiketleri (buttons, labels)
- Komutlar (commands)
- Bildirimler (notifications)
- Eğitim içeriği (educational content)
- Oyun açıklamaları (game descriptions)

### RTL Desteği / RTL Support
```typescript
<div dir={language === 'ar' ? 'rtl' : 'ltr'}>
  {/* İçerik / Content */}
</div>
```

---

## 🎹 Klavye Kontrolleri / Keyboard Controls

### Hareket Komutları / Movement Commands
| Tuş / Key | Komut / Command |
|-----------|-----------------|
| W / ↑ | Yukarı / Up |
| S / ↓ | Aşağı / Down |
| D / → | Sağ / Right |
| A / ← | Sol / Left |
| Space / E | Topla / Collect |
| Enter | Çalıştır / Run |
| Escape | Temizle / Clear |

### Input Koruması / Input Protection
```typescript
const activeElement = document.activeElement;
if (activeElement?.tagName === 'INPUT' || 
    activeElement?.tagName === 'TEXTAREA') {
  return; // Klavye komutlarını devre dışı bırak
}
```

---

## 🔔 Bildirim Sistemi / Notification System

### Toast Tipleri / Toast Types

#### Başarı / Success
```typescript
toast.success('Oyuncu bilgileri kaydedildi', {
  icon: '✅',
});
```

#### Hata / Error
```typescript
toast.error('Önce komut ekleyin!', {
  icon: '⚠️',
});
```

#### Bilgi / Info
```typescript
toast(t.playerNotSaved, {
  icon: '🤖',
  duration: 4000,
  style: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
});
```

---

## 🎨 Bileşen Hiyerarşisi / Component Hierarchy

```
SeaCleaningRobot (Main)
│
├── Toaster (Notifications)
│
├── Language Selector
│   ├── TR Flag Button
│   ├── EN Flag Button
│   └── AR Flag Button
│
├── Header Section
│   ├── Title
│   └── Description
│
├── Game Area
│   ├── Command Queue (Left)
│   ├── Grid (Center)
│   │   └── Cells (6x6)
│   │       ├── Robot
│   │       └── Waste Items
│   └── Control Panel (Right)
│       ├── Robot Status
│       ├── Command Buttons
│       ├── Action Buttons
│       └── Congratulations
│
├── Player Info Section
│   ├── Name Input
│   ├── Surname Input
│   ├── Class Input
│   └── Action Buttons
│
├── Command History
│
├── Scoreboard
│   ├── Statistics
│   └── Top 10 Players
│
└── Info Sections (Grid)
    ├── Learning Outcomes
    ├── How to Play
    ├── Keyboard Shortcuts
    └── About
```

---

## 🚀 Performans Optimizasyonları / Performance Optimizations

### 1. useCallback Hooks
```typescript
const moveRight = useCallback(() => {
  setRobot((prev) => ({
    ...prev,
    x: Math.min(prev.x + 1, GRID_SIZE - 1),
    direction: 'right',
  }));
}, []);
```

### 2. Lazy State Initialization
```typescript
const [waste, setWaste] = useState<Waste[]>(() => {
  // Sadece ilk render'da çalışır
  const initialWaste: Waste[] = [];
  // ... initialization logic
  return initialWaste;
});
```

### 3. Memoized Translations
```typescript
const t = translations[language];
// Referans değişmedikçe yeniden hesaplanmaz
```

---

## 🐛 Hata Ayıklama / Debugging

### Console Logs
```javascript
// Geliştirme modunda aktif
if (import.meta.env.DEV) {
  console.log('Robot position:', robot);
  console.log('Commands:', commands);
}
```

### React DevTools
- State inceleme
- Props tracking
- Performance profiling

### Browser DevTools
- LocalStorage kontrolü
- Audio context debugging
- CSS animation testing

---

## 📱 Platform Desteği / Platform Support

### Tarayıcılar / Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Cihazlar / Devices
- 💻 Desktop
- 📱 Mobile
- 📱 Tablet
- 🖥️ Large screens

### İşletim Sistemleri / Operating Systems
- Windows 10/11
- macOS 11+
- Linux (Ubuntu, Fedora, etc.)
- Android 8+
- iOS 13+

---

## 🔐 Güvenlik / Security

### Input Validation
```typescript
if (playerName.trim() && playerSurname.trim() && playerClass.trim()) {
  setIsPlayerSaved(true);
}
```

### XSS Prevention
- React'ın otomatik escape mekanizması
- Kullanıcı girdilerinin sanitizasyonu

### Data Privacy
- Veriler sadece localStorage'da
- Sunucuya veri gönderilmez
- GDPR uyumlu

---

## 🎓 Eğitim Senaryoları / Educational Scenarios

### Senaryo 1: İlk Adımlar
```
Hedef: Robotu hedefe götür
Komutlar: Sağ → Sağ → Yukarı → Topla
Öğrenme: Temel hareket ve komut sırası
```

### Senaryo 2: Optimizasyon
```
Hedef: Minimum komutla atık topla
Komutlar: En kısa yolu bulma
Öğrenme: Algoritma optimizasyonu
```

### Senaryo 3: Problem Çözme
```
Hedef: Tüm atıkları en verimli şekilde topla
Komutlar: Strateji geliştirme
Öğrenme: Planlama ve hesaplamalı düşünme
```

---

## 📊 Başarı Metrikleri / Success Metrics

### Oyuncu Başarısı / Player Success
```typescript
const efficiency = (collected / commands.length) * 100;
const successRate = (collected / waste.length) * 100;
```

### Verimlilik Derecelendirme / Efficiency Rating
- 🥇 Altın: %80+ verimlilik
- 🥈 Gümüş: %60-79% verimlilik
- 🥉 Bronz: %40-59% verimlilik
- 🏅 Katılımcı: %0-39% verimlilik

---

## 🎯 Gelecek Geliştirmeler / Future Enhancements

### Planlanan Özellikler / Planned Features
- [ ] Zorluk seviyeleri (Kolay, Orta, Zor)
- [ ] Engel sistemleri (Kayalar, duvarlar)
- [ ] Zaman sınırı modu
- [ ] Çoklu oyuncu desteği
- [ ] Başarı rozetleri sistemi
- [ ] Hikaye modu
- [ ] Daha fazla dil desteği
- [ ] Mobil uygulama versiyonu
- [ ] Ses ayarları menüsü
- [ ] Karanlık/Aydınlık tema

### Teknik İyileştirmeler / Technical Improvements
- [ ] Progressive Web App (PWA)
- [ ] Offline çalışma desteği
- [ ] Backend entegrasyonu
- [ ] Veritabanı ile skor paylaşımı
- [ ] Sosyal medya entegrasyonu
- [ ] Analytics entegrasyonu
- [ ] Unit testler
- [ ] E2E testler

---

## 👨‍💻 Geliştirici / Developer

**Mehmet Dalğın**
- 🏫 Dumlupınar İlkokulu
- 🌐 Avrupa Kod Haftası 2025
- 🎯 Tema: "Mavi Yeşil Vatan"

---

## 📄 Lisans / License

Bu proje eğitim amaçlıdır ve MIT lisansı altında dağıtılmaktadır.

This project is for educational purposes and is distributed under the MIT license.

---

## 🙏 Teşekkürler / Acknowledgments

- **Avrupa Kod Haftası** - Etkinlik organizasyonu için
- **React Team** - Harika framework için
- **Vite Team** - Hızlı geliştirme araçları için
- **Tailwind CSS** - Modern CSS framework için
- **Tüm öğrencilerimiz** - İlham ve motivasyon için

---

## 📞 İletişim / Contact

Proje hakkında sorularınız için:
- 📧 Email: [your-email]
- 🌐 Website: [your-website]
- 📱 GitHub: [your-github]

---

## 🌊💚 Fırat Nehri'mizi Birlikte Koruyalım! 💚🌊

**#CodeWeek2025 #MaviYeşilVatan #SaveTheEuphrates #FıratıKoru**

---

*Bu belge proje geliştirme sürecinde sürekli güncellenmektedir.*
*Last Updated: Ekim 2025*
