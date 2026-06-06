const canvas = document.getElementById('Janela');
const ctx = canvas.getContext('2d');


const BackgroundImage = new Image();
const BallImage = new Image();
const NumbersImage = new Image();
const Player1Image = new Image();
const Player2Image = new Image();

const FPS = 30;
const FRAME_DURATION = 1000 / FPS;


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
  // nota: essa função só deve ser chamada no começo do programa
  function LoadFiles()
  {

    BackgroundImage.src = 'gfx/background.bmp'
    BallImage.src = 'gfx/ball.bmp'
    NumbersImage.src = 'gfx/numbers.bmp'
    Player1Image.src = 'gfx/player1.bmp'
    Player2Image.src = 'gfx/player2.bmp'
  }

  LoadFiles();

  // use essa função pra limpar a tela
  function ClearScreen()
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }


  // use essa função pra desenhar uma imagem na tela
  function DrawImage(x, y, image)
  {
    ctx.drawImage(image, x, y);
  }

  // use essa função pra desenhar uma imagem cortada na tela
  function DrawImageFrame(x, y, sourceImage, frameWidth, frameHeight, FrameIndex)
  {
    const cols = Math.floor(sourceImage.width / frameWidth);
    const sx = (FrameIndex % cols)*frameWidth;
    const sy = Math.floor(FrameIndex / cols) * frameHeight;

    ctx.drawImage(sourceImage, sx, sy, frameWidth, frameHeight, x,y,frameWidth, frameHeight);
  }


  // use essa função pra desenhar texto na tela
  function DrawText(x,y,sourceImage,text,charSize,StarCharASCIICode)
  {
    for(let i = 0; i < text.length; i++)
    {
      const FrameIndex = text.charCodeAt(i) - StarCharASCIICode;
      DrawImageFrame(x + i*charSize, y, sourceImage, charSize, charSize, FrameIndex);
    }
  }


  let tecla = null;
  window.addEventListener('keydown', function(event)
  {
  tecla = event.key;
});


  let player1 =
    {
        x: 20,
        y: 190,
        width: 20,
        height: 100,
        speed: 10
    };


  let player1Score = 0;
  let player2Score = 0;
  let timer = 0;

// use essa função pra mover o player1
function MovePlayer1()
{
  // programação do teclado

  if(tecla === 'ArrowDown')
  {
    player1.y = player1.y+player1.speed;
    tecla = null;
  }

  if(tecla === 'ArrowUp')
  {
    player1.y = player1.y-player1.speed;
    tecla = null;
  }

  // colisão lado de cima
  if(player1.y < 0)
  {
    player1.y = 0;
  }

  // colisão lado de baixo
  if(player1.y > canvas.height-player1.height)
  {
    player1.y = canvas.height-player1.height;
  }
}



  // game loop
  function gameLoop()
  {


    ClearScreen()

    // física
    MovePlayer1()

    DrawImage(0,0, BackgroundImage);
    DrawImage(player1.x, player1.y, Player1Image);
    DrawImage(640-2*20, 190, Player2Image);
    DrawImage(310, 230, BallImage);



    DrawText(80,0,NumbersImage,player1Score.toString(),60,0);
    DrawText(500,0,NumbersImage,player2Score.toString(),60,0);


    

    timer++;

    if(timer >= 10 && player1Score < 99)
    {
      player1Score++;
      timer = 0;
    }

    if(player1Score >= 99)
    {
      player1Score = 99;
    }


    setTimeout(gameLoop, FRAME_DURATION);
  }