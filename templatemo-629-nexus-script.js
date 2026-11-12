(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cards = Array.prototype.slice.call(document.querySelectorAll(".zcard"));
  var hudFill = document.getElementById("hudFill");
  var hudPct = document.getElementById("hudPct");
  var navUp = document.getElementById("navUp");
  var navDown = document.getElementById("navDown");

  var vh = window.innerHeight;
  var ticking = false;

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  /* Z-Depth Escalator Engine */
  function renderEngine() {
    var y = window.scrollY || window.pageYOffset || 0;
    var i, entry, recede, scale, ty;

    for (i = 0; i < cards.length; i++) {
      entry = i === 0 ? 1 : clamp01((y - (i - 1) * vh) / vh);
      recede = i === cards.length - 1 ? 0 : clamp01((y - i * vh) / vh);
      scale = 1 - 0.1 * recede;
      ty = (1 - entry) * 100;
      cards[i].style.transform = "translateY(" + ty + "%) scale(" + scale + ")";
      cards[i].style.opacity = String(1 - 0.6 * recede);
    }
  }

  function renderProgress() {
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var p = clamp01((window.scrollY || window.pageYOffset || 0) / max);
    hudFill.style.width = (p * 100) + "%";
    hudPct.textContent = String(Math.round(p * 100)).padStart(3, "0") + "%";
    navUp.disabled = p <= 0.001;
    navDown.disabled = p >= 0.999;
  }

  function onFrame() {
    if (!reduceMotion) { renderEngine(); }
    renderProgress();
    ticking = false;
  }

  function requestRender() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onFrame);
    }
  }

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", function () {
    vh = window.innerHeight;
    requestRender();
  });

  setTimeout(requestRender, 3000);
  requestRender();

  function gotoCard(index) {
    var i = Math.max(0, Math.min(cards.length - 1, index));
    var top;

    if (reduceMotion) {
      top = cards[i].getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
      window.scrollTo(0, top);
    } else {
      window.scrollTo({ top: i * vh, behavior: "smooth" });
    }
  }

  navUp.addEventListener("click", function () {
    var y = window.scrollY || window.pageYOffset || 0;
    gotoCard(Math.ceil(y / vh - 0.001) - 1);
  });

  navDown.addEventListener("click", function () {
    var y = window.scrollY || window.pageYOffset || 0;
    gotoCard(Math.floor(y / vh + 0.001) + 1);
  });

  /* Kinetic Accordion Fold */
  var accordion = document.getElementById("accordion");
  var slices = Array.prototype.slice.call(accordion.querySelectorAll(".slice"));
  var hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function setActiveSlice(target) {
    slices.forEach(function (s) {
      var on = s === target;
      s.classList.toggle("active", on);
      s.setAttribute("aria-expanded", on ? "true" : "false");
    });
  }

  slices.forEach(function (slice) {
    if (hoverCapable) {
      slice.addEventListener("mouseenter", function () { setActiveSlice(slice); });
      slice.addEventListener("focus", function () { setActiveSlice(slice); });
    }
    slice.addEventListener("click", function () {
      if (slice.classList.contains("active") && !hoverCapable) {
        setActiveSlice(null);
      } else {
        setActiveSlice(slice);
      }
    });
  });

  if (hoverCapable) {
    accordion.addEventListener("mouseleave", function () { setActiveSlice(null); });
  }
  /* ==========================================
     Choose level Href
  ========================================== */
