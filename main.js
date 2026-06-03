const canvas = document.getElementById('Janela');
const ctx = canvas.getContext('2d');


const BackgroundImage = new Image();
const BallImage = new Image();
const NumbersImage = new Image();
const Player1Image = new Image();
const Player2Image = new Image();


let imagesLoaded = 0;
  function onImageLoad()
  {
    imagesLoaded++;
    if (imagesLoaded === 5)
    {
      requestAnimationFrame(gameLoop);
    }
  }




BackgroundImage.onload = onImageLoad;
BallImage.onload = onImageLoad;
NumbersImage.onload = onImageLoad;
Player1Image.onload = onImageLoad;
Player2Image.onload = onImageLoad;


  // use essa função pra carregar arquivos
  // nota: essa função só deve ser chamada no começo do program
  function LoadFiles()
  {

    BackgroundImage.src = 'gfx/background.bmp'
    BallImage.src = 'gfx/ball.bmp'
    NumbersImage.src = 'gfx/numbers.bmp'
    Player1Image.src = 'gfx/player1.bmp'
    Player2Image.src = 'gfx/player2.bmp'
  }

  LoadFiles();


  // use essa função pra desenhar uma imagem na tela
  function DrawImage(x, y, image)
  {
    ctx.drawImage(image, x, y);
  }



  // game loop
  function gameLoop()
  {


    DrawImage(0,0, BackgroundImage);
    DrawImage(20, 190, Player1Image);
    DrawImage(640-2*20, 190, Player2Image);
    DrawImage(310, 230, BallImage);
    
    requestAnimationFrame(gameLoop);
  }