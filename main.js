  const canvas = document.getElementById('Janela');
  const ctx = canvas.getContext('2d');


  // pra carregar arquivos de imagem
  const BackgroundImage = new Image();
  const BallImage = new Image();
  const NumbersImage = new Image();
  const Player1Image = new Image();
  const Player2Image = new Image();
  const PauseImage = new Image();
  const WhiteFontImage = new Image();
  const GreenFontImage = new Image();
  const CursorImage = new Image();


  const FPS = 30;
  const FRAME_DURATION = 1000 / FPS;


  let imagesLoaded = 0;

  function onImageLoad()
  {
    imagesLoaded++;
    if (imagesLoaded === 9)
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
  GreenFontImage.onload = onImageLoad;
  CursorImage.onload = onImageLoad;


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
    GreenFontImage.src = 'gfx/greenfont.png'
    CursorImage.src = 'gfx/cursor.png'
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

     // esse objeto representa o cursor do menu
    let cursor =
    {
        x: 0,
        y: 0
    };


  let player1Score = 0;
  let player2Score = 0;
  let timer = 0;

  // essa função move o player1 pelo teclado
  function MovePlayer1()
  {
    
    // programação do teclado
    if(tecla["s"])
    {
      player1.y = player1.y+player1.speed;
    }

    if(tecla["w"])
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

  // essa função move o player2 pelo teclado
  function MovePlayer2()
  {
    
    // programação do teclado
    if(tecla["ArrowDown"])
    {
      player2.y = player2.y+player2.speed;
    }

    if(tecla["ArrowUp"])
    {
      player2.y = player2.y-player2.speed;
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

  // essa função move o player2 por inteligência artificial
  function MovePlayer2ByCPU()
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
      PlayScoreSound(); // toca som
    }
    
    // se passou do lado direito da tela
    if(ball.x > canvas.width - ball.width)
    {
      // coloca a bola no centro da tela
      ball.x = (canvas.width-ball.width)/2;
      ball.y = (canvas.height-ball.height)/2;
      player1Score = player1Score+1; // player1 faz um ponto
      PlayScoreSound(); // toca som
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

  // essas váriaveis são os estados do jogo
  let INTRO = 0;
  let MENU = 1;
  let GAME1 = 2;
  let GAME2 = 3;
  let PAUSE = 4;
  let TUTORIAL = 5;
  let ABOUT = 6;
  let WIN1 = 7;
  let WIN2 = 8;
  let RESETGAME = 9;

  let game_estado = MENU;

  // essa função verifica quem ganhou o jogo
  function CheckWin()
  {
    if(player1Score >= 10)
    {
      game_estado = WIN1;
    }

    else if(player2Score >= 10)
    {
      game_estado = WIN2;
    }
  }


  // player 1 vs cpu
  function PlayGame1()
  {
    // física
    MovePlayer1();
    MovePlayer2ByCPU();
    MoveBall();

    DrawImage(0,0, BackgroundImage);
    DrawText(80,0,NumbersImage,player1Score.toString(),60,0);
    DrawText(500,0,NumbersImage,player2Score.toString(),60,0);

    DrawImage(player1.x, player1.y, Player1Image);
    DrawImage(player2.x, player2.y, Player2Image);
    DrawImage(ball.x,ball.y,BallImage);
    CheckWin();
  }

  // player 1 vs player 2
  function PlayGame2()
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
    CheckWin();
  }


    let key = null;
  window.addEventListener('keydown', function(event)
  {
  key = event.key;
});





  let index = 0; // pra mudar a posição do cursor do menu

// use essa função pra desenhar e controlar o menu na tela
function DrawMenuAndUpdateMenu()
{

    const options = ["Player1 vs CPU", "Player1 Vs Player2", "Tutorial", "Sobre"];

    const NumberOfNames = options.length;

    let dist = 30;
    let x = 0;
    let y = 0;
    let NumberOfLetters = 0;
    cursor.x = 0;
    cursor.y = 0;

    // programação do teclado
    if(key === 'ArrowUp')
    {
        index = index-1;
        key = null;
    }

    if(key === 'ArrowDown')
    {
        index = index+1;
        key = null;
    }

    if(index > NumberOfNames - 1)
    {
        index = 0;
    }

     if(index < 0)
    {
        index = NumberOfNames - 1;
    }

    if(index == 0 && key === 'Enter')
    {
        game_estado = GAME1;
        key = null;
    }

    if(index == 1 && key === 'Enter')
    {
        game_estado = GAME2;
        key = null;
    }

    if(index == 2 && key === 'Enter')
    {
        game_estado = TUTORIAL;
        key = null;
    }

    if(index == 3 && key === 'Enter')
    {
        game_estado = ABOUT;
        key = null;
    }


    for(let i = 0; i < NumberOfNames; i++)
    {
        NumberOfLetters = options[i].length;

        x = (canvas.width - 16*NumberOfLetters)/2;
        y = 120;

        // valor selecionado
        if(index == i)
        {
            cursor.x = 166;
            cursor.y = y + (dist*i)-2;
            DrawImage(cursor.x,cursor.y,CursorImage);
            DrawText(x, y+(dist*i), GreenFontImage, options[i], 16, 32);
        }

        // valor não selecionado
        else
        {
            DrawText(x, y+(dist*i), WhiteFontImage, options[i], 16, 32);
        }
    }
}



  // desenha o tutorial na tela
  function DrawTutorial()
  {
    TypeEffect(0,16,0,"Bem vindo ao jogo do pong\nTeclas w e s move o player1\nTeclas de cima e de baixo move o player2\nGanha quem fizer 10 pontos primeiro\nAperte Escape pra voltar ao Menu",16,32);
  }

  // os comandos do tutorial
  function updateTutorial()
  {

      if(key === 'Escape')
      {
        game_estado = MENU;
        key = null;
      }
  }

  // desenha o about na tela
  function DrawAbout()
  {
      DrawText(0,0,WhiteFontImage, "Jogo do Pong", 16, 32);
      DrawText(0,32,WhiteFontImage, "Feito por", 16, 32);
      DrawText(0,64,WhiteFontImage, "Jonatas Ricosti", 16, 32);
      DrawText(0,96,WhiteFontImage, "Audio: Atari", 16, 32);
  }

  // os comandos de about
  function updateAbout()
  {
      if(key === 'Escape')
      {
        game_estado = MENU;
        key = null;
      }
  }

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



  // essa função reseta algumas variáveis do jogo
  function ResetGame()
  {
    player1.x = 20;
    player1.y = 190;

    player2.x = 600;
    player2.y = 190;

    ball.x = 310;
    ball.y = 230;
  }


  // use essa função pra trocar os estados de tela do jogo
  function RunGame()
  {
    switch(game_estado)
    {
    case INTRO: PlayIntro(); break;
    case MENU: DrawMenuAndUpdateMenu(); break;
    case GAME1: PlayGame1(); break;
    case GAME2: PlayGame2(); break;
    case PAUSE: PauseGame(); break;
    case TUTORIAL: DrawTutorial(); updateTutorial(); break;
    case ABOUT: DrawAbout(); updateTutorial(); break;
    case WIN1:
    case WIN2:
    case RESETGAME: ResetGame(); break;
    }
  }

  // essa função reseta as variáveis da função TypeEffect da função DrawTutorial
  function ResetText()
  {
    textProgress = textTimer = 0;
  }


  // game loop
  function gameLoop()
  {

    if(game_estado == GAME1 && key === 'Escape')
    {
      game_estado = PAUSE;
      key = null;
    }

    else if(game_estado == PAUSE && key === 'Escape')
    {
      game_estado = GAME1;
      key = null;
    }

    if(game_estado == GAME2 && key === 'Escape')
    {
      game_estado = PAUSE;
      key = null;
    }

    else if(game_estado == PAUSE && key === 'Escape')
    {
      game_estado = GAME2;
      key = null;
    }

    if(game_estado != TUTORIAL)
    {
      ResetText();
    }


    ClearScreen(); // limpa a tela
    RunGame(); // troca as telas do jogo

    setTimeout(gameLoop, FRAME_DURATION); // FrameRate
  }