document.getElementById("pre-schoolBtn").addEventListener("click", function() {
  window.location.href = "Choose.html";
});
document.getElementById("primaryschoolbtn").addEventListener("click", function() {
  window.location.href = "Choose.html";
});
document.getElementById("jssbtn").addEventListener("click", function() {
  window.location.href = "Choose.html";
});
document.getElementById("seniorschoolbtn").addEventListener("click", function() {
  window.location.href = "Choose.html";
});

  /* Matrix Tabs */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".matrix-tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".matrix-img"));
  var caption = document.getElementById("matrixCaption");

  var captions = {
    core: "FIG. 01 / Engage Now",
    fluidics: "FIG. 02 / Explore and Adventure",
    sync: "FIG. 03 / Learn and conqure"
  };

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-goto");

      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });

      panels.forEach(function (p) {
        p.classList.toggle("active", p.getAttribute("data-panel") === key);
      });

      caption.textContent = captions[key];
    });
  });

  /* ==========================================
     SOUND EFFECTS CONTROLLER (EXTERNAL FILES)
  ========================================== */
  var soundToggle = document.getElementById("soundToggle");
  var soundEnabled = true;
  var lastHoverTime = 0;

  var sfxClick = document.getElementById("sfxClick");
  var sfxHover = document.getElementById("sfxHover");
  var sfxPlay = document.getElementById("sfxPlay");
  var sfxSwitch = document.getElementById("sfxSwitch");

  function playAudioFile(audioElem) {
    if (!soundEnabled || !audioElem) return;
    try {
      audioElem.currentTime = 0;
      audioElem.play().catch(function () {});
    } catch (e) {}
  }

  function triggerClickSound() { playAudioFile(sfxClick); }
  function triggerHoverSound() {
    var now = Date.now();
    if (now - lastHoverTime < 150) return;
    lastHoverTime = now;
    playAudioFile(sfxHover);
  }
  function triggerPlayButtonSound() { playAudioFile(sfxPlay); }
  function triggerSwitchSound() { playAudioFile(sfxSwitch); }

  // Global click event handler
  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var interactive = target.closest("button, .Play, .hud-brand");
    if (!interactive) return;
    if (interactive.id === "soundToggle" || interactive.id === "themeToggle") return;

    if (interactive.matches(".Play") || interactive.closest(".Play")) {
      triggerPlayButtonSound();
    } else {
      triggerClickSound();
    }
  });

  // Card hover sound effects
  slices.forEach(function (slice) {
    slice.addEventListener("mouseenter", function () {
      if (slice !== document.activeElement) triggerHoverSound();
    });
  });

  // Play Button hover sound effect
  var playBtn = document.querySelector(".Play");
  if (playBtn) {
    playBtn.addEventListener("mouseenter", triggerHoverSound);
  }

  // Tab switch sound effects
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      triggerSwitchSound();
    });
  });

  // Mute / Unmute control for sound effects
  if (soundToggle) {
    soundToggle.addEventListener("click", function () {
      soundEnabled = !soundEnabled;
      soundToggle.textContent = soundEnabled ? "🔊 Sound On" : "🔇 Sound Off";
      soundToggle.setAttribute("aria-pressed", String(soundEnabled));
      soundToggle.setAttribute("aria-label", soundEnabled ? "Mute sound" : "Enable sound");
      if (soundEnabled) triggerClickSound();
    });
  }

  /* ==========================================
     BACKGROUND MUSIC CONTROLLER (EXTERNAL FILE)
  ========================================== */
  var musicToggle = document.getElementById("musicToggle");
  var musicVolume = document.getElementById("musicVolume");
  var bgMusic = document.getElementById("bgMusic");
  var musicEnabled = true;

  if (bgMusic && musicVolume) {
    bgMusic.volume = Number(musicVolume.value) / 100;
  }

  function startBackgroundMusic() {
    if (!musicEnabled || !bgMusic) return;
    bgMusic.play().catch(function () {});
  }

  function stopBackgroundMusic() {
    if (bgMusic) {
      bgMusic.pause();
    }
  }

  document.addEventListener("pointerdown", function (event) {
    if (event.target.closest && event.target.closest("#musicToggle")) return;
    startBackgroundMusic();
  }, { once: true });

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener("click", function () {
      musicEnabled = !musicEnabled;
      if (musicEnabled) {
        musicToggle.textContent = "♫ Music On";
        musicToggle.setAttribute("aria-pressed", "true");
        startBackgroundMusic();
      } else {
        musicToggle.textContent = "♫ Music Off";
        musicToggle.setAttribute("aria-pressed", "false");
        stopBackgroundMusic();
      }
    });
  }

  if (musicVolume && bgMusic) {
    musicVolume.addEventListener("input", function () {
      bgMusic.volume = Number(musicVolume.value) / 100;
    });
  }

  /* ==========================================
     THEME TOGGLE CONTROLLER (LIGHT/DARK)
  ========================================== */
  var themeToggle = document.getElementById("themeToggle");
  var savedTheme = localStorage.getItem("nexus_theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      var isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("nexus_theme", isDark ? "dark" : "light");
      triggerClickSound();
    });
  }

})();