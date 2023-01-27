var canvas = document.getElementById('mycanvas');
var victory_canvas=document.getElementById('victory-Canv');
var mousex = 0;
var mousey = 0;
var g;


//load image
var bulb = new Image();
bulb.src = "image/bulb.png";

var bulb_win = new Image();
bulb_win.src = "image/bulb_win.png";

var f_error = new Image();
f_error.src = "image/f_error.png";

var light = new Image();
light.src = "image/lighted.png";

var mark = new Image();
mark.src = "image/marked.png";

var redo = new Image();
redo.src = "image/redo.png";

var restart = new Image();
restart.src = "image/restart.png";

var undo = new Image();
undo.src = "image/undo.png";

var wall0 = new Image();
wall0.src = "image/wall0.png";

var wall1 = new Image();
wall1.src = "image/wall1.png";

var wall2 = new Image();
wall2.src = "image/wall2.png";

var wall3 = new Image();
wall3.src = "image/wall3.png";

var wall4 = new Image();
wall4.src = "image/wall4.png";

var wall0_error = new Image();
wall0_error.src = "image/wall0_error.png";

var wall1_error = new Image();
wall1_error.src = "image/wall1_error.png";

var wall2_error = new Image();
wall2_error.src = "image/wall2_error.png";

var wall3_error = new Image();
wall3_error.src = "image/wall3_error.png";

var wall4_error = new Image();
wall4_error.src = "image/wall4_error.png";

var wallu = new Image();
wallu.src = "image/wallu.png";

var win = new Image();
win.src = "image/win.png";


Module.onRuntimeInitialized = () => {
    console.log("module initialized!");
    setTimeout(start, 300); // wait all images are loaded!!!
}

canvas.addEventListener('click', canvasLeftClick);        // left click event
canvas.addEventListener('contextmenu', canvasRightClick); // right click event


function canvasLeftClick(event) { //left click moove 
    event.preventDefault();
    console.log("left click at position:", event.offsetX, event.offsetY);
    mousex = event.offsetX;
    mousey = event.offsetY;
    play_leftmove_canvas();
}
function canvasRightClick(event) {//right click moove 
    event.preventDefault();
    console.log("right click at position:", event.offsetX, event.offsetY);
    mousex = event.offsetX;
    mousey = event.offsetY;
    play_rightmove_canvas();
}

function drawCanvas_line(nb_rows, nb_cols) { // draw game dimension with line 
    const ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    ctx.save();
    ctx.beginPath();
    ctx.clearRect(0, 0,width, height);
    ctx.strokeStyle = 'black';
    ctx.moveTo(0, 0);
    // draw some lines
    for (var row = 0; row < nb_rows; row++) {
        var row_draw = height / nb_rows;
        ctx.moveTo(0, row_draw * row);
        ctx.lineTo(width, row_draw * row);
    }
    for (var col = 0; col < nb_cols; col++) {
        var cols_draw = width / nb_cols;
        ctx.moveTo(cols_draw * col, 0);
        ctx.lineTo(cols_draw * col, height);
    }
    
    ctx.stroke();
    ctx.restore();
}

function drawCanvas_square(img, nb_rows, nb_cols, rows, cols) { // draw image (lightbulb /marked / lighted or wall)
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    ctx.save();
    ctx.drawImage(img, width / nb_cols * cols, height / nb_rows * rows, height/nb_cols, width/nb_cols); // Ne s'adapte pas super bien avec les images si les cases n'ont pas width=height
    ctx.restore();
}




