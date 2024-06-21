  


  let win;
  let tie;




  const highScoreEl = document.getElementById('high-score');
  const resetBtnEl= document.getElementById('reset');
  
  
  // Container size 
  const width = 50
  const height = 50
  const totalSquareCount = width * height
  const grid = document.querySelector('.grid')
  const squareEls = []


Init();


function init() {
    container =
    player = 
    invaders = 
    winner = false
    lose = false

    render();

}


function render (){
    updateContainer();
    updateMessage();
}


function updateContainer() {
    container.foreach((value, index) => {
        const grid = gridEls[index];
        grid.textContent = value;
    });
}


// container creation 
for (let i = 0; i <totalSquareCount; i++){
    const square = document.createElement('div')
    square.innerText = i
    square.classList.add('sqr')
    square.id = i


    square.style.height = `${100 / height}%`
    square.style.width = `${100 / width}%`

    squareEls.push(square)
    grid.appendChild(square)
}
