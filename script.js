
let currentLevel = "";
let currentCategory = "";
let currentSublevel = "";
let nickname = "";
let currentWord = "";
let guessedLetters = [];
let attemptsLeft = 6;
let correctWords = 0;
let currentWordIndex = 0;
let totalRequired = 3;
let wordsThisStage = [];

window.onload = () => {
  const levelSelect = document.getElementById("level-select");
  Object.keys(levels).forEach(level => {
    const opt = document.createElement("option");
    opt.value = level;
    opt.textContent = level;
    levelSelect.appendChild(opt);
  });
};

function goToCategorySelection() {
  nickname = document.getElementById("nickname").value.trim();
  currentLevel = document.getElementById("level-select").value;
  if (!nickname || !currentLevel) {
    alert("Por favor ingresa tu nombre y selecciona un nivel.");
    return;
  }
  const catSel = document.getElementById("category-select");
  catSel.innerHTML = "";
  const categorias = new Set();
  for (const etapa of Object.values(levels[currentLevel])) {
    categorias.add(etapa.category);
  }
  categorias.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    catSel.appendChild(opt);
  });
  showScreen("category-screen");
}

async function goToStageSelection() {
  currentCategory = document.getElementById("category-select").value;
  const container = document.getElementById("stages-container");
  container.innerHTML = "";

  const visuals = await fetch("category_visuals.json").then(res => res.json());

  Object.entries(levels[currentLevel]).forEach(([key, etapa]) => {
    if (etapa.category === currentCategory) {
      const card = document.createElement("div");
      card.className = "stage-card";
      card.onclick = () => startStage(key);

      const visual = visuals[etapa.category];
      card.innerHTML = `
        <div class="stage-image" style="background-image:url('${visual?.image || ""}')">
          <div class="stage-label">${visual?.icon || ""} ${etapa.title}</div>
        </div>
      `;

      container.appendChild(card);
    }
  });

  showScreen("stage-screen");
}

function startStage(sublevel) {
  currentSublevel = sublevel;
  correctWords = 0;
  currentWordIndex = 0;
  const etapa = levels[currentLevel][sublevel];
  wordsThisStage = etapa.words;
  document.getElementById("etapa-title").textContent = etapa.title;
  document.getElementById("categoria-juego").textContent = "📘 Categoría: " + etapa.category;
  document.getElementById("info-jugador").textContent = `Jugador: ${nickname} | Nivel: ${currentLevel}`;
  showScreen("game-screen");
  loadNextWord();
}

function loadNextWord() {
  if (currentWordIndex >= wordsThisStage.length) {
    endStage();
    return;
  }
  currentWord = wordsThisStage[currentWordIndex].word.toLowerCase();
  guessedLetters = [];
  attemptsLeft = 6;
  updateWordDisplay();
  document.getElementById("hint-display").textContent = "???";
  document.getElementById("attempts").textContent = attemptsLeft;
  document.getElementById("guessed-letters").textContent = "";
  document.getElementById("aciertos").textContent = correctWords;
}

function updateWordDisplay() {
  const display = currentWord
    .split("")
    .map(l => guessedLetters.includes(l) ? l : "_")
    .join(" ");
  document.getElementById("word-display").textContent = display;
}

function guessLetter() {
  const input = document.getElementById("letter-input");
  const letra = input.value.toLowerCase();
  input.value = "";
  if (!letra.match(/^[a-z]$/) || guessedLetters.includes(letra)) {
    alert("Letra inválida o repetida.");
    return;
  }
  guessedLetters.push(letra);
  document.getElementById("guessed-letters").textContent = guessedLetters.join(", ");
  if (!currentWord.includes(letra)) {
    attemptsLeft--;
    document.getElementById("attempts").textContent = attemptsLeft;
    if (attemptsLeft === 0) {
      currentWordIndex++;
      loadNextWord();
    }
  } else {
    updateWordDisplay();
    if (currentWord.split("").every(l => guessedLetters.includes(l))) {
      correctWords++;
      document.getElementById("aciertos").textContent = correctWords;
      currentWordIndex++;
      setTimeout(loadNextWord, 600);
    }
  }
}

function showHint() {
  const hint = wordsThisStage[currentWordIndex]?.hint;
  document.getElementById("hint-display").textContent = hint || "No hay pista disponible.";
}

function endStage() {
  showScreen("result");
  const msg = correctWords >= totalRequired ? "¡Etapa completada!" : "No fue suficiente. Intenta otra vez.";
  document.getElementById("message").textContent = msg;
}

function restartGame() {
  showScreen("game-screen");
  startStage(currentSublevel);
}

function nextSublevel() {
  const next = String(Number(currentSublevel) + 1);
  if (levels[currentLevel][next]?.category === currentCategory) {
    startStage(next);
    showScreen("game-screen");
  } else {
    alert("No hay más etapas en esta categoría.");
    showScreen("stage-screen");
  }
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(div => div.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}

function backToWelcome() { showScreen("welcome-screen"); }
function backToCategory() { showScreen("category-screen"); }
function backToStage() { showScreen("stage-screen"); }

document.addEventListener("keydown", e => {
  if (document.getElementById("game-screen").classList.contains("visible") && e.key === "Enter") {
    guessLetter();
  } else if (document.getElementById("result").classList.contains("visible") && e.key === "Enter") {
    nextSublevel();
  }
});