function printGame(g) {
    var nb_rows = Module._nb_rows(g);
    var nb_cols = Module._nb_cols(g);
    drawCanvas_line(nb_rows, nb_cols);
    for (var row = 0; row < nb_rows; row++) {
        for (var col = 0; col < nb_cols; col++) {
            var black = Module._is_black(g, row, col);
            var ligthed = Module._is_lighted(g, row, col);
            var lightbulb = Module._is_lightbulb(g, row, col);
            var marked = Module._is_marked(g, row, col);
            var error = Module._has_error(g, row, col);
            if (black) {
                var nombre = Module._get_black_number(g, row, col);
                if (nombre == 0)
                    if (error)
                        drawCanvas_square(wall0_error, nb_rows, nb_cols, row, col);
                    else
                        drawCanvas_square(wall0, nb_rows, nb_cols, row, col);
                if (nombre == 1)
                    if (error)
                        drawCanvas_square(wall1_error, nb_rows, nb_cols, row, col);
                    else
                        drawCanvas_square(wall1, nb_rows, nb_cols, row, col);
                if (nombre == 2)
                    if (error)
                        drawCanvas_square(wall2_error, nb_rows, nb_cols, row, col);
                    else
                        drawCanvas_square(wall2, nb_rows, nb_cols, row, col);
                if (nombre == 3)
                    if (error)
                        drawCanvas_square(wall3_error, nb_rows, nb_cols, row, col);
                    else
                        drawCanvas_square(wall3, nb_rows, nb_cols, row, col);
                if (nombre == 4)
                    if (error)
                        drawCanvas_square(wall4_error, nb_rows, nb_cols, row, col);
                    else
                        drawCanvas_square(wall4, nb_rows, nb_cols, row, col);
                if (nombre == -1)
                    drawCanvas_square(wallu, nb_rows, nb_cols, row, col);
            }
            else if (lightbulb)
                if (error)
                    drawCanvas_square(f_error, nb_rows, nb_cols, row, col);
                else
                    drawCanvas_square(bulb, nb_rows, nb_cols, row, col);
            else if (marked)
                drawCanvas_square(mark, nb_rows, nb_cols, row, col);
            else if (ligthed)
                drawCanvas_square(light, nb_rows, nb_cols, row, col);
        }
    }
    if (Module._is_over(g)) {
        Victoire();
    }
    else
        clear_victoire();
}


function play_rightmove_canvas() { // If right Click put Marked
    var width = canvas.width;
    var height = canvas.height;
    var nb_rows = Module._nb_rows(g);
    var nb_cols = Module._nb_cols(g);
    var marked = Module._is_marked(g, mousey * nb_rows / height, mousex * nb_cols / width);
    const S_MARK = 2;
    const S_BLANK = 0;
    if (marked)
        Module._play_move(g, mousey * nb_rows / height, mousex * nb_cols / width, S_BLANK);
    else
        Module._play_move(g, mousey * nb_rows / height, mousex * nb_cols / width, S_MARK);
    printGame(g);

}

function play_leftmove_canvas() { // if left click put Lightbulb
    var width = canvas.width;
    var height = canvas.height;
    var nb_rows = Module._nb_rows(g);
    var nb_cols = Module._nb_cols(g);
    var blank = Module._is_blank(g, mousey * nb_rows / height, mousex * nb_cols / width);
    var lightbulb = Module._is_lightbulb(g, mousey * nb_rows / height, mousex * nb_cols / width);
    var marked = Module._is_marked(g, mousey * nb_rows / height, mousex * nb_cols / width);
    const LIGHTBULB = 1;
    const S_BLANK = 0
    if (blank)
        Module._play_move(g, mousey * nb_rows / height, mousex * nb_cols / width, LIGHTBULB);
    if (lightbulb)
        Module._play_move(g, mousey * nb_rows / height, mousex * nb_cols / width, S_BLANK);
    if (marked)
        Module._play_move(g, mousey * nb_rows / height, mousex * nb_cols / width, LIGHTBULB);
    printGame(g);
}

function undo_canvas() {
    Module._undo(g);
    printGame(g);
}
function redo_canvas() {
    Module._redo(g);
    printGame(g);
}
function restart_canvas() {
    Module._restart(g);
    printGame(g);
}
function solve_canvas() {
    Module._solve(g); // Not Working until 6x6
    printGame(g);
}

function Victoire(){ // print a victory message in a second canvas 
    var ctx = victory_canvas.getContext('2d');
    var width = victory_canvas.width;
    var height = victory_canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.drawImage(win, width / 2, height /2, width/2, height /2);
    ctx.font = "20pt Calibri,Geneva,Arial";
    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillText("Choose ", 10, 20);
    ctx.fillText("New Random Game", 10, 40);
    ctx.fillText("To Continue", 10, 60);
    ctx.restore();
}

function clear_victoire(){ // clear the second canvas
    var ctx = victory_canvas.getContext('2d');
    var width = victory_canvas.width;
    var height = victory_canvas.height;
    ctx.clearRect(0, 0, width, height);

}

function new_random_canvas() { // Generate new random game
    nb_played=0;
    var x = parseInt(document.getElementById('x').value);
    var y = parseInt(document.getElementById('y').value);
    var wall = parseInt(document.getElementById('m').value);
    var wrapping = parseInt(document.getElementById('w').value);
    g = Module._new_random(x, y, wrapping, wall, 0); 
    console.log("random");
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    printGame(g);
}

function start() {
    g = Module._new_default();
    printGame(g);
}

