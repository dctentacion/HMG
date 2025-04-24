
let currentLevel = "A1";
let currentSublevel = "1";
let currentWord = "";
let guessedLetters = [];
let attemptsLeft = 6;
let score = 0;
let correctWords = 0;
let totalRequired = 3;
let wordsThisStage = [];
let currentWordIndex = 0;

function startGame() {
  const levelSelect = document.getElementById("level-select").value;
  const sublevelSelect = document.getElementById("sublevel-select").value;
  currentLevel = levelSelect;
  currentSublevel = sublevelSelect;
  score = 0;
  correctWords = 0;
  currentWordIndex = 0;

  const etapa = levels[currentLevel][currentSublevel];
  wordsThisStage = etapa.words;
  document.getElementById("etapa-title").textContent = etapa.title;
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  loadNextWord();
}

function loadNextWord() {
  if (currentWordIndex >= wordsThisStage.length) {
    endSublevel();
    return;
  }
  currentWord = wordsThisStage[currentWordIndex].word.toLowerCase();
  guessedLetters = [];
  attemptsLeft = 6;
  hintUsed = false;
  updateWordDisplay();
  document.getElementById("hint-display").textContent = "???";
  document.getElementById("attempts").textContent = attemptsLeft;
  document.getElementById("guessed-letters").textContent = "";
  document.getElementById("aciertos").textContent = correctWords;
}

function updateWordDisplay() {
  const display = currentWord.split(""
  ).map(letter => guessedLetters.includes(letter) ? letter : "_").join(" ");
  document.getElementById("word-display").textContent = display;
}

function guessLetter() {
  const input = document.getElementById("letter-input").value.toLowerCase();
  document.getElementById("letter-input").value = "";
  if (!input.match(/[a-z]/i) || input.length !== 1) {
    alert("Ingresa una letra válida");
    return;
  }
  if (guessedLetters.includes(input)) {
    alert("Ya intentaste esa letra");
    return;
  }
  guessedLetters.push(input);
  document.getElementById("guessed-letters").textContent = guessedLetters.join(", ");
  if (!currentWord.includes(input)) {
    attemptsLeft--;
    document.getElementById("attempts").textContent = attemptsLeft;
    if (attemptsLeft === 0) {
      currentWordIndex++;
      loadNextWord();
    }
  } else {
    updateWordDisplay();
    if (currentWord.split("").every(letter => guessedLetters.includes(letter))) {
      correctWords++;
      document.getElementById("aciertos").textContent = correctWords;
      currentWordIndex++;
      setTimeout(loadNextWord, 800);
    }
  }
}

function showHint() {
  const hint = wordsThisStage[currentWordIndex].hint;
  document.getElementById("hint-display").textContent = hint;
}

function endSublevel() {
  document.getElementById("game").style.display = "none";
  document.getElementById("result").style.display = "block";
  const message = correctWords >= totalRequired ?
    "¡Completaste la etapa!" :
    "No alcanzaste los aciertos requeridos";
  document.getElementById("message").textContent = message;
}

function nextSublevel() {
  const next = parseInt(currentSublevel) + 1;
  if (next > 100) {
    alert("¡Completaste todos los subniveles de este nivel!");
    location.reload();
  } else {
    document.getElementById("result").style.display = "none";
    currentSublevel = next.toString();
    document.getElementById("sublevel-select").value = currentSublevel;
    startGame();
  }
}

function restartGame() {
  document.getElementById("result").style.display = "none";
  document.getElementById("game").style.display = "block";
  startGame();
}

// Llenar selectores dinámicamente
window.onload = () => {
  const levelsList = Object.keys(levels);
  const levelSelect = document.getElementById("level-select");
  const sublevelSelect = document.getElementById("sublevel-select");

  levelsList.forEach(level => {
    const opt = document.createElement("option");
    opt.value = level;
    opt.textContent = level;
    levelSelect.appendChild(opt);
  });

  for (let i = 1; i <= 100; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Etapa ${i}`;
    sublevelSelect.appendChild(opt);
  }
};
