  
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
            squareEls [projectilePosition].classList.remove('projectile');
            projectilePosition -= width;

            if (projectilePosition >= 0) {
                squareEls[projectilePosition].classList.add('projectile');
            }
            }
            const projectileInterval = setInterval(moveProjectile, 100);
            activeProjectiles.push(projectileInterval);
        }
    }



    document.addEventListener('keydown', handleMove);
    document.addEventListener('keydown', handleFire);

