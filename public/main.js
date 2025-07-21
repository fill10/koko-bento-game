// المتغيرات الأساسية
let lives = 3;
let score = 0;
let currentLevelIndex = 0;

const levels = [
  // بيانات الحروف لكل مستوى (كمثال)
  [
    { letter: "ح", name: "حصان", img: "./assets/horse.png", dropZoneId: "drop-h" },
    { letter: "خ", name: "خروف", img: "./assets/sheep.png", dropZoneId: "drop-kh" },
    // أضف الحروف للمستوى الأول
  ],
  // مستويات أخرى...
];

// تحميل المستوى الحالي
function loadLevel(index) {
  const dropzonesContainer = document.getElementById('dropzonesContainer');
  const draggablesContainer = document.getElementById('draggablesContainer');

  dropzonesContainer.innerHTML = "";
  draggablesContainer.innerHTML = "";

  const levelData = levels[index];

  levelData.forEach(item => {
    // إنشاء مناطق الإسقاط
    const dropZone = document.createElement('div');
    dropZone.id = item.dropZoneId;
    dropZone.className = 'drop-zone p-4 mb-3 rounded-lg font-arabic text-center text-2xl text-gray-800';
    dropZone.textContent = "⬜"; // رمز مكان فارغ، يمكن تغييره
    dropZone.dataset.letter = item.letter;

    // مستمعات أحداث السحب والإفلات
    dropZone.addEventListener('dragover', event => event.preventDefault());
    dropZone.addEventListener('drop', event => onDrop(event, dropZone));

    dropzonesContainer.appendChild(dropZone);

    // إنشاء الحروف القابلة للسحب
    const draggable = document.createElement('img');
    draggable.src = item.img;
    draggable.alt = item.name;
    draggable.className = 'letter-card cursor-move';
    draggable.draggable = true;
    draggable.dataset.letter = item.letter;

    draggable.addEventListener('dragstart', onDragStart);

    draggablesContainer.appendChild(draggable);
  });
}

// التحديث البسيط للحالة (النقاط والأرواح)
function updateStatus() {
  document.getElementById('scoreDisplay').textContent = score;
  document.getElementById('livesDisplay').textContent = "❤️".repeat(lives);
  document.getElementById('progressDisplay').textContent = `التقدم: ${score} من ${levels[currentLevelIndex].length}`;
  document.getElementById('levelTitle').textContent = `المستوى ${currentLevelIndex + 1}`;
}

// بدء اللعبة من الواجهة
function startGame() {
  document.getElementById('intro').style.display = 'none';
  document.getElementById('gameContainer').classList.remove('hidden');
  currentLevelIndex = 0;
  lives = 3;
  score = 0;
  loadLevel(currentLevelIndex);
  updateStatus();
}

// إعادة تشغيل اللعبة
function restartGame() {
  closeModal();
  lives = 3;
  score = 0;
  currentLevelIndex = 0;
  document.getElementById('celebrationModal').classList.add('hidden');
  document.getElementById('successModal').classList.add('hidden');
  loadLevel(currentLevelIndex);
  updateStatus();
}

// العودة للشاشة الرئيسية
function goToMainMenu() {
  closeModal();
  document.getElementById('gameContainer').classList.add('hidden');
  document.getElementById('intro').style.display = 'flex';
  restartGame();
}

// السحب
function onDragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.dataset.letter);
  event.target.classList.add('dragging');
}

// الإفلات
function onDrop(event, dropZone) {
  event.preventDefault();
  const draggedLetter = event.dataTransfer.getData('text/plain');
  const expectedLetter = dropZone.dataset.letter;

  if (draggedLetter === expectedLetter) {
    // صحيح
    score++;
    updateStatus();

    // تعطيل العنصر المسحوب
    const draggableItems = document.querySelectorAll('#draggablesContainer img');
    draggableItems.forEach(img => {
      if (img.dataset.letter === draggedLetter) {
        img.draggable = false;
        img.classList.add('opacity-50');
      }
    });

    // تلوين منطقة الإسقاط للإشارة للصحة
    dropZone.classList.add('correct');
    dropZone.textContent = draggedLetter;

    if (score === levels[currentLevelIndex].length) {
      // انتهاء المستوى
      setTimeout(() => showCelebration(), 500);
    }
  } else {
    // خطأ
    lives--;
    updateStatus();
    if (lives <= 0) {
      alert('انتهت الأرواح! حاول مرة أخرى.');
      restartGame();
    }
  }
}

// إظهار نافذة الاحتفال عند إكمال المستوى
function showCelebration() {
  document.getElementById('celebrationModal').classList.remove('hidden');
  document.getElementById('celebrationTitle').textContent = 'أحسنت!';
  document.getElementById('celebrationMessage').textContent = 'لقد أكملت هذا المستوى بنجاح!';
  document.getElementById('finalScore').textContent = score;

  // عرض النجوم بناء على النقاط (مثال)
  const starsDisplay = document.getElementById('starsDisplay');
  starsDisplay.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const star = document.createElement('span');
    star.textContent = i < 2 ? '⭐' : '✩';
    starsDisplay.appendChild(star);
  }
}

// الانتقال للمستوى التالي
function nextLevel() {
  document.getElementById('celebrationModal').classList.add('hidden');
  currentLevelIndex++;
  if (currentLevelIndex >= levels.length) {
    // انتهت اللعبة، عرض فيديو المكافأة
    showSuccessModal();
  } else {
    score = 0;
    lives = 3;
    loadLevel(currentLevelIndex);
    updateStatus();
  }
}

// عرض فيديو المكافأة عند انتهاء اللعبة
function showSuccessModal() {
  const successModal = document.getElementById('successModal');
  const rewardVideo = document.getElementById('rewardVideo');
  
  // الرابط بصيغة embed + autoplay + rel=0 لاقتراحات من نفس القناة
  rewardVideo.src = "https://www.youtube.com/embed/MBsYXRytFo8?autoplay=1&rel=0";
  
  successModal.classList.remove('hidden');
}

// إغلاق نافذة الفيديو وإيقافه
function closeModal() {
  const successModal = document.getElementById('successModal');
  const rewardVideo = document.getElementById('rewardVideo');
  rewardVideo.src = ""; // إيقاف الفيديو
  successModal.classList.add('hidden');
}

// مشاركة اللعبة (مثال)
function shareGame() {
  if (navigator.share) {
    navigator.share({
      title: 'كوكو وأصدقاء الحروف',
      text: 'تعلم الحروف العربية بطريقة ممتعة مع لعبة كوكو!',
      url: window.location.href
    }).then(() => {
      console.log('تمت المشاركة بنجاح');
    }).catch(console.error);
  } else {
    alert('ميزة المشاركة غير مدعومة في هذا المتصفح.');
  }
}

// الذهاب لمستوى معين (مثال)
function goToLevel(index) {
  currentLevelIndex = index;
  score = 0;
  lives = 3;
  loadLevel(currentLevelIndex);
  updateStatus();
  document.getElementById('celebrationModal').classList.add('hidden');
  document.getElementById('successModal').classList.add('hidden');
}

// تحميل أول مرة
window.onload = () => {
  document.getElementById('intro').style.display = 'flex';
  document.getElementById('gameContainer').classList.add('hidden');
};
