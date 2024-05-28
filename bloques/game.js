//elementos del canvas
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");


//border del canvas
cvs.style.border = "2px solid black";

//border de la paleta
ctx.lineWidth = 3;
//variables del juego 
const paddleWidth =100;//paleta ancho
const paddleMarginBottom=50; //Parte inferior del margen de la paleta
const paddleHeight=20 //altura
//bola
const ballRadius = 10;
//vida
 var life = 3;
//puntos
var score = 0;
const scoreUnit =10;//puntos por romper bloqye
//level
var level=1;
const maxLevel = 6;
var GAME_OVER = false;
//direction
var leftArrow = false;
var rightArrow = false;

//cargar imagenes sonidos 
//cargar el fondo 
const bgImg = new Image();
bgImg.src = "assets/imagenes/fondo1.jpg";
bgImg.width=400;
bgImg.height=500;
//level
const levelImg = new Image();
levelImg.src = "assets/imagenes/nivel.png";
// vida
const lifeImg = new Image();
lifeImg.src = "assets/imagenes/vida.png";
//puntos
const scoreImg = new Image();
scoreImg.src = "assets/imagenes/score.png";

//sonidos
const wallHit = new Audio();
wallHit.src="assets/sounds/ambiente.mp3";//ambiente

const fin = new Audio();
fin.src="assets/sounds/gameover.mp3";//gameover

const paleta = new Audio();
paleta.src="assets/sounds/paleta.mp3";//paleta

const choque = new Audio();
choque.src="assets/sounds/plop.mp3";//plop

const empezar = new Audio();
empezar.src="assets/sounds/start.mp3";//start

const lifeLost = new Audio();
lifeLost.src="assets/sounds/vidaperdida.mp3";//vida perdida




//crando paleta
const paddle =
{
    x:cvs.width/2 - paddleWidth/2,
    y:cvs.height - paddleMarginBottom - paddleHeight,
    width:paddleWidth,
    height:paddleHeight,
    dx:5
};

//dibujar paleta
function drawPaddle()
{
    //fondo de la paleta
    ctx.fillStyle = "red";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    //borde de la paleta
    ctx.strokeStyle = "black";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
};

//controles de la paleta 
document.addEventListener('keydown', function(event)
{
    if(event.keyCode == '37')
    {
        leftArrow=true;
        //console.log("funciona derecha");
    }
    else if(event.keyCode=='39')
    {
        rightArrow = true;
        //console.log("funciona1 izikierda");
    }
})
document.addEventListener('keyup', function(event)
{
    if(event.keyCode == '37')
    {
        leftArrow=false;
        //console.log("funciona2 suelto");
    }
    else if(event.keyCode=='39')
    {
        rightArrow = false;
        //console.log("funciona3 solt");
    }

})
//movimiento paleta
function movePaddle()
{
    if(rightArrow && paddle.x + paddle.width < cvs.width)//evitar k salga del canvas a partir &&
    {
        paddle.x += paddle.dx;
    }
    else if(leftArrow && paddle.x > 0)
    {
        paddle.x -= paddle.dx;
    }
};

//creando bola
const ball = 
{
    x:cvs.width/2,
    y:paddle.y - ballRadius,
    radius:ballRadius,
    speed:4,
    dx:3 * (Math.random() * 2 - 1),
    dy:-3
}

//dibujar bola 
function drawBall()
{
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, 50);
    ctx.fillStyle="yellow";
    ctx.fill();

    ctx.strokeStyle="black"
    ctx.stroke();

    ctx.closePath();
}

//movimiento de la bola 
function moveBall()
{
    ball.x +=ball.dx;
    ball.y +=ball.dy;
}

