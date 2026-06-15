  const canvas = document.getElementById('Janela');
  const ctx = canvas.getContext('2d');


  const BackgroundImage = new Image();
  const BallImage = new Image();
  const NumbersImage = new Image();
  const Player1Image = new Image();
  const Player2Image = new Image();
  const PauseImage = new Image();
  const WhiteFontImage = new Image();

  const FPS = 30;
  const FRAME_DURATION = 1000 / FPS;


  let imagesLoaded = 0;

  function onImageLoad()
  {
    imagesLoaded++;
    if (imagesLoaded === 7)
    {
      requestAnimationFrame(gameLoop);
    }
  }

  BackgroundImage.onload = onImageLoad;
  BallImage.onload = onImageLoad;
  NumbersImage.onload = onImageLoad;
  Player1Image.onload = onImageLoad;
  Player2Image.onload = onImageLoad;
  PauseImage.onload = onImageLoad;
  WhiteFontImage.onload = onImageLoad;


  // use essa função pra carregar arquivos
  // nota: essa função só deve ser chamada no começo do programa
  function LoadFiles()
  {

    BackgroundImage.src = 'gfx/background.png'
    BallImage.src = 'gfx/ball.png'
    NumbersImage.src = 'gfx/numbers.png'
    Player1Image.src = 'gfx/player1.png'
    Player2Image.src = 'gfx/player2.png'
    PauseImage.src = 'gfx/pause.png'
    WhiteFontImage.src = 'gfx/whitefont.png'
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
  function DrawText(x,y,sourceImage,text,charSize,StartCharASCIICode)
  {
    for(let i = 0; i < text.length; i++)
    {
      const FrameIndex = text.charCodeAt(i) - StartCharASCIICode;
      DrawImageFrame(x + i*charSize, y, sourceImage, charSize, charSize, FrameIndex);
    }
  }

    const HitSound = new Audio('sounds/hit.wav');
    const WallSound = new Audio('sounds/wall.wav');
    const ScoreSound = new Audio('sounds/score.wav');

    // toca som
    function PlayHitSound()
    {
      HitSound.currentTime = 0;
      HitSound.play();
    } 

    function PlayWallSound()
    {
      WallSound.currentTime = 0;
      WallSound.play();
    }

    function PlayScoreSound()
    {
      ScoreSound.currentTime = 0;
      ScoreSound.play();
    } 




    // Controles
    const tecla = {};

    document.addEventListener("keydown", e =>{
        tecla[e.key] = true;
    });

    document.addEventListener("keyup", e => {
        tecla[e.key] = false;
    });


  // esse objeto representa o player1
  let player1 =
    {
        x: 20,
        y: 190,
        width: 20,
        height: 100,
        speed: 10
    };

    // esse objeto representa o player2
    let player2 =
    {
        x: 600,
        y: 190,
        width: 20,
        height: 100,
        speed: 10
    };

    // esse objeto representa a bola
    let ball =
    {
        x: 310,
        y: 230,
        vx: 20,
        vy: 10,
        width: 20,
        height: 20
    };


  let player1Score = 0;
  let player2Score = 0;
  let timer = 0;

  // essa função move o player1 pelo teclado
  function MovePlayer1()
  {
    
    // programação do teclado
    if(tecla["ArrowDown"])
    {
      player1.y = player1.y+player1.speed;
    }

    if(tecla["ArrowUp"])
    {
      player1.y = player1.y-player1.speed;
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

  // essa função move o player2 por inteligência artificial
  function MovePlayer2()
  {
    let py = player2.y + player2.height/2;

    if(ball.vx > 0 && ball.x > 200)
    {
      if(py > ball.y)
      {
        // move pra cima
        player2.y = player2.y - player2.speed;
      }


      if(py < ball.y)
      {
        // move pra baixo
        player2.y = player2.y + player2.speed;
      }
    }

    // colisão lado de cima
    if(player2.y < 0)
    {
      player2.y = 0;
    }

    // colisão lado de baixo
    if(player2.y > canvas.height-player2.height)
    {
      player2.y = canvas.height-player2.height;
    }
  }


  // use essa função pra detectar colisão entre dois retângulos
  function AABB(x1, y1, width1, height1, x2, y2, width2, height2)
  {
      if(x1 < x2 + width2 &&
    x2 < x1+width1 &&
    y1 < y2+height2 &&
    y2 < y1+height1)
    {
      return 1;
    }

    return 0;
  }

  // essa função move a bola e verifica colisões
  function MoveBall()
  {
    ball.x = ball.x + ball.vx;
    ball.y = ball.y + ball.vy;
    
    // se passou do lado esquerdo da tela
    if(ball.x < 0)
    {
      // coloca a bola no centro da tela
      ball.x = (canvas.width-ball.width)/2;
      ball.y = (canvas.height-ball.height)/2;
      player2Score = player2Score+1; // player2 faz um ponto
      PlayScoreSound();
    }
    
    // se passou do lado direito da tela
    if(ball.x > canvas.width - ball.width)
    {
      // coloca a bola no centro da tela
      ball.x = (canvas.width-ball.width)/2;
      ball.y = (canvas.height-ball.height)/2;
      player1Score = player1Score+1; // player1 faz um ponto
      PlayScoreSound();
    }
    
    
    // se passou do lado de cima da tela
    if(ball.y < 0)
    {
      ball.vy = -ball.vy;
      PlayWallSound();
    }
    
    // se passou do lado de baixo da tela
    if(ball.y > canvas.height - ball.height)
    {
      ball.vy = -ball.vy;
      PlayWallSound();
    }
    
    
    // colisão com o player1
    if(AABB(player1.x,player1.y,player1.width,player1.height,ball.x,ball.y,ball.width,ball.height))
    {
      ball.vx = -ball.vx;
      PlayHitSound();
    }
    
    // colisão com o player2
    if(AABB(player2.x,player2.y,player2.width,player2.height,ball.x,ball.y,ball.width,ball.height))
    {
      ball.vx = -ball.vx;
      PlayHitSound();
    }
  }


  function PlayGame()
  {
    // física
    MovePlayer1();
    MovePlayer2();
    MoveBall();

    DrawImage(0,0, BackgroundImage);
    DrawText(80,0,NumbersImage,player1Score.toString(),60,0);
    DrawText(500,0,NumbersImage,player2Score.toString(),60,0);

    DrawImage(player1.x, player1.y, Player1Image);
    DrawImage(player2.x, player2.y, Player2Image);
    DrawImage(ball.x,ball.y,BallImage);
  }

  let INTRO = 0;
  let GAME = 1;
  let PAUSE = 2;
  let MENU = 3;
  let game_estado = INTRO;

  function PauseGame()
  {
    DrawImage(0,0, BackgroundImage);
    DrawText(80,0,NumbersImage,player1Score.toString(),60,0);
    DrawText(500,0,NumbersImage,player2Score.toString(),60,0);

    DrawImage(player1.x, player1.y, Player1Image);
    DrawImage(player2.x, player2.y, Player2Image);
    DrawImage(ball.x,ball.y,BallImage);
    DrawImage(0,0,PauseImage);
  }

  let textProgress = 0;
  let textTimer = 0;
  const TYPE_DELAY = 5;

  // use essa função pra desenhar texto com efeito de digitação
  function TypeEffect(x, y, delay, text, charSize, asciiOffset)
  {
  
  let col = 0;
  let row = 0;

  textTimer++;
  if (textTimer >= delay)
  {
    textProgress++;
    textTimer = 0;
  }

  if (textProgress > text.length)
  {
    textProgress = text.length;
  }

  for (let i = 0; i < textProgress; i++)
  {
    const char = text[i];

    if (char === "\n")
    {
      row++;
      col = 0;
      continue;
    }

    const frame = char.charCodeAt(0) - asciiOffset;

    DrawImageFrame(x + col * charSize, y + row * charSize, WhiteFontImage , charSize, charSize, frame);
    col++;
  }
}


  let introTimer = 0;
  function PlayIntro()
  {
    TypeEffect(0,70,0,"Bem vindo ao jogo\nQuem fazer 10 pontos ganha\nUse as setas pra cima ou pra baixo\npra mover a raquete",16,32);
    introTimer++;
    if(introTimer > 200)
    {
      game_estado = GAME;
      introTimer = 0;
    }
  }


  // use essa função pra trocar os estados de tela do jogo
  function RunGame()
  {
    switch(game_estado)
    {
    case INTRO: PlayIntro(); break;
    case GAME: PlayGame(); break;
    case PAUSE: PauseGame(); break;
    }
  }


    let key = null;
  window.addEventListener('keydown', function(event)
  {
  key = event.key;
});




  // game loop
  function gameLoop()
  {

    if(game_estado == GAME && key === 'Escape')
    {
      game_estado = PAUSE;
      key = null;
    }

    else if(game_estado == PAUSE && key === 'Escape')
    {
      game_estado = GAME;
      key = null;
    }


    ClearScreen();
    RunGame();

    setTimeout(gameLoop, FRAME_DURATION);
  }