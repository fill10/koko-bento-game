// بيانات اللعبة
const arabicLetters = [
  { id: '1', arabic: 'أ', name: 'أرنب', sound: 'alif', color: '#FF6B6B' },
  { id: '2', arabic: 'ب', name: 'بطة', sound: 'baa', color: '#4ECDC4' },
  { id: '3', arabic: 'ت', name: 'تفاحة', sound: 'taa', color: '#45B7D1' },
  { id: '4', arabic: 'ث', name: 'ثعلب', sound: 'thaa', color: '#96CEB4' },
  { id: '5', arabic: 'ج', name: 'جمل', sound: 'jeem', color: '#FFEAA7' },
  { id: '6', arabic: 'ح', name: 'حصان', sound: 'haa', color: '#DDA0DD' },
  { id: '7', arabic: 'خ', name: 'خروف', sound: 'khaa', color: '#98D8C8' },
  { id: '8', arabic: 'د', name: 'دجاجة', sound: 'dal', color: '#F7DC6F' },
  { id: '9', arabic: 'ذ', name: 'ذئب', sound: 'thal', color: '#BB8FCE' },
  { id: '10', arabic: 'ر', name: 'رمانة', sound: 'raa', color: '#85C1E9' },
  { id: '11', arabic: 'ز', name: 'زيتون', sound: 'zay', color: '#F8C471' },
  { id: '12', arabic: 'س', name: 'سلحفاة', sound: 'seen', color: '#82E0AA' },
  { id: '13', arabic: 'ش', name: 'شجرة', sound: 'sheen', color: '#A8E6CF' },
  { id: '14', arabic: 'ص', name: 'صوص', sound: 'saad', color: '#FFD93D' },
  { id: '15', arabic: 'ض', name: 'ضفدع', sound: 'daad', color: '#6BCF7F' },
  { id: '16', arabic: 'ط', name: 'طائرة', sound: 'taa', color: '#4A90E2' },
  { id: '17', arabic: 'ظ', name: 'ظرف', sound: 'dhaa', color: '#F5A623' },
  { id: '18', arabic: 'ع', name: 'عصفور', sound: 'ain', color: '#7ED321' },
  { id: '19', arabic: 'غ', name: 'غراب', sound: 'ghain', color: '#50E3C2' },
  { id: '20', arabic: 'ف', name: 'فيل', sound: 'faa', color: '#B8E986' },
  { id: '21', arabic: 'ق', name: 'قرد', sound: 'qaaf', color: '#D0021B' },
  { id: '22', arabic: 'ك', name: 'كرة', sound: 'kaaf', color: '#F8E71C' },
  { id: '23', arabic: 'ل', name: 'ليمونة', sound: 'laam', color: '#8B572A' },
  { id: '24', arabic: 'م', name: 'ماما', sound: 'meem', color: '#7B68EE' },
  { id: '25', arabic: 'ن', name: 'نافذة', sound: 'noon', color: '#417505' },
  { id: '26', arabic: 'هـ', name: 'هدية', sound: 'haa', color: '#BD10E0' },
  { id: '27', arabic: 'و', name: 'ولد', sound: 'waaw', color: '#9013FE' },
  { id: '28', arabic: 'ي', name: 'يد', sound: 'yaa', color: '#50E3C2' },
];

// متغيرات التتبع
let totalCorrect = 0;
let totalNeeded = 24; // عدد الحروف الحالي (8 × 3 مستويات)

const gameLevels = [
  {
    id: 1,
    title: 'المستوى الأول - الحروف الأساسية',
    letters: arabicLetters.slice(0, 8),
    targetCount: 8,
    difficulty: 'easy'
  },
  {
    id: 2,
    title: 'المستوى الثاني - المزيد من الحروف',
    letters: arabicLetters.slice(8, 16),
    targetCount: 8,
    difficulty: 'medium'
  },
  {
    id: 3,
    title: 'المستوى الثالث - التحدي الكبير',
    letters: arabicLetters.slice(16, 24),
    targetCount: 8,
    difficulty: 'hard'
  }
];

// حالة اللعبة
let gameState = {
  currentLevel: 0,
  score: 0,
  lives: 3,
  completedLetters: [],
  isGameComplete: false,
  showCelebration: false,
  showColoring: false,
  currentColoringImage: null,
};

