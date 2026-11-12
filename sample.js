// Complete Dataset with Unique IDs & Links
const activities = [
  // --- Crosswords ---
  { id: 1, title: "Business Communication", grade: "Grade 8", subject: "pre-technical", type: "Crossword", level: "Intermediate", description: "Test your Communication Skills.", link: "Pre-tech communication.html" },
  { id: 2, title: "Visual Programming Crossword", grade: "Grade 8", subject: "pre-technical", type: "Crossword", level: "Advanced", description: "Visual Programming test it right now.", link: "visual-programming.html" },
  { id: 3, title: "Ecosystems & Habitats", grade: "Grade 6", subject: "Integrated Science", type: "Crossword", level: "Intermediate", description: "Explore plants, animals, and ecosystem terms.", link: "ecosystems.html" },
  { id: 4, title: "Ceramics and Materials Crossword", grade: "Grade 8", subject: "pre-technical", type: "Crossword", level: "basic", description: "Ceramics and Composites test it right now.", link: "pre-teckcomposite-ceramics.html" },
  { id: 5, title: "Word Detectives", grade: "Grade 4", subject: "English", type: "Crossword", level: "Beginner", description: "Match simple clues to vocabulary words.", link: "#" },
  { id: 6, title: "Kiswahili Msamiati", grade: "Grade 5", subject: "Kiswahili", type: "Crossword", level: "Beginner", description: "Practise Kiswahili vocabulary and meanings.", link: "#" },

  // --- Sudoku ---
  { id: 7, title: "Number Logic 4×4", grade: "Grade 8", subject: "Mathematics", type: "Sudoku", level: "Beginner", description: "A small number-grid challenge for logic practice.", link: "sudoku.html" },
  { id: 8, title: "Shape Sudoku 4×4", grade: "Pre-School", subject: "Mathematics", type: "Sudoku", level: "Beginner", description: "Arrange basic numbers and shapes in a mini grid.", link: "#" },
  { id: 9, title: "JSS Algebra Sudoku", grade: "Grade 9", subject: "Mathematics", type: "Sudoku", level: "Advanced", description: "Solve algebraic equations to unlock Sudoku grid entries.", link: "#" },

  // --- Quiz ---
  { id: 10, title: "Science Trivia Quiz", grade: "Grade 7", subject: "Integrated Science", type: "Quiz", level: "Intermediate", description: "Test your knowledge on ecosystems, matter, and energy.", link: "quiz.html" },
  { id: 11, title: "Social Studies Map Quiz", grade: "Grade 6", subject: "Social Studies", type: "Quiz", level: "Beginner", description: "Identify continents, countries, and physical features.", link: "#" },
  { id: 12, title: "Kiswahili Sarufi Quiz", grade: "Grade 6", subject: "Kiswahili", type: "Quiz", level: "Intermediate", description: "Mazoezi ya sarufi na vitenzi.", link: "#" },

  // --- Flashcards ---
  { id: 13, title: "English Vocabulary Cards", grade: "Grade 4", subject: "English", type: "Flashcards", level: "Beginner", description: "Flip cards to master challenging new vocabulary words.", link: "flashcards.html" },
  { id: 14, title: "Kiswahili Vitenzi Flashcards", grade: "Grade 5", subject: "Kiswahili", type: "Flashcards", level: "Beginner", description: "Master verbs and daily usage in Kiswahili.", link: "#" },
  { id: 15, title: "Pre-Technical Tools Flashcards", grade: "Grade 8", subject: "pre-technical", type: "Flashcards", level: "Intermediate", description: "Learn workshop tools, symbols, and equipment names.", link: "#" },

  // --- Word Search ---
  { id: 16, title: "Animal Kingdom Word Search", grade: "Grade 3", subject: "Integrated Science", type: "Word Search", level: "Beginner", description: "Find hidden animals in the letter matrix.", link: "wordsearch.html" },
  { id: 17, title: "Tech Term Word Search", grade: "Grade 9", subject: "pre-technical", type: "Word Search", level: "Advanced", description: "Hunt for programming and computer hardware terms.", link: "#" }
];

// DOM Element Variables
const gradeFilter = document.querySelector("#grade-filter");
const subjectFilter = document.querySelector("#subject-filter");
const typeFilter = document.querySelector("#type-filter");
const activityList = document.querySelector("#activity-list");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const resetButton = document.querySelector("#reset-button");

