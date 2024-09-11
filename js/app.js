
const width = 20;
const height = 20;
const totalSquareCount = width * height;
const invaderWidth = 10;
const invaderHeight = 7;


const container = document.querySelector('.container');
const highScoreEl = document.getElementById('high-score');
const messageEl = document.getElementById('message');
const resetBtnEl = document.getElementById('reset');
const currentScoreEl = document.getElementById('current-score');
const currentLevelEl = document.getElementById('current-level');


let win = false;
let lose = false;
let gameInterval;
let playerPosition = 380;
let invaderStartPosition = 5;
let invaderPositions = new Set();
let invaderDirection = 1;
const activeProjectiles = [];
let currentScore = 0;
let highScore = localStorage.getItem('highScore') || 0;
let currentLevel = 1;
let invaderSpeed = 500; 

const invaderPattern = [
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]  
];


const squareEls = [];
for (let i = 0; i < totalSquareCount; i++) {
    const square = document.createElement('div');
    square.classList.add('sqr');
    square.id = i;
    square.style.height = `${100 / height}%`;
    square.style.width = `${100 / width}%`;
    squareEls.push(square);
    container.appendChild(square);
}

function init() {
    win = false;
    lose = false;
    clearInterval(gameInterval);
    gameInterval = setInterval(moveInvader, invaderSpeed);
    currentScore = 0;
    currentLevel = 1;
    invaderSpeed = 500;
    updateScoreDisplay();
    updateLevelDisplay();
    updateMessage("Good luck!");
    render();
}

function render() {
    createInvader();
    renderPlayer();
}

function createInvader() {
    clearInvader();
    invaderPositions.clear();
    for (let row = 0; row < invaderHeight; row++) {
        for (let col = 0; col < invaderWidth; col++) {
            if (invaderPattern[row][col] === 1) {
                const position = invaderStartPosition + col + row * width;
                if (position < totalSquareCount) {
                    invaderPositions.add(position);
                    squareEls[position].classList.add('invader');
                }
            }
        }
    }
}

function clearInvader() {
    invaderPositions.forEach(position => {
        if (position < totalSquareCount) {
            squareEls[position].classList.remove('invader');
        }
    });
}

function moveInvader() {
    clearInvader();
    
    let touchedEdge = false;
    invaderPositions.forEach(position => {
        if ((invaderDirection === 1 && (position % width) === (width - 1)) || 
            (invaderDirection === -1 && (position % width) === 0)) {
            touchedEdge = true;
        }
    });
    
    if (touchedEdge) {
        invaderDirection *= -1;
        invaderPositions = new Set([...invaderPositions].map(position => position + width));
    } else {
        invaderPositions = new Set([...invaderPositions].map(position => position + invaderDirection));
    }
    
    addInvader();
    if ([...invaderPositions].some(position => position >= totalSquareCount - width)) {
        endGame('lose');
    }
}

function addInvader() {
    invaderPositions.forEach(position => {
        if (position < totalSquareCount) {
            squareEls[position].classList.add('invader');
        }
    });
}

function renderPlayer() {
    squareEls.forEach(square => square.classList.remove('player'));
    squareEls[playerPosition].classList.add('player');
}

function handleMove(evt) {
    if (evt.key === 'ArrowLeft' && playerPosition % width !== 0) {
        playerPosition -= 1;
    } else if (evt.key === 'ArrowRight' && playerPosition % width !== width - 1) {
        playerPosition += 1;
    }
    renderPlayer();
}

function handleFire(evt) {
    if (evt.key === ' ' && activeProjectiles.length < 5) {
        let projectilePosition = playerPosition - width;

        function moveProjectile() {
            if (projectilePosition + width < totalSquareCount) {
                squareEls[projectilePosition + width].classList.remove('projectile');
            }

            if (projectilePosition < 0) {
                clearInterval(projectileInterval);
                activeProjectiles.splice(activeProjectiles.indexOf(projectileInterval), 1);
                return;
            }

            if (invaderPositions.has(projectilePosition)) {
                invaderPositions.delete(projectilePosition);
                squareEls[projectilePosition].classList.remove('invader');
                clearInterval(projectileInterval);
                activeProjectiles.splice(activeProjectiles.indexOf(projectileInterval), 1);

                
                currentScore += 10;
                updateScoreDisplay();

                if (invaderPositions.size === 0) {
                    if (currentLevel < 3) {
                        nextLevel();
                    } else {
                        endGame('win');
                    }
                }
                return;
            }

            squareEls[projectilePosition].classList.add('projectile');
            projectilePosition -= width;
        }

        const projectileInterval = setInterval(moveProjectile, 100);
        activeProjectiles.push(projectileInterval);
    }
}

function nextLevel() {
    currentLevel++;
    invaderSpeed -= 100; 
    clearInterval(gameInterval);
    gameInterval = setInterval(moveInvader, invaderSpeed);
    updateLevelDisplay();
    createInvader(); 
    updateMessage(`Level ${currentLevel} - Good luck!`, false, false, true);
}

function updateScoreDisplay() {
    currentScoreEl.textContent = `Score: ${currentScore}`;
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem('highScore', highScore);
    }
    highScoreEl.textContent = `High Score: ${highScore}`;
}

function updateLevelDisplay() {
    currentLevelEl.textContent = `Level: ${currentLevel}`;
}

function updateMessage(text, isWin = false, isLose = false, isLevelComplete = false) {
    messageEl.textContent = text;
    messageEl.classList.remove('win', 'lose', 'level-complete');
    if (isWin) {
        messageEl.classList.add('win');
        container.classList.add('game-complete');
        setTimeout(() => {
            container.classList.remove('game-complete');
        }, 700);
    } else if (isLose) {
        messageEl.classList.add('lose');
    } else if (isLevelComplete) {
        messageEl.classList.add('level-complete');
        setTimeout(() => {
            messageEl.classList.remove('level-complete');
        }, 500);
    }
}

function endGame(result) {
    activeProjectiles.forEach(interval => clearInterval(interval));
    clearInterval(gameInterval);
    if (result === 'win') {
        win = true;
        updateMessage("You've completed all levels!", true);
    } else if (result === 'lose') {
        lose = true;
        updateMessage("Game Over! Try again?", false, true);
    }
    updateScoreDisplay();
}

function reset() {
    clearInterval(gameInterval);
    activeProjectiles.forEach(interval => clearInterval(interval));
    activeProjectiles.length = 0;
    squareEls.forEach(square => {
        square.classList.remove('projectile', 'invader', 'player');
    });
    invaderPositions.clear();
    invaderStartPosition = 5;
    playerPosition = 380;
    init();
}


document.addEventListener('keydown', handleMove);
document.addEventListener('keydown', handleFire);
resetBtnEl.addEventListener('click', reset);


init();