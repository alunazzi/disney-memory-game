// Game state variables
let numPlayers = 1;
let difficulty = 10;
let moves = 0;
let timer = 0;
let timerInterval;
let timerStarted = false;
let flippedCards = [];
let matchedCards = 0;
let currentPlayer = 1;
let playerScores = {};

// Player badge colors
const playerColors = {
  1: '#ff3b7e', // pink
  2: '#00b2dd', // blue
  3: '#63bb67', // green
  4: '#ff9800'  // orange
};

// Character pool (name, movie, image filename)
const characters = [
  { name: 'Eleonora', movie: 'Principessina Eleonora', img: '../IMG/Eleonora.png' },
  { name: 'Snow White', movie: 'Snow White', img: '../IMG/SnowWhite.png' },
  { name: 'Cinderella', movie: 'Cinderella', img: '../IMG/Cinderella.png' },
  { name: 'Aurora', movie: 'Sleeping Beauty', img: '../IMG/Aurora.png' },
  { name: 'Ariel', movie: 'The Little Mermaid', img: '../IMG/Ariel.png' },
  { name: 'Belle', movie: 'Beauty and the Beast', img: '../IMG/Belle.png' },
  { name: 'Jasmine', movie: 'Aladdin', img: '../IMG/Jasmine.png' },
  { name: 'Pocahontas', movie: 'Pocahontas', img: '../IMG/Pocahontas.png' },
  { name: 'Mulan', movie: 'Mulan', img: '../IMG/Mulan.png' },
  { name: 'Tiana', movie: 'Princess and the Frog', img: '../IMG/Tiana.png' },
  { name: 'Rapunzel', movie: 'Tangled', img: '../IMG/Rapunzel.png' },
  { name: 'Merida', movie: 'Brave', img: '../IMG/Merida.png' },
  { name: 'Moana', movie: 'Moana', img: '../IMG/Moana.png' },
  { name: 'Raya', movie: 'Raya and the Last Dragon', img: '../IMG/Raya.png' },
  { name: 'Elsa', movie: 'Frozen', img: '../IMG/Elsa.png' },
  { name: 'Anna', movie: 'Frozen', img: '../IMG/Anna.png' },
  { name: 'Mirabel', movie: 'Encanto', img: '../IMG/Mirabel.png' },
  { name: 'Vanellope', movie: 'Wreck-It Ralph', img: '../IMG/Vanellope.png' },
  { name: 'Megara', movie: 'Hercules', img: '../IMG/Megara.png' },
  { name: 'Esmeralda', movie: 'Hunchback of Notre Dame', img: '../IMG/Esmeralda.png' },
  { name: 'Kida', movie: 'Atlantis', img: '../IMG/Kida.png' },
  { name: 'Jane', movie: 'Tarzan', img: '../IMG/Jane.png' },
  { name: 'Giselle', movie: 'Enchanted', img: '../IMG/Giselle.png' },
  { name: 'Wendy', movie: 'Peter Pan', img: '../IMG/Wendy.png' }
];

// Set number of players
function setPlayers(button) {
  numPlayers = parseInt(button.dataset.value);
  currentPlayer = 1;

  // Remove active class from all player buttons
  document.querySelectorAll('.player-selection-buttons button').forEach(btn =>
    btn.classList.remove('active-button')
  );

  // Add active class to selected button
  button.classList.add('active-button');

  resetGame();
}

// Set difficulty level
function setDifficulty(button) {
  difficulty = parseInt(button.dataset.value);

  // Remove active class from all difficulty buttons
  document.querySelectorAll('.difficulty-selection-buttons button').forEach(btn =>
    btn.classList.remove('active-button')
  );

  // Add active class to selected button
  button.classList.add('active-button');

  resetGame();
}