let dragState = {
  isDragging: false,
  draggedLetter: null,
  dragOffset: { x: 0, y: 0 },
};

// صور التلوين
const coloringImages = {
  1: './assets/coloring/koko.png', // صورة كوكو المرفوعة
  2: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg'   // أرنب للمستوى الثاني
};
// وظائف اللعبة الأساسية
function startGame() {
  document.getElementById('intro').style.display = 'none';
  document.getElementById('gameContainer').classList.remove('hidden');
  loadGame();
}

function goToMainMenu() {
  document.getElementById('gameContainer').classList.add('hidden');
  document.getElementById('intro').style.display = 'flex';
  document.getElementById('celebrationModal').classList.add('hidden');
  document.getElementById('successModal').classList.add('hidden');
}

function goToLevel(levelIndex) {
  if (levelIndex >= 0 && levelIndex < gameLevels.length) {
    gameState.currentLevel = levelIndex;
    gameState.completedLetters = [];
    document.getElementById('celebrationModal').classList.add('hidden');
    loadGame();
  }
}
function restartGame() {
  gameState = {
    currentLevel: 0,
    score: 0,
    lives: 3,
    completedLetters: [],
    isGameComplete: false,
    showCelebration: false,
  };
  
  dragState = {
    isDragging: false,
    draggedLetter: null,
    dragOffset: { x: 0, y: 0 },
  };
  
  totalCorrect = 0;
  
  document.getElementById('celebrationModal').classList.add('hidden');
  document.getElementById('successModal').classList.add('hidden');
  loadGame();
}

function shareGame() {
  const url = window.location.href;
  const text = "🐨 تعال العب معي لعبة كوكو وأصدقاء الحروف! لعبة ممتعة لتعلم الحروف العربية 🎮✨";
  
  if (navigator.share) {
    navigator.share({
      title: 'كوكو وأصدقاء الحروف',
      text: text,
      url: url
    }).catch(console.error);
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
      alert("تم نسخ رابط اللعبة! 🎉");
    });
  } else {
    alert(`${text}\n${url}`);
  }
}

function loadGame() {
  const currentLevel = gameLevels[gameState.currentLevel];
  
  if (!currentLevel) {
    showGameComplete();
    return;
  }
  
  // تحديث واجهة المستوى
  document.getElementById('levelTitle').textContent = currentLevel.title;
  updateUI();
  
  // تنظيف الحاويات
  const dropzones = document.getElementById('dropzonesContainer');
  const draggables = document.getElementById('draggablesContainer');
  dropzones.innerHTML = '';
  draggables.innerHTML = '';
  
  // خلط الحروف للسحب
  const shuffledLetters = [...currentLevel.letters].sort(() => Math.random() - 0.5);
  
  // إنشاء مناطق الإسقاط (بالترتيب الأبجدي)
  currentLevel.letters.forEach((letter) => {
    const dropZone = createDropZone(letter);
    dropzones.appendChild(dropZone);
  });
  
  // إنشاء الحروف القابلة للسحب (مخلوطة)
  shuffledLetters.forEach((letter) => {
    const letterCard = createLetterCard(letter);
    draggables.appendChild(letterCard);
  });
}

function createLetterCard(letter) {
  const card = document.createElement('div');
  card.className = 'letter-card relative cursor-move p-4 rounded-2xl w-full';
  card.draggable = !gameState.completedLetters.includes(letter.id);
  card.style.borderColor = letter.color;
  card.dataset.letterId = letter.id;
  
  if (gameState.completedLetters.includes(letter.id)) {
    card.classList.add('opacity-50', 'cursor-not-allowed');
    card.draggable = false;
  }
  
  card.innerHTML = `
    <div class="flex items-center justify-center gap-4 p-2">
      <div class="text-5xl arabic-text" style="color: ${letter.color}">
        ${letter.arabic}
      </div>
      <div class="text-lg font-semibold text-gray-700 font-arabic flex-1">
        ${letter.name}
      </div>
    </div>
    ${gameState.completedLetters.includes(letter.id) ? 
      '<div class="absolute top-2 left-2"><div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"><span class="text-white text-sm">✓</span></div></div>' 
      : ''}
  `;
  
  // إضافة أحداث السحب
  card.addEventListener('dragstart', (e) => handleDragStart(e, letter));
  card.addEventListener('dragend', handleDragEnd);
  
  return card;
}

