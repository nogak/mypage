'use strict';
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const context = canvas.getContext`2d`
context.imageSmoothingEnabled
= context.msImageSmoothingEnabled
= context.webkitImageSmoothingEnabled = false

ctx.lineWidth = 1;

let frame_counter = 0;

// load image
const img_battle_field = new Image();
img_battle_field.src = "images/battle_field/Panels.png";
const img_license_logo = new Image();
img_license_logo.src = "images/imageLicenseLogo.png";

const img_uchan = new Object();
img_uchan.idle = [new Image(), new Image(), new Image(), new Image()];
img_uchan.idle[0].src = "images/unitychan/idle_01.png";
img_uchan.idle[1].src = "images/unitychan/idle_02.png";
img_uchan.idle[2].src = "images/unitychan/idle_03.png";
img_uchan.idle[3].src = "images/unitychan/idle_04.png";
img_uchan.damage = [new Image(), new Image(), new Image(), new Image()];
img_uchan.damage[0].src = "images/unitychan/damage_01.png";
img_uchan.damage[1].src = "images/unitychan/damage_02.png";
img_uchan.damage[2].src = "images/unitychan/damage_03.png";
img_uchan.damage[3].src = "images/unitychan/damage_04.png";
img_uchan.shoot = [new Image(), new Image(), new Image(), new Image(), new Image()];
img_uchan.shoot[0].src = "images/unitychan/shoot_01.png";
img_uchan.shoot[1].src = "images/unitychan/shoot_02.png";
img_uchan.shoot[2].src = "images/unitychan/shoot_03.png";
img_uchan.shoot[3].src = "images/unitychan/shoot_04.png";
img_uchan.shoot[4].src = "images/unitychan/shoot_05.png"; 
img_uchan.sword = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
img_uchan.sword[0].src = "images/unitychan/sword_01.png";
img_uchan.sword[1].src = "images/unitychan/sword_02.png";
img_uchan.sword[2].src = "images/unitychan/sword_03.png";
img_uchan.sword[3].src = "images/unitychan/sword_04.png";
img_uchan.sword[4].src = "images/unitychan/sword_05.png";
img_uchan.sword[5].src = "images/unitychan/sword_06.png";
img_uchan.sword[6].src = "images/unitychan/sword_07.png"; 
img_uchan.lose = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
img_uchan.lose[0].src = "images/unitychan/lose_01.png";
img_uchan.lose[1].src = "images/unitychan/lose_02.png";
img_uchan.lose[2].src = "images/unitychan/lose_03.png";
img_uchan.lose[3].src = "images/unitychan/lose_04.png";
img_uchan.lose[4].src = "images/unitychan/lose_05.png";
img_uchan.lose[5].src = "images/unitychan/lose_06.png";

//draw status
let loop_counter_player = 0;
let loop_counter_enemy;
let loop_counter_move = 0;
let loop_counter_charge = 0;
let loop_counter_damage = 0;
let loop_counter_damage_enemy = 0;
let flag_charge = false;
let flag_shoot = false;
let flag_draw_damege = false;
let flag_draw_damege_enemy = false;
// 0:idle, 1:move, 2:damage, 3:shoot, 4:sword, 5:lose
let player_status = 0;
let enemy_status = 0;
let old_status = 0;
let old_status_enemy = 0;
// let motion_uchan = new Object();
// motion_uchan.idle = 