// Modal Variables
const gameModal = document.querySelector("#gameModal");
const closeModal = document.querySelector("#closeModal");
const modalTitle = document.querySelector("#modalTitle");
const modalCategory = document.querySelector("#modalCategory");
const modalBody = document.querySelector("#modalBody");

// Audio Variables
const soundToggle = document.getElementById("soundToggle");
const musicToggle = document.getElementById("musicToggle");
const musicVolume = document.getElementById("musicVolume");
const bgMusic = document.getElementById("bgMusic");

const sfxClick = document.getElementById("sfxClick");
const sfxHover = document.getElementById("sfxHover");
const sfxPlay = document.getElementById("sfxPlay");
const sfxSwitch = document.getElementById("sfxSwitch");

// State Variables
let soundEnabled = true;
let musicEnabled = true;
let lastHoverTime = 0;

/* ==========================================
   EXPLICIT FUNCTION VARIABLES FOR SFX
========================================== */
const playAudioFile = function (audioElem) {
  if (!soundEnabled || !audioElem) return;
  try {
    audioElem.currentTime = 0;
    audioElem.play().catch(function () {});
  } catch (e) {}
};

const triggerClickSound = function () { playAudioFile(sfxClick); };
const triggerHoverSound = function () {
  const now = Date.now();
  if (now - lastHoverTime < 150) return;
  lastHoverTime = now;
  playAudioFile(sfxHover);
};
const triggerPlayButtonSound = function () { playAudioFile(sfxPlay); };
const triggerSwitchSound = function () { playAudioFile(sfxSwitch); };

/* ==========================================
   EXPLICIT FUNCTION VARIABLES FOR GAME MODAL
========================================== */
const openGameModal = function (activity) {
  triggerPlayButtonSound();
  modalTitle.textContent = activity.title;
  modalCategory.textContent = `${activity.type} · ${activity.grade} · ${activity.subject}`;
  modalBody.innerHTML = "";

  if (activity.type === "Quiz") {
    modalBody.innerHTML = `
      <p style="color:var(--muted); margin-bottom:15px;">Sample Question: ${activity.description}</p>
      <h3>What is the main objective of this lesson?</h3>
      <button class="quiz-option" data-correct="true">A) Master ${activity.subject} concepts</button>
      <button class="quiz-option" data-correct="false">B) Random guessing</button>
      <button class="quiz-option" data-correct="false">C) Skip practice</button>
      <p id="quizFeedback" style="margin-top:15px; font-weight:700;"></p>
    `;
    const options = modalBody.querySelectorAll(".quiz-option");
    options.forEach(function (opt) {
      opt.addEventListener("click", function () {
        triggerClickSound();
        const feedback = modalBody.querySelector("#quizFeedback");
        if (this.getAttribute("data-correct") === "true") {
          feedback.style.color = "#4ade80";
          feedback.textContent = "Correct! Great job!";
        } else {
          feedback.style.color = "#f87171";
          feedback.textContent = "Incorrect. Try again!";
        }
      });
    });
  } else if (activity.type === "Flashcards") {
    let flipped = false;
    modalBody.innerHTML = `
      <div id="flashcardEl" class="flashcard">Click to Flip Card</div>
      <p style="color:var(--muted);">Sample Flashcard · Click card to reveal definition</p>
    `;
    const cardEl = modalBody.querySelector("#flashcardEl");
    cardEl.addEventListener("click", function () {
      triggerClickSound();
      flipped = !flipped;
      cardEl.textContent = flipped ? `Definition: ${activity.description}` : "Click to Flip Card";
    });
  } else {
    modalBody.innerHTML = `
      <p style="color:var(--muted); margin-bottom:20px;">${activity.description}</p>
      <div style="background:var(--panel2); border:1px dashed var(--accent); padding:30px; border-radius:12px; font-size:1.1rem;">
        🎮 Dynamic sample workspace for <strong>${activity.type}</strong>!
      </div>
      <button class="play-link" style="margin-top:20px;" onclick="closeGameModalFunc()">Close Preview</button>
    `;
  }

  gameModal.hidden = false;
};

const closeGameModalFunc = function () {
  triggerClickSound();
  gameModal.hidden = true;
};

window.closeGameModalFunc = closeGameModalFunc;

/* ==========================================
   EXPLICIT FUNCTION VARIABLES FOR FILTERING & RENDERING
========================================== */
const getFilteredActivities = function () {
  return activities.filter(function (activity) {
    const gradeMatches = gradeFilter.value === "all" || activity.grade === gradeFilter.value;
    const subjectMatches = subjectFilter.value === "all" || activity.subject === subjectFilter.value;
    const typeMatches = typeFilter.value === "all" || activity.type === typeFilter.value;
    return gradeMatches && subjectMatches && typeMatches;
  });
};