function createDropZone(letter) {
  const zone = document.createElement('div');
  zone.className = 'drop-zone rounded-2xl p-4 flex items-center justify-center w-full min-h-[100px]';
  zone.dataset.letterId = letter.id;
  
  const isCompleted = gameState.completedLetters.includes(letter.id);
  
  if (isCompleted) {
    zone.classList.add('correct');
    zone.innerHTML = `
      <div class="flex items-center justify-center gap-4 celebration-effect w-full">
        <div class="text-6xl arabic-text" style="color: ${letter.color}">
          ${letter.arabic}
        </div>
        <div class="flex-1">
          <div class="text-xl font-bold text-green-600 font-arabic">
            أحسنت! 🎉
          </div>
          <div class="text-lg text-gray-600 font-arabic">
            ${letter.name}
          </div>
        </div>
      </div>
    `;
  } else {
    zone.innerHTML = `
      <div class="flex items-center justify-center gap-4 w-full">
        <div class="text-5xl text-gray-400 arabic-text" style="color: ${letter.color}; opacity: 0.3;">
          ${letter.arabic}
        </div>
        <div class="flex-1 text-center">
          <div class="text-lg text-gray-500 font-arabic">
            اسحب حرف "${letter.name}" هنا
          </div>
        </div>
      </div>
    `;
  }
          ${letter.name}
        </div>
      </div>
    `;
  } else {
    zone.innerHTML = `
      <div class="text-center">
        <div class="text-6xl text-gray-400 mb-4 arabic-text">
          ${letter.arabic}
        </div>
        <div class="text-lg text-gray-500 font-arabic">
          اسحب حرف "${letter.name}" هنا
        </div>
        <div class="text-sm text-gray-400 mt-2">
          ${letter.sound}
        </div>
      </div>
    `;
  }
  
  // إضافة أحداث الإسقاط
  zone.addEventListener('dragover', (e) => handleDragOver(e, letter));
  zone.addEventListener('dragleave', (e) => handleDragLeave(e, letter));
  zone.addEventListener('drop', (e) => handleDrop(e, letter));
  
  return zone;
}

function handleDragStart(e, letter) {
  if (gameState.completedLetters.includes(letter.id)) {
    e.preventDefault();
    return;
  }
  
  dragState.isDragging = true;
  dragState.draggedLetter = letter;
  
  e.dataTransfer.setData('text/plain', letter.id);
  e.dataTransfer.effectAllowed = 'move';
  
  e.target.classList.add('dragging');
  
  // تشغيل صوت بداية السحب
  playSound('drag');
}

function handleDragEnd(e) {
  dragState.isDragging = false;
  dragState.draggedLetter = null;
  
  e.target.classList.remove('dragging');
  
  // إزالة تأثيرات السحب من جميع المناطق
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drag-over');
  });
}

function handleDragOver(e, targetLetter) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  if (!gameState.completedLetters.includes(targetLetter.id)) {
    e.target.closest('.drop-zone').classList.add('drag-over');
  }
}

function handleDragLeave(e, targetLetter) {
  e.target.closest('.drop-zone').classList.remove('drag-over');
}

function handleDrop(e, targetLetter) {
  e.preventDefault();
  
  const draggedLetterId = e.dataTransfer.getData('text/plain');
  const isCorrect = draggedLetterId === targetLetter.id;
  const dropZone = e.target.closest('.drop-zone');
  
  dropZone.classList.remove('drag-over');
  
  if (gameState.completedLetters.includes(targetLetter.id)) {
    return; // المنطقة مكتملة بالفعل
  }
  
  if (isCorrect) {
    // إجابة صحيحة
    gameState.completedLetters.push(targetLetter.id);
    gameState.score += 100;
    totalCorrect++;
    
    // تحديث منطقة الإسقاط
    dropZone.classList.add('correct');
    dropZone.innerHTML = `
      <div class="text-center celebration-effect">
        <div class="text-8xl arabic-text mb-4" style="color: ${targetLetter.color}">
          ${targetLetter.arabic}
        </div>
        <div class="text-2xl font-bold text-green-600 font-arabic">
          أحسنت! 🎉
        </div>
        <div class="text-lg text-gray-600 font-arabic">
          ${targetLetter.name}
        </div>
      </div>
    `;
    
    // تحديث بطاقة الحرف
    const letterCard = document.querySelector(`[data-letter-id="${targetLetter.id}"]`);
    if (letterCard) {
      letterCard.classList.add('opacity-50', 'cursor-not-allowed');
      letterCard.draggable = false;
      letterCard.innerHTML += '<div class="absolute top-2 right-2"><div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"><span class="text-white text-sm">✓</span></div></div>';
    }
    
    // تشغيل صوت النجاح
    playSound('success');
    
    // فحص اكتمال المستوى
    const currentLevel = gameLevels[gameState.currentLevel];
    if (gameState.completedLetters.length === currentLevel.targetCount) {
      setTimeout(() => {
        // إذا كان المستوى الأول أو الثاني، اعرض التلوين
        if (gameState.currentLevel === 0) {
          showColoringActivity(2); // Coloring Tour (2) بعد المستوى الأول
        } else if (gameState.currentLevel === 1) {
          showColoringActivity(1); // Coloring Tour (1) بعد المستوى الثاني
        } else {
          showCelebration();
        }
      }, 1000);
    }
    
    // فحص اكتمال اللعبة
    if (totalCorrect === totalNeeded) {
      setTimeout(() => {
        showSuccessModal();
      }, 1500);
    }
    
  } else {
    // إجابة خاطئة
    gameState.lives = Math.max(0, gameState.lives - 1);
    
    // تأثير بصري للخطأ
    dropZone.classList.add('bg-red-200');
    setTimeout(() => {
      dropZone.classList.remove('bg-red-200');
    }, 500);
    
    // تشغيل صوت الخطأ
    playSound('error');
    
    // فحص انتهاء الأرواح
    if (gameState.lives === 0) {
      setTimeout(() => {
        alert('انتهت الأرواح! سيتم إعادة تشغيل اللعبة.');
        restartGame();
      }, 500);
    }
  }
  
  updateUI();
}

function updateUI() {
  // تحديث النقاط
  document.getElementById('scoreDisplay').textContent = gameState.score;
  
  // تحديث الأرواح
  const livesDisplay = document.getElementById('livesDisplay');
  livesDisplay.innerHTML = '❤️'.repeat(gameState.lives) + '🤍'.repeat(3 - gameState.lives);
  
  // تحديث التقدم
  const currentLevel = gameLevels[gameState.currentLevel];
  if (currentLevel) {
    document.getElementById('progressDisplay').textContent = 
      \`التقدم: ${gameState.completedLetters.length} من ${currentLevel.targetCount}`;
  }
}

