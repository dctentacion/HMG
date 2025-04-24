const levels = [
  {
    level: "A1",
    words: [
      // Básico (palabras cortas y comunes)
      { word: "cat", hint: "A small domestic animal", category: "animals" },
      { word: "dog", hint: "Man's best friend", category: "animals" },
      { word: "lion", hint: "The king of the jungle", category: "animals" },
      { word: "milk", hint: "White drink from cows", category: "food" },
      { word: "bread", hint: "Used to make sandwiches", category: "food" },
      { word: "soccer", hint: "Game with a ball and goals", category: "sports" },
      { word: "tennis", hint: "Played with rackets", category: "sports" },
      { word: "train", hint: "Transport that moves on tracks", category: "travel" },
      { word: "hotel", hint: "Place to stay when traveling", category: "travel" },
      { word: "map", hint: "Used to find directions", category: "travel" }
    ]
  },
  {
    level: "A2",
    words: [
      { word: "rabbit", hint: "Small animal that hops", category: "animals" },
      { word: "tiger", hint: "Striped big cat", category: "animals" },
      { word: "banana", hint: "A yellow fruit", category: "food" },
      { word: "pizza", hint: "Round dish with cheese and toppings", category: "food" },
      { word: "cycling", hint: "Riding bikes competitively", category: "sports" },
      { word: "golf", hint: "Hit balls into holes", category: "sports" },
      { word: "airport", hint: "Where planes take off", category: "travel" },
      { word: "passport", hint: "Needed to travel abroad", category: "travel" },
      { word: "penguin", hint: "Bird that swims", category: "animals" },
      { word: "cheese", hint: "Used on pizza", category: "food" }
    ]
  },
  {
    level: "B1",
    words: [
      { word: "elephant", hint: "Large grey animal", category: "animals" },
      { word: "giraffe", hint: "Tall animal with long neck", category: "animals" },
      { word: "apple", hint: "Fruit that keeps doctors away", category: "food" },
      { word: "carrot", hint: "Orange vegetable", category: "food" },
      { word: "basketball", hint: "Sport with a hoop", category: "sports" },
      { word: "skiing", hint: "Sliding on snow", category: "sports" },
      { word: "vacation", hint: "Time off to travel", category: "travel" },
      { word: "ticket", hint: "Used to board planes or buses", category: "travel" },
      { word: "chocolate", hint: "Sweet brown treat", category: "food" },
      { word: "dolphin", hint: "Smart ocean animal", category: "animals" }
    ]
  },
  {
    level: "B2",
    words: [
      { word: "kangaroo", hint: "Jumps and has a pouch", category: "animals" },
      { word: "cruise", hint: "Luxury travel on a ship", category: "travel" },
      { word: "luggage", hint: "Used to carry your clothes", category: "travel" },
      { word: "cuisine", hint: "Style of cooking", category: "food" },
      { word: "tournament", hint: "Series of matches", category: "sports" },
      { word: "volleyball", hint: "Hit the ball over a net", category: "sports" },
      { word: "surfing", hint: "Sport on ocean waves", category: "sports" },
      { word: "rice", hint: "Staple grain", category: "food" },
      { word: "adventure", hint: "Exciting journey", category: "travel" },
      { word: "zebra", hint: "Striped horse-like animal", category: "animals" }
    ]
  },
  {
    level: "C1",
    words: [
      { word: "porcupine", hint: "Spiky mammal", category: "animals" },
      { word: "broccoli", hint: "Green veggie with florets", category: "food" },
      { word: "parachute", hint: "Used to fall slowly from sky", category: "travel" },
      { word: "championship", hint: "Final sports competition", category: "sports" },
      { word: "tortilla", hint: "Used in Mexican food", category: "food" },
      { word: "camouflage", hint: "Helps animals blend in", category: "animals" },
      { word: "jetlag", hint: "Fatigue from time zones", category: "travel" },
      { word: "penalty", hint: "Punishment in sports", category: "sports" },
      { word: "ostrich", hint: "Largest bird, doesn't fly", category: "animals" },
      { word: "restaurant", hint: "Place to eat out", category: "food" }
    ]
  },
  {
    level: "C2",
    words: [
      { word: "connoisseur", hint: "Expert in food or art", category: "food" },
      { word: "expedition", hint: "Long journey with purpose", category: "travel" },
      { word: "triathlon", hint: "Race with swim, bike, run", category: "sports" },
      { word: "iguana", hint: "Green tropical lizard", category: "animals" },
      { word: "gastronomy", hint: "Science of food", category: "food" },
      { word: "hangglider", hint: "Flight with wings", category: "travel" },
      { word: "cheetah", hint: "Fastest land animal", category: "animals" },
      { word: "marathon", hint: "Very long race", category: "sports" },
      { word: "smorgasbord", hint: "Large variety of food", category: "food" },
      { word: "passportcontrol", hint: "Airport checkpoint", category: "travel" }
    ]
  }
];

let currentLevel = 0;
let currentWord = "";
let guessedLetters = [];
let attemptsLeft = 6;
let score = 0;
let nickname = "";
let hintUsed = false;

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
  while (currentLevel < levels.length) {
    const levelData = levels[currentLevel];
    const filteredWords = levelData.words.filter(w => w.category === category);

    if (filteredWords.length > 0) {
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
      return;
    } else {
      currentLevel++;
    }
  }

  alert("No hay palabras disponibles para esa categoría.");
  resetGame();
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
