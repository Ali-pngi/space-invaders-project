  
  let win;
  let tie;

  const highScoreEl = document.getElementById('high-score');
  const messageEl = document.getElementById('message');
  const resetBtnEl= document.getElementById('reset');
  
  
  
 function init () {

    win = false;
    lose = false; 
    render();

  }



  function render () {
    updateMessage();
   createInvader();

  }

  function updateMessage() {
    if(win) {
        messageEl.textContent = `You win! Great work.`
    } else if(lose) {
        messageEl.textContent = `You lose! Bad luck, try again?`
    } else {
        messageEl.textContent = `Good luck!`
    }
  }
  
  // Container size 
  const width = 20
  const height = 25
  const totalSquareCount = width * height
  const container = document.querySelector('.container')
  const squareEls = []
  
  // container creation 
  for (let i = 0; i <totalSquareCount; i++){
    const square = document.createElement('div');
    // square.innerText = i;
    square.classList.add('sqr');
    square.id = i;
    
    
    square.style.height = `${100 / height}%`;
    square.style.width = `${100 / width}%`;
    
    squareEls.push(square);
    container.appendChild(square); 
    }
    
    // console.log(squareEls);


    // Player initialisation
    let playerPosition = 470;
    
    squareEls[playerPosition].classList.add('player');
    

    //  Invader initialisation & structure 

    const invaderWidth = 10;
    const invaderHeight = 7;
    let invaderStartPosition = 5;
    let invaderPositions = new Set();

    const invaderPattern = [
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]  
    ]

    function createInvader() {
       
        invaderPositions.clear();
        for( let row = 0; row < invaderHeight; row++) {
            for(let col = 0; col < invaderWidth; col++) {
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

    function addInvader() {
        invaderPositions.forEach(position => {
         if(position < totalSquareCount) {
             squareEls[position].classList.add('invader');
         }
        });
     }
    
 

    function clearInvader() {
       invaderPositions.forEach(position => {
        if(position < totalSquareCount) {
            squareEls[position].classList.remove('invader');
        }
       });
    }

    // Invader movement 
    let invaderDirection = 1;
   
    function moveInvader() {
        clearInvader();
       
        let touchedEdge = false;
        [...invaderPositions].forEach(position => {
            console.log(invaderDirection, position, position % width)
           if ((invaderDirection === 1 && (position % width) === (width - 1)) || (invaderDirection === -1 && (position % width) === 0)) 
                touchedEdge = true;
            }
         );
        
        if (touchedEdge) {
         invaderDirection *= -1;
         invaderStartPosition += width;
         
        } else {
            invaderStartPosition += invaderDirection;
            console.log(invaderStartPosition)
        }
        invaderPositions = new Set([...invaderPositions].map(position => position + invaderDirection));
    
        addInvader();
    }

    setInterval(moveInvader, 750) 

    // Active projectiles array 
    const activeProjectiles = [];

    // Handle player movement 
    function handleMove(evt) {
        squareEls[playerPosition].classList.remove('player');
        if (evt.key === 'ArrowLeft' && playerPosition % width !==0) {
            playerPosition -= 1;
        } else if (evt.key === 'ArrowRight' && playerPosition % width !== width - 1){
            playerPosition += 1;
        }
        squareEls[playerPosition].classList.add('player');
    }

    // Handle projectile firing

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
    
                    
                    if (invaderPositions.size === 0) {
                        endGame('win');
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
    



    function endGame(result) {
        activeProjectiles.forEach(interval => clearInterval(interval));
        if(result === 'win') {
            messageEl.textContent ='You win!';
        } else if (result === 'lose') {
            messageEl.textContent ='You lose! Try again?';
        }
    }


    function reset() {
        activeProjectiles.forEach(interval => clearInterval(interval));
        activeProjectiles.length= 0;
        
        squareEls.forEach(square => {
            square.classList.remove('projectile', 'invader', 'player');
            });
            invaderPositions.clear();
            invaderStartPosition = 5;
            playerPosition = 470;
            createInvader();
            init();
        
    }

    init()

    document.addEventListener('keydown', handleMove);
    document.addEventListener('keydown', handleFire);
    resetBtnEl.addEventListener('click', reset)