// Reset and start a new game
function resetGame() {
  clearInterval(timerInterval);
  timerStarted = false;
  moves = 0;
  timer = 0;
  flippedCards = [];
  matchedCards = 0;
  currentPlayer = 1;

  // Reset player scores
  playerScores = {};
  for (let i = 1; i <= numPlayers; i++) {
    playerScores[i] = 0;
  }

  // Reset UI
  document.getElementById('moves').textContent = `Moves: ${moves}`;
  document.getElementById('timer').textContent = `Time: ${timer}s`;
  document.getElementById('turn').textContent = `Player ${currentPlayer}'s Turn`;
  document.getElementById('winner-modal').classList.add('hidden');

  const board = document.getElementById('game-board');
  board.innerHTML = '';

  // Select and shuffle cards
  const selected = characters.slice(0, difficulty / 2);
  const cardSet = [...selected, ...selected].sort(() => Math.random() - 0.5);

  // Create card elements
  cardSet.forEach(char => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = char.name;

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const back = document.createElement('div');
    back.classList.add('card-back');
    const backImg = document.createElement('img');
    backImg.src = 'IMG/Card_Back.jpg';
    backImg.alt = 'Card Back';
    backImg.classList.add('card-back-image');

    back.appendChild(backImg);

    const front = document.createElement('div');
    front.classList.add('card-front');
    front.style.backgroundImage = `url('images/${char.img}')`;

    const info = document.createElement('div');
    info.classList.add('card-info');
    info.innerHTML = `<strong>${char.name}</strong>${char.movie}`;
    front.appendChild(info);

    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);

    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });
}

// Handle card flip logic
function flipCard(card) {
  if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

  // Start timer on first flip
  if (!timerStarted) {
    timerStarted = true;
    timerInterval = setInterval(() => {
      timer++;
      document.getElementById('timer').textContent = `Time: ${timer}s`;
    }, 1000);
  }

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    document.getElementById('moves').textContent = `Moves: ${moves}`;

    const [card1, card2] = flippedCards;
    const name1 = card1.dataset.name;
    const name2 = card2.dataset.name;

    const inner1 = card1.querySelector('.card-inner');
    const inner2 = card2.querySelector('.card-inner');

    if (name1 === name2) {
      // Match found
      matchedCards += 2;
      playerScores[currentPlayer] += 1;

      inner1.classList.add('matched');
      inner2.classList.add('matched');

      [card1, card2].forEach(card => {
        const badge = document.createElement('div');
        badge.classList.add('card-player');
        badge.textContent = currentPlayer;
        badge.style.backgroundColor = playerColors[currentPlayer];
        card.querySelector('.card-front').appendChild(badge);
      });

      flippedCards = [];

      // Check for game end
      if (matchedCards === difficulty) {
        clearInterval(timerInterval);
        setTimeout(() => showWinner(), 500);
      }
    } else {
      // No match
      inner1.classList.add('wrong');
      inner2.classList.add('wrong');

      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        inner1.classList.remove('wrong');
        inner2.classList.remove('wrong');
        flippedCards = [];
        nextPlayer();
      }, 1000);
    }
  }
}

// Rotate to next player's turn
function nextPlayer() {
  currentPlayer = currentPlayer % numPlayers + 1;
  document.getElementById('turn').textContent = `Player ${currentPlayer}'s Turn`;
}

// Show winner in modal
function showWinner() {
  let maxScore = 0;
  let winners = [];

  for (let player in playerScores) {
    if (playerScores[player] > maxScore) {
      maxScore = playerScores[player];
      winners = [player];
    } else if (playerScores[player] === maxScore) {
      winners.push(player);
    }
  }

  const winnerText = winners.length === 1
    ? `Player ${winners[0]} wins!`
    : `It's a tie between players ${winners.join(', ')}`;

  document.getElementById('winner-title').textContent = winnerText;
  document.getElementById('winner-details').textContent =
    `Total Moves: ${moves}\nTime: ${timer}s`;

  document.getElementById('winner-modal').classList.remove('hidden');
}

// Start default game
resetGame();