const renderActivities = function () {
  const matches = getFilteredActivities();
  activityList.innerHTML = "";

  matches.forEach(function (activity) {
    const card = document.createElement("article");
    card.className = "activity-card";
    
    let icon = "▦";
    if (activity.type === "Sudoku") icon = "▩";
    if (activity.type === "Quiz") icon = "❓";
    if (activity.type === "Flashcards") icon = "🃏";
    if (activity.type === "Word Search") icon = "🔍";

    const isDirectLink = activity.link && activity.link !== "#";
    const actionElement = isDirectLink 
      ? `<a class="play-link" href="${activity.link}">Open activity →</a>`
      : `<button class="play-link" type="button">Open activity →</button>`;

    card.innerHTML = `
      <div class="card-top">
        <div class="game-icon" aria-hidden="true">${icon}</div>
        <span class="pill">${activity.type}</span>
      </div>
      <h3>${activity.title}</h3>
      <p>${activity.description}</p>
      <div class="meta">${activity.grade} · ${activity.subject} · ${activity.level}</div>
      ${actionElement}
    `;

    card.addEventListener("mouseenter", triggerHoverSound);
    const playBtn = card.querySelector(".play-link");
    if (playBtn) {
      playBtn.addEventListener("mouseenter", triggerHoverSound);
      if (!isDirectLink) {
        playBtn.addEventListener("click", function () {
          openGameModal(activity);
        });
      } else {
        playBtn.addEventListener("click", triggerPlayButtonSound);
      }
    }

    activityList.appendChild(card);
  });

  resultCount.textContent = `${matches.length} ${matches.length === 1 ? "activity" : "activities"}`;
  emptyState.hidden = matches.length !== 0;
};

const handleFilterChange = function () {
  triggerSwitchSound();
  renderActivities();
};

const handleResetFilters = function () {
  triggerClickSound();
  gradeFilter.value = "all";
  subjectFilter.value = "all";
  typeFilter.value = "all";
  renderActivities();
};

const handleSoundToggle = function () {
  soundEnabled = !soundEnabled;
  soundToggle.querySelector(".hud-text").textContent = soundEnabled ? "SFX On" : "SFX Off";
  soundToggle.querySelector(".hud-icon").textContent = soundEnabled ? "🔊" : "🔇";
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  if (soundEnabled) triggerClickSound();
};

/* ==========================================
   EXPLICIT FUNCTION VARIABLES FOR BACKGROUND MUSIC
========================================== */
const startBackgroundMusic = function () {
  if (!musicEnabled || !bgMusic) return;
  bgMusic.play().catch(function () {});
};

const stopBackgroundMusic = function () {
  if (bgMusic) bgMusic.pause();
};

const handleMusicToggle = function () {
  musicEnabled = !musicEnabled;
  if (musicEnabled) {
    musicToggle.querySelector(".hud-text").textContent = "Music On";
    musicToggle.setAttribute("aria-pressed", "true");
    startBackgroundMusic();
  } else {
    musicToggle.querySelector(".hud-text").textContent = "Music Off";
    musicToggle.setAttribute("aria-pressed", "false");
    stopBackgroundMusic();
  }
};

const handleVolumeChange = function () {
  if (bgMusic && musicVolume) {
    bgMusic.volume = Number(musicVolume.value) / 100;
  }
};

const handleUserFirstInteraction = function (event) {
  if (event.target && event.target.closest && event.target.closest("#musicToggle")) return;
  startBackgroundMusic();
};

/* ==========================================
   EVENT LISTENERS ASSIGNMENT
========================================== */
if (bgMusic && musicVolume) {
  bgMusic.volume = Number(musicVolume.value) / 100;
}

[gradeFilter, subjectFilter, typeFilter].forEach(function (filter) {
  filter.addEventListener("change", handleFilterChange);
});

if (resetButton) {
  resetButton.addEventListener("click", handleResetFilters);
}

if (closeModal) {
  closeModal.addEventListener("click", closeGameModalFunc);
}

if (soundToggle) {
  soundToggle.addEventListener("click", handleSoundToggle);
}

if (musicToggle) {
  musicToggle.addEventListener("click", handleMusicToggle);
}

if (musicVolume) {
  musicVolume.addEventListener("input", handleVolumeChange);
}

document.addEventListener("pointerdown", handleUserFirstInteraction, { once: true });

// Initial Page Render
renderActivities();