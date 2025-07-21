<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>كوكو وأصدقاء الحروف</title>
  <style>
    body {
      font-family: sans-serif;
      background: #fff4ea;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    #game-screen, #video-screen {
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    #intro-screen, #video-screen {
      text-align: center;
    }
    button {
      padding: 12px 24px;
      font-size: 20px;
      margin: 10px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      background-color: #ffcf4f;
    }
    .dropzone-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 20px;
      margin: 30px 0;
    }
    .dropzone, .draggable {
      width: 100px;
      height: 100px;
      background-color: #eee;
      border: 2px dashed #999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      border-radius: 12px;
    }
    .draggable {
      background-color: #d3f9d8;
      cursor: grab;
    }
    .hidden {
      display: none;
    }
    iframe {
      border: none;
      width: 90vw;
      height: 50vh;
    }
  </style>
</head>
<body>
  <div id="intro-screen">
    <h1>مرحبًا بك في كوكو وأصدقاء الحروف</h1>
    <button onclick="startGame()">ابدأ</button>
  </div>

  <div id="game-screen">
    <div class="dropzone-container" id="dropzones"></div>
    <div class="dropzone-container" id="draggables"></div>
  </div>

  <div id="video-screen">
    <div id="video-container"></div>
    <button id="btn-close" onclick="closeVideo()" class="hidden">❌ إغلاق</button>
    <button onclick="restartGame()" class="hidden" id="btn-restart">🔁 إعادة</button>
    <button onclick="goToIntro()" class="hidden" id="btn-home">🏠 الرئيسية</button>
  </div>

  <script>
    const letters = [
      { letter: "أ", image: "alif.png" },
      { letter: "ب", image: "ba.png" },
      { letter: "ت", image: "ta.png" },
      { letter: "ث", image: "tha.png" },
      { letter: "ج", image: "jeem.png" }
      // أضف المزيد حسب حاجتك
    ];

    function startGame() {
      document.getElementById("intro-screen").style.display = "none";
      document.getElementById("game-screen").style.display = "flex";
      setupGame();
    }

    function setupGame() {
      const dropzones = document.getElementById("dropzones");
      const draggables = document.getElementById("draggables");
      dropzones.innerHTML = "";
      draggables.innerHTML = "";

      // ترتيب الحروف من اليمين
      letters.forEach((item, i) => {
        const zone = document.createElement("div");
        zone.className = "dropzone";
        zone.dataset.letter = item.letter;
        zone.ondragover = (e) => e.preventDefault();
        zone.ondrop = (e) => onDrop(e, zone);
        zone.innerText = item.letter;
        dropzones.prepend(zone); // للترتيب من اليمين
      });

      // عشوائية السحب
      const shuffled = [...letters].sort(() => 0.5 - Math.random());
      shuffled.forEach((item) => {
        const drag = document.createElement("div");
        drag.className = "draggable";
        drag.draggable = true;
        drag.dataset.letter = item.letter;
        drag.ondragstart = (e) => {
          e.dataTransfer.setData("text/plain", item.letter);
        };
        drag.innerText = item.letter;
        draggables.appendChild(drag);
      });
    }

    function onDrop(e, zone) {
      const dropped = e.dataTransfer.getData("text/plain");
      if (dropped === zone.dataset.letter) {
        zone.style.backgroundColor = "#c8e6c9";
        zone.innerText = "✔";
        checkWin();
      } else {
        zone.style.backgroundColor = "#ffcdd2";
      }
    }

    function checkWin() {
      const zones = document.querySelectorAll(".dropzone");
      const allCorrect = Array.from(zones).every(z => z.innerText === "✔");
      if (allCorrect) showVideo();
    }

    let player;
    function showVideo() {
      document.getElementById("game-screen").style.display = "none";
      document.getElementById("video-screen").style.display = "block";

      // إعداد iframe مع YouTube API
      document.getElementById("video-container").innerHTML = `
        <div id="ytplayer"></div>
      `;

      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    function onYouTubeIframeAPIReady() {
      player = new YT.Player('ytplayer', {
        height: '390',
        width: '640',
        videoId: 'MBsYXRytFo8',
        playerVars: { 'autoplay': 1, 'rel': 0 },
        events: {
          'onStateChange': onPlayerStateChange
        }
      });
    }

    function onPlayerStateChange(event) {
      if (event.data === YT.PlayerState.ENDED) {
        document.getElementById("btn-close").classList.remove("hidden");
        document.getElementById("btn-restart").classList.remove("hidden");
        document.getElementById("btn-home").classList.remove("hidden");
      }
    }

    function closeVideo() {
      document.getElementById("video-screen").style.display = "none";
    }
    function restartGame() {
      closeVideo();
      startGame();
    }
    function goToIntro() {
      closeVideo();
      document.getElementById("intro-screen").style.display = "block";
    }
  </script>
</body>
</html>