// character status
let player_pos = [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
let player_HP = 500;
let player_HP_draw = 500;

// enemy status
let enemy_pos = [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
let enemy_HP = 500;
let enemy_HP_draw = 500;
let loop_counter_move_enemy = 0;

// key_param
let right_pressed = false;
let left_pressed = false;
let down_pressed = false;
let up_pressed = false;
let right_pressed_long = false;
let left_pressed_long = false;
let down_pressed_long = false;
let up_pressed_long = false;
let space_pressed = false;
let flag_freeze = false;
let flag_freeze_enemy = false;

// const paramater
const gba_width = 240;
const gba_hight = 160;
const charge_time = 60;

// background animation param
let loop_counter_background = 0;

function mirror(){
    ctx.scale(-1,1);
    ctx.translate(-256, 0);
}

function draw_field(){
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2-10);
    ctx.fillStyle = "red";
    ctx.fillRect(0, canvas.height-10, canvas.width/2, 10);
    ctx.fillStyle = "blue";
    ctx.fillRect(canvas.width/2, canvas.height-10, canvas.width/2, 10);
    
    ctx.strokeStyle = "red";
    ctx.strokeRect(ctx.lineWidth/2, canvas.height/2, (canvas.width-ctx.lineWidth)/2-ctx.lineWidth, canvas.height/2);
    ctx.moveTo(0, canvas.height/6*4-3);
    ctx.lineTo(canvas.width/2, canvas.height/6*4-3);
    ctx.moveTo(0, canvas.height/6*5-6);
    ctx.lineTo(canvas.width/2, canvas.height/6*5-6);

    ctx.moveTo(canvas.width/6, canvas.height/2);
    ctx.lineTo(canvas.width/6, canvas.height);
    ctx.moveTo(canvas.width/6*2, canvas.height/2);
    ctx.lineTo(canvas.width/6*2, canvas.height);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.strokeRect((canvas.width+ctx.lineWidth/2)/2, canvas.height/2, (canvas.width-ctx.lineWidth)/2-ctx.lineWidth/2, canvas.height/2);
    
    ctx.moveTo(canvas.width/2, canvas.height/6*4-3);
    ctx.lineTo(canvas.width, canvas.height/6*4-3);
    ctx.moveTo(canvas.width/2, canvas.height/6*5-6);
    ctx.lineTo(canvas.width, canvas.height/6*5-6);

    ctx.moveTo(canvas.width/6*4, canvas.height/2);
    ctx.lineTo(canvas.width/6*4, canvas.height);
    ctx.moveTo(canvas.width/6*5, canvas.height/2);
    ctx.lineTo(canvas.width/6*5, canvas.height);

    ctx.closePath();
    ctx.stroke();
}

function draw_background(){
    for(let i=-1; i < 3; i++){
        for(let j=-1; j < 2; j++){
            ctx.drawImage(img_license_logo, 0, 0, img_license_logo.width, img_license_logo.height, canvas.width/3*i+loop_counter_background, canvas.width/6/10*9*j*2+loop_counter_background*(9/10), canvas.width/6, canvas.width/6/10*9);
            ctx.drawImage(img_license_logo, 0, 0, img_license_logo.width, img_license_logo.height, canvas.width/3*i+canvas.width/6+loop_counter_background, canvas.width/6/10*9*j*2+canvas.width/6/10*9+loop_counter_background*(9/10), canvas.width/6, canvas.width/6/10*9);
        }
    }
    loop_counter_background++;
    if(loop_counter_background > canvas.width/6) loop_counter_background = 0;
}

function move_pattern(pos, direction){
    // 0:right, 1:left, 2:up, 3:down
    if(pos[0][0] == 1){
        if(direction == 0){
            return [[0, 1, 0], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 1){
            return [[1, 0, 0], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 2){
            return [[1, 0, 0], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 3){
            return [[0, 0, 0], [1, 0, 0], [0, 0, 0]];
        }
    }else if(pos[0][1] == 1){
        if(direction == 0){
            return [[0, 0, 1], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 1){
            return [[1, 0, 0], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 2){
            return [[0, 1, 0], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 3){
            return [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
        }
    }else if(pos[0][2] == 1){
        if(direction == 0){
            return [[0, 0, 1], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 1){
            return [[0, 1, 0], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 2){
            return [[0, 0, 1], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 3){
            return [[0, 0, 0], [0, 0, 1], [0, 0, 0]];
        }
    }else if(pos[1][0] == 1){
        if(direction == 0){
            return [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
        }else if(direction == 1){
            return [[0, 0, 0], [1, 0, 0], [0, 0, 0]];
        }else if(direction == 2){
            return [[1, 0, 0], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 3){
            return [[0, 0, 0], [0, 0, 0], [1, 0, 0]];
        }
    }else if(pos[1][1] == 1){
        if(direction == 0){
            return [[0, 0, 0], [0, 0, 1], [0, 0, 0]];
        }else if(direction == 1){
            return [[0, 0, 0], [1, 0, 0], [0, 0, 0]];
        }else if(direction == 2){
            return [[0, 1, 0], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 3){
            return [[0, 0, 0], [0, 0, 0], [0, 1, 0]];
        }        
    }else if(pos[1][2] == 1){
        if(direction == 0){
            return [[0, 0, 0], [0, 0, 1], [0, 0, 0]];
        }else if(direction == 1){
            return [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
        }else if(direction == 2){
            return [[0, 0, 1], [0, 0, 0], [0, 0, 0]];
        }else if(direction == 3){
            return [[0, 0, 0], [0, 0, 0], [0, 0, 1]];
        }
    }else if(pos[2][0] == 1){
        if(direction == 0){
            return [[0, 0, 0], [0, 0, 0], [0, 1, 0]];
        }else if(direction == 1){
            return [[0, 0, 0], [0, 0, 0], [1, 0, 0]];
        }else if(direction == 2){
            return [[0, 0, 0], [1, 0, 0], [0, 0, 0]];
        }else if(direction == 3){
            return [[0, 0, 0], [0, 0, 0], [1, 0, 0]];
        }
    }else if(pos[2][1] == 1){
        if(direction == 0){
            return [[0, 0, 0], [0, 0, 0], [0, 0, 1]];
        }else if(direction == 1){
            return [[0, 0, 0], [0, 0, 0], [1, 0, 0]];
        }else if(direction == 2){
            return [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
        }else if(direction == 3){
            return [[0, 0, 0], [0, 0, 0], [0, 1, 0]];
        }
    }else if(pos[2][2] == 1){
        if(direction == 0){
            return [[0, 0, 0], [0, 0, 0], [0, 0, 1]];
        }else if(direction == 1){
            return [[0, 0, 0], [0, 0, 0], [0, 1, 0]];
        }else if(direction == 2){
            return [[0, 0, 0], [0, 0, 1], [0, 0, 0]];
        }else if(direction == 3){
            return [[0, 0, 0], [0, 0, 0], [0, 0, 1]];
        }
    }
}

function convert_pos(pos){
    let obj_pos = new Object();
    const offset = 5
    if(pos[0][0] == 1){
        obj_pos.x = canvas.width/12*1;
        obj_pos.y = canvas.height/12*7;
    }else if(pos[0][1] == 1){
        obj_pos.x = canvas.width/12*3;
        obj_pos.y = canvas.height/12*7;
    }else if(pos[0][2] == 1){
        obj_pos.x = canvas.width/12*5;
        obj_pos.y = canvas.height/12*7;
    }else if(pos[1][0] == 1){
        obj_pos.x = canvas.width/12*1;
        obj_pos.y = canvas.height/12*9 -offset;
    }else if(pos[1][1] == 1){
        obj_pos.x = canvas.width/12*3;
        obj_pos.y = canvas.height/12*9 - offset;
    }else if(pos[1][2] == 1){
        obj_pos.x = canvas.width/12*5;
        obj_pos.y = canvas.height/12*9 - offset;
    }else if(pos[2][0] == 1){
        obj_pos.x = canvas.width/12*1;
        obj_pos.y = canvas.height/12*11 - offset*2;
    }else if(pos[2][1] == 1){
        obj_pos.x = canvas.width/12*3;
        obj_pos.y = canvas.height/12*11 - offset*2;
    }else if(pos[2][2] == 1){
        obj_pos.x = canvas.width/12*5;
        obj_pos.y = canvas.height/12*11 - offset*2;
    }
    return obj_pos
}

function convert_pos_enemy(pos){
    let obj_pos = new Object();
    const offset = 5
    if(pos[0][0] == 1){
        obj_pos.x = canvas.width/12*7;
        obj_pos.y = canvas.height/12*7;
    }else if(pos[0][1] == 1){
        obj_pos.x = canvas.width/12*9;
        obj_pos.y = canvas.height/12*7;
    }else if(pos[0][2] == 1){
        obj_pos.x = canvas.width/12*11;
        obj_pos.y = canvas.height/12*7;
    }else if(pos[1][0] == 1){
        obj_pos.x = canvas.width/12*7;
        obj_pos.y = canvas.height/12*9 -offset;
    }else if(pos[1][1] == 1){
        obj_pos.x = canvas.width/12*9;
        obj_pos.y = canvas.height/12*9 - offset;
    }else if(pos[1][2] == 1){
        obj_pos.x = canvas.width/12*11;
        obj_pos.y = canvas.height/12*9 - offset;
    }else if(pos[2][0] == 1){
        obj_pos.x = canvas.width/12*7;
        obj_pos.y = canvas.height/12*11 - offset*2;
    }else if(pos[2][1] == 1){
        obj_pos.x = canvas.width/12*9;
        obj_pos.y = canvas.height/12*11 - offset*2;
    }else if(pos[2][2] == 1){
        obj_pos.x = canvas.width/12*11;
        obj_pos.y = canvas.height/12*11 - offset*2;
    }
    return obj_pos
}

function cal_player_pos(){
    // 0:right, 1:left, 2:up, 3:down
    const move_freeze = 8;
    if(flag_freeze) return;
    if((right_pressed || right_pressed_long) && loop_counter_move > move_freeze){
        player_pos = move_pattern(player_pos, 0);
        right_pressed = false;
        loop_counter_move = 0;
    }else if((left_pressed || left_pressed_long) && loop_counter_move > move_freeze){
        player_pos = move_pattern(player_pos, 1);
        left_pressed = false;
        loop_counter_move = 0;
    }else if((up_pressed || up_pressed_long) && loop_counter_move > move_freeze){
        player_pos = move_pattern(player_pos, 2);
        up_pressed = false;
        loop_counter_move = 0;
    }else if((down_pressed || down_pressed_long) && loop_counter_move > move_freeze){
        player_pos = move_pattern(player_pos, 3);
        down_pressed = false;
        loop_counter_move = 0
    }
}

function cal_pos_list(pos){
    let char_pos = new Object();
    if(pos[0][0] == 1){
        char_pos.x = 0;
        char_pos.y = 0;
    }else if(pos[0][1] == 1){
        char_pos.x = 1;
        char_pos.y = 0;
    }else if(pos[0][2] == 1){
        char_pos.x = 2;
        char_pos.y = 0;
    }else if(pos[1][0] == 1){
        char_pos.x = 0;
        char_pos.y = 1;
    }else if(pos[1][1] == 1){
        char_pos.x = 1;
        char_pos.y = 1;
    }else if(pos[1][2] == 1){
        char_pos.x = 2;
        char_pos.y = 1;
    }else if(pos[2][0] == 1){
        char_pos.x = 0;
        char_pos.y = 2;
    }else if(pos[2][1] == 1){
        char_pos.x = 1;
        char_pos.y = 2;
    }else if(pos[2][2] == 1){
        char_pos.x = 2;
        char_pos.y = 2;
    }
    return char_pos
}

function cal_enemy_pos(){
    if(flag_freeze_enemy) return;
    if(loop_counter_move_enemy < 80){
        loop_counter_move_enemy++;
        return;
    }
    loop_counter_move_enemy = 0;
    enemy_pos = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    let rand_pos = Math.floor(Math.random()*9);
    if(rand_pos == 0){
        enemy_pos[0][0] = 1;
    }else if(rand_pos == 1){
        enemy_pos[0][1] = 1;
    }else if(rand_pos == 2){
        enemy_pos[0][2] = 1;
    }else if(rand_pos == 3){
        enemy_pos[1][0] = 1;
    }else if(rand_pos == 4){
        enemy_pos[1][1] = 1;
    }else if(rand_pos == 5){
        enemy_pos[1][2] = 1;
    }else if(rand_pos == 6){
        enemy_pos[2][0] = 1;
    }else if(rand_pos == 7){
        enemy_pos[2][1] = 1;
    }else if(rand_pos == 8){
        enemy_pos[2][2] = 1;
    }
}

function detect_damage(attack, attacker){
    // target → player, enemy
    let area = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
    let pos_player = cal_pos_list(player_pos);
    let pos_enemy = cal_pos_list(enemy_pos);
    // console.log(pos_player);
    // console.log(pos_enemy);
    if(attacker == "player"){
        if(attack == "buster"){
            // 攻撃範囲を設定
            for(let i=pos_player.x+1; i < 6; i++){
                area[pos_player.y][i] = 1; 
            }
        }
        if(area[pos_enemy.y][Math.abs(pos_enemy.x-5)] == 1){
            draw_HP_damage_enemy(5);
        }
    }else if(target == "enemy"){

    }
}

function shoot_motion_normal_or_charge(){
    if(flag_shoot){
        if(loop_counter_charge >= charge_time){
            player_status = 4;
        }else{
            player_status = 3;
            // player_status = 4;
        }
        flag_shoot = false;
        flag_charge = false
        loop_counter_charge = 0;
    }else if(flag_charge){
        loop_counter_charge++;
        if(loop_counter_charge > charge_time) loop_counter_charge = charge_time;
    }
}

function draw_charge_bar(grid_pos){
    // if(!flag_charge && loop_counter_charge < 10){
        // return;
    // }
    const bar_width = 80;
    const bar_height = 10;
    const offset_y = 12;
    
    ctx.beginPath();
    ctx.lineWidth = 2;
    if(loop_counter_charge >= charge_time){
        ctx.strokeStyle = "lime";
        ctx.fillStyle = "lime"; 
    }else{
        ctx.strokeStyle = "cyan";
        ctx.fillStyle = "cyan"
    }
    ctx.strokeRect(grid_pos.x-bar_width/2, grid_pos.y+offset_y, bar_width, bar_height);
    ctx.fillRect(grid_pos.x-bar_width/2, grid_pos.y+offset_y, bar_width*loop_counter_charge/charge_time, bar_height);
    ctx.closePath();
    ctx.stroke();
}

function draw_HP_damage(damage_num){
    const width = 80;
    const height = 30;
    if(damage_num != 0){
        player_HP_draw = player_HP;
        player_HP = player_HP - damage_num;
        flag_draw_damege = true;
    }
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.fillRect(ctx.lineWidth/2, ctx.lineWidth/2, width, height);
    ctx.strokeRect(ctx.lineWidth/2, ctx.lineWidth/2, width, height);

    ctx.font = "20px Arial";
    if(player_HP > 100){
        ctx.fillStyle = "black";
    }else{
        ctx.fillStyle = "red";
    }
    ctx.textAlign = "center";
    if(player_HP < player_HP_draw - loop_counter_damage && flag_draw_damege){
        ctx.fillText("HP:"+(player_HP_draw-loop_counter_damage), (width+ctx.lineWidth/2)/2, 25);
        loop_counter_damage++;
    }else{
        ctx.fillText("HP:"+player_HP, (width+ctx.lineWidth/2)/2, 25);
        loop_counter_damage = 0;
        flag_draw_damege = false;
    }
    ctx.closePath();
    ctx.stroke();
}

function draw_HP_damage_enemy(damage_num){
    const width = 80;
    const height = 30;
    if(damage_num != 0){
        enemy_HP_draw = enemy_HP;
        enemy_HP = enemy_HP - damage_num;
        flag_draw_damege_enemy = true;
    }
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width-(width+ctx.lineWidth/2), ctx.lineWidth/2, width, height);
    ctx.strokeRect(canvas.width-(width+ctx.lineWidth/2), ctx.lineWidth/2, width, height);

    ctx.font = "20px Arial";
    if(enemy_HP > 100){
        ctx.fillStyle = "black";
    }else{
        ctx.fillStyle = "red";
    }
    ctx.textAlign = "center";
    // ctx.fillText("HP:"+player_HP, (width+ctx.lineWidth/2)/2, 25);
    if(enemy_HP < enemy_HP_draw - loop_counter_damage_enemy && flag_draw_damege_enemy){
        ctx.fillText("HP:"+(enemy_HP_draw-loop_counter_damage_enemy), canvas.width-((width+ctx.lineWidth/2)/2), 25);
        loop_counter_damage_enemy++;
    }else{
        ctx.fillText("HP:"+enemy_HP, canvas.width-((width+ctx.lineWidth/2)/2), 25);
        loop_counter_damage_enemy = 0;
        flag_draw_damege_enemy = false;
    }
    ctx.closePath();
    ctx.stroke();
}

// function draw_HP(){
//     const width = 80;
//     const height = 30;
//     ctx.beginPath();
//     ctx.lineWidth = 3;
//     ctx.strokeStyle = "black";
//     ctx.fillStyle = "white";
//     ctx.fillRect(ctx.lineWidth/2, ctx.lineWidth/2, width, height);
//     ctx.strokeRect(ctx.lineWidth/2, ctx.lineWidth/2, width, height);

//     ctx.font = "20px Arial";
//     ctx.fillStyle = "black";
//     ctx.textAlign = "center";
//     ctx.fillText("HP:"+player_HP, (width+ctx.lineWidth/2)/2, 25);

//     ctx.closePath();
//     ctx.stroke();
// }

function draw_player_motion(character, grid_pos){
    const offset_character_x = 64*2-5
    const offset_character_y = 128*2-40
    if(player_HP <= 0 && player_status != 100){
        player_HP = 0;
        player_status = 5;
    }

    if(old_status != player_status) loop_counter_player = 0;
    if(character == "unity-chan"){
        if(player_status == 0){
            flag_freeze = false;
            if(loop_counter_player < 20){
                ctx.drawImage(img_uchan.idle[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 40){
                ctx.drawImage(img_uchan.idle[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 60){
                ctx.drawImage(img_uchan.idle[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 80){
                ctx.drawImage(img_uchan.idle[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else{
                ctx.drawImage(img_uchan.idle[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
                loop_counter_player = 0;
            }
        }else if(player_status == 2){
            flag_freeze = true;
            if(loop_counter_player < 10){
                ctx.drawImage(img_uchan.damage[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 20){
                ctx.drawImage(img_uchan.damage[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 30){
                ctx.drawImage(img_uchan.damage[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 40){
                ctx.drawImage(img_uchan.damage[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else{
                ctx.drawImage(img_uchan.idle[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
                loop_counter_player = 0;
                player_status = 0
            }
        }else if(player_status == 3){
            flag_freeze = true;
            if(loop_counter_player < 3){
                ctx.drawImage(img_uchan.shoot[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 5){
                ctx.drawImage(img_uchan.shoot[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 8){
                ctx.drawImage(img_uchan.shoot[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 12){
                ctx.drawImage(img_uchan.shoot[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
                if(loop_counter_player == 10) detect_damage("buster", "player");
            }else if(loop_counter_player < 15){
                ctx.drawImage(img_uchan.shoot[4], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else{
                ctx.drawImage(img_uchan.idle[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
                loop_counter_player = 0;
                player_status = 0
            }
        }else if(player_status == 4){
            flag_freeze = true;
            if(loop_counter_player < 5){
                ctx.drawImage(img_uchan.sword[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 10){
                ctx.drawImage(img_uchan.sword[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 15){
                ctx.drawImage(img_uchan.sword[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 20){
                ctx.drawImage(img_uchan.sword[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 25){
                ctx.drawImage(img_uchan.sword[4], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 30){
                ctx.drawImage(img_uchan.sword[5], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 35){
                ctx.drawImage(img_uchan.sword[6], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else{
                ctx.drawImage(img_uchan.idle[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
                loop_counter_player = 0;
                player_status = 0
            }
        }else if(player_status == 5){
            flag_freeze = true;
            if(loop_counter_player < 10){
                ctx.drawImage(img_uchan.damage[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 20){
                ctx.drawImage(img_uchan.damage[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 30){
                ctx.drawImage(img_uchan.damage[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 40){
                ctx.drawImage(img_uchan.damage[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 50){
                ctx.drawImage(img_uchan.lose[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 60){
                ctx.drawImage(img_uchan.lose[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 70){
                ctx.drawImage(img_uchan.lose[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 80){
                ctx.drawImage(img_uchan.lose[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 90){
                ctx.drawImage(img_uchan.lose[4], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else if(loop_counter_player < 100){
                ctx.drawImage(img_uchan.lose[5], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
            }else{
                ctx.drawImage(img_uchan.lose[5], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
                loop_counter_player = 0;
                player_status = 100;
            }
        }else if(player_status == 100){
            ctx.drawImage(img_uchan.lose[5], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, 256, 256);
        }
    }
    loop_counter_player++;
    loop_counter_move++;
    old_status = player_status;
}

function draw_enemy_motion(character, grid_pos){
    const offset_character_x = 64*2+200
    const offset_character_y = 128*2-40
    if(enemy_HP <= 0 && enemy_status != 100){
        enemy_HP = 0;
        enemy_status = 5;
    }
    if(old_status_enemy != enemy_status) loop_counter_enemy = 0;
    
    if(character == "unity-chan"){
        if(enemy_status == 0){
            flag_freeze_enemy = false;
            if(loop_counter_enemy < 20){
                mirror();
                ctx.drawImage(img_uchan.idle[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 40){
                mirror();
                ctx.drawImage(img_uchan.idle[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 60){
                mirror();
                ctx.drawImage(img_uchan.idle[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 80){
                mirror();
                ctx.drawImage(img_uchan.idle[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else{
                mirror();
                ctx.drawImage(img_uchan.idle[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
                loop_counter_enemy = 0;
            }
        }else if(enemy_status == 2){
            flag_freeze_enemy = true;
            if(loop_counter_enemy < 10){
                mirror();
                ctx.drawImage(img_uchan.damage[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 20){
                mirror();
                ctx.drawImage(img_uchan.damage[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 30){
                mirror();
                ctx.drawImage(img_uchan.damage[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 40){
                mirror();
                ctx.drawImage(img_uchan.damage[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else{
                mirror();
                ctx.drawImage(img_uchan.idle[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
                loop_counter_enemy = 0;
                enemy_status = 0
            }
        }else if(enemy_status == 3){
            flag_freeze_enemy = true;
            if(loop_counter_enemy < 3){
                mirror();
                ctx.drawImage(img_uchan.shoot[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 5){
                mirror();
                ctx.drawImage(img_uchan.shoot[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 8){
                mirror();
                ctx.drawImage(img_uchan.shoot[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 12){
                mirror();
                ctx.drawImage(img_uchan.shoot[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 15){
                mirror();
                ctx.drawImage(img_uchan.shoot[4], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else{
                mirror();
                ctx.drawImage(img_uchan.idle[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
                loop_counter_enemy = 0;
                enemy_status = 0
            }
        }else if(enemy_status == 4){
            flag_freeze_enemy = true;
            if(loop_counter_enemy < 5){
                mirror();
                ctx.drawImage(img_uchan.sword[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 10){
                mirror();
                ctx.drawImage(img_uchan.sword[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 15){
                mirror();
                ctx.drawImage(img_uchan.sword[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 20){
                mirror();
                ctx.drawImage(img_uchan.sword[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 25){
                mirror();
                ctx.drawImage(img_uchan.sword[4], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 30){
                mirror();
                ctx.drawImage(img_uchan.sword[5], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 35){
                mirror();
                ctx.drawImage(img_uchan.sword[6], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else{
                mirror();
                ctx.drawImage(img_uchan.idle[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
                loop_counter_enemy = 0;
                enemy_status = 0
            }
        }else if(enemy_status == 5){
            flag_draw_damege_enemy = true;
            if(loop_counter_enemy < 10){
                mirror();
                ctx.drawImage(img_uchan.damage[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 20){
                mirror();
                ctx.drawImage(img_uchan.damage[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 30){
                mirror();
                ctx.drawImage(img_uchan.damage[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 40){
                mirror();
                ctx.drawImage(img_uchan.damage[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 50){
                mirror();
                ctx.drawImage(img_uchan.lose[0], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 60){
                mirror();
                ctx.drawImage(img_uchan.lose[1], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 70){
                mirror();
                ctx.drawImage(img_uchan.lose[2], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 80){
                mirror();
                ctx.drawImage(img_uchan.lose[3], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 90){
                mirror();
                ctx.drawImage(img_uchan.lose[4], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else if(loop_counter_enemy < 100){
                mirror();
                ctx.drawImage(img_uchan.lose[5], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
            }else{
                mirror();
                ctx.drawImage(img_uchan.lose[5], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
                mirror();
                loop_counter_enemy = 0;
                enemy_status = 100;
            }
        }else if(enemy_status == 100){
            flag_freeze_enemy = true;
            mirror();
            ctx.drawImage(img_uchan.lose[5], grid_pos.x-offset_character_x, grid_pos.y-offset_character_y, -256, 256);
            mirror();
        }
    }
    loop_counter_enemy++;
    old_status_enemy = enemy_status;
}

function draw_player(){
    // const offset_character_x = 64*2-5
    // const offset_character_y = 128*2-40
    ctx.beginPath();
    cal_player_pos();
    let grid_pos = convert_pos(player_pos);
    shoot_motion_normal_or_charge();
    draw_player_motion("unity-chan", grid_pos);
    draw_charge_bar(grid_pos);
    ctx.closePath();
}

function draw_enemy(){
    ctx.beginPath();
    cal_enemy_pos();
    let grid_pos = convert_pos_enemy(enemy_pos);
    draw_enemy_motion("unity-chan", grid_pos);
    ctx.closePath();
}

//-----------------------------------
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_background();
    draw_field();
    draw_enemy();
    draw_player();
    draw_HP_damage(0);
    draw_HP_damage_enemy(0);
    frame_counter++;
    requestAnimationFrame(draw);
}
// setInterval(draw, 10);
draw();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if((e.key == "Right" || e.key == "ArrowRight") && player_status == 0){
        right_pressed = true;
        right_pressed_long = true;
    }else if((e.key == "Left" || e.key == "ArrowLeft") && player_status == 0){
        left_pressed = true;
        left_pressed_long = true;
    }else if(e.keyCode == 38 && player_status == 0){
        up_pressed = true;
        up_pressed_long = true;
    }else if(e.keyCode == 40 && player_status == 0){
        down_pressed = true;
        down_pressed_long = true;
    }else if(e.keyCode == 32 && player_status == 0){
        space_pressed = true;
    }else if(e.keyCode == 68 && player_status == 0){ //key : d
        right_pressed = true;
        right_pressed_long = true;
    }else if(e.keyCode == 65 && player_status == 0){ //key : a
        left_pressed = true;
        left_pressed_long = true;
    }else if(e.keyCode == 87 && player_status == 0){ //key : w
        up_pressed = true;
        up_pressed_long = true;
    }else if(e.keyCode == 83 && player_status == 0){ //key : s
        down_pressed = true;
        down_pressed_long = true;
    }else if(e.keyCode == 74){ //key : j
        flag_charge = true;
    }else if(e.keyCode == 78){ //key : n
        player_status = 2; // damage
        draw_HP_damage(50);
    }else if(e.keyCode == 77){ //key : m
        enemy_status = 2; // lose
        draw_HP_damage_enemy(50);
    }else if(e.keyCode == 32){ //key : space
        space_pressed = true;
    }else if(e.keyCode == 13){ // key : enter
        if(flag_start_menu) flag_start_menu = false;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight"){
        right_pressed_long = false;
    }else if(e.key == "Left" || e.key == "ArrowLeft"){
        left_pressed_long = false;
    }else if(e.keyCode == 38){
        up_pressed_long = false;
    }else if(e.keyCode == 40){
        down_pressed_long = false;
    }else if(e.keyCode == 68){ //key : d
        right_pressed_long = false;
    }else if(e.keyCode == 65){ //key : a
        left_pressed_long = false;
    }else if(e.keyCode == 87){ //key : w
        up_pressed_long = false;
    }else if(e.keyCode == 83){ //key : s
        down_pressed_long = false;
    // }else if(e.keyCode == 32){
        // space_pressed == false;
    }else if(e.keyCode == 74){ //key : j
        flag_shoot = true;
    }
}