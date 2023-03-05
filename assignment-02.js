// Define global variables
let sequence = [];
let humanSequence = [];
let level = 0;
let highScore = 0;
let timer;
let AllTimeHigh = 0; 

// Get elements from HTML
const startButton = document.querySelector('.start');
const info = document.querySelector('.js-info');
const circleContainer = document.querySelector('.js-contain');
const status = document.querySelector('.status');
const highScores = document.querySelector('.highScore');
const AllTimeHighScore = document.querySelector('.AllTimeHigh');

// Reset the game when it ends
function resetGame(text) {
  // alert(text);
  // If the player reached a new high score, update it
  if (level > AllTimeHigh) {
    AllTimeHigh = level;
  }
  sequence = [];
  humanSequence = [];
  level = 0;
  // Allow the player to start a new game
  startButton.classList.remove('unclickable');
  // Hide the game information
  info.classList.add('hidden');
  // Disable the ability to click on circles
  circleContainer.classList.add('unclickable');
   // Reset the game status
  status.classList.remove('activated');
  // Flash all the colors after the game end
  flashColors();
  // Update the all-time high score display
  AllTimeHighScore.textContent = `${AllTimeHigh}`;
}
// Flash all the colors
function flashColors() {
  let count = 0;
  const flashInterval = setInterval(() => {
    activatecircle('green');
    activatecircle('red');
    activatecircle('yellow');
    activatecircle('blue');
    count++;
    if (count >= 5) {
      clearInterval(flashInterval);
    }
  }, 700);
}
// Allow the player to take their turn
function humanTurn(level) {
  circleContainer.classList.remove('unclickable');
  info.textContent = `Your turn: ${level} Tap${level > 1 ? 's' : ''}`;
}
// Activate a circle
function activatecircle(color) {
  const circle = document.querySelector(`[data-circle='${color}']`);
  circle.classList.add('activated');
// Remove the CSS class after a short delay to return the circle to its original state
  setTimeout(() => {
    circle.classList.remove('activated');
  }, 300);
}


// Play the next round of the game
//increase speed after how many rounds
function playRound(nextSequence) {
  nextSequence.forEach((color, index) => {
    let delayTime = (index + 1) * 600;

    if (level >= 5) {                       
      delayTime = (index + 1) * 500;
    }

    if (level >= 9) {
      delayTime = (index + 1) * 450;
    }
    if (level >= 13) {
      delayTime = (index + 1) * 400;
    }

    setTimeout(() => {
      activatecircle(color);
    }, delayTime);
  });
}

//random the next step colour  for the next step in the sequence
function nextStep() {
  const circle = ['green', 'red', 'yellow', 'blue'];
  const random = circle[Math.floor(Math.random() * circle.length)];

  return random;
}
// Start the next round of the game
function nextRound() {
  // Increment the level counter and disable start button click
  level += 1;
  circleContainer.classList.add('unclickable');
  info.textContent = 'Wait for the computer';
  highScores.textContent = ` ${level}`; // update high score span

  const nextSequence = [...sequence];
  nextSequence.push(nextStep());
  playRound(nextSequence);

  sequence = [...nextSequence];
  setTimeout(() => {
    humanTurn(level);
  }, level * 600 + 1000);

}
//This function is called when the player clicks on a circle.
// It checks if the circle clicked by the player matches the circle in the sequence
function handleClick(circle) {
  clearTimeout(timer);
  const index = humanSequence.push(circle) - 1;
  const remainingTaps = sequence.length - humanSequence.length;

  if (humanSequence[index] !== sequence[index]) {
    resetGame();
    return;
  }

  if (humanSequence.length === sequence.length) {
    if (humanSequence.length === 20) {
      resetGame();
      return
    }

    humanSequence = []; 
    info.textContent = 'Success! Keep going!';
    setTimeout(() => {
      nextRound();
    }, 1000);
    return;
  }

  info.textContent = `Your turn: ${remainingTaps} Tap${
    remainingTaps > 1 ? 's' : ''
  }`;

  timer = setTimeout(() => {
    resetGame();
  }, 5000);
}
//This function is called when the player clicks the start button. 
function startGame() {
  
  startButton.classList.add('unclickable');
  info.classList.remove('hidden');
  status.classList.add('activated');
  info.textContent = 'Wait for the computer';
  setTimeout(() => {
    nextRound();
  }, 3000);
}


startButton.addEventListener('click', startGame);
circleContainer.addEventListener('click', event => {
  const { circle } = event.target.dataset;

  if (circle) handleClick(circle);
});