function showCelebration() {
  const currentLevel = gameLevels[gameState.currentLevel];
  const isGameComplete = gameState.currentLevel === gameLevels.length - 1;
  
  document.getElementById('celebrationTitle').textContent = 
    isGameComplete ? 'مبروك! أكملت اللعبة! 🎉' : 'أحسنت! 🌟';
  
  document.getElementById('celebrationMessage').textContent = 
    isGameComplete ? 'لقد أتممت جميع المستويات بنجاح!' : 'لقد أكملت هذا المستوى بنجاح!';
  
  document.getElementById('finalScore').textContent = gameState.score;
  
  // عرض النجوم
  const starsCount = Math.min(5, Math.floor(gameState.score / 100));
  const starsDisplay = document.getElementById('starsDisplay');
  starsDisplay.innerHTML = '';
  
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('span');
    star.className = 'text-2xl';
    star.textContent = i < starsCount ? '⭐' : '⚪';
    starsDisplay.appendChild(star);
  }
  
  // إخفاء/إظهار زر المستوى التالي
  const nextBtn = document.getElementById('nextLevelBtn');
  if (isGameComplete) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'block';
  }
  
  document.getElementById('celebrationModal').classList.remove('hidden');
}

function nextLevel() {
  gameState.currentLevel++;
  gameState.completedLetters = [];
  document.getElementById('celebrationModal').classList.add('hidden');
  loadGame();
}

