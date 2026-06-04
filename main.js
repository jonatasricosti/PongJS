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


  let player1Score = 0;
  let player2Score = 0;
  let timer = 0;



  // game loop
  function gameLoop()
  {


    ClearScreen()
    DrawImage(0,0, BackgroundImage);
    DrawImage(20, 190, Player1Image);
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


    requestAnimationFrame(gameLoop);
  }