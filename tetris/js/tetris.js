const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const ROW = 20; //canvas size vertical
const COL = COLUMN = 10; //canvas size horizontal
const SQ = squareSize = 20;
const VACANT = "WHITE"; //color of empty sqaure

//draw square     works if you remove SQ with 50,50 and taking out the *SQ
function drawSquare(x,y,color) {
  ctx.fillStyle = color;
  ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

  ctx.strokeStyle = "BLACK";
  ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

//creating the board

let board = [];
for(r = 0; r <ROW; r++){
  board[r] = [];
  for(c = 0; c < COL; c++){
    board[r][c] = VACANT;
  }
}

// draw board on canvas
  function drawBoard(){
    for(r = 0; r <ROW; r++){
      for(c = 0; c < COL; c++){
        drawSquare(c,r,board[r][c]);
      }
    }
  }

drawBoard();

  //tetris piece and the color
  const PIECES = [
    [Z, "cyan"],
    [S, "yellow"],
    [T, "green"],
    [O, "red"],
    [L, "gray"],
    [I, "orange"],
    [J, "blue"]
  ];

  //generate random tetris function
  function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) //generate rand num from 0 -> 6
    return new Piece(PIECES[r][0],PIECES[r][1]);
  }

  let p = randomPiece();

// Creating object piece

function Piece(tetromino, color){
  this.tetromino = tetromino;
  this.color = color;

  this.tetrominoN = 0; //starting from the first pattern
  this.activeTetromino = this.tetromino[this.tetrominoN];

// controls for the tetris pieces
this.x=3;
this.y=0;
}

// fill function
Piece.prototype.fill = function(color){
  for(r = 0; r < this.activeTetromino.length; r++){
    for(c = 0; c < this.activeTetromino.length; c++){
      //if statement that will draw only on occupied squares
      if(this.activeTetromino[r][c]){
        drawSquare(this.x + c,this.y + r, color)
      }
    }
  }
}


// draw tetris piece to board function
Piece.prototype.draw = function(){
  this.fill(this.color);
}

//undraw previous falling tetris piece. turns the color of the piece previous position white
Piece.prototype.unDraw = function(){
  this.fill(VACANT);
}

// move down
Piece.prototype.moveDown = function(){
  if(!this.collision(0,1,this.activeTetromino)){
    this.unDraw();
    this.y++;
    this.draw();
  }else{
    // piece has landed on ground spot, generate new piece
      this.lock();
      p = randomPiece();
  }
}

//move right function
Piece.prototype.moveRight = function(){
  if(!this.collision(1,0,this.activeTetromino)){
  this.unDraw();
  this.x++;
  this.draw();
}else{

  }
}

//move left function
Piece.prototype.moveLeft = function(){
  if(!this.collision(-1,0,this.activeTetromino)){
  this.unDraw();
  this.x--;
  this.draw();
}else{

  }
}

//rotate tetris function
Piece.prototype.rotate = function(){
  let nextPattern =  this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
  //allowing tetris piece to rotate when against wall
  let kick = 0;
  if(this.collision(0,0,nextPattern)){
    if(this.x > COL/2){
      //the wall on the right has cause the collision
      kick = -1; //-1 will move the tetris piece to the left
    }else{
      //the wall on the left has caused the collision
      kick = 1; //1 will move the tetris piece to the right
    }
  }
  if(!this.collision(kick,0,nextPattern)){
  this.unDraw();
  this.x += kick;
  this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; //same as (0+1)%4 = 1
  this.activeTetromino = this.tetromino[this.tetrominoN];
  this.draw();
  }
}

let score=0;

//detect if tetris piece hits another tetris piece
Piece.prototype.lock = function(){
  for(r = 0; r < this.activeTetromino.length; r++){
    for(c = 0; c < this.activeTetromino.length; c++){
      //skip the vacant squares
      if( !this.activeTetromino[r][c]){
        continue;
      }
      //if tetris piece hits the top of the board, game is over
      if(this.y - r < -1.5){
        alert("Game Over");
        //cancel request animation frame
        gameOver = true;
        break;
      }
      // change board color to so it looks like tetris piece is grounded
      board[this.y+r][this.x+c] = this.color;
    }
  }
  //remove full row
  for(r=0; r < ROW; r++){
    let isRowFull = true;
    for(c= 0; c < COL; c++){
      isRowFull = isRowFull && (board[r][c] != VACANT);
    }
    if(isRowFull){
      //if the row is full, move down all rows above it
      for(y = r; y > 1; y--){
        for(c= 0; c < COL; c++){
          board[y][c] = board[y-1][c];
        }
      }
      //top row board , has no row above it
      for(c= 0; c < COL; c++){
        board[0][c] = VACANT;
      }
      //score increase
      score += 40;
    }
  }
  //update the board
  drawBoard();
}


//collision detection function
Piece.prototype.collision = function(x,y,piece){
  for(r = 0; r < piece.length; r++){
    for(c = 0; c < piece.length; c++){
      //check if the square is vacant, if so skip it.
      if(!piece[r][c]){
        continue;
      }
      //coordinates for tetris after movement
      let newX = this.x + c + x;
      let newY = this.y + r + y;

      //conditions
      if(newX < 0 || newX >= COL || newY >= ROW){
        return true;
      }
      //skip newY <0; board[-1] will crash the game
      if(newY < 0){
        continue;
      }
      //check if tetris is already in place on board
      if(board[newY][newX] !=VACANT){
        return true;
      }
    }
  }
  return false;
}

//Tetris controls . dropStart prevents it from pushing the tetris down unless you press the down button
document.addEventListener("keydown", CONTROL);
function CONTROL(event){
  if(event.keyCode == 37){
    p.moveLeft();
    dropStart = Date.now();
  }else if(event.keyCode == 38){
    p.rotate();
    dropStart = Date.now();
  }else if(event.keyCode == 39){
    p.moveRight();
    dropStart = Date.now();
  }else if(event.keyCode == 40){
    p.moveDown();
  }
}

//tetris piece dropping function, should drop one square every 1 second.

let dropStart = Date.now();
let gameOver = false;
function drop(){
  let now = Date.now();
  let delta = now - dropStart;
  if(delta > 700){
  p.moveDown();
  dropStart = Date.now();
}
  if( !gameOver){
  requestAnimationFrame(drop);
  }
}
 drop();
