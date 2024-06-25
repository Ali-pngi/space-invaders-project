  
  let win;
  let tie;

  const highScoreEl = document.getElementById('high-score');
  const resetBtnEl= document.getElementById('reset');
  
  
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
    
    console.log(squareEls);


    // Player initialisation
    let playerPosition = 470;
    squareEls[playerPosition].classList.add('player');


    //  Invader initialisation & structure 

    const invaderWidth = 10;
    const invaderHeight = 7;
    let invaderStartPosition = 5;

    const invaderPattern = [
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]  
    ]

    let invaderPositions = new Set();
    function createInvader() {
      invaderPositions.clear();
      for (let row = 0; row < invaderHeight; row++) {
        for (let col = 0; col < invaderWidth; col++) {
          if (invaderPattern[row][col] === 1) {
            const position = invaderStartPosition + row * width + col;
            invaderPositions.add(position);
            squareEls[position].classList.add('invader');
          }
        }
      }
    }

    function clearInvader() {
       invaderPositions.forEach(position => {
        squareEls[position].classList.remove('invader');
       })
    }

    // Invader movement 
    let invaderDirection = -1;
   
    function moveInvader() {
        clearInvader();

        if((invaderDirection === 1 && (invaderStartPosition % width + invaderWidth) >= width) ||
    (invaderDirection === -1 && invaderStartPosition % width === 0)) {
        invaderDirection *= -1;
        invaderStartPosition += width;
    } else {
        invaderStartPosition += invaderDirection;
    }

    invaderPositions = new Set([...invaderPositions].map(position =>
        position + invaderDirection + (invaderDirection === -1 ? width : 0)));
        invaderPositions.forEach(position => {
            if(position < totalSquareCount) {
                squareEls[position].classList.add('invader');
            }
        })

        if ([...invaderPositions].some(position => position >= totalSquareCount - width)) {
            endGame('lose');
        }
    }

    createInvader();

    setInterval(moveInvader, 750);

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
                if (projectilePosition < 0) {
                    clearInterval(projectileInterval);
                    activeProjectiles.splice(activeProjectiles.indexOf(projectileInterval), 1);
                    return;
                }
             squareEls [projectilePosition + width].classList.remove('projectile');
            projectilePosition -= width;

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
        clearInterval(invaderMovementInterval);
        if(result === 'win') {
            alert('You win!');
        } else if (result === 'lose') {
            alert('You lose!');
        }
    }
    
    document.addEventListener('keydown', handleMove);
    document.addEventListener('keydown', handleFire);

