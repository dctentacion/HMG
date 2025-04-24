const levels = [
  { level: "A1", words: [
    { word: "cat", hint: "A small domestic animal", category: "animals" },
    { word: "book", hint: "Used for reading", category: "food" }
  ]},
  { level: "A2", words: [
    { word: "family", hint: "People you live with", category: "animals" },
    { word: "travel", hint: "To go from one place to another", category: "sports" }
  ]},
  { level: "B1", words: [
    { word: "challenge", hint: "A difficult task", category: "sports" },
    { word: "journey", hint: "A long trip", category: "travel" }
  ]},
  { level: "B2", words: [
    { word: "achievement", hint: "Something you have accomplished", category: "sports" },
    { word: "environment", hint: "The world around us", category: "animals" }
  ]}
];

let currentLevel = 0;
let currentWord = "";
let guessedLetters = [];
let attemptsLeft = 6;
let score = 0;
let nickname = "";
let hintUsed = false;

// Sonidos en línea desde CDN (Pixabay)
const correctSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_9c45c83288.mp3?filename=correct-answer-3-21839.mp3");
const incorrectSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_338c674ac7.mp3?filename=wrong-answer-2-21834.mp3");

function startGame() {
  nickname = document.getElementById("nickname").value.trim();
  const category = document.getElementById("category").value;
  if (!nickname) {
    alert("Please enter your nickname.");
    return;
  }
  document.getElementById("player-name").textContent = nickname;
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  loadLevel(category);
}

function loadLevel(category) {
  const levelData = levels[currentLevel];
  const filteredWords = levelData.words.filter(w => w.category === category);
  const wordData = filteredWords[Math.floor(Math.random() * filteredWords.length)];
  currentWord = wordData.word.toLowerCase();
  guessedLetters = [];
  attemptsLeft = 6;
  hintUsed = false;
  document.getElementById("hint-display").textContent = "???";
  document.getElementById("level-display").textContent = levelData.level;
  document.getElementById("attempts").textContent = attemptsLeft;
  document.getElementById("score").textContent = score;
  document.getElementById("guessed-letters").textContent = "";
  document.getElementById("result").style.display = "none";
  updateWordDisplay();
  updateProgress();
}

function updateWordDisplay() {
  const display = currentWord
    .split("")
    .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
  const wordDisplay = document.getElementById("word-display");
  wordDisplay.textContent = display;
  wordDisplay.classList.add("bounce");
  setTimeout(() => wordDisplay.classList.remove("bounce"), 1000);
}

function guessLetter() {
  const input = document.getElementById("letter-input").value.toLowerCase();
  document.getElementById("letter-input").value = "";
  if (!input.match(/[a-z]/i) || input.length !== 1) {
    alert("Please enter a valid letter.");
    return;
  }
  if (guessedLetters.includes(input)) {
    alert("You already guessed that letter.");
    return;
  }
  guessedLetters.push(input);
  document.getElementById("guessed-letters").textContent = guessedLetters.join(", ");
  if (currentWord.includes(input)) {
    correctSound.play();
  } else {
    incorrectSound.play();
    attemptsLeft--;
  }
  updateWordDisplay();
  document.getElementById("attempts").textContent = attemptsLeft;
  checkGameState();
}

function showHint() {
  if (!hintUsed) {
    hintUsed = true;
    const levelData = levels[currentLevel];
    const wordData = levelData.words.find(w => w.word.toLowerCase() === currentWord);
    document.getElementById("hint-display").textContent = wordData.hint;
  } else {
    alert("Hint already used.");
  }
}

function checkGameState() {
  if (currentWord.split("").every(l => guessedLetters.includes(l))) {
    score += attemptsLeft * 10;
    document.getElementById("score").textContent = score;
    showResult("You won! Great job!");
  } else if (attemptsLeft <= 0) {
    showResult("You lost. Try again!");
  }
}

function showResult(message) {
  document.getElementById("message").textContent = message;
  document.getElementById("final-word").textContent = currentWord;
  document.getElementById("game").style.display = "none";
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  resultDiv.classList.add("fade-in");
}

function restartGame() {
  document.getElementById("game").style.display = "block";
  document.getElementById("result").style.display = "none";
  loadLevel(document.getElementById("category").value);
}

function nextLevel() {
  if (currentLevel + 1 < levels.length) {
    currentLevel++;
    restartGame();
  } else {
    alert("Congratulations! You completed all levels.");
    location.reload();
  }
}

function resetGame() {
  location.reload();
}

function updateProgress() {
  const progress = ((currentLevel + 1) / levels.length) * 100;
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = progress + "%";
  progressBar.classList.add("progress-grow");
  setTimeout(() => progressBar.classList.remove("progress-grow"), 2000);
}
