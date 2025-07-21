// main.js

// بيانات الحروف ومستويات اللعبة (مثال)
const levels = [
  {
    name: "المستوى الأول",
    letters: [
      { char: "أ", word: "أسد", img: "./assets/letters/alif.png" },
      { char: "ب", word: "بطة", img: "./assets/letters/baa.png" },
      { char: "ت", word: "تفاحة", img: "./assets/letters/taa.png" },
      { char: "ث", word: "ثعلب", img: "./assets/letters/thaa.png" },
      { char: "ج", word: "جمل", img: "./assets/letters/jeem.png" },
      { char: "ح", word: "حصان", img: "./assets/letters/haa.png" },
      { char: "خ", word: "خروف", img: "./assets/letters/khaa.png" },
      { char: "د", word: "دجاجة", img: "./assets/letters/dal.png" },
    ],
  },
  // يمكنك إضافة مستويات أخرى هنا
];

let currentLevelIndex = 0;
let score = 0;
let lives = 3;

// عند بدء اللعبة من زر "ابدأ"
function startGame() {
  document.getElementById('intro').style.display = 'none';
  document.getElementById('gameContainer').classList.remove('hidden');
  loadLevel(currentLevelIndex);
  updateStatus();
}

// تحميل مستوى معين
function loadLevel(levelIndex) {
  const level = levels[levelIndex];
  if (!level) return;

  document.getElementById('levelTitle').textContent = level.name;
  document.getElementById('progressDisplay').textContent = `التقدم: 0 من ${level.letters.length}`;
  score = 0;
  lives = 3;
  updateStatus();

  // مسح الحاويات
  const dropzonesContainer = document.getElementById('dropzonesContainer');
  const draggablesContainer = document.getElementById('draggablesContainer');
  dropzonesContainer.innerHTML = '';
  draggablesContainer.innerHTML = '';

  // إنشاء مناطق الإسقاط
  level.letters.forEach((letter, index) => {
    // Drop Zone
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone rounded-xl p-4 mb-3 text-center text-3xl font-bold font-arabic';
    dropZone.dataset.letter = letter.char;
    dropZone.textContent = letter.char;
    dropZone.addEventListener('dragover', dragOverHandler);
    dropZone.addEventListener('drop', dropHandler);
    dropzonesContainer.appendChild(dropZone);
  });

  // إنشاء الحروف القابلة للسحب (عشوائي)
  const shuffledLetters = [...level.letters].sort(() => Math.random() - 0.5);

  shuffledLetters.forEach((letter) => {
    const draggable = document.createElement('div');
    draggable.className = 'letter-card p-4 cursor-move select-none text-center text-3xl font-bold font-arabic';
    draggable.textContent = letter.char;
    draggable.draggable = true;
    draggable.id = `draggable-${letter.char}`;
    draggable.dataset.letter = letter.char;
    draggable.addEventListener('dragstart', dragStartHandler);
    draggablesContainer.appendChild(draggable);
  });
}

// تحديث عرض النقاط والأرواح
function updateStatus() {
  document.getElementById('scoreDisplay').textContent = score;
  document.getElementById('livesDisplay').textContent = '❤️'.repeat(lives);
  const level = levels[currentLevelIndex];
  const progressDisplay = document.getElementById('progressDisplay');
  const placedCount = document.querySelectorAll('.drop-zone.correct').length;
  progressDisplay.textContent = `التقدم: ${placedCount} من ${level.letters.length}`;
}

// دوال سحب وإفلات (Drag & Drop)
let draggedLetter = null;

function dragStartHandler(event) {
  draggedLetter = event.target;
  event.dataTransfer.setData('text/plain', event.target.dataset.letter);
  setTimeout(() => {
    event.target.classList.add('dragging');
  }, 0);
}

function dragOverHandler(event) {
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
}

