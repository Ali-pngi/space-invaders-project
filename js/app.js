  


  let win;
  let tie;

  const highScoreEl = document.getElementById('high-score');
  const resetBtnEl= document.getElementById('reset');
  
  
  // Container size 
  const width = 25
  const height = 25
  const totalSquareCount = width * height
  const container = document.querySelector('.container')
  const squareEls = []
  
  

                  
                  

  // container creation 
  for (let i = 0; i <totalSquareCount; i++){
    const square = document.createElement('div');
    square.innerText = i;
    square.classList.add('sqr');
    square.id = i;
    
    
    square.style.height = `${100 / height}%`;
    square.style.width = `${100 / width}%`;
    
    squareEls.push(square);
    container.appendChild(square); 
    }
    
    console.log(square);