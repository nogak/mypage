'use strict';
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.lineWidth = 1;

let frame_counter = 0;

// load field image
// const battle_field = "images/battle_field/Panel.png"
const img_battle_field = new Image();
img_battle_field.src = "images/battle_field/Panels.png"

// const paramater
const gba_width = 240;
const gba_hight = 320;

function draw_field(){
    var can = document.getElementById('sample');
    // var img = new Image();
    // img.src = "images/battele_field/Panels.png"
    var context = canvas.getContext('2d');
    context.drawImage(img ,0, 0, 240/6, 160/2, 0, canvas.height-160,canvas.width/6, canvas.height/2)
    context.drawImage(img ,0, 0, 240/6, 160/2, 0, canvas.height-160,canvas.width/6, canvas.height/2)
}

function draw_grid(){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';
    // horizontal line
    for(let i=0.0; i < canvas.height; i+=cell_size){
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }
    for(let i=0.0; i < canvas.width; i+=cell_size){
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
    }
    ctx.closePath();
    ctx.stroke();
}

//-----------------------------------
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_field();
    
    frame_counter++;
    requestAnimationFrame(draw);
}
// setInterval(draw, 10);
draw();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.keyCode == 76) { // 76 : l
        right_pressed = true;
        if(flag_start_menu && menu_counter > 5){
            select_mode++;
            if(select_mode > 2) select_mode = 2;
            menu_counter = 0;
        }
    }else if(e.key == "Left" || e.key == "ArrowLeft" || e.keyCode == 74) { // 74 : j
        left_pressed = true;
        if(flag_start_menu && menu_counter > 5){
            select_mode--;
            if(select_mode < 0) select_mode = 0;
            menu_counter = 0;
        }
    }else if(e.keyCode == 38 || e.keyCode == 73){ // 73 : i
        up_pressed = true;
    }else if(e.keyCode == 40 || e.keyCode == 75){ // 75 : k
        down_pressed = true;
    }else if(e.keyCode == 32){
        space_pressed = true;
        grid_focus = true;
        if(flag_start_menu) flag_start_menu = false;
    }else if(e.keyCode == 68){ //key : d
        if(debug_mode){
            debug_mode = false;
        }else{
            debug_mode = true;
        }
    }else if(e.keyCode == 13){ // key : enter
        if(flag_start_menu) flag_start_menu = false;
    }
}
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.keyCode == 76) {
        right_pressed = false;
        right_up_flag = true;
    }else if(e.key == "Left" || e.key == "ArrowLeft" || e.keyCode == 74) {
        left_pressed = false;
        left_up_flag = true;
    }else if(e.keyCode == 38 || e.keyCode == 73){
        up_pressed = false;
        up_up_flag = true;
    }else if(e.keyCode == 40 || e.keyCode == 75){
        down_pressed = false;
        up_up_flag = true;
    }else if(e.keyCode == 32){
        space_pressed == false;
        grid_focus = false;
    }
    long_press_flag_reset();
}