function dropHandler(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');

  const dropZoneLetter = event.currentTarget.dataset.letter;
  const draggedLetterChar = event.dataTransfer.getData('text/plain');

  if (dropZoneLetter === draggedLetterChar) {
    // ناجح
    event.currentTarget.classList.add('correct');
    draggedLetter.classList.add('hidden');
    score += 10;
  } else {
    // خطأ
    lives--;
    alert('خطأ! حاول مرة أخرى.');
  }

  updateStatus();
  checkLevelCompletion();
}

// إنهاء السحب
function dragEndHandler(event) {
  event.target.classList.remove('dragging');
}

// التحقق من إتمام المستوى
function checkLevelCompletion() {
  const level = levels[currentLevelIndex];
  const placedCount = document.querySelectorAll('.drop-zone.correct').length;
  if (placedCount === level.letters.length) {
    // عرض نافذة الاحتفال
    showCelebration();
  } else if (lives <= 0) {
    alert('انتهت الأرواح! حاول مرة أخرى.');
    restartGame();
  }
}

// عرض نافذة الاحتفال (مثال بسيط)
function showCelebration() {
  document.getElementById('celebrationModal').classList.remove('hidden');
  document.getElementById('finalScore').textContent = score;

  // عرض النجوم - مثال: 3 نجوم لكل 80 نقطة أو أكثر
  const starsDisplay = document.getElementById('starsDisplay');
  starsDisplay.innerHTML = '';
  let starsCount = 1;
  if (score >= levels[currentLevelIndex].letters.length * 10 * 0.8) starsCount = 3;
  else if (score >= levels[currentLevelIndex].letters.length * 10 * 0.5) starsCount = 2;

  for (let i = 0; i < starsCount; i++) {
    const star = document.createElement('span');
    star.textContent = '⭐';
    star.style.fontSize = '2rem';
    starsDisplay.appendChild(star);
  }
}

// الانتقال للمستوى التالي
function nextLevel() {
  document.getElementById('celebrationModal').classList.add('hidden');
  currentLevelIndex++;
  if (currentLevelIndex >= levels.length) {
    showSuccessModal();
  } else {
    loadLevel(currentLevelIndex);
  }
}

// إظهار نافذة الانتهاء من اللعبة
function showSuccessModal() {
  document.getElementById('successModal').classList.remove('hidden');
  // ضع رابط فيديو المكافأة هنا:
  const rewardVideo = document.getElementById('rewardVideo');
  rewardVideo.src = 'https://www.youtube.com/watch?v=MBsYXRytFo8'; // مثال فيديو
}

// إغلاق النوافذ
function closeModal() {
  document.getElementById('celebrationModal').classList.add('hidden');
}

function closeColoringModal() {
  document.getElementById('coloringModal').classList.add('hidden');
}

// إعادة اللعبة من البداية
function restartGame() {
  lives = 3;
  score = 0;
  currentLevelIndex = 0;
  document.getElementById('celebrationModal').classList.add('hidden');
  document.getElementById('successModal').classList.add('hidden');
  loadLevel(currentLevelIndex);
  updateStatus();
}

// العودة لقائمة البداية
function goToMainMenu() {
  document.getElementById('gameContainer').classList.add('hidden');
  document.getElementById('intro').style.display = 'flex';
  restartGame();
}

// الانتقال إلى مستوى معين
function goToLevel(index) {
  if (index < 0 || index >= levels.length) return;
  currentLevelIndex = index;
  restartGame();
}

// دالة المشاركة
function shareGame() {
  if (navigator.share) {
    navigator.share({
      title: 'كوكو وأصدقاء الحروف',
      text: 'تعلم الحروف العربية بطريقة ممتعة مع لعبة كوكو!',
      url: window.location.href,
    }).catch((error) => {
      console.error('خطأ في المشاركة:', error);
    });
  } else {
    alert('ميزة المشاركة غير مدعومة في متصفحك.');
  }
}

// يمكنك هنا إضافة المزيد من الدوال الخاصة بالتلوين أو الأصوات

// إضافة مستمعات الأحداث اللازمة للحروف القابلة للسحب عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // سيتم تحميل الحروف عند بدء اللعبة، لا حاجة لفعل شيء هنا
});