// colision de la bola 
function ballWallCollision()
{
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0)
    {
        ball.dx = -ball.dx;
        choque.play();
    }

    if(ball.y - ball.radius < 0)
    {
        ball.dy= -ball.dy;
    }

    if(ball.y + ball.radius > cvs.height)
    {
        life--;
        lifeLost.play();
        resetBall();
    }
}
//resetear bola 
function resetBall()
{
    ball.x=cvs.width/2;
    ball.y=paddle.y - ballRadius;
    ball.dx=3 * (Math.random() * 2 - 1);
    ball.dy=-3;
}
//chocar bola con paleta
function ballPaddleCollision()
{
    if(ball.x <paddle.x + paddle.width && ball.x > paddle.y < paddle.y + paddle.height && ball.y >paddle.y)
    {
        //sonido
        paleta.play();
        //comprobar dónde la pelota golpeó la paleta
        let collidePoint = ball.x -(paddle.x + paddle.width/2);
        //normalizar los valores
        collidePoint = collidePoint / (paddle.width/2);
        //calcular el angulo 
        let angle = collidePoint * Math.PI/3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}

//creando las medidas bloques
const brick = 
{
    row:3,
    column:5,
    width:55,
    height:20,
    offSetLeft:20,
    offSetTop:20,
    marginTop:40,
    fillColor:"green",
    strokeColor:"black"
};
//creando bloques 
let bricks=[];
function createBricks()
{
    for(let r = 0; r < brick.row;r++)
    {
        bricks[r]=[]
        for(let c = 0; c < brick.column;c++)
        {
            bricks[r][c] = 
            {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop +brick.marginTop,
                status:true
            }
        }
    }
}
createBricks();
//dibujando los bloques 
function drawBricks()
{
    for(let r = 0; r < brick.row;r++)
    {
        for(let c = 0; c < brick.column;c++)
        {
            let b = bricks[r][c];
            if(b.status)
            {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

//romper los bloques 
function ballBricksCollision()
{
    for(let r = 0; r < brick.row;r++)
    {
        for(let c = 0; c < brick.column;c++)
        {
            let b = bricks[r][c];
            if(b.status)
            {
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y
                    && ball.y - ball.radius < b.y + brick.height)
                {
                    choque.play();
                    ball.dy = -ball.dy;
                    b.status = false;//rompe bloke
                    score += scoreUnit;
                }
                
            }
        }
    }
}
//mostrat que empienza el juego
function showGameStats(text,textX,textY,img,imgX,imgY)
{
    //dibujar texto
    ctx.fillStyle="white";
    ctx.font="25px Germania one";
    ctx.fillText(text,textX,textY);
    //dibujar imagen
    ctx.drawImage(img,imgX,imgY, width=25,height=25)

}

//dibujar
function draw()
{
    drawPaddle();
    drawBall();
    drawBricks();
    //puntos
    showGameStats(score, 35, 25, scoreImg, 5, 5);
    //vida
    showGameStats(life,cvs.width -25, 25, lifeImg, cvs.width -55, 5);
    //level
    showGameStats(level, cvs.width/2 +10, 25, levelImg,cvs.width/2 -20, 5);
}

//game over
function gameOver()
{
    if(life <=0)
    {
        showYouLose();
        GAME_OVER=true;
        fin.play();
        wallHit.muted=true;
    }
}
//subir d enivel
function levelUp()
{
    let isLevelDone = true;
    for(let r = 0; r < brick.row;r++)
    {
        for(let c = 0; c < brick.column;c++)
        {
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }
    if(isLevelDone)
    {
        brick.row++;
        createBricks();
        ball.speed += 1;
        resetBall();
        level++;
        empezar.play();
        console.log("pasaste");


        if(level >= maxLevel)
        {
            showYouWon();
            GAME_OVER=true;
            return;
        }
    }

}

//actualizar la función del juego
function update()
{
    //empezar.play();
    movePaddle();

    moveBall();

    ballWallCollision();
    ballPaddleCollision();
    ballBricksCollision();
    wallHit.play();

    gameOver();
    levelUp();

}

//bucle de juego
function loop()
{
    ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height);//cargar fondo 

    draw();

    update();
    if(! GAME_OVER)
    {
        requestAnimationFrame(loop);
    }
}
loop();


//silenciar sonido
const soundElement = document.getElementById("sound");
soundElement.addEventListener("click", audioManager);

function audioManager()
{
    let  imgSrc=soundElement.getAttribute("src");
    let soundImg= imgSrc=="assets/imagenes/soundOn.png" ? "assets/imagenes/soundOff.jpg": "assets/imagenes/soundOn.png";

    soundElement.setAttribute("src", soundImg);

    //mutar sonidos
    wallHit.muted = wallHit.muted ? false : true;
    /*
    choque.muted = choque.muted ? false : true;
    empezar.muted = empezar.muted ? false : true;
    fin.muted =fin.muted ? false : true;
    paleta.muted = paleta.muted ? false : true;
    lifeLost.muted = lifeLost.muted ? false : true;*/
}

//pantalla de gameover
const gameover = document.getElementById("gameover");
const youwon = document.getElementById("youwon");
const youlose = document.getElementById("youlose");
const restar = document.getElementById("restar");

// volver a empezar el juego 
restar.addEventListener("click", function()
{
    location.reload();//volver a cargar la pagina
})
//cuando ganas 
function showYouWon()
{
    gameover.style.display = "block";
    youwon.style.display = "block";
}
//cuando pierdes 
function showYouLose()
{
    gameover.style.display = "block";
    youlose.style.display = "block";
}