function showGameComplete() {
  document.getElementById('celebrationTitle').textContent = 'مبروك! أكملت اللعبة! 🎉';
  document.getElementById('celebrationMessage').textContent = 'لقد أتممت جميع المستويات بنجاح!';
  document.getElementById('finalScore').textContent = gameState.score;
  document.getElementById('nextLevelBtn').style.display = 'none';
  document.getElementById('celebrationModal').classList.remove('hidden');
}

function showSuccessModal() {
  // تحديد رابط الفيديو
  const videoUrl = "https://www.youtube.com/embed/MBsYXRytFo8?autoplay=1&rel=0";
  document.getElementById('rewardVideo').src = videoUrl;
  
  document.getElementById('successModal').classList.remove('hidden');
  
  // تشغيل صوت الفوز
  playSound('victory');
}

function showColoringActivity(imageNumber) {
  gameState.showColoring = true;
  gameState.currentColoringImage = imageNumber;
  
  const coloringModal = document.getElementById('coloringModal');
  const coloringImage = document.getElementById('coloringImage');
  const coloringTitle = document.getElementById('coloringTitle');
  
  coloringTitle.textContent = \`يلا نلون! 🎨 Coloring Tour (${imageNumber})`;
  coloringImage.src = coloringImages[imageNumber];
  
  coloringModal.classList.remove('hidden');
  
  // تشغيل صوت التلوين
  playSound('coloring');
}

function finishColoring() {
  document.getElementById('coloringModal').classList.add('hidden');
  gameState.showColoring = false;
  
  // الانتقال للمستوى التالي
  if (gameState.currentLevel < gameLevels.length - 1) {
    gameState.currentLevel++;
    gameState.completedLetters = [];
    loadGame();
  } else {
    // إذا انتهت جميع المستويات
    showCelebration();
  }
}

function closeModal() {
  document.getElementById('successModal').classList.add('hidden');
  // إيقاف الفيديو
  document.getElementById('rewardVideo').src = '';
}

function closeColoringModal() {
  document.getElementById('coloringModal').classList.add('hidden');
  gameState.showColoring = false;
}

// وظائف الصوت
function playSound(type) {
  // يمكن إضافة ملفات صوتية حقيقية هنا
  console.log(\`🎵 تشغيل صوت: ${type}`);
  
  // محاكاة الأصوات باستخدام Web Audio API (اختياري)
  if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
    try {
      const audioContext = new (AudioContext || webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // تحديد تردد الصوت حسب النوع
      switch(type) {
        case 'success':
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          break;
        case 'error':
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
          break;
        case 'victory':
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
          break;
        case 'drag':
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
          break;
        case 'coloring':
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          break;
        default:
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      }
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('لا يمكن تشغيل الصوت:', error);
    }
  }
}

// تحميل اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎮 لعبة كوكو وأصدقاء الحروف جاهزة!');
  
  // إضافة مستمعات الأحداث للوحة المفاتيح (اختياري)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
      closeColoringModal();
    }
  });
});

// وظائف التلوين
let selectedColor = '#ef4444'; // اللون الافتراضي أحمر

function selectColor(color) {
  selectedColor = color;
  console.log('تم اختيار اللون:', color);
  
  // تأثير بصري لإظهار اللون المختار
  document.querySelectorAll('.grid div').forEach(colorDiv => {
    colorDiv.classList.remove('ring-4', 'ring-gray-800');
  });
  
  event.target.classList.add('ring-4', 'ring-gray-800');
}

// إضافة تفاعل التلوين مع الصورة (محاكاة)
document.addEventListener('click', function(e) {
  if (e.target.id === 'coloringImage' && gameState.showColoring) {
    // محاكاة التلوين بإضافة تأثير بصري
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // إنشاء نقطة لون
    const colorDot = document.createElement('div');
    colorDot.style.position = 'absolute';
    colorDot.style.left = x + 'px';
    colorDot.style.top = y + 'px';
    colorDot.style.width = '20px';
    colorDot.style.height = '20px';
    colorDot.style.backgroundColor = selectedColor;
    colorDot.style.borderRadius = '50%';
    colorDot.style.pointerEvents = 'none';
    colorDot.style.opacity = '0.7';
    
    e.target.parentElement.appendChild(colorDot);
    
    // تشغيل صوت التلوين
    playSound('coloring');
  }